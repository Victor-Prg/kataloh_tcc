import { useCallback, useEffect, useRef, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  type Timestamp,
  type QuerySnapshot,
  type QueryDocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../firebaseConfig';
import { Send, ChevronDown } from 'lucide-react';

type Message = {
  id: string;
  from: 'store' | 'client';
  text: string;
  createdAt: string;
};

type Room = {
  id: string;
  clientId: string;
  clientOnline?: boolean;
  clientLastSeen?: string;
  typingClient?: boolean;
  typingStore?: boolean;
};

type MessageDoc = {
  from?: 'store' | 'client';
  text?: string;
  createdAt?: Timestamp;
};

type MockMessageEventDetail = {
  roomId: string;
  from: 'store' | 'client';
  text: string;
  createdAt: string;
};

type MockRoomEventDetail = {
  roomId: string;
  clientId: string;
};

type MockPresenceEventDetail = {
  roomId: string;
  clientOnline: boolean;
  clientLastSeen: string;
};

type MockTypingEventDetail = {
  roomId: string;
  who: 'client' | 'store';
  typing: boolean;
};

const USE_FIREBASE = Boolean(db) && isFirebaseConfigured;
const LS_PREFIX = 'chat_messages_';

const STORE_ID = 'store-1';
const CLIENT_ID = 'client-1';
const DEFAULT_ROOM_ID = `${STORE_ID}_${CLIENT_ID}`;

type BroadcastPayload =
  | { type: 'mock-room'; detail: MockRoomEventDetail }
  | { type: 'mock-message'; detail: MockMessageEventDetail }
  | { type: 'mock-presence'; detail: MockPresenceEventDetail }
  | { type: 'mock-typing'; detail: MockTypingEventDetail };

let CHAT_BC: BroadcastChannel | null = null;
let BC_FORWARD_INSTALLED = false;
const getBroadcastChannel = (): BroadcastChannel | null => {
  try {
    if (!('BroadcastChannel' in window)) return null;
    if (!CHAT_BC) CHAT_BC = new BroadcastChannel('kataloh-chat-bus');
    return CHAT_BC;
  } catch {
    return null;
  }
};
const installBroadcastForwarder = (): (() => void) => {
  if (BC_FORWARD_INSTALLED) return () => {};
  const bc = getBroadcastChannel();
  if (!bc) return () => {};
  const handler = (ev: MessageEvent) => {
    const data = ev.data as BroadcastPayload;
    if (!data || !data.type) return;
    if (data.type === 'mock-room') {
      window.dispatchEvent(new CustomEvent<MockRoomEventDetail>('mock-room', { detail: data.detail }));
    } else if (data.type === 'mock-message') {
      window.dispatchEvent(new CustomEvent<MockMessageEventDetail>('mock-message', { detail: data.detail }));
    } else if (data.type === 'mock-presence') {
      window.dispatchEvent(new CustomEvent<MockPresenceEventDetail>('mock-presence', { detail: data.detail }));
    } else if (data.type === 'mock-typing') {
      window.dispatchEvent(new CustomEvent<MockTypingEventDetail>('mock-typing', { detail: data.detail }));
    }
  };
  bc.addEventListener('message', handler as EventListener);
  BC_FORWARD_INSTALLED = true;
  return () => {
    try {
      bc.removeEventListener('message', handler as EventListener);
      BC_FORWARD_INSTALLED = false;
    } catch {
      void 0;
    }
  };
};

const ensureDefaultRoom = async () => {
  if (!USE_FIREBASE) {
    return DEFAULT_ROOM_ID;
  }
  const roomRef = doc(db!, 'rooms', DEFAULT_ROOM_ID);
  const snap = await getDoc(roomRef);
  if (!snap.exists()) {
    await setDoc(roomRef, {
      storeId: STORE_ID,
      clientId: CLIENT_ID,
      createdAt: serverTimestamp(),
    });
  }
  return DEFAULT_ROOM_ID;
};

const StorePanel = () => {
  const [rooms, setRooms] = useState<Room[]>(() => {
    if (USE_FIREBASE) return [];
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const k = localStorage.key(i);
      if (k && k.startsWith(LS_PREFIX)) {
        keys.push(k.substring(LS_PREFIX.length));
      }
    }
    const initialRooms: Room[] =
      keys.length > 0
        ? keys.map((rid) => ({
            id: rid,
            clientId: rid.includes(`${STORE_ID}_`) ? rid.split(`${STORE_ID}_`)[1] : rid,
          }))
        : [{ id: DEFAULT_ROOM_ID, clientId: CLIENT_ID }];
    return initialRooms;
  });
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(() => {
    if (USE_FIREBASE) return null;
    let bestId = rooms[0]?.id ?? DEFAULT_ROOM_ID;
    let bestTs = -1;
    rooms.forEach((r) => {
      const raw = localStorage.getItem(`${LS_PREFIX}${r.id}`);
      if (!raw) return;
      let arr: Array<{ ts?: number }> = [];
      try {
        arr = JSON.parse(raw) as Array<{ ts?: number }>;
      } catch {
        arr = [];
      }
      const last = arr[arr.length - 1];
      const ts = typeof last?.ts === 'number' ? last.ts! : -1;
      if (ts > bestTs) {
        bestTs = ts;
        bestId = r.id;
      }
    });
    return bestId;
  });
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [newClientId, setNewClientId] = useState('');
  const readLocalMessages = (roomId: string): Message[] => {
    try {
      const raw = localStorage.getItem(`${LS_PREFIX}${roomId}`);
      if (!raw) return [];
      const arr = JSON.parse(raw) as Array<{ from: 'store' | 'client'; text: string; createdAt: string; ts?: number }>;
      return arr.map((m, idx) => ({
        id: String(m.ts ?? `${roomId}-${idx}`),
        from: m.from,
        text: m.text,
        createdAt: m.createdAt,
      }));
    } catch {
      return [];
    }
  };
  const [messagesByRoom, setMessagesByRoom] = useState<Record<string, Message[]>>(() => {
    if (USE_FIREBASE) return {};
    const id = selectedRoomId ?? DEFAULT_ROOM_ID;
    return { [id]: readLocalMessages(id) };
  });
  const [lastTsByRoom, setLastTsByRoom] = useState<Record<string, number>>({});
  const [unreadByRoom, setUnreadByRoom] = useState<Record<string, number>>({});
  const [clientSeenCountByRoom, setClientSeenCountByRoom] = useState<Record<string, number>>({});
  const storeTypingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!USE_FIREBASE) {
      const removeForwarder = installBroadcastForwarder();
      const roomHandler = (e: Event) => {
        const ev = e as CustomEvent<MockRoomEventDetail>;
        setRooms((prev) => {
          if (prev.some((r) => r.id === ev.detail.roomId)) return prev;
          return [...prev, { id: ev.detail.roomId, clientId: ev.detail.clientId }];
        });
      };
      window.addEventListener('mock-room', roomHandler as EventListener);
      return () => {
        window.removeEventListener('mock-room', roomHandler as EventListener);
        removeForwarder();
      };
      return;
    }
    const roomsRef = collection(db!, 'rooms');
    const q = query(roomsRef, where('storeId', '==', STORE_ID));
    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data: Room[] = snapshot.docs.map(
          (docSnap: QueryDocumentSnapshot<DocumentData>) => {
            const d = docSnap.data();
            return {
              id: docSnap.id,
              clientId: String(d.clientId ?? ''),
              clientOnline: Boolean(d.clientOnline ?? false),
              clientLastSeen: d.clientLastSeen ? d.clientLastSeen.toDate().toLocaleTimeString() : '',
              typingClient: Boolean(d.typingClient ?? false),
              typingStore: Boolean(d.typingStore ?? false),
            };
          }
        );
        setRooms(data);
        if (!selectedRoomId && data.length > 0) {
          setSelectedRoomId(data[0].id);
        }
        if (data.length === 0) {
          void ensureDefaultRoom();
        }
      },
      (err) => setError(String(err))
    );
    return unsubscribe;
  }, [selectedRoomId]);

  useEffect(() => {
    if (USE_FIREBASE) return;
    const handler = (ev: StorageEvent) => {
      if (!ev.key || !ev.key.startsWith(LS_PREFIX) || ev.newValue === null) return;
      const rid = ev.key.substring(LS_PREFIX.length);
      try {
        const arr = JSON.parse(ev.newValue) as Array<{ from: 'store' | 'client'; text: string; createdAt: string; ts?: number }>;
        setRooms((prev) => {
          if (prev.some((r) => r.id === rid)) return prev;
          return [
            ...prev,
            {
              id: rid,
              clientId: rid.includes(`${STORE_ID}_`) ? rid.split(`${STORE_ID}_`)[1] : rid,
            },
          ];
        });
        setMessagesByRoom((prev) => {
          const current = prev[rid] ?? [];
          if (arr.length <= current.length) return prev;
          const mapped: Message[] = arr.map((m, idx) => ({
            id: String(m.ts ?? `${rid}-${idx}`),
            from: m.from,
            text: m.text,
            createdAt: m.createdAt,
          }));
          return { ...prev, [rid]: mapped };
        });
        const last = arr[arr.length - 1];
        const ts = typeof last?.ts === 'number' ? last.ts! : Date.now();
        setLastTsByRoom((prev) => ({ ...prev, [rid]: ts }));
        const clientCount = arr.filter((m) => m.from !== 'store').length;
        setUnreadByRoom((prevUnread) => {
          if (rid === selectedRoomId) return { ...prevUnread, [rid]: 0 };
          const baseline = clientSeenCountByRoom[rid] ?? 0;
          const diff = clientCount - baseline;
          const inc = diff > 0 ? diff : 0;
          const current = prevUnread[rid] ?? 0;
          return { ...prevUnread, [rid]: current + inc };
        });
      } catch {
        //
      }
    };
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('storage', handler);
    };
  }, [selectedRoomId, clientSeenCountByRoom]);

  useEffect(() => {
    if (!USE_FIREBASE) {
      const handler = (e: Event) => {
        const ev = e as CustomEvent<MockMessageEventDetail>;
        const msg: Message = {
          id: String(Date.now()),
          from: ev.detail.from,
          text: ev.detail.text,
          createdAt: ev.detail.createdAt,
        };
        setMessagesByRoom((prev) => {
          const current = prev[ev.detail.roomId] ?? [];
          return { ...prev, [ev.detail.roomId]: [...current, msg] };
        });
        setLastTsByRoom((prev) => ({ ...prev, [ev.detail.roomId]: Date.now() }));
        if (ev.detail.roomId !== selectedRoomId && ev.detail.from !== 'store') {
          setUnreadByRoom((prev) => ({
            ...prev,
            [ev.detail.roomId]: (prev[ev.detail.roomId] ?? 0) + 1,
          }));
        } else if (ev.detail.roomId === selectedRoomId) {
          setUnreadByRoom((prev) => ({ ...prev, [ev.detail.roomId]: 0 }));
        }
      };
      window.addEventListener('mock-message', handler as EventListener);
      return () => {
        window.removeEventListener('mock-message', handler as EventListener);
      };
    }
  }, [selectedRoomId]);

  useEffect(() => {
    if (!USE_FIREBASE) {
      const id = selectedRoomId;
      if (!id) return;
      setTimeout(() => {
        setMessagesByRoom((prev) => {
          if (prev[id]) return prev;
          return { ...prev, [id]: readLocalMessages(id) };
        });
        const msgs = messagesByRoom[id] ?? [];
        const cnt = msgs.filter((m) => m.from !== 'store').length;
        setClientSeenCountByRoom((prev) => ({ ...prev, [id]: cnt }));
        setUnreadByRoom((prev) => ({ ...prev, [id]: 0 }));
        try {
          const raw = localStorage.getItem(`${LS_PREFIX}${id}`);
          const arr = raw ? JSON.parse(raw) as Array<{ ts?: number }> : [];
          const last = arr[arr.length - 1];
          const ts = typeof last?.ts === 'number' ? last.ts! : Date.now();
          setLastTsByRoom((prev) => ({ ...prev, [id]: ts }));
        } catch {
          setLastTsByRoom((prev) => ({ ...prev, [id]: Date.now() }));
        }
      }, 0);
    }
  }, [selectedRoomId, messagesByRoom]);

  useEffect(() => {
    if (!USE_FIREBASE) return;
    if (rooms.length === 0) return;
    const unsubs = rooms.map((room) => {
      const messagesRef = collection(db!, 'rooms', room.id, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'asc'));
      return onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const data: Message[] = snapshot.docs.map(
            (docSnap: QueryDocumentSnapshot<DocumentData>) => {
              const d = docSnap.data() as MessageDoc;
              return {
                id: docSnap.id,
                from: d.from === 'store' ? 'store' : 'client',
                text: String(d.text ?? ''),
                createdAt: d.createdAt ? d.createdAt.toDate().toLocaleTimeString() : '',
              };
            }
          );
          setMessagesByRoom((prev) => ({ ...prev, [room.id]: data }));
          const lastDoc = snapshot.docs[snapshot.docs.length - 1];
          const lastData = lastDoc ? (lastDoc.data() as MessageDoc) : undefined;
          const ts = lastData?.createdAt ? lastData.createdAt.toMillis() : Date.now();
          setLastTsByRoom((prev) => ({ ...prev, [room.id]: ts }));
          const clientCount = data.filter((m) => m.from !== 'store').length;
          if (room.id === selectedRoomId) {
            setClientSeenCountByRoom((prev) => ({ ...prev, [room.id]: clientCount }));
            setUnreadByRoom((prev) => ({ ...prev, [room.id]: 0 }));
          } else {
            setUnreadByRoom((prevUnread) => {
              const baseline = clientSeenCountByRoom[room.id] ?? 0;
              const diff = clientCount - baseline;
              const inc = diff > 0 ? diff : 0;
              const current = prevUnread[room.id] ?? 0;
              return { ...prevUnread, [room.id]: current + inc };
            });
          }
        },
        (err) => setError(String(err))
      );
    });
    return () => {
      unsubs.forEach((u) => {
        u();
      });
    };
  }, [rooms, clientSeenCountByRoom, selectedRoomId]);

  const currentStoreMessages = selectedRoomId ? (messagesByRoom[selectedRoomId] ?? []) : [];
  useEffect(() => {
    if (endOfMessagesRef.current && selectedRoomId) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedRoomId, currentStoreMessages.length]);

  const updateScrollToBottomVisibility = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollToBottom(distanceFromBottom > 80);
  }, []);

  const handleCreateClient = async () => {
    const cid = newClientId.trim();
    if (!cid) return;
    const newRoomId = `${STORE_ID}_${cid}`;
    if (!USE_FIREBASE) {
      const ev = new CustomEvent<MockRoomEventDetail>('mock-room', {
        detail: { roomId: newRoomId, clientId: cid },
      });
      window.dispatchEvent(ev);
      const bc = getBroadcastChannel();
      bc?.postMessage({ type: 'mock-room', detail: { roomId: newRoomId, clientId: cid } } as BroadcastPayload);
      setSelectedRoomId(newRoomId);
      setNewClientId('');
      return;
    }
    try {
      const roomRef = doc(db!, 'rooms', newRoomId);
      const snap = await getDoc(roomRef);
      if (!snap.exists()) {
        await setDoc(roomRef, {
          storeId: STORE_ID,
          clientId: cid,
          createdAt: serverTimestamp(),
          clientOnline: false,
          typingClient: false,
          typingStore: false,
        });
      }
      setSelectedRoomId(newRoomId);
      setNewClientId('');
    } catch (err) {
      setError(String(err));
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    let roomId = selectedRoomId;
    if (!roomId) {
      roomId = await ensureDefaultRoom();
      setSelectedRoomId(roomId);
    }
    if (!USE_FIREBASE) {
      try {
        const key = `${LS_PREFIX}${roomId}`;
        const raw = localStorage.getItem(key);
        const arr = raw ? JSON.parse(raw) : [];
        arr.push({
          from: 'store',
          text,
          createdAt: new Date().toLocaleTimeString(),
          ts: Date.now(),
        });
        localStorage.setItem(key, JSON.stringify(arr));
      } catch {
        //
      }
      const ev = new CustomEvent<MockMessageEventDetail>('mock-message', {
        detail: {
          roomId,
          from: 'store',
          text,
          createdAt: new Date().toLocaleTimeString(),
        },
      });
      window.dispatchEvent(ev);
      const bc = getBroadcastChannel();
      bc?.postMessage({
        type: 'mock-message',
        detail: { roomId, from: 'store', text, createdAt: new Date().toLocaleTimeString() },
      } as BroadcastPayload);
      if (storeTypingTimeoutRef.current) {
        window.clearTimeout(storeTypingTimeoutRef.current);
      }
      const ev2 = new CustomEvent<MockTypingEventDetail>('mock-typing', {
        detail: { roomId, who: 'store', typing: false },
      });
      window.dispatchEvent(ev2);
      bc?.postMessage({ type: 'mock-typing', detail: { roomId, who: 'store', typing: false } } as BroadcastPayload);
      setInput('');
      return;
    }
    const messagesRef = collection(db!, 'rooms', roomId, 'messages');
    try {
      await addDoc(messagesRef, {
        from: 'store',
        text,
        createdAt: serverTimestamp(),
      });
      const roomRef = doc(db!, 'rooms', roomId);
      await setDoc(roomRef, { typingStore: false }, { merge: true });
      setInput('');
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <div className="bg-[var(--bg-body)] h-full">
      <div className="h-full flex flex-col md:flex-row bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden min-h-0">
        <div className="w-full md:w-[320px] lg:w-[360px] border-b md:border-b-0 md:border-r border-[var(--border)] bg-[var(--surface-nav)] flex flex-col min-h-0">
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Clientes</h2>
              <p className="text-xs text-[var(--text-secondary)]">Salas da loja</p>
            </div>
          </div>
          <div className="px-3 py-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newClientId}
                onChange={(e) => setNewClientId(e.target.value)}
                placeholder="Novo cliente (ex: client-2)"
                className="flex-1 rounded-full border border-[var(--border)] bg-[var(--bg-body)] px-4 py-2 text-xs md:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
              />
              <button
                type="button"
                onClick={handleCreateClient}
                className="inline-flex items-center justify-center rounded-full bg-[var(--primary-100)] text-white px-3 py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                disabled={!newClientId.trim()}
              >
                Adicionar
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto chat-scroll">
            <ul>
              {[...rooms].sort((a, b) => (lastTsByRoom[b.id] ?? 0) - (lastTsByRoom[a.id] ?? 0)).map((room) => {
                const isActive = room.id === selectedRoomId;
                const items = messagesByRoom[room.id] ?? [];
                const last = items.length > 0 ? items[items.length - 1] : undefined;
                const unread = unreadByRoom[room.id] ?? 0;
                return (
                  <li
                    key={room.id}
                    className={`cursor-pointer transition-colors px-3 py-2.5 md:px-4 md:py-3 ${
                      isActive ? 'bg-[var(--bg-card)]' : 'hover:bg-[var(--bg-hover)]'
                    }`}
                    onClick={() => setSelectedRoomId(room.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-200 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-xs md:text-sm text-[var(--text-primary)] truncate">
                            Cliente: {room.clientId}
                          </p>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-[10px] text-[var(--text-muted)]">{last?.createdAt ?? ''}</span>
                            {unread > 0 && (
                              <span className="inline-flex items-center justify-center rounded-full bg-[var(--primary-100)] text-white text-[10px] px-2 py-0.5">
                                {unread}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] truncate">{last?.text ?? ''}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
              {rooms.length === 0 && (
                <li className="px-4 py-6 text-center text-xs text-[var(--text-secondary)]">
                  Nenhum cliente encontrado.
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="flex-1 bg-[var(--bg-body)] flex flex-col overflow-hidden min-h-0">
          <div className="w-full border-b border-[var(--border)] bg-[var(--surface)]">
            <div className="px-4 py-3 md:px-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200" />
                <div className="flex flex-col">
                  <span className="text-sm md:text-base font-semibold text-[var(--text-primary)]">
                    {selectedRoomId ? `Cliente: ${rooms.find(r => r.id === selectedRoomId)?.clientId ?? ''}` : 'Selecione um cliente'}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {(() => {
                      const active = rooms.find(r => r.id === selectedRoomId);
                      if (!active) return '';
                      if (active.typingClient) return 'Digitando...';
                      if (active.clientOnline) return 'Online';
                      return active.clientLastSeen ? `Visto às ${active.clientLastSeen}` : 'Offline';
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0 relative">
            <div className="h-full flex flex-col min-h-0">
              <div
                ref={messagesContainerRef}
                className="flex-1 min-h-0 px-3 md:px-6 py-3 overflow-y-auto space-y-2 chat-scroll"
                onScroll={updateScrollToBottomVisibility}
              >
                {(messagesByRoom[selectedRoomId ?? ''] ?? []).map((msg) => {
                  const isStore = msg.from === 'store';
                  return (
                    <div key={msg.id} className={`flex w-full ${isStore ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-3 py-2 text-xs md:text-sm shadow-sm ${
                          isStore
                            ? 'bg-[var(--primary-100)] text-white rounded-br-sm'
                            : 'bg-[var(--surface)] text-[var(--text-primary)] rounded-bl-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                        <span
                          className={`mt-1 block text-[10px] ${isStore ? 'text-white/80' : 'text-[var(--text-muted)]'}`}
                        >
                          {msg.createdAt}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {(messagesByRoom[selectedRoomId ?? ''] ?? []).length === 0 && (
                  <div className="text-center text-xs text-[var(--text-secondary)]">Nenhuma mensagem.</div>
                )}
                {error && <div className="text-center text-xs text-red-500">{error}</div>}
                <div ref={endOfMessagesRef} />
              </div>
              {showScrollToBottom && (
                <button
                  type="button"
                  onClick={() => {
                    if (endOfMessagesRef.current) {
                      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="absolute left-1/2 -translate-x-1/2 bottom-20 md:bottom-24 rounded-full bg-[var(--primary-100)] text-white shadow-lg p-2.5 hover:opacity-90 transition-opacity"
                >
                  <ChevronDown size={18} />
                </button>
              )}
              <div className="border-t border-[var(--border)] bg-[var(--surface)]">
                <div className="px-3 md:px-6 py-2 md:py-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(event) => {
                      setInput(event.target.value);
                      const id = selectedRoomId;
                      if (!id) return;
                      if (!USE_FIREBASE) {
                        const ev = new CustomEvent<MockTypingEventDetail>('mock-typing', {
                          detail: { roomId: id, who: 'store', typing: true },
                        });
                        window.dispatchEvent(ev);
                        if (storeTypingTimeoutRef.current) {
                          window.clearTimeout(storeTypingTimeoutRef.current);
                        }
                        storeTypingTimeoutRef.current = window.setTimeout(() => {
                          const ev2 = new CustomEvent<MockTypingEventDetail>('mock-typing', {
                            detail: { roomId: id, who: 'store', typing: false },
                          });
                          window.dispatchEvent(ev2);
                        }, 1000);
                      } else {
                        const roomRef = doc(db!, 'rooms', id);
                        void setDoc(roomRef, { typingStore: true }, { merge: true });
                        if (storeTypingTimeoutRef.current) {
                          window.clearTimeout(storeTypingTimeoutRef.current);
                        }
                        storeTypingTimeoutRef.current = window.setTimeout(() => {
                          void setDoc(roomRef, { typingStore: false }, { merge: true });
                        }, 1000);
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        void handleSend();
                      }
                    }}
                    placeholder="Mensagem da loja..."
                    className="flex-1 rounded-full border border-[var(--border)] bg-[var(--bg-body)] px-4 py-2 text-xs md:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--primary-100)] text-white p-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
                    disabled={!input.trim()}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientPanel = () => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messagesByRoom, setMessagesByRoom] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [clientId, setClientId] = useState<string>('client-1');
  const [typingStore, setTypingStore] = useState<boolean>(false);
  const clientTypingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!USE_FIREBASE) {
      const removeForwarder = installBroadcastForwarder();
      return () => {
        removeForwarder();
      };
    }
  }, []);

  useEffect(() => {
    const ensureRoom = async () => {
      const id = `${STORE_ID}_${clientId}`;
      setRoomId(id);
      if (!USE_FIREBASE) {
        const ev = new CustomEvent<MockRoomEventDetail>('mock-room', {
          detail: { roomId: id, clientId },
        });
        window.dispatchEvent(ev);
        const bc = getBroadcastChannel();
        bc?.postMessage({ type: 'mock-room', detail: { roomId: id, clientId } } as BroadcastPayload);
        const pe = new CustomEvent<MockPresenceEventDetail>('mock-presence', {
          detail: { roomId: id, clientOnline: true, clientLastSeen: new Date().toLocaleTimeString() },
        });
        window.dispatchEvent(pe);
        bc?.postMessage({
          type: 'mock-presence',
          detail: { roomId: id, clientOnline: true, clientLastSeen: new Date().toLocaleTimeString() },
        } as BroadcastPayload);
        return;
      }
      try {
        const roomRef = doc(db!, 'rooms', id);
        const snap = await getDoc(roomRef);
        if (!snap.exists()) {
          await setDoc(roomRef, {
            storeId: STORE_ID,
            clientId,
            createdAt: serverTimestamp(),
            clientOnline: true,
            typingClient: false,
            typingStore: false,
          });
        }
        await setDoc(roomRef, { clientOnline: true, clientLastSeen: serverTimestamp() }, { merge: true });
      } catch (err) {
        setError(String(err));
      }
    };
    ensureRoom();
  }, [clientId]);

  useEffect(() => {
    if (!roomId) return;
    if (!USE_FIREBASE) {
      const typingHandler = (e: Event) => {
        const ev = e as CustomEvent<MockTypingEventDetail>;
        if (ev.detail.roomId === roomId && ev.detail.who === 'store') {
          setTypingStore(ev.detail.typing);
        }
      };
      window.addEventListener('mock-typing', typingHandler as EventListener);
      const presenceInterval = window.setInterval(() => {
        const pe = new CustomEvent<MockPresenceEventDetail>('mock-presence', {
          detail: { roomId: roomId!, clientOnline: true, clientLastSeen: new Date().toLocaleTimeString() },
        });
        window.dispatchEvent(pe);
        const bc = getBroadcastChannel();
        bc?.postMessage({
          type: 'mock-presence',
          detail: { roomId: roomId!, clientOnline: true, clientLastSeen: new Date().toLocaleTimeString() },
        } as BroadcastPayload);
      }, 20000);
      return () => {
        window.removeEventListener('mock-typing', typingHandler as EventListener);
        window.clearInterval(presenceInterval);
        const pe = new CustomEvent<MockPresenceEventDetail>('mock-presence', {
          detail: { roomId: roomId!, clientOnline: false, clientLastSeen: new Date().toLocaleTimeString() },
        });
        window.dispatchEvent(pe);
        const bc = getBroadcastChannel();
        bc?.postMessage({
          type: 'mock-presence',
          detail: { roomId: roomId!, clientOnline: false, clientLastSeen: new Date().toLocaleTimeString() },
        } as BroadcastPayload);
      };
    }
    const roomRef = doc(db!, 'rooms', roomId);
    const unsub = onSnapshot(roomRef, (snap) => {
      const d = snap.data();
      setTypingStore(Boolean(d?.typingStore ?? false));
    }, (err) => setError(String(err)));
    const presenceInterval = window.setInterval(() => {
      const ref = doc(db!, 'rooms', roomId);
      void setDoc(ref, { clientOnline: true, clientLastSeen: serverTimestamp() }, { merge: true });
    }, 20000);
    return () => {
      unsub();
      window.clearInterval(presenceInterval);
      const ref = doc(db!, 'rooms', roomId);
      void setDoc(ref, { clientOnline: false, clientLastSeen: serverTimestamp() }, { merge: true });
    };
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    if (!USE_FIREBASE) {
      const handler = (e: Event) => {
        const ev = e as CustomEvent<MockMessageEventDetail>;
        if (ev.detail.roomId === roomId) {
          const msg: Message = {
            id: String(Date.now()),
            from: ev.detail.from,
            text: ev.detail.text,
            createdAt: ev.detail.createdAt,
          };
          setMessagesByRoom((prev) => {
            const current = prev[roomId] ?? [];
            return { ...prev, [roomId]: [...current, msg] };
          });
        }
      };
      window.addEventListener('mock-message', handler as EventListener);
      return () => {
        window.removeEventListener('mock-message', handler as EventListener);
      };
    }
    const messagesRef = collection(db!, 'rooms', roomId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data: Message[] = snapshot.docs.map(
          (docSnap: QueryDocumentSnapshot<DocumentData>) => {
            const d = docSnap.data() as MessageDoc;
            return {
              id: docSnap.id,
              from: d.from === 'store' ? 'store' : 'client',
              text: String(d.text ?? ''),
              createdAt: d.createdAt
                ? d.createdAt.toDate().toLocaleTimeString()
                : '',
            };
          }
        );
        setMessagesByRoom((prev) => ({ ...prev, [roomId]: data }));
      },
      (err) => setError(String(err))
    );
    return unsubscribe;
  }, [roomId]);

  useEffect(() => {
    if (!roomId || USE_FIREBASE) return;
    const handler = (ev: StorageEvent) => {
      if (ev.key !== `${LS_PREFIX}${roomId}` || ev.newValue === null) return;
      try {
        const arr = JSON.parse(ev.newValue) as Array<{ from: 'store' | 'client'; text: string; createdAt: string; ts?: number }>;
        setMessagesByRoom((prev) => {
          const current = prev[roomId] ?? [];
          if (arr.length <= current.length) return prev;
          const mapped: Message[] = arr.map((m, idx) => ({
            id: String(m.ts ?? `${roomId}-${idx}`),
            from: m.from,
            text: m.text,
            createdAt: m.createdAt,
          }));
          return { ...prev, [roomId]: mapped };
        });
      } catch {
        //
      }
    };
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('storage', handler);
    };
  }, [roomId]);

  const currentClientMessages = roomId ? (messagesByRoom[roomId] ?? []) : [];
  useEffect(() => {
    if (endOfMessagesRef.current && roomId) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [roomId, currentClientMessages.length]);

  const updateScrollToBottomVisibility = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollToBottom(distanceFromBottom > 80);
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !roomId) return;
    if (!USE_FIREBASE) {
      try {
        const key = `${LS_PREFIX}${roomId}`;
        const raw = localStorage.getItem(key);
        const arr = raw ? JSON.parse(raw) : [];
        arr.push({
          from: 'client',
          text,
          createdAt: new Date().toLocaleTimeString(),
          ts: Date.now(),
        });
        localStorage.setItem(key, JSON.stringify(arr));
      } catch {
        //
      }
      const ev = new CustomEvent<MockMessageEventDetail>('mock-message', {
        detail: {
          roomId,
          from: 'client',
          text,
          createdAt: new Date().toLocaleTimeString(),
        },
      });
      window.dispatchEvent(ev);
      const bc = getBroadcastChannel();
      bc?.postMessage({
        type: 'mock-message',
        detail: { roomId, from: 'client', text, createdAt: new Date().toLocaleTimeString() },
      } as BroadcastPayload);
      if (clientTypingTimeoutRef.current) {
        window.clearTimeout(clientTypingTimeoutRef.current);
      }
      const te2 = new CustomEvent<MockTypingEventDetail>('mock-typing', {
        detail: { roomId, who: 'client', typing: false },
      });
      window.dispatchEvent(te2);
      bc?.postMessage({ type: 'mock-typing', detail: { roomId, who: 'client', typing: false } } as BroadcastPayload);
      setInput('');
      return;
    }
    const messagesRef = collection(db!, 'rooms', roomId, 'messages');
    try {
      await addDoc(messagesRef, {
        from: 'client',
        text,
        createdAt: serverTimestamp(),
      });
      const roomRef = doc(db!, 'rooms', roomId);
      await setDoc(roomRef, { typingClient: false }, { merge: true });
      setInput('');
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <div className="bg-[var(--bg-body)] h-full">
      <div className="h-full flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden min-h-0">
        <div className="w-full border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="px-4 py-3 md:px-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200" />
              <div className="flex flex-col">
                <span className="text-sm md:text-base font-semibold text-[var(--text-primary)]">
                  Loja
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  {typingStore ? 'Digitando...' : 'Online há pouco tempo'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Cliente simulando (ex: client-1)"
                className="rounded-full border border-[var(--border)] bg-[var(--bg-body)] px-4 py-2 text-xs md:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
              />
            </div>
          </div>
        </div>
        <div className="flex-1 w-full min-h-0 relative">
          <div className="h-full flex flex-col min-h-0">
            <div
              ref={messagesContainerRef}
              className="flex-1 min-h-0 px-3 md:px-6 py-3 overflow-y-auto space-y-2 chat-scroll"
              onScroll={updateScrollToBottomVisibility}
            >
              {(messagesByRoom[roomId ?? ''] ?? []).map((msg) => {
                const isClient = msg.from !== 'store';
                return (
                  <div key={msg.id} className={`flex w-full ${isClient ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-3 py-2 text-xs md:text-sm shadow-sm ${
                        isClient
                          ? 'bg-[var(--primary-100)] text-white rounded-br-sm'
                          : 'bg-[var(--surface)] text-[var(--text-primary)] rounded-bl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                      <span
                        className={`mt-1 block text-[10px] ${isClient ? 'text-white/80' : 'text-[var(--text-muted)]'}`}
                      >
                        {msg.createdAt}
                      </span>
                    </div>
                  </div>
                );
              })}
              {(messagesByRoom[roomId ?? ''] ?? []).length === 0 && (
                <div className="text-center text-xs text-[var(--text-secondary)]">Nenhuma mensagem.</div>
              )}
              {error && <div className="text-center text-xs text-red-500">{error}</div>}
              <div ref={endOfMessagesRef} />
            </div>
            {showScrollToBottom && (
              <button
                type="button"
                onClick={() => {
                  if (endOfMessagesRef.current) {
                    endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="absolute left-1/2 -translate-x-1/2 bottom-20 md:bottom-24 rounded-full bg-[var(--primary-100)] text-white shadow-lg p-2.5 hover:opacity-90 transition-opacity"
              >
                <ChevronDown size={18} />
              </button>
            )}
            <div className="border-t border-[var(--border)] bg-[var(--surface)]">
              <div className="px-3 md:px-6 py-2 md:py-3 flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                    onChange={(event) => {
                      setInput(event.target.value);
                      if (!roomId) return;
                      if (!USE_FIREBASE) {
                        const te = new CustomEvent<MockTypingEventDetail>('mock-typing', {
                          detail: { roomId, who: 'client', typing: true },
                        });
                        window.dispatchEvent(te);
                        if (clientTypingTimeoutRef.current) {
                          window.clearTimeout(clientTypingTimeoutRef.current);
                        }
                        clientTypingTimeoutRef.current = window.setTimeout(() => {
                          const te2 = new CustomEvent<MockTypingEventDetail>('mock-typing', {
                            detail: { roomId, who: 'client', typing: false },
                          });
                          window.dispatchEvent(te2);
                        }, 1000);
                      } else {
                        const roomRef = doc(db!, 'rooms', roomId);
                        void setDoc(roomRef, { typingClient: true }, { merge: true });
                        if (clientTypingTimeoutRef.current) {
                          window.clearTimeout(clientTypingTimeoutRef.current);
                        }
                        clientTypingTimeoutRef.current = window.setTimeout(() => {
                          void setDoc(roomRef, { typingClient: false }, { merge: true });
                        }, 1000);
                      }
                    }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      void handleSend();
                    }
                  }}
                  placeholder="Mensagem do cliente..."
                  className="flex-1 rounded-full border border-[var(--border)] bg-[var(--bg-body)] px-4 py-2 text-xs md:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  className="inline-flex items-center justify-center rounded-full bg-[var(--primary-100)] text-white p-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
                  disabled={!input.trim()}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatFirebase = () => {
  return (
    <div className="flex gap-4 h-[calc(100vh-120px)] p-4">
      <div className="flex-1">
        <StorePanel />
      </div>
      <div className="flex-1">
        <ClientPanel />
      </div>
    </div>
  );
};

export default ChatFirebase;

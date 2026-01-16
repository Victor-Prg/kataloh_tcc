import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Search, Send, ChevronDown, CheckCheck, ArrowLeft } from 'lucide-react';

interface Conversation {
  id: string;
  storeName: string;
  storeCategory: string;
  storeImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    storeName: 'Burger King',
    storeCategory: 'Lanches',
    storeImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido está quase saindo para entrega, tudo certo por aí?',
    lastMessageTime: '14:32',
    unreadCount: 2,
  },
  {
    id: '2',
    storeName: 'Sushi House',
    storeCategory: 'Japonesa',
    storeImage: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop',
    lastMessage: 'Boa noite! Confirmando se deseja adicionar molho extra ao pedido.',
    lastMessageTime: 'Ontem',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
   {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
   {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
   {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
   {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
   {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
   {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
   {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
   {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
   {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
   {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
   {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
   {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
   {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
   {
    id: '3',
    storeName: 'Pizza Hut',
    storeCategory: 'Pizza',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    lastMessage: 'Seu pedido foi entregue. Avalie sua experiência com a loja.',
    lastMessageTime: 'Seg',
  },
  {
    id: '4',
    storeName: 'Açaí do Bom',
    storeCategory: 'Sobremesa',
    storeImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
    lastMessage: 'Olá! Seu açaí já está sendo preparado com muito carinho.',
    lastMessageTime: '12:05',
    unreadCount: 1,
  },
  {
    id: '4',
    storeName: 'Açaí do Bom',
    storeCategory: 'Sobremesa',
    storeImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
    lastMessage: 'Olá! Seu açaí já está sendo preparado com muito carinho.',
    lastMessageTime: '12:05',
    unreadCount: 1,
  },
  {
    id: '4',
    storeName: 'Açaí do Bom',
    storeCategory: 'Sobremesa',
    storeImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
    lastMessage: 'Olá! Seu açaí já está sendo preparado com muito carinho.',
    lastMessageTime: '12:05',
    unreadCount: 1,
  },
  {
    id: '4',
    storeName: 'Açaí do Bom',
    storeCategory: 'Sobremesa',
    storeImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
    lastMessage: 'Olá! Seu açaí já está sendo preparado com muito carinho.',
    lastMessageTime: '12:05',
    unreadCount: 1,
  },
  {
    id: '4',
    storeName: 'Açaí do Bom',
    storeCategory: 'Sobremesa',
    storeImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
    lastMessage: 'Olá! Seu açaí já está sendo preparado com muito carinho.',
    lastMessageTime: '12:05',
    unreadCount: 1,
  },
  {
    id: '4',
    storeName: 'Açaí do Bom',
    storeCategory: 'Sobremesa',
    storeImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
    lastMessage: 'Olá! Seu açaí já está sendo preparado com muito carinho.',
    lastMessageTime: '12:05',
    unreadCount: 1,
  },
  {
    id: '4',
    storeName: 'Açaí do Bom',
    storeCategory: 'Sobremesa',
    storeImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
    lastMessage: 'Olá! Seu açaí já está sendo preparado com muito carinho.',
    lastMessageTime: '12:05',
    unreadCount: 1,
  },
  {
    id: '4',
    storeName: 'Açaí do Bom',
    storeCategory: 'Sobremesa',
    storeImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
    lastMessage: 'Olá! Seu açaí já está sendo preparado com muito carinho.',
    lastMessageTime: '12:05',
    unreadCount: 1,
  },
  {
    id: '4',
    storeName: 'Açaí do Bom',
    storeCategory: 'Sobremesa',
    storeImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
    lastMessage: 'Olá! Seu açaí já está sendo preparado com muito carinho.',
    lastMessageTime: '12:05',
    unreadCount: 1,
  },
  {
    id: '4',
    storeName: 'Açaí do Bom',
    storeCategory: 'Sobremesa',
    storeImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
    lastMessage: 'Olá! Seu açaí já está sendo preparado com muito carinho.',
    lastMessageTime: '12:05',
    unreadCount: 1,
  },
  {
    id: '4',
    storeName: 'Açaí do Bom',
    storeCategory: 'Sobremesa',
    storeImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
    lastMessage: 'Olá! Seu açaí já está sendo preparado com muito carinho.',
    lastMessageTime: '12:05',
    unreadCount: 1,
  },
  
];

export const Conversas = () => {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(
    INITIAL_CONVERSATIONS[0]?.id ?? null
  );
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<
    {
      id: number;
      from: 'cliente' | 'loja';
      text: string;
      time: string;
    }[]
  >([
    {
      id: 1,
      from: 'loja',
      text: 'Olá! Recebemos seu pedido e já estamos preparando tudo com carinho.',
      time: '14:20',
    },
    {
      id: 2,
      from: 'cliente',
      text: 'Perfeito, muito obrigado. Consegue tirar a cebola do lanche?',
      time: '14:22',
    },
    {
      id: 3,
      from: 'loja',
      text: 'Claro! Já anotamos aqui e vamos preparar sem cebola.',
      time: '14:23',
    },
  ]);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const normalizeText = (value: string) =>
    value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim();

  const filteredConversations = useMemo(() => {
    const term = normalizeText(searchTerm);
    if (!term) {
      return conversations;
    }
    return conversations.filter((conversation) => {
      const name = normalizeText(conversation.storeName);
      return name.includes(term);
    });
  }, [conversations, searchTerm]);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedId) ?? null,
    [conversations, selectedId]
  );

  const updateScrollToBottomVisibility = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollToBottom(distanceFromBottom > 80);
  }, []);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    updateScrollToBottomVisibility();
  }, [selectedConversation, updateScrollToBottomVisibility]);

  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === id ? { ...conversation, unreadCount: 0 } : conversation
      )
    );
  };

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      return;
    }

    const newMessage = {
      id: Date.now(),
      from: 'cliente' as const,
      text: trimmed,
      time: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((previous) => [...previous, newMessage]);
    setInputValue('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-[var(--bg-body)]">
      <div className="max-w-6xl mx-auto px-2 md:px-4 py-4 md:py-6 h-[calc(100vh-120px)]">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm flex flex-col md:flex-row overflow-hidden h-full min-h-0">
          <div
            className={`w-full md:w-[320px] lg:w-[360px] border-b md:border-b-0 md:border-r border-[var(--border)] bg-[var(--surface-nav)] flex flex-col min-h-0 ${
              selectedConversation ? 'hidden md:flex' : 'flex'
            }`}
          >
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-[var(--text-primary)]">
                  Conversas
                </h1>
                <p className="text-xs text-[var(--text-secondary)]">
                  Histórico com as suas lojas
                </p>
              </div>
            </div>

            <div className="px-3 py-2 border-b border-[var(--border)]">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Pesquisar ou começar uma conversa"
                  className="w-full pl-10 pr-3 py-2 rounded-full bg-[var(--bg-body)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto chat-scroll">
              {filteredConversations.length === 0 ? (
                <div className="px-4 py-6 text-center text-xs text-[var(--text-secondary)]">
                  Nenhuma conversa encontrada.
                </div>
              ) : (
                <ul>
                  {filteredConversations.map((conversation) => {
                    const isActive = conversation.id === selectedId;

                    return (
                      <li
                        key={conversation.id}
                        className={`cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-[var(--bg-card)]'
                            : 'hover:bg-[var(--bg-hover)]'
                        }`}
                        onClick={() => handleSelectConversation(conversation.id)}
                      >
                        <div className="px-3 py-2.5 md:px-4 md:py-3 flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            <img
                              src={conversation.storeImage}
                              alt={conversation.storeName}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-semibold text-xs md:text-sm text-[var(--text-primary)] truncate">
                                {conversation.storeName}
                              </p>
                              <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap">
                                {conversation.lastMessageTime}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2 mt-0.5">
                              <p className="text-[11px] md:text-xs text-[var(--text-secondary)] truncate">
                                {conversation.lastMessage}
                              </p>
                              <div className="flex items-center gap-1 shrink-0">
                                {(conversation.unreadCount ?? 0) <= 0 && (
                                  <CheckCheck
                                    size={12}
                                    className="text-[var(--text-muted)]"
                                  />
                                )}
                                {typeof conversation.unreadCount === 'number' &&
                                  conversation.unreadCount > 0 && (
                                    <span className="ml-1 inline-flex items-center justify-center min-w-[18px] px-1 h-4 rounded-full bg-[var(--primary-100)] text-white text-[10px] font-semibold">
                                      {conversation.unreadCount}
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <div
            className={`flex-1 bg-[var(--bg-body)] flex flex-col overflow-hidden min-h-0 ${
              !selectedConversation ? 'hidden md:flex' : 'flex'
            }`}
          >
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-center px-4">
                <div>
                  <p className="text-sm md:text-base font-semibold text-[var(--text-primary)] mb-1">
                    Selecione uma conversa para começar
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    As mensagens com as lojas aparecerão aqui.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-full border-b border-[var(--border)] bg-[var(--surface)]">
                  <div className="px-4 py-3 md:px-6 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedId(null)}
                        className="md:hidden p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-primary)]"
                      >
                        <ArrowLeft size={18} />
                      </button>
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200">
                        <img
                          src={selectedConversation.storeImage}
                          alt={selectedConversation.storeName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm md:text-base font-semibold text-[var(--text-primary)]">
                          {selectedConversation.storeName}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)]">
                          Online há pouco tempo
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
                      {messages.map((message) => {
                        const isClient = message.from === 'cliente';

                        return (
                          <div
                            key={message.id}
                            className={`flex w-full ${
                              isClient ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-3 py-2 text-xs md:text-sm shadow-sm ${
                                isClient
                                  ? 'bg-[var(--primary-100)] text-white rounded-br-sm'
                                  : 'bg-[var(--surface)] text-[var(--text-primary)] rounded-bl-sm'
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">
                                {message.text}
                              </p>
                              <span
                                className={`mt-1 block text-[10px] ${
                                  isClient
                                    ? 'text-white/80'
                                    : 'text-[var(--text-muted)]'
                                }`}
                              >
                                {message.time}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={endOfMessagesRef} />
                    </div>

                    {showScrollToBottom && (
                      <button
                        type="button"
                        onClick={() => {
                          if (endOfMessagesRef.current) {
                            endOfMessagesRef.current.scrollIntoView({
                              behavior: 'smooth',
                            });
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
                          value={inputValue}
                          onChange={(event) => setInputValue(event.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Digite uma mensagem"
                          className="flex-1 rounded-full border border-[var(--border)] bg-[var(--bg-body)] px-4 py-2 text-xs md:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
                        />
                        <button
                          type="button"
                          onClick={handleSend}
                          className="inline-flex items-center justify-center rounded-full bg-[var(--primary-100)] text-white p-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
                          disabled={!inputValue.trim()}
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

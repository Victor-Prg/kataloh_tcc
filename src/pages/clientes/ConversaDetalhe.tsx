import { useMemo, useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';

type MessageAuthor = 'cliente' | 'loja';

interface Message {
  id: number;
  from: MessageAuthor;
  text: string;
  time: string;
}

interface ConversationInfo {
  id: string;
  storeName: string;
  storeImage: string;
}

const CONVERSATIONS_MOCK: ConversationInfo[] = [
  {
    id: '1',
    storeName: 'Burger King',
    storeImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
  },
  {
    id: '2',
    storeName: 'Sushi House',
    storeImage: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop',
  },
  {
    id: '3',
    storeName: 'Pizza Hut',
    storeImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
  },
  {
    id: '4',
    storeName: 'Açaí do Bom',
    storeImage: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
  },
];

export const ConversaDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
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

  const conversation = useMemo(
    () => CONVERSATIONS_MOCK.find((c) => c.id === (id || '')),
    [id]
  );

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!conversation) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Conversa não encontrada.
          </p>
          <button
            type="button"
            onClick={() => navigate('/cliente/conversas')}
            className="px-4 py-2 rounded-lg bg-[var(--primary-100)] text-white text-sm font-medium"
          >
            Voltar para conversas
          </button>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      return;
    }

    const newMessage: Message = {
      id: Date.now(),
      from: 'cliente',
      text: trimmed,
      time: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-body)] pb-24 md:pb-0 flex flex-col">
      <div className="w-full border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-3xl mx-auto px-4 py-3 md:px-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/cliente/conversas')}
            className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-primary)]"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--bg-body)]">
              <img
                src={conversation.storeImage}
                alt={conversation.storeName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-semibold text-[var(--text-primary)]">
                {conversation.storeName}
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">
                Online há pouco tempo
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full">
        <div className="max-w-3xl mx-auto h-full flex flex-col">
          <div className="flex-1 px-4 md:px-6 py-3 overflow-y-auto space-y-2">
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
                    className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                      isClient
                        ? 'bg-[var(--primary-100)] text-white rounded-br-sm'
                        : 'bg-[var(--surface)] text-[var(--text-primary)] rounded-bl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    <span
                      className={`mt-1 block text-[10px] ${
                        isClient ? 'text-white/80' : 'text-[var(--text-muted)]'
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

          <div className="border-t border-[var(--border)] bg-[var(--surface)]">
            <div className="max-w-3xl mx-auto px-3 md:px-6 py-2 md:py-3 flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite uma mensagem..."
                className="flex-1 rounded-full border border-[var(--border)] bg-[var(--bg-body)] px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
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
    </div>
  );
};

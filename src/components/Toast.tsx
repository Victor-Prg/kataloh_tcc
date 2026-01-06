import { useEffect } from 'react';
import '../assets/Toast.css';
import { X, CheckCircle, WarningCircle } from 'phosphor-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error';
  title: string;
  description?: string;
}

interface ToastProps {
  message: ToastMessage;
  onRemove: (id: string) => void;
}

export const Toast = ({ message, onRemove }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => { onRemove(message.id); }, 3000);
    return () => clearTimeout(timer);
  }, [message.id, onRemove]);

  return (
    <div className={`toast ${message.type}`}>
      <div className="icon-color">
        {message.type === 'success' ? <CheckCircle size={24} weight="fill" /> : <WarningCircle size={24} weight="fill" />}
      </div>
      <div className="toast-content">
        <span className="toast-title">{message.title}</span>
        {message.description && <span className="toast-desc">{message.description}</span>}
      </div>
      <button className="toast-close" onClick={() => onRemove(message.id)}>
        <X size={20} />
      </button>
    </div>
  );
};
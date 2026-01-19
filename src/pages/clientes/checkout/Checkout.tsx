import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronLeft } from 'lucide-react';
import { useCart } from '../../../composables/CartContext';
import { Button, Text } from '../../../components';
import { AddressStep } from './AddressStep';
import { PaymentStep } from './PaymentStep';

export default function Checkout() {
  const navigate = useNavigate();
  // CORREÇÃO: Removido cartTotal que não era usado aqui
  const { items, isMultiStore, uniqueStoreNames } = useCart();
  const [step, setStep] = useState<1 | 2>(1); // 1 = Endereço, 2 = Pagamento
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="p-6 text-center">
        <Text as="h2" size="lg">Seu carrinho está vazio</Text>
        <Button onClick={() => navigate('/cliente/lojas')} className="mt-4">
          Ir às compras
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 pb-24">
      {/* Header com Botão Voltar */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => (step === 1 ? navigate(-1) : setStep(1))}
          className="p-2 hover:bg-[var(--bg-hover)] rounded-full"
        >
          <ChevronLeft />
        </button>
        <Text as="h1" size="heading" style={{ fontWeight: 'bold' }}>Finalizar Pedido</Text>
      </div>

      {/* Stepper Visual */}
      <div className="flex items-center justify-center mb-8">
        <div
          className={`flex items-center gap-2 ${
            step >= 1 ? 'text-[var(--primary-100)]' : 'text-[var(--text-muted)]'
          }`}
        >
          <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">1</div>
          <span className="font-medium">Endereço</span>
        </div>
        <div
          className={`w-16 h-0.5 mx-4 ${
            step >= 2 ? 'bg-[var(--primary-100)]' : 'bg-[var(--border)]'
          }`}
        />
        <div
          className={`flex items-center gap-2 ${
            step >= 2 ? 'text-[var(--primary-100)]' : 'text-[var(--text-muted)]'
          }`}
        >
          <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">2</div>
          <span className="font-medium">Pagamento</span>
        </div>
      </div>

      {/* Conteúdo dos Passos */}
      {step === 1 && (
        <AddressStep 
          onSelectAddress={setSelectedAddress} 
          selectedId={selectedAddress}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <PaymentStep 
          addressId={selectedAddress}
          onBack={() => setStep(1)}
        />
      )}

      {/* Resumo Fixo (Apenas informativo do valor) */}
      <div className="mt-8 border-t border-[var(--border)] pt-4">
        {isMultiStore && (
           <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm text-blue-700 dark:text-blue-300 flex gap-2">
             <CheckCircle size={16} className="mt-0.5"/>
             <div>
               <strong>Compra Compartilhada:</strong> Você está comprando de: {uniqueStoreNames.join(', ')}. 
               Os pedidos serão gerados individualmente para cada loja.
             </div>
           </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { QrCode, CreditCard, Banknote, Store, Smartphone, CheckCircle } from 'lucide-react'; // CORREÇÃO: Adicionado CheckCircle
import { useCart } from '../../../composables/CartContext';
import { Button, Text, Input, Switch } from '../../../components';

type PaymentMethod = 'pix' | 'credit_online' | 'machine' | 'cash' | 'pickup';

interface PaymentStepProps {
  addressId: string | null;
  onBack: () => void;
}

export const PaymentStep = ({ addressId, onBack }: PaymentStepProps) => {
  const { cartTotal, isMultiStore, clearCart } = useCart();
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  
  // Estados para Dinheiro
  const [needsChange, setNeedsChange] = useState(false);
  const [changeFor, setChangeFor] = useState('');

  // Estados para Cartão
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });

  // Lógica de Filtro: Se multi-loja, remove opções offline
  const availableMethods = [
    { id: 'pix', label: 'Pix (Aprovação Imediata)', icon: QrCode, online: true },
    { id: 'credit_online', label: 'Cartão de Crédito (App)', icon: CreditCard, online: true },
    { id: 'machine', label: 'Pagar na Entrega (Maquininha)', icon: Smartphone, online: false },
    { id: 'cash', label: 'Dinheiro (Pagar na Entrega)', icon: Banknote, online: false },
    { id: 'pickup', label: 'Pagar na Retirada', icon: Store, online: false },
  ].filter(m => isMultiStore ? m.online : true);

  const handleFinishOrder = () => {
    // CORREÇÃO: Usando addressId para simular envio correto
    if (!addressId) {
      alert('Erro: Endereço não selecionado.');
      return;
    }
    
    // Aqui você enviaria os dados para a API
    alert(`Pedido Realizado com Sucesso!\nEndereço ID: ${addressId}\nTotal: R$ ${cartTotal.toFixed(2)}\nMétodo: ${method}`);
    clearCart();
    // Navegar para sucesso ou home...
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Aviso de Carrinho Compartilhado */}
      {isMultiStore && (
        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
          <Text size="sm" className="text-orange-800 dark:text-orange-200">
            ⚠️ Carrinho Compartilhado: Para garantir a segurança de pedidos em múltiplas lojas simultâneas, apenas pagamentos online são aceitos.
          </Text>
        </div>
      )}

      {/* Seleção de Método */}
      <div className="space-y-3">
        {/* CORREÇÃO: as="h3" -> as="h2" */}
        <Text as="h2" size="md" style={{ fontWeight: 'bold' }}>Forma de Pagamento</Text>
        {availableMethods.map((m) => (
          <div
            key={m.id}
            onClick={() => setMethod(m.id as PaymentMethod)}
            className={`
              cursor-pointer border rounded-lg p-4 flex items-center gap-4 transition-all
              ${method === m.id 
                ? 'border-[var(--primary-100)] bg-[var(--primary-50)]/10 ring-1 ring-[var(--primary-100)]' 
                : 'border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)]'}
            `}
          >
            <m.icon size={24} className={method === m.id ? 'text-[var(--primary-100)]' : 'text-gray-500'} />
            <Text style={{ fontWeight: method === m.id ? '600' : '400' }}>{m.label}</Text>
          </div>
        ))}
      </div>

      {/* Detalhes do Método Selecionado */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
        {!method && <Text className="text-center text-gray-500">Selecione uma forma de pagamento acima.</Text>}

        {method === 'pix' && (
          <div className="text-center space-y-4">
            <Text style={{fontWeight: 'bold'}}>Código Pix Gerado</Text>
            <div className="w-48 h-48 bg-gray-200 mx-auto flex items-center justify-center rounded-lg">
              <QrCode size={64} className="text-gray-400" />
            </div>
            <Text size="sm" color="var(--text-secondary)">Copie e cole no app do seu banco ou escaneie o QR Code.</Text>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs break-all font-mono">
              00020126360014BR.GOV.BCB.PIX0114+551199999999520400005303986540510.005802BR5913Kataloh App6008Sao Paulo62070503***63041D3D
            </div>
             <Button variant="outline" size="sm" onClick={() => alert('Copiado!')}>Copiar Código Pix</Button>
          </div>
        )}

        {method === 'credit_online' && (
          <div className="space-y-3">
             <Input
               label="Número do Cartão"
               placeholder="0000 0000 0000 0000"
               maxLength={19}
               value={cardData.number}
               onChange={e => {
                 const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                 let formatted = '';
                 for (let i = 0; i < digits.length; i++) {
                   if (i > 0 && i % 4 === 0) {
                     formatted += ' ';
                   }
                   formatted += digits[i];
                 }
                 setCardData({ ...cardData, number: formatted });
               }}
             />
             <Input
               label="Nome no Cartão"
               placeholder="COMO NO CARTAO"
               maxLength={20}
               value={cardData.name}
               onChange={e => {
                 const onlyLetters = e.target.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '');
                 const limited = onlyLetters.slice(0, 20);
                 setCardData({ ...cardData, name: limited.toUpperCase() });
               }}
             />
             <div className="flex gap-3">
               <Input
                 label="Validade"
                 placeholder="MM/AA"
                 className="w-1/2"
                 maxLength={5}
                 value={cardData.expiry}
                 onChange={e => {
                   const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                   const formatted = digits.length <= 2 ? digits : `${digits.slice(0, 2)}/${digits.slice(2)}`;
                   setCardData({ ...cardData, expiry: formatted });
                 }}
               />
               <Input
                 label="CVV"
                 placeholder="123"
                 className="w-1/2"
                 maxLength={3}
                 value={cardData.cvv}
                 onChange={e => {
                   const digits = e.target.value.replace(/\D/g, '').slice(0, 3);
                   setCardData({ ...cardData, cvv: digits });
                 }}
               />
             </div>
          </div>
        )}

        {method === 'cash' && (
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Text>Precisa de troco?</Text>
                <Switch checked={needsChange} onToggle={() => setNeedsChange(!needsChange)} />
              </div>
              {needsChange && (
                <Input 
                  label="Troco para quanto?" 
                  placeholder="R$ 50,00" 
                  value={changeFor}
                  onChange={e => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 7);
                    if (!raw) {
                      setChangeFor('');
                      return;
                    }
                    const valueNumber = Number(raw) / 100;
                    const formatted = valueNumber.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                    });
                    setChangeFor(formatted);
                  }}
                />
              )}
           </div>
        )}
        
        {(method === 'machine' || method === 'pickup') && (
           <div className="text-center py-4">
             <CheckCircle size={48} className="mx-auto text-green-500 mb-2" />
             <Text>Tudo certo! O pagamento será realizado no momento da {method === 'machine' ? 'entrega' : 'retirada'}.</Text>
           </div>
        )}
      </div>

      {/* Botão Final */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--surface-nav)] border-t border-[var(--border)] z-10 md:static md:bg-transparent md:border-0 md:p-0">
        <div className="flex justify-between items-center mb-2 md:hidden">
          <Text size="sm">Total</Text>
          <Text size="lg" style={{fontWeight: 'bold'}}>R$ {cartTotal.toFixed(2)}</Text>
        </div>
        
        <div className="flex gap-3">
          {/* CORREÇÃO: Botão voltar usa a prop onBack */}
          <Button variant="outline" className="flex-1" onClick={onBack}>
            Voltar
          </Button>
          <Button 
            variant="primary" 
            className="flex-[2] py-3 text-lg" 
            disabled={!method}
            onClick={handleFinishOrder}
          >
            Finalizar • R$ {cartTotal.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
};

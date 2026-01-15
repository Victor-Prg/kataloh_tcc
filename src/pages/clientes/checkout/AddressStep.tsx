import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button, Text, Input, Modal } from '../../../components';

// Mock de endereços
const MOCK_ADDRESSES = [
  { id: '1', label: 'Casa', street: 'Rua das Flores, 123', district: 'Centro' },
  { id: '2', label: 'Trabalho', street: 'Av. Paulista, 1000', district: 'Bela Vista' },
];

interface AddressStepProps {
  onSelectAddress: (id: string) => void;
  selectedId: string | null;
  onNext: () => void;
}

export const AddressStep = ({ onSelectAddress, selectedId, onNext }: AddressStepProps) => {
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [addresses] = useState(MOCK_ADDRESSES);
  const [numero, setNumero] = useState('');

  return (
    <div className="flex flex-col gap-4">
      <Text as="h2" size="lg" style={{ fontWeight: 'bold', marginBottom: 10 }}>
        Onde vamos entregar?
      </Text>
      
      {addresses.map((addr) => (
        <div 
          key={addr.id}
          onClick={() => onSelectAddress(addr.id)}
          className={`
            cursor-pointer border rounded-xl p-4 flex items-start gap-4 transition-all
            ${selectedId === addr.id 
              ? 'border-[var(--primary-100)] bg-[var(--primary-50)]/10 ring-1 ring-[var(--primary-100)]' 
              : 'border-[var(--border)] hover:border-gray-400 bg-[var(--bg-card)]'}
          `}
        >
          <div className={`mt-1 ${selectedId === addr.id ? 'text-[var(--primary-100)]' : 'text-gray-400'}`}>
            {/* CORREÇÃO AQUI: Trocamos 'weight' por 'fill' para funcionar com Lucide React */}
            <MapPin 
              size={24} 
              fill={selectedId === addr.id ? "currentColor" : "none"} 
            />
          </div>
          <div>
            <Text style={{ fontWeight: 'bold' }}>{addr.label}</Text>
            <Text size="sm" color="var(--text-secondary)">{addr.street} - {addr.district}</Text>
          </div>
        </div>
      ))}

      <Button 
        variant="outline" 
        className="w-55 self-center py-4 border-dashed flex items-center justify-center gap-2" 
        onClick={() => setShowNewAddress(true)}>
        Adicionar Novo Endereço
      </Button>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--surface-nav)] border-t border-[var(--border)] z-10 md:static md:bg-transparent md:border-0 md:p-0 md:mt-4">
        <Button 
          variant="primary" 
          className="w-full py-3 text-lg" 
          disabled={!selectedId}
          onClick={onNext}
        >
          Continuar para Pagamento
        </Button>
      </div>

      <Modal isOpen={showNewAddress} onClose={() => setShowNewAddress(false)} title="Novo Endereço">
        <div className="space-y-2 px-2 md:px-0">
          <Input label="Rótulo (ex: Casa)" placeholder="Casa" maxLength={20} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Rua" placeholder="Rua..." maxLength={80} />
            <Input
              label="Número"
              placeholder="Número..."
              maxLength={4}
              value={numero}
              onChange={e => {
                let value = e.target.value;
                if (value.length > 4) {
                  value = value.slice(0, 4);
                }
                const normalized = value.toLowerCase();
                const isDigits = /^[0-9]*$/.test(value);
                const isPrefixSn = 's/n'.startsWith(normalized);
                if (isDigits || isPrefixSn) {
                  setNumero(value);
                }
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Bairro" placeholder="Bairro..." maxLength={80} />
            <Input label="Complemento" placeholder="Complemento..." maxLength={80} />
          </div>
          <Button onClick={() => setShowNewAddress(false)} className="w-full mt-4">Salvar Endereço</Button>
        </div>
      </Modal>
    </div>
  );
};

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';

interface Loja {
  id: string;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  ativa: boolean;
}

export default function DeliveryLojas() {
  const [showLojaModal, setShowLojaModal] = useState(false);
  
  const [lojas, setLojas] = useState<Loja[]>([
    {
      id: '1',
      nome: 'Burger King',
      cnpj: '12.345.678/0001-90',
      telefone: '(11) 98765-4321',
      email: 'contato@burgerking.com',
      endereco: 'Av. Paulista, 1000 - São Paulo',
      ativa: true,
    },
    {
      id: '2',
      nome: 'Pizza Hut',
      cnpj: '98.765.432/0001-10',
      telefone: '(11) 91234-5678',
      email: 'contato@pizzahut.com',
      endereco: 'Rua Augusta, 500 - São Paulo',
      ativa: true,
    },
  ]);

  const [lojaForm, setLojaForm] = useState({
    nome: '',
    cnpj: '',
    telefone: '',
    email: '',
    endereco: '',
  });

  const handleLojaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novaLoja: Loja = {
      id: String(lojas.length + 1),
      ...lojaForm,
      ativa: true,
    };
    setLojas([...lojas, novaLoja]);
    setLojaForm({ nome: '', cnpj: '', telefone: '', email: '', endereco: '' });
    setShowLojaModal(false);
  };

  const toggleLojaStatus = (id: string) => {
    setLojas(lojas.map((loja) => (loja.id === id ? { ...loja, ativa: !loja.ativa } : loja)));
  };

  const deleteLoja = (id: string) => {
    if (window.confirm('Deseja realmente excluir esta loja?')) {
      setLojas(lojas.filter((loja) => loja.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-body)]">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-[24px] sm:text-[28px] leading-[32px] font-semibold tracking-tight text-[var(--text-primary)]">
              Gerenciar Lojas
            </h1>
            <p className="mt-1 text-[20px] leading-[24px] text-[var(--text-primary)]">
              Cadastre e gerencie as lojas parceiras do delivery
            </p>
          </div>
          <Button
            onClick={() => setShowLojaModal(true)}
            className="!bg-[var(--primary-100)] !text-white hover:!opacity-90"
          >
            <Plus size={18} className="inline mr-2" />
            Nova Loja
          </Button>
        </div>

        {/* Lista de Lojas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lojas.map((loja) => (
            <Card key={loja.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">{loja.nome}</h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    loja.ativa
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}
                >
                  {loja.ativa ? 'Ativa' : 'Inativa'}
                </span>
              </div>
              <div className="space-y-2 text-sm text-[var(--text-secondary)] mb-4">
                <p><span className="font-medium">CNPJ:</span> {loja.cnpj}</p>
                <p><span className="font-medium">Telefone:</span> {loja.telefone}</p>
                <p><span className="font-medium">Email:</span> {loja.email}</p>
                <p><span className="font-medium">Endereço:</span> {loja.endereco}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => toggleLojaStatus(loja.id)}
                  variant="outline"
                  className="flex-1"
                >
                  {loja.ativa ? 'Desativar' : 'Ativar'}
                </Button>
                <Button
                  onClick={() => deleteLoja(loja.id)}
                  variant="outline"
                  className="!px-3 !text-red-600 !border-red-200 hover:!bg-red-50"
                >
                  <Trash2 size={16} className="inline mr-1.5" />
                  Excluir
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal Nova Loja */}
      <Modal isOpen={showLojaModal} onClose={() => setShowLojaModal(false)} title="Cadastrar Nova Loja">
        <form onSubmit={handleLojaSubmit} className="space-y-4">
          <Input
            label="Nome da Loja"
            value={lojaForm.nome}
            onChange={(e) => setLojaForm({ ...lojaForm, nome: e.target.value })}
            required
          />
          <Input
            label="CNPJ"
            value={lojaForm.cnpj}
            onChange={(e) => setLojaForm({ ...lojaForm, cnpj: e.target.value })}
            required
          />
          <Input
            label="Telefone"
            type="tel"
            value={lojaForm.telefone}
            onChange={(e) => setLojaForm({ ...lojaForm, telefone: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={lojaForm.email}
            onChange={(e) => setLojaForm({ ...lojaForm, email: e.target.value })}
            required
          />
          <Input
            label="Endereço"
            value={lojaForm.endereco}
            onChange={(e) => setLojaForm({ ...lojaForm, endereco: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setShowLojaModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="!bg-[var(--primary-100)] !text-white">
              Cadastrar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

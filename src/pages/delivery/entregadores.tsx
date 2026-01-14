import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';

interface Entregador {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  veiculo: string;
  placa: string;
  status: 'livre' | 'em_rota';
  totalEntregas: number;
  ganhoTotal: number;
}

export default function DeliveryEntregadores() {
  const [showEntregadorModal, setShowEntregadorModal] = useState(false);
  const [editingEntregador, setEditingEntregador] = useState<Entregador | null>(null);

  const [entregadores, setEntregadores] = useState<Entregador[]>([
    {
      id: '1',
      nome: 'Carlos Mendes',
      cpf: '123.456.789-00',
      telefone: '(11) 99999-1111',
      email: 'carlos@email.com',
      veiculo: 'Moto Honda CG 160',
      placa: 'ABC-1234',
      status: 'em_rota',
      totalEntregas: 45,
      ganhoTotal: 2250.0,
    },
    {
      id: '2',
      nome: 'Ana Souza',
      cpf: '987.654.321-00',
      telefone: '(11) 99999-2222',
      email: 'ana@email.com',
      veiculo: 'Moto Yamaha Factor',
      placa: 'XYZ-5678',
      status: 'livre',
      totalEntregas: 38,
      ganhoTotal: 1900.0,
    },
    {
      id: '3',
      nome: 'Roberto Lima',
      cpf: '456.789.123-00',
      telefone: '(11) 99999-3333',
      email: 'roberto@email.com',
      veiculo: 'Moto Honda Biz',
      placa: 'DEF-9012',
      status: 'livre',
      totalEntregas: 52,
      ganhoTotal: 2600.0,
    },
  ]);

  const [entregadorForm, setEntregadorForm] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    veiculo: '',
    placa: '',
  });

  const handleEntregadorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEntregador) {
      setEntregadores(
        entregadores.map((ent) =>
          ent.id === editingEntregador.id
            ? { ...ent, ...entregadorForm }
            : ent
        )
      );
    } else {
      const novoEntregador: Entregador = {
        id: String(entregadores.length + 1),
        ...entregadorForm,
        status: 'livre',
        totalEntregas: 0,
        ganhoTotal: 0,
      };
      setEntregadores([...entregadores, novoEntregador]);
    }
    
    setEntregadorForm({ nome: '', cpf: '', telefone: '', email: '', veiculo: '', placa: '' });
    setShowEntregadorModal(false);
  };

  const handleEditEntregador = (entregador: Entregador) => {
    setEditingEntregador(entregador);
    setEntregadorForm({
      nome: entregador.nome,
      cpf: entregador.cpf,
      telefone: entregador.telefone,
      email: entregador.email,
      veiculo: entregador.veiculo,
      placa: entregador.placa,
    });
    setShowEntregadorModal(true);
  };

  const handleCloseEntregadorModal = () => {
    setShowEntregadorModal(false);
    setEditingEntregador(null);
    setEntregadorForm({ nome: '', cpf: '', telefone: '', email: '', veiculo: '', placa: '' });
  };

  const deleteEntregador = (id: string) => {
    if (window.confirm('Deseja realmente excluir este entregador?')) {
      setEntregadores(entregadores.filter((ent) => ent.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-body)]">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-[28px] leading-[32px] font-semibold tracking-tight text-[var(--text-primary)]">
              Gerenciar Entregadores
            </h1>
            <p className="mt-1 text-[20px] leading-[24px] text-[var(--text-primary)]">
              Cadastre e gerencie os entregadores do sistema
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingEntregador(null);
              setShowEntregadorModal(true);
            }}
            className="!bg-[var(--primary-100)] !text-white hover:!opacity-90"
          >
            <Plus size={18} className="inline mr-2" />
            Novo Entregador
          </Button>
        </div>

        {/* Lista de Entregadores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entregadores.map((entregador) => (
            <Card key={entregador.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">{entregador.nome}</h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    entregador.status === 'livre'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                  }`}
                >
                  {entregador.status === 'livre' ? 'Livre' : 'Em Rota'}
                </span>
              </div>
              <div className="space-y-2 text-sm text-[var(--text-secondary)] mb-4">
                <p><span className="font-medium">CPF:</span> {entregador.cpf}</p>
                <p><span className="font-medium">Telefone:</span> {entregador.telefone}</p>
                <p><span className="font-medium">Email:</span> {entregador.email}</p>
                <p><span className="font-medium">Veículo:</span> {entregador.veiculo}</p>
                <p><span className="font-medium">Placa:</span> {entregador.placa}</p>
                <div className="pt-2 border-t border-[var(--border)]">
                  <p><span className="font-medium">Total Entregas:</span> {entregador.totalEntregas}</p>
                  <p><span className="font-medium">Ganhos:</span> R$ {entregador.ganhoTotal.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEditEntregador(entregador)}
                  variant="outline"
                  className="flex-1"
                >
                  <Edit2 size={16} className="inline mr-1.5" />
                  Editar
                </Button>
                <Button
                  onClick={() => deleteEntregador(entregador.id)}
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

      {/* Modal Entregador */}
      <Modal
        isOpen={showEntregadorModal}
        onClose={handleCloseEntregadorModal}
        title={editingEntregador ? 'Editar Entregador' : 'Cadastrar Novo Entregador'}
      >
        <form onSubmit={handleEntregadorSubmit} className="space-y-4">
          <Input
            label="Nome Completo"
            value={entregadorForm.nome}
            onChange={(e) => setEntregadorForm({ ...entregadorForm, nome: e.target.value })}
            required
          />
          <Input
            label="CPF"
            value={entregadorForm.cpf}
            onChange={(e) => setEntregadorForm({ ...entregadorForm, cpf: e.target.value })}
            required
          />
          <Input
            label="Telefone"
            type="tel"
            value={entregadorForm.telefone}
            onChange={(e) => setEntregadorForm({ ...entregadorForm, telefone: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={entregadorForm.email}
            onChange={(e) => setEntregadorForm({ ...entregadorForm, email: e.target.value })}
            required
          />
          <Input
            label="Veículo"
            value={entregadorForm.veiculo}
            onChange={(e) => setEntregadorForm({ ...entregadorForm, veiculo: e.target.value })}
            required
          />
          <Input
            label="Placa"
            value={entregadorForm.placa}
            onChange={(e) => setEntregadorForm({ ...entregadorForm, placa: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={handleCloseEntregadorModal}>
              Cancelar
            </Button>
            <Button type="submit" className="!bg-[var(--primary-100)] !text-white">
              {editingEntregador ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

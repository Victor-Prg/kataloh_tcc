import { useMemo, useState } from 'react';
import { 
  Table, 
  Card, 
  Text, 
  Input, 
  Select, 
  Badge, 
  Pagination, 
  Button 
} from '../../components'; 
// Certifique-se que o caminho do DateRangePicker está correto
import { DateRangePicker } from '../../components/DateRangePicker'; 
import { FileCsv } from 'phosphor-react';

// --- TIPAGEM ---
type StatusTransacao = 'concluido' | 'pendente' | 'falha' | 'cancelado';

interface Transacao {
  id: string;
  cliente: string;
  dataHora: Date;
  valor: number;
  tipo: 'PIX' | 'BOLETO' | 'CARTAO';
  status: StatusTransacao;
  idTransacaoPix?: string;
}

// --- DADOS MOCKADOS ---
const MOCK_DATA: Transacao[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `TRX-${1000 + i}`,
  cliente: i % 2 === 0 ? `Cliente Exemplo ${i}` : `Loja do Fulano ${i}`,
  dataHora: new Date(2024, 0, 15 + i, 14, 30),
  valor: 150.00 + (i * 10.50),
  tipo: 'PIX',
  status: i % 5 === 0 ? 'falha' : i % 3 === 0 ? 'pendente' : 'concluido',
  idTransacaoPix: `E12345678202401${String(i).padStart(4, '0')}`
}));

const statusOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Concluído', value: 'concluido' },
  { label: 'Pendente', value: 'pendente' },
  { label: 'Falha', value: 'falha' },
];

export default function HistoricoRepasses() {
  // Estados
  const [buscaCliente, setBuscaCliente] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('all');
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- LÓGICA DE FILTRAGEM ---
  const dadosFiltrados = useMemo(() => {
    return MOCK_DATA.filter((item) => {
      // 1. Filtro Texto (Recriado aqui para não dar erro de variável não definida)
      const matchCliente = item.cliente.toLowerCase().includes(buscaCliente.toLowerCase()) || 
                           item.id.toLowerCase().includes(buscaCliente.toLowerCase());
      
      // 2. Filtro Status (Recriado aqui)
      const matchStatus = statusFiltro === 'all' || item.status === statusFiltro;

      // 3. Filtro de Data (INTERVALO)
      let matchData = true;
      const { start, end } = dateRange;

      if (start || end) {
        const itemDate = new Date(item.dataHora);
        itemDate.setHours(0, 0, 0, 0);

        if (start) {
          const startDate = new Date(start);
          startDate.setHours(0, 0, 0, 0);
          if (itemDate < startDate) matchData = false;
        }

        if (matchData && end) {
          const endDate = new Date(end);
          endDate.setHours(0, 0, 0, 0);
          if (itemDate > endDate) matchData = false;
        }
      }

      return matchCliente && matchStatus && matchData;
    });
  }, [buscaCliente, statusFiltro, dateRange]);

  // Paginação
  const totalPages = Math.ceil(dadosFiltrados.length / itemsPerPage);
  const currentData = dadosFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Colunas da Tabela
  const columns = [
    {
      key: 'id',
      header: 'ID Transação',
      renderCell: (row: Transacao) => (
        <div className="flex flex-col gap-1">
          <Text size="sm" style={{ fontWeight: 'bold' }}>{row.id}</Text>
          <Text size="sm" color="var(--text-secondary)" style={{ fontSize: '11px' }}>
            PIX: {row.idTransacaoPix}
          </Text>
        </div>
      ),
    },
    {
      key: 'data',
      header: 'Data / Hora',
      renderCell: (row: Transacao) => (
        <Text size="sm">
          {new Intl.DateTimeFormat('pt-BR', { 
            day: '2-digit', month: '2-digit', year: '2-digit', 
            hour: '2-digit', minute: '2-digit' 
          }).format(row.dataHora)}
        </Text>
      ),
    },
    {
      key: 'cliente',
      header: 'Cliente / Loja',
      renderCell: (row: Transacao) => (
        <Text size="sm" style={{ fontWeight: 500 }}>{row.cliente}</Text>
      ),
    },
    {
      key: 'valor',
      header: 'Valor',
      renderCell: (row: Transacao) => (
        <Text size="sm" style={{ fontWeight: 'bold' }}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.valor)}
        </Text>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      renderCell: (row: Transacao) => {
        const variantMap: Record<string, 'sucesso' | 'aviso' | 'perigo' | 'neutro'> = {
          concluido: 'sucesso',
          pendente: 'aviso',
          falha: 'perigo',
          cancelado: 'neutro'
        };
        const labelMap: Record<string, string> = {
          concluido: 'Pago',
          pendente: 'Processando',
          falha: 'Falhou',
          cancelado: 'Cancelado'
        };
        return <Badge variant={variantMap[row.status] || 'neutro'} label={labelMap[row.status]} />;
      },
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Text as="h1" size="heading" style={{ fontWeight: 'bold' }}>Histórico de Repasses</Text>
          <Text color="var(--text-secondary)">Gerencie as transferências PIX realizadas.</Text>
        </div>
        <Button variant="outline" label="Exportar CSV" icon={<FileCsv size={20} />} />
      </div>

      {/* Filtros */}
      <Card variant="outlined" padding="20px">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          <div className="md:col-span-4">
            <Input 
              label="Buscar" 
              placeholder="Nome do cliente ou ID..." 
              value={buscaCliente}
              onChange={(e) => {
                setBuscaCliente(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="md:col-span-3">
            <Select 
              label="Status" 
              options={statusOptions}
              value={statusFiltro}
              onChange={(e) => {
                setStatusFiltro(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="md:col-span-5">
            <DateRangePicker 
              label="Período"
              startDate={dateRange.start}
              endDate={dateRange.end}
              onChange={(range) => {
                setDateRange(range);
                setCurrentPage(1);
              }}
              placeholder="Início - Fim"
            />
          </div>

        </div>
      </Card>

      {/* Tabela */}
      <Card variant="elevated" padding="0">
        <Table 
          columns={columns} 
          data={currentData} 
          emptyTitle="Nenhum repasse encontrado" 
          emptyDescription="Ajuste os filtros de data ou status." 
        />
        
        {dadosFiltrados.length > 0 && (
          <div className="p-4 border-t border-[var(--border-color)] flex justify-end">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
              showFirstLast 
            />
          </div>
        )}
      </Card>
    </div>
  );
}
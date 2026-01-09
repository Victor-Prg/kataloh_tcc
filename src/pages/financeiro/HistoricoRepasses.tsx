import { useMemo, useState } from 'react';
import { 
  Table, 
  Card, 
  Text, 
  Input, 
  Select, 
  DatePicker, 
  Badge, 
  Pagination, 
  Stack, 
  Button 
} from '../../components'; // Ajuste o caminho dos componentes se necessário
import { FileCsv } from 'phosphor-react';

// --- TIPAGEM DOS DADOS ---
type StatusTransacao = 'concluido' | 'pendente' | 'falha' | 'cancelado';

interface Transacao {
  id: string;
  cliente: string;
  dataHora: Date;
  valor: number;
  tipo: 'PIX' | 'BOLETO' | 'CARTAO';
  status: StatusTransacao;
  idTransacaoPix?: string; // ID E2E do PIX
}

// --- DADOS MOCKADOS (Para teste) ---
const MOCK_DATA: Transacao[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `TRX-${1000 + i}`,
  cliente: i % 2 === 0 ? `Cliente Exemplo ${i}` : `Loja do Fulano ${i}`,
  dataHora: new Date(2024, 0, 15 + i, 14, 30),
  valor: 150.00 + (i * 10.50),
  tipo: 'PIX',
  status: i % 5 === 0 ? 'falha' : i % 3 === 0 ? 'pendente' : 'concluido',
  idTransacaoPix: `E12345678202401${String(i).padStart(4, '0')}`
}));

// --- OPÇÕES DE FILTRO ---
const statusOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Concluído', value: 'concluido' },
  { label: 'Pendente', value: 'pendente' },
  { label: 'Falha', value: 'falha' },
];

export default function HistoricoRepasses() {
  // Estados dos Filtros
  const [buscaCliente, setBuscaCliente] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('all');
  const [dataFiltro, setDataFiltro] = useState<Date | undefined>(undefined);
  
  // Estado da Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- LÓGICA DE FILTRAGEM ---
  const dadosFiltrados = useMemo(() => {
    return MOCK_DATA.filter((item) => {
      // 1. Filtro por Cliente (Busca textual)
      const matchCliente = item.cliente.toLowerCase().includes(buscaCliente.toLowerCase()) || 
                           item.id.toLowerCase().includes(buscaCliente.toLowerCase());
      
      // 2. Filtro por Status
      const matchStatus = statusFiltro === 'all' || item.status === statusFiltro;

      // 3. Filtro por Data (Compara dia/mês/ano ignorando hora)
      let matchData = true;
      if (dataFiltro) {
        matchData = item.dataHora.toDateString() === dataFiltro.toDateString();
      }

      return matchCliente && matchStatus && matchData;
    });
  }, [buscaCliente, statusFiltro, dataFiltro]);

  // --- LÓGICA DE PAGINAÇÃO ---
  const totalPages = Math.ceil(dadosFiltrados.length / itemsPerPage);
  const currentData = dadosFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- DEFINIÇÃO DAS COLUNAS ---
  const columns = [
    {
      key: 'id',
      header: 'ID Transação',
      renderCell: (row: Transacao) => (
        <Stack gap={2}>
          <Text size="sm" style={{ fontWeight: 'bold' }}>{row.id}</Text>
          <Text size="sm" color="var(--text-secondary)" style={{ fontSize: '11px' }}>
            PIX: {row.idTransacaoPix}
          </Text>
        </Stack>
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
        
        return <Badge variant={variantMap[row.status]} label={labelMap[row.status]} />;
      },
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* CABEÇALHO DA PÁGINA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Text as="h1" size="heading" style={{ fontWeight: 'bold' }}>Histórico de Repasses</Text>
          <Text color="var(--text-secondary)">Gerencie as transferências PIX realizadas.</Text>
        </div>
        <Button 
          variant="outline" 
          label="Exportar CSV" 
          icon={<FileCsv size={20} />} 
        />
      </div>

      {/* ÁREA DE FILTROS */}
      <Card variant="outlined" padding="20px">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          {/* Busca por Texto */}
          <div className="col-span-1 md:col-span-2">
            <Input 
              label="Buscar Cliente ou ID" 
              placeholder="Digite o nome..." 
              value={buscaCliente}
              onChange={(e) => {
                setBuscaCliente(e.target.value);
                setCurrentPage(1); // Resetar página ao filtrar
              }}
              // Se o seu Input suportar ícone, coloque aqui, senão remove
            />
          </div>

          {/* Filtro de Status */}
          <div>
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

          {/* Filtro de Data */}
          <div>
            <DatePicker 
              label="Data do Repasse"
              value={dataFiltro}
              onChange={(date) => {
                setDataFiltro(date);
                setCurrentPage(1);
              }}
              placeholder="Selecionar data"
            />
          </div>
        </div>
      </Card>

      {/* TABELA DE DADOS */}
      <Card variant="elevated" padding="0">
        <Table 
          columns={columns} 
          data={currentData} 
          emptyTitle="Nenhum repasse encontrado"
          emptyDescription="Tente ajustar os filtros de busca."
        />
        
        {/* RODAPÉ COM PAGINAÇÃO */}
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
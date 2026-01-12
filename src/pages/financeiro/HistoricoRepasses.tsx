import { useMemo, useState, useRef, useEffect } from 'react';
import { 
  Text, 
  Badge, 
  Button 
} from '../../components'; 
import { FileCsv, Eraser, MagnifyingGlass, CaretDown, Tag, CalendarBlank, CaretLeft, CaretRight } from 'phosphor-react';

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
  { label: 'Todos os status', value: 'all' },
  { label: 'Concluído', value: 'concluido' },
  { label: 'Pendente', value: 'pendente' },
  { label: 'Falha', value: 'falha' },
];

export default function HistoricoRepasses() {
  const [buscaCliente, setBuscaCliente] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('all');
  
  // --- ESTADOS DE DATA ---
  const [dateStart, setDateStart] = useState(''); 
  const [dateEnd, setDateEnd] = useState(''); 
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const datePickerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerContainerRef.current && !datePickerContainerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClearFilters = () => {
    setBuscaCliente('');
    setStatusFiltro('all');
    setDateStart('');
    setDateEnd('');
    setIsDatePickerOpen(false);
    setCurrentPage(1);
  };

  const formatDateDisplay = (isoDate: string) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  const dateButtonLabel = useMemo(() => {
    if (dateStart && dateEnd) return `${formatDateDisplay(dateStart)} - ${formatDateDisplay(dateEnd)}`;
    if (dateStart) return `${formatDateDisplay(dateStart)} - ...`;
    return "Período";
  }, [dateStart, dateEnd]);

  // --- FILTRAGEM ---
  const dadosFiltrados = useMemo(() => {
    return MOCK_DATA.filter((item) => {
      const matchCliente = item.cliente.toLowerCase().includes(buscaCliente.toLowerCase()) || 
                           item.id.toLowerCase().includes(buscaCliente.toLowerCase());
      
      const matchStatus = statusFiltro === 'all' || item.status === statusFiltro;

      let matchData = true;
      const itemDate = new Date(item.dataHora);
      itemDate.setHours(0, 0, 0, 0);

      if (dateStart) {
        const start = new Date(dateStart);
        start.setHours(0, 0, 0, 0);
        if (itemDate < start) matchData = false;
      }

      if (matchData && dateEnd) {
        const end = new Date(dateEnd);
        end.setHours(0, 0, 0, 0);
        if (itemDate > end) matchData = false;
      }

      return matchCliente && matchStatus && matchData;
    });
  }, [buscaCliente, statusFiltro, dateStart, dateEnd]);

  const totalPages = Math.ceil(dadosFiltrados.length / itemsPerPage);
  const currentData = dadosFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderStatusBadge = (status: StatusTransacao) => {
    const variantMap: Record<string, 'sucesso' | 'aviso' | 'perigo' | 'neutro'> = { concluido: 'sucesso', pendente: 'aviso', falha: 'perigo', cancelado: 'neutro' };
    const labelMap: Record<string, string> = { concluido: 'Pago', pendente: 'Proc.', falha: 'Falha', cancelado: 'Canc.' }; 
    return <Badge variant={variantMap[status] || 'neutro'} label={labelMap[status]} />;
  };

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
        <div className="flex items-center gap-2">
          <CalendarBlank size={16} className="text-[var(--text-secondary)] shrink-0" />
          <Text size="sm">
            {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }).format(row.dataHora)}
          </Text>
        </div>
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
        const variantMap: Record<string, 'sucesso' | 'aviso' | 'perigo' | 'neutro'> = { concluido: 'sucesso', pendente: 'aviso', falha: 'perigo', cancelado: 'neutro' };
        const labelMap: Record<string, string> = { concluido: 'Pago', pendente: 'Processando', falha: 'Falhou', cancelado: 'Cancelado' };
        return <Badge variant={variantMap[row.status] || 'neutro'} label={labelMap[row.status]} />;
      },
    },
  ];

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, dadosFiltrados.length);
  
  const buttonStyleClass = "flex items-center justify-start h-10 px-3 rounded-md border border-[var(--border-color)] bg-transparent text-[var(--text-secondary)] w-full transition-all hover:border-[var(--text-muted)] focus-within:border-[var(--primary-100)] focus-within:ring-1 focus-within:ring-[var(--primary-100)]";

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* HEADER + FILTROS */}
      <div className="flex flex-col xl:flex-row justify-between xl:items-start gap-6">
        <div className="min-w-max pt-1 flex flex-col gap-1"> 
          {/* TÍTULO: 28px */}
          <Text as="h1" style={{ fontWeight: 'bold', fontSize: '28px', lineHeight: '1.2' }}>
            Histórico de Repasses
          </Text>
          
          {/* SUBTÍTULO: 20px */}
          <Text color="var(--text-secondary)" style={{ fontSize: '20px' }}>
            Gerencie as transferências PIX.
          </Text>
        </div>
        
        <div className="w-full xl:w-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* BUSCA */}
          <div className={buttonStyleClass}>
            <MagnifyingGlass size={18} className="mr-2 opacity-50 shrink-0" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={buscaCliente} 
              onChange={(e) => { setBuscaCliente(e.target.value); setCurrentPage(1); }} 
              className="bg-transparent border-none outline-none w-full h-full text-sm placeholder-[var(--text-muted)] text-[var(--text-primary)]" 
            />
          </div>
          
          {/* STATUS */}
          <div className="relative w-full h-10 group">
             <div className={`${buttonStyleClass} justify-between pointer-events-none`}>
                <div className="flex items-center overflow-hidden">
                   <Tag size={18} className="mr-2 opacity-50 shrink-0" />
                   <span className="text-sm truncate text-[var(--text-primary)]">
                     {statusOptions.find(opt => opt.value === statusFiltro)?.label || 'Status'}
                   </span>
                </div>
                <CaretDown size={14} className="opacity-50 shrink-0 ml-2" />
             </div>
             <select value={statusFiltro} onChange={(e) => { setStatusFiltro(e.target.value); setCurrentPage(1); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                {statusOptions.map(opt => (<option key={opt.value} value={opt.value} className="bg-[var(--surface)] text-[var(--text-primary)]">{opt.label}</option>))}
             </select>
          </div>
          
          {/* DATEPICKER */}
          <div className="relative w-full" ref={datePickerContainerRef}>
            <button 
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className={`${buttonStyleClass} w-full cursor-pointer justify-between ${isDatePickerOpen ? 'border-[var(--primary-100)] ring-1 ring-[var(--primary-100)]' : ''}`}
              type="button"
            >
               <div className="flex items-center overflow-hidden">
                 <CalendarBlank size={18} className="mr-2 opacity-50 shrink-0" />
                 <span className={`text-sm truncate ${dateStart ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                   {dateButtonLabel}
                 </span>
               </div>
               <CaretDown size={14} className={`opacity-50 shrink-0 ml-2 transition-transform ${isDatePickerOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDatePickerOpen && (
              <div className="absolute top-full left-0 mt-2 w-full sm:w-64 bg-[var(--surface)] border border-[var(--border-color)] rounded-lg shadow-xl z-50 p-4 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">Data Inicial</label>
                  <input 
                    type="date" 
                    max="9999-12-31" 
                    value={dateStart}
                    onChange={(e) => { 
                      if (e.target.value.length > 10) return; 
                      setDateStart(e.target.value); 
                      setCurrentPage(1); 
                    }}
                    style={{ colorScheme: 'dark' }} 
                    className="w-full h-9 rounded-md border border-[var(--border-color)] bg-transparent text-sm px-2 text-[var(--text-primary)] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">Data Final</label>
                  <input 
                    type="date" 
                    max="9999-12-31"
                    value={dateEnd}
                    onChange={(e) => { 
                      if (e.target.value.length > 10) return;
                      setDateEnd(e.target.value); 
                      setCurrentPage(1); 
                    }}
                    style={{ colorScheme: 'dark' }}
                    className="w-full h-9 rounded-md border border-[var(--border-color)] bg-transparent text-sm px-2 text-[var(--text-primary)] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                </div>
                <div className="pt-2 border-t border-[var(--border-color)] flex justify-end">
                   <button onClick={() => setIsDatePickerOpen(false)} className="text-xs text-[var(--primary-100)] font-medium hover:underline">
                     Fechar
                   </button>
                </div>
              </div>
            )}
          </div>

          <Button variant="outline" label="Limpar" icon={<Eraser size={18} />} onClick={handleClearFilters} className="justify-center border border-[var(--border-color)] text-[var(--text-secondary)] w-full h-10" />
          <Button variant="outline" label="Exportar" icon={<FileCsv size={18} />} className="justify-center bg-[var(--surface)] text-[var(--text-primary)] w-full h-10 hover:bg-[var(--surface-nav)]" />
        </div>
      </div>

      {/* --- CARD PRINCIPAL --- */}
      <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-lg shadow-sm overflow-hidden flex flex-col">
        
        {/* Header do Card */}
        <div className="px-4 py-3 border-b border-[var(--border-color)] bg-[var(--surface-nav)]/10">
          <Text size="sm" className="font-medium text-[#84cc16]"> 
            Mostrando {dadosFiltrados.length > 0 ? startItem : 0}-{endItem} de {dadosFiltrados.length} repasses
          </Text>
        </div>

        {/* --- DESKTOP VIEW --- */}
        <div className="hidden md:block w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--surface-nav)]/30 border-b border-[var(--border-color)]">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider whitespace-nowrap">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {currentData.length > 0 ? (
                currentData.map((row) => (
                  <tr key={row.id} className="hover:bg-[var(--surface-nav)]/10 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 whitespace-nowrap align-middle">
                        {col.renderCell(row)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-[var(--text-muted)]">
                    <Text>Nenhum repasse encontrado.</Text>
                    <Text size="sm">Tente ajustar os filtros.</Text>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- MOBILE VIEW (CARDS UM ABAIXO DO OUTRO) --- */}
        <div className="md:hidden flex flex-col gap-3 p-4 bg-[var(--surface-nav)]/5">
          {currentData.length > 0 ? (
            currentData.map((row) => (
              <div 
                key={row.id} 
                className="p-4 flex flex-col gap-3 bg-[var(--surface)] border border-[var(--border-color)] rounded-lg shadow-sm w-full"
              >
                {/* Linha 1: ID e Status */}
                <div className="flex justify-between items-start pb-2 border-b border-[var(--border-color)]/50">
                  <div className="flex flex-col">
                    <Text size="sm" style={{ fontWeight: 'bold' }}>{row.id}</Text>
                    <Text size="lg" color="var(--text-secondary)" style={{ fontSize: '10px' }}>
                      PIX: {row.idTransacaoPix}
                    </Text>
                  </div>
                  {renderStatusBadge(row.status)}
                </div>

                {/* Linha 2: Cliente */}
                <div className="flex flex-col gap-1">
                   <div>
                     <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium block mb-1">Cliente / Loja</span>
                     <Text size="sm" style={{ fontWeight: 500 }}>{row.cliente}</Text>
                   </div>
                   
                   {/* Linha 3: Data e Valor */}
                   <div className="flex justify-between items-end mt-2">
                       <div>
                          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium block mb-1">Data</span>
                          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                              <CalendarBlank size={16} />
                              <Text size="sm">
                                {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }).format(row.dataHora)}
                              </Text>
                          </div>
                       </div>
                       
                       <div className="text-right">
                          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium block mb-1">Valor</span>
                          <Text size="lg" style={{ fontWeight: 'bold' }} className="text-[var(--text-primary)]">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.valor)}
                          </Text>
                       </div>
                   </div>
                </div>
              </div>
            ))
          ) : (
             <div className="px-4 py-8 text-center text-[var(--text-muted)]">
                <Text>Nenhum repasse encontrado.</Text>
             </div>
          )}
        </div>
        
        {/* RODAPÉ (PAGINAÇÃO MANUAL) */}
        {dadosFiltrados.length > 0 && (
          <div className="w-full px-4 py-3 border-t border-[var(--border-color)] bg-[var(--surface)] flex flex-col sm:flex-row justify-center sm:justify-end items-center gap-3">
             
             {/* Componente de Paginação Manual */}
             <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--surface-nav)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CaretLeft size={16} weight="bold" />
                </button>

                {/* Numeração de Páginas */}
                <div className="flex items-center gap-1">
                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                     <button
                       key={page}
                       onClick={() => setCurrentPage(page)}
                       className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                         currentPage === page
                           ? 'bg-[#84cc16] text-black font-bold' // Estilo Ativo
                           : 'border border-[var(--border-color)] hover:bg-[var(--surface-nav)] text-[var(--text-primary)] hidden sm:flex' 
                       }`}
                     >
                       {page}
                     </button>
                   ))}
                   
                   {/* Mobile Fallback: Mostra apenas "1 / 5" se ocultar os botões */}
                   <span className="sm:hidden text-sm font-medium px-2 text-[var(--text-primary)]">
                     {currentPage} / {totalPages}
                   </span>
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--surface-nav)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CaretRight size={16} weight="bold" />
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
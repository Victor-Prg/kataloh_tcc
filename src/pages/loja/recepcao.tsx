import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Text, Badge, Button } from '../../components'

type StatusPedido = 'pendente' | 'preparacao' | 'rota' | 'entregue'

type Pedido = {
  id: string
  cliente: string
  endereco: string
  observacao?: string
  valor: number
  status: StatusPedido
  criadoEm: string
}

const pedidosMock: Pedido[] = [
  {
    id: 'PED-001',
    cliente: 'João Silva',
    endereco: 'Rua das Flores, 123 - Centro',
    observacao: 'Entregar na portaria',
    valor: 54.9,
    status: 'pendente',
    criadoEm: '16/12/2025 às 14:30',
  },
  {
    id: 'PED-002',
    cliente: 'Maria Santos',
    endereco: 'Av. Principal, 456 - Jardim',
    valor: 89.5,
    status: 'preparacao',
    criadoEm: '16/12/2025 às 15:15',
  },
  {
    id: 'PED-003',
    cliente: 'Pedro Costa',
    endereco: 'Rua do Comércio, 789 - Vila Nova',
    observacao: 'Entregar para Ana Souza',
    valor: 125,
    status: 'rota',
    criadoEm: '16/12/2025 às 15:45',
  },
]

const statusConfig: Record<
  StatusPedido,
  { titulo: string; badge: string; variant: 'neutro' | 'sucesso' | 'aviso' | 'perigo' }
> = {
  pendente: {
    titulo: 'Pendentes',
    badge: 'Pendente',
    variant: 'aviso',
  },
  preparacao: {
    titulo: 'Em preparação',
    badge: 'Preparando',
    variant: 'neutro',
  },
  rota: {
    titulo: 'Em rota de entrega',
    badge: 'Em rota',
    variant: 'sucesso',
  },
  entregue: {
    titulo: 'Entregues',
    badge: 'Entregue',
    variant: 'sucesso',
  },
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default function RecepcaoLoja() {
  const navigate = useNavigate()
  const [pedidos] = useState<Pedido[]>(pedidosMock)

  const pedidosPorStatus = useMemo(
    () => ({
      pendente: pedidos.filter(pedido => pedido.status === 'pendente'),
      preparacao: pedidos.filter(pedido => pedido.status === 'preparacao'),
      rota: pedidos.filter(pedido => pedido.status === 'rota'),
      entregue: pedidos.filter(pedido => pedido.status === 'entregue'),
    }),
    [pedidos],
  )

  const totalPendentes =
    pedidosPorStatus.pendente.length + pedidosPorStatus.preparacao.length
  const totalEmRota = pedidosPorStatus.rota.length
  const totalEntregues = pedidosPorStatus.entregue.length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Text as="h1" size="heading" style={{ fontWeight: 'bold' }}>
            Recepção de Pedidos
          </Text>
          <Text color="var(--text-secondary)">
            Acompanhe em tempo real os pedidos que chegam à loja.
          </Text>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            label="Novo pedido"
            onClick={() => navigate('/loja/novo-pedido')}
          />
          <Button variant="primary" label="Solicitar coleta" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card
          variant="outlined"
          padding="12px"
          className="flex h-full flex-col justify-between items-start text-left"
        >
          <div>
            <Text size="sm" color="var(--text-secondary)">
              Pedidos em fila
            </Text>
            <Text
              size="sm"
              color="var(--text-secondary)"
              style={{ marginTop: 2 }}
              className="hidden sm:block"
            >
              Aguardando preparo ou início da produção
            </Text>
          </div>
          <Text as="p" size="lg" style={{ fontWeight: 'bold' }}>
            {totalPendentes}
          </Text>
        </Card>

        <Card
          variant="outlined"
          padding="12px"
          className="flex h-full flex-col justify-between items-start text-left"
        >
          <div>
            <Text size="sm" color="var(--text-secondary)">
              Em rota de entrega
            </Text>
            <Text
              size="sm"
              color="var(--text-secondary)"
              style={{ marginTop: 2 }}
              className="hidden sm:block"
            >
              Pedidos já enviados para o cliente
            </Text>
          </div>
          <Text as="p" size="lg" style={{ fontWeight: 'bold' }}>
            {totalEmRota}
          </Text>
        </Card>

        <Card
          variant="outlined"
          padding="12px"
          className="flex h-full flex-col justify-between items-start text-left"
        >
          <div>
            <Text size="sm" color="var(--text-secondary)">
              Entregues hoje
            </Text>
            <Text
              size="sm"
              color="var(--text-secondary)"
              style={{ marginTop: 2 }}
              className="hidden sm:block"
            >
              Pedidos finalizados no dia
            </Text>
          </div>
          <Text as="p" size="lg" style={{ fontWeight: 'bold' }}>
            {totalEntregues}
          </Text>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {(Object.keys(statusConfig) as StatusPedido[]).map(status => {
          if (status === 'entregue') {
            return null
          }

          const lista =
            status === 'pendente'
              ? pedidosPorStatus.pendente
              : status === 'preparacao'
                ? pedidosPorStatus.preparacao
                : pedidosPorStatus.rota

          return (
            <Card key={status} variant="elevated" padding="20px">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[color:var(--success)]" />
                  <Text
                    as="h2"
                    size="lg"
                    style={{ fontWeight: 600, fontSize: 18 }}
                  >
                    {statusConfig[status].titulo}{' '}
                    {lista.length > 0 ? `(${lista.length})` : ''}
                  </Text>
                </div>
              </div>

              <div className="space-y-3">
                {lista.length === 0 && (
                  <Text size="sm" color="var(--text-secondary)">
                    Nenhum pedido neste estágio.
                  </Text>
                )}

                {lista.map(pedido => (
                  <div
                    key={pedido.id}
                    className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="space-y-1">
                        <Text
                          size="sm"
                          style={{ fontWeight: 'bold', fontSize: 14 }}
                        >
                          {pedido.cliente}
                        </Text>
                        <Text
                          size="sm"
                          color="var(--text-secondary)"
                          style={{ fontSize: 12 }}
                        >
                          {pedido.criadoEm}
                        </Text>
                      </div>
                      <Badge
                        label={statusConfig[status].badge}
                        variant={statusConfig[status].variant}
                      />
                    </div>

                    <div className="mt-2 space-y-1">
                      <Text
                        size="sm"
                        color="var(--text-secondary)"
                        style={{ fontSize: 12 }}
                      >
                        {pedido.endereco}
                      </Text>
                      {pedido.observacao && (
                        <Text
                          size="sm"
                          color="var(--text-secondary)"
                          style={{
                            fontSize: 12,
                            backgroundColor: 'var(--bg-hover)',
                            borderRadius: 6,
                            padding: '4px 8px',
                          }}
                        >
                          Obs: {pedido.observacao}
                        </Text>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <Text
                        size="sm"
                        style={{
                          fontWeight: 'bold',
                          color: '#16A34A',
                          fontSize: 14,
                        }}
                      >
                        {formatCurrency(pedido.valor)}
                      </Text>
                      {status === 'rota' && (
                        <Button
                          variant="outline"
                          label="Em rota"
                          size="sm"
                        />
                      )}
                      {status === 'pendente' && (
                        <Button
                          variant="danger"
                          label="Cancelar"
                          size="sm"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}


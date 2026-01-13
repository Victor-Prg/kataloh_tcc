export default function ProdutosCadastro() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Cadastro de Produtos</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Adicione e gerencie os produtos disponíveis na loja
          </p>
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8 text-center">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Em Desenvolvimento
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          A funcionalidade de cadastro de produtos está em construção.
        </p>
      </div>
    </div>
  )
}

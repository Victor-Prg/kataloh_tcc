/**
 * Converte uma string de valor em formato brasileiro (com vírgula) para número
 * @example toNumberFromComma('15,50') => 15.5
 */
export function toNumberFromComma(value: string): number {
  if (!value) return 0
  const normalized = value.replace(',', '.')
  const parsed = parseFloat(normalized)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Formata input de decimal com máscara de vírgula
 * Permite apenas números e vírgula, substitui ponto por vírgula
 * @example toDecimalCommaInput('15.50') => '15,50'
 */
export function toDecimalCommaInput(value: string): string {
  if (!value) return ''
  // Remove tudo que não é número ou vírgula
  let cleaned = value.replace(/[^\d,]/g, '')
  
  // Se não tiver vírgula ainda, e tiver apenas números, deixa como está
  // Se tiver mais de uma vírgula, remove as extras mantendo apenas a primeira
  const parts = cleaned.split(',')
  if (parts.length > 2) {
    cleaned = parts[0] + ',' + parts.slice(1).join('')
  }
  
  return cleaned
}

/**
 * Formata o valor para sempre ter 2 casas decimais com vírgula
 * @example toFixed2CommaMasked('15') => '15,00'
 * @example toFixed2CommaMasked('15,5') => '15,50'
 * @example toFixed2CommaMasked('') => ''
 */
export function toFixed2CommaMasked(value: string): string {
  if (!value) return ''
  
  const num = toNumberFromComma(value)
  if (num === 0 && value === '') return ''
  
  return num.toFixed(2).replace('.', ',')
}

/**
 * Formata um número para formato de moeda brasileira
 * @example formatCurrency(15.50) => 'R$ 15,50'
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

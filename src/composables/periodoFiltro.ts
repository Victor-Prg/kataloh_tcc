export type PeriodoFiltro = 'hoje' | 'semana' | 'mes'

export const filtrarPorPeriodo = <T>(
  items: T[],
  getDate: (item: T) => Date,
  periodo: PeriodoFiltro,
): T[] => {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  return items.filter(item => {
    const data = getDate(item)
    data.setHours(0, 0, 0, 0)

    if (periodo === 'hoje') {
      return data.getTime() === hoje.getTime()
    }

    if (periodo === 'semana') {
      const semanaAtras = new Date(hoje)
      semanaAtras.setDate(hoje.getDate() - 7)
      return data >= semanaAtras && data <= hoje
    }

    const mesAtras = new Date(hoje)
    mesAtras.setDate(hoje.getDate() - 30)
    return data >= mesAtras && data <= hoje
  })
}


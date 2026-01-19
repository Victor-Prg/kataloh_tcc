import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Camera, AlertCircle } from 'lucide-react'

const inputBase =
  'mt-1 block w-full rounded-md bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--text-primary)] ring-1 ring-[var(--border-color)] placeholder:text-[var(--text-soft)] focus:ring-2 focus:ring-[var(--primary-100)] focus:outline-none'

const errorText = 'mt-1 text-xs text-[var(--danger)]'

const onlyDigits = (value: string) => value.replace(/\D/g, '')

const formatCpf = (value: string) => {
  const digits = onlyDigits(value).slice(0, 14)

  if (digits.length <= 11) {
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return digits.replace(/(\d{3})(\d{0,3})/, '$1.$2')
    if (digits.length <= 9) return digits.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3')
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
  }

  if (digits.length <= 12) return digits.replace(/(\d{2})(\d{0,3})(\d{0,3})/, '$1.$2.$3')
  if (digits.length <= 14) {
    return digits.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/,
      '$1.$2.$3/$4-$5'
    )
  }

  return digits
}

const formatCnh = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11)
  return digits
}

const isValidCpf = (digits: string) => {
  if (digits.length !== 11) return false
  if (/^(\d)\1{10}$/.test(digits)) return false

  let sum = 0

  for (let i = 0; i < 9; i += 1) {
    sum += Number(digits[i]) * (10 - i)
  }

  let firstDigit = (sum * 10) % 11

  if (firstDigit === 10) firstDigit = 0
  if (firstDigit !== Number(digits[9])) return false

  sum = 0

  for (let i = 0; i < 10; i += 1) {
    sum += Number(digits[i]) * (11 - i)
  }

  let secondDigit = (sum * 10) % 11

  if (secondDigit === 10) secondDigit = 0
  return secondDigit === Number(digits[10])
}

const isValidCnpj = (digits: string) => {
  if (digits.length !== 14) return false
  if (/^(\d)\1{13}$/.test(digits)) return false

  const numbers = digits.split('').map((char) => Number(char))

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  let sum = 0

  for (let i = 0; i < 12; i += 1) {
    sum += numbers[i] * weights1[i]
  }

  let firstDigit = sum % 11
  firstDigit = firstDigit < 2 ? 0 : 11 - firstDigit

  if (firstDigit !== numbers[12]) return false

  sum = 0

  for (let i = 0; i < 13; i += 1) {
    sum += numbers[i] * weights2[i]
  }

  let secondDigit = sum % 11
  secondDigit = secondDigit < 2 ? 0 : 11 - secondDigit

  return secondDigit === numbers[13]
}

const isValidCnh = (digits: string) => {
  if (digits.length !== 11) return false
  if (/^(\d)\1{10}$/.test(digits)) return false

  const numbers = digits.split('').map((char) => Number(char))

  let sum = 0

  for (let i = 0, weight = 9; i < 9; i += 1, weight -= 1) {
    sum += numbers[i] * weight
  }

  let firstDigit = sum % 11
  let discount = 0

  if (firstDigit >= 10) {
    firstDigit = 0
    discount = 2
  }

  sum = 0

  for (let i = 0, weight = 1; i < 9; i += 1, weight += 1) {
    sum += numbers[i] * weight
  }

  let secondDigit = (sum % 11) - discount

  if (secondDigit < 0) secondDigit += 11
  if (secondDigit >= 10) secondDigit = 0

  return firstDigit === numbers[9] && secondDigit === numbers[10]
}

export default function EntregadoresCadastro() {
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [cpf, setCpf] = useState('')
  const [cnh, setCnh] = useState('')
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [nomeTouched, setNomeTouched] = useState(false)
  const [idadeTouched, setIdadeTouched] = useState(false)
  const [cpfCnpjTouched, setCpfCnpjTouched] = useState(false)
  const [cnhTouched, setCnhTouched] = useState(false)

  const idadeNumber = Number(idade)
  const cpfDigits = onlyDigits(cpf)
  const cnhDigits = onlyDigits(cnh)

  const cpfCnpjValido =
    (cpfDigits.length === 11 && isValidCpf(cpfDigits)) ||
    (cpfDigits.length === 14 && isValidCnpj(cpfDigits))

  const cnhValida = cnhDigits.length === 11 && isValidCnh(cnhDigits)

  const handleFotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      setFotoPreview(null)
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setFotoPreview(previewUrl)
  }

  const handleReset = () => {
    setNome('')
    setIdade('')
    setCpf('')
    setCnh('')
    setFotoPreview(null)
    setSuccessMessage('')
    setNomeTouched(false)
    setIdadeTouched(false)
    setCpfCnpjTouched(false)
    setCnhTouched(false)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setSuccessMessage('')

    setNomeTouched(true)
    setIdadeTouched(true)
    setCpfCnpjTouched(true)
    setCnhTouched(true)

    if (!nome.trim() || !idade.trim() || cpfDigits.length === 0 || cnhDigits.length === 0) {
      return
    }

    if (!Number.isFinite(idadeNumber) || idadeNumber < 18) {
      return
    }

    if (!cpfCnpjValido) {
      return
    }

    if (!cnhValida) {
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setSuccessMessage('Entregador cadastrado com sucesso (apenas interface).')
      setNome('')
      setIdade('')
      setCpf('')
      setCnh('')
      setFotoPreview(null)
    }, 500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[var(--text-primary)]">Cadastro de Entregadores</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Gerencie a equipe de entregadores da loja
          </p>
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 sm:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {successMessage && (
            <div className="rounded-lg border border-[var(--success)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--success)]">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--text-primary)]">
                Nome do entregador
              </label>
              <input
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                onBlur={() => setNomeTouched(true)}
                placeholder="Ex: João Silva"
                className={inputBase}
                required
              />
              {nomeTouched && nome.trim().length === 0 && (
                <p className={`${errorText} flex items-center gap-1`}>
                  <AlertCircle size={14} className="shrink-0" />
                  <span>Informe o nome do entregador.</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)]">
                Idade
              </label>
              <input
                type="number"
                min={18}
                value={idade}
                onChange={(event) => setIdade(event.target.value)}
                onBlur={() => setIdadeTouched(true)}
                placeholder="Ex: 25"
                className={inputBase}
                required
              />
              {idadeTouched && idade.trim().length === 0 && (
                <p className={`${errorText} flex items-center gap-1`}>
                  <AlertCircle size={14} className="shrink-0" />
                  <span>Informe a idade do entregador.</span>
                </p>
              )}
              {idadeTouched &&
                idade.trim().length > 0 &&
                (!Number.isFinite(idadeNumber) || idadeNumber < 18) && (
                  <p className={`${errorText} flex items-center gap-1`}>
                    <AlertCircle size={14} className="shrink-0" />
                    <span>O entregador deve ter pelo menos 18 anos.</span>
                  </p>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)]">
                CPF / CNPJ
              </label>
              <input
                type="text"
                value={cpf}
                onChange={(event) => setCpf(formatCpf(event.target.value))}
                onBlur={() => setCpfCnpjTouched(true)}
                placeholder="CPF ou CNPJ"
                maxLength={18}
                className={inputBase}
                required
              />
              {cpfCnpjTouched && cpfDigits.length === 0 && (
                <p className={`${errorText} flex items-center gap-1`}>
                  <AlertCircle size={14} className="shrink-0" />
                  <span>Informe o CPF ou CNPJ do entregador.</span>
                </p>
              )}
              {cpfCnpjTouched &&
                cpfDigits.length > 0 &&
                !cpfCnpjValido && (
                  <p className={`${errorText} flex items-center gap-1`}>
                    <AlertCircle size={14} className="shrink-0" />
                    <span>Informe um CPF ou CNPJ válido.</span>
                  </p>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)]">
                CNH
              </label>
              <input
                type="text"
                value={cnh}
                onChange={(event) => setCnh(formatCnh(event.target.value))}
                onBlur={() => setCnhTouched(true)}
                placeholder="Somente números"
                maxLength={11}
                className={inputBase}
                required
              />
              {cnhTouched && cnhDigits.length === 0 && (
                <p className={`${errorText} flex items-center gap-1`}>
                  <AlertCircle size={14} className="shrink-0" />
                  <span>Informe a CNH do entregador.</span>
                </p>
              )}
              {cnhTouched && cnhDigits.length > 0 && !cnhValida && (
                <p className={`${errorText} flex items-center gap-1`}>
                  <AlertCircle size={14} className="shrink-0" />
                  <span>Informe uma CNH válida com 11 dígitos.</span>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--text-primary)]">
              Foto do entregador (opcional)
            </label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] cursor-pointer">
                <Camera className="text-[var(--primary-100)]" size={18} />
                <span>Selecionar foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="hidden"
                />
              </label>
              {fotoPreview && (
                <div className="h-10 w-10 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface-nav)]">
                  <img
                    src={fotoPreview}
                    alt="Pré-visualização da foto do entregador"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-100)]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-lg bg-[var(--primary-100)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-90)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-100)] disabled:bg-[var(--primary-50)] disabled:text-[var(--text-soft)] disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar entregador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

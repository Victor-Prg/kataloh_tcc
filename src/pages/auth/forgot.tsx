import { useContext, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../composables/ThemeContext'
import SimplesLogo from '../../assets/simples.svg'

export default function ForgotPassword() {
    const { isDark, toggleTheme } = useContext(ThemeContext)
    const [step, setStep] = useState<'email' | 'otp'>('email')
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [otpError, setOtpError] = useState('')
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

    const lightBg =
        'radial-gradient(120% 90% at 30% 35%, #8CB800 0%, #A3D900 30%, #F4FBE5 65%, #F8FAFC 100%)'
    const darkBg =
        'radial-gradient(120% 90% at 70% 30%, #B8F000 0%, #A3D900 32%, #1D2025 65%, #0A0C0E 100%)'

    const handleEmailBlur = () => {
        if (email && !/.*@.*\.com.*/.test(email)) {
            setEmailError('campo invalido')
        } else {
            setEmailError('')
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value
        setEmail(next)
        if (emailError && /.*@.*\.com.*/.test(next)) setEmailError('')
    }

    const handleOtpChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return
        setOtpError('')
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        if (value && index < 5) otpInputRefs.current[index + 1]?.focus()
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus()
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (step === 'email') {
            if (!email || !/.*@.*\.com.*/.test(email)) {
                setEmailError('campo invalido')
                return
            }
            setStep('otp')
            return
        }

        if (otp.some((digit) => !digit)) {
            setOtpError('campo invalido')
            return
        }
    }

    return (
        <div className="relative flex min-h-full flex-col justify-center bg-[var(--bg)] text-[var(--text-primary)] py-12 sm:px-6 lg:px-8">
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: isDark ? darkBg : lightBg,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            <div className="relative z-10 w-full">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="flex items-center gap-2 rounded-md bg-[var(--surface-nav)] px-3 py-2 text-sm font-medium text-[var(--text-primary)] outline outline-1 outline-[color:var(--border)] hover:bg-[var(--surface)] focus-visible:outline-2 focus-visible:outline-[color:var(--primary-100)]"
                        >
                            <span>{isDark ? 'Dark' : 'Light'}</span>
                            <span className="inline-block h-2 w-2 rounded-full bg-[var(--primary-100)]" aria-hidden />
                        </button>
                    </div>
                </div>

                <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-[480px]">
                    <div className="bg-[var(--surface)] px-6 pt-6 pb-12 outline -outline-offset-1 outline-[color:var(--border)] sm:rounded-lg sm:px-12 shadow-md">
                        <form className="space-y-6" noValidate onSubmit={handleSubmit}>
                            <div>
                                <img alt="Simples" src={SimplesLogo} className="mx-auto h-[200px] w-auto" />
                                <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight text-[var(--text-primary)]">
                                    Recuperar senha
                                </h2>
                            </div>

                            {step === 'email' ? (
                                <div>
                                    <label htmlFor="email" className="block text-sm/6 font-medium text-[var(--text-primary)]">
                                        E-mail
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="E-mail"
                                            value={email}
                                            onChange={handleEmailChange}
                                            onBlur={handleEmailBlur}
                                            className={`block w-full rounded-md bg-[var(--surface-nav)] px-3 py-1.5 text-base text-[var(--text-primary)] outline-1 -outline-offset-1 outline-[color:var(--border)] placeholder-[color:var(--text-soft)] focus:outline-2 focus:-outline-offset-2 focus:outline-[color:var(--primary-100)] sm:text-sm/6 ${emailError ? 'outline-[var(--danger)]' : ''}`}
                                        />
                                        {emailError && <p className="mt-1 text-sm text-[var(--danger)]">{emailError}</p>}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-center text-sm/6 font-medium text-[var(--text-primary)]">
                                        Código
                                    </label>
                                    <div className="mt-2 flex justify-center gap-2">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => {
                                                    otpInputRefs.current[index] = el
                                                }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                className={`h-10 w-10 rounded-md bg-[var(--surface-nav)] text-center text-lg text-[var(--text-primary)] outline-1 -outline-offset-1 outline-[color:var(--border)] focus:outline-2 focus:-outline-offset-2 focus:outline-[color:var(--primary-100)] ${otpError ? 'outline-[var(--danger)]' : ''}`}
                                            />
                                        ))}
                                    </div>
                                    {otpError && <p className="mt-2 text-center text-sm text-[var(--danger)]">{otpError}</p>}
                                </div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-[var(--primary-100)] px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-[var(--primary-90)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary-90)]"
                                >
                                    {step === 'email' ? 'Receber código' : 'Verificar código'}
                                </button>
                            </div>

                            <div className="text-center text-sm text-[var(--text-soft)]">
                                {step === 'otp' ? (
                                    <button
                                        type="button"
                                        onClick={() => setStep('email')}
                                        className="font-semibold text-[var(--primary-100)] hover:text-[var(--primary-90)]"
                                    >
                                        Voltar e alterar e-mail
                                    </button>
                                ) : (
                                    <Link to="/" className="font-semibold text-[var(--primary-100)] hover:text-[var(--primary-90)]">
                                        Voltar para login
                                    </Link>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}


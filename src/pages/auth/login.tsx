import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../composables/ThemeContext'
import Logo from '../../assets/logo.svg'

export default function Example() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
    const { isDark, toggleTheme } = useContext(ThemeContext)
    // Gradientes estilo 2026 (Mesh/Ambient Light)
    const lightBg = `
        radial-gradient(at 0% 0%, rgba(163, 217, 0, 0.4) 0%, transparent 50%),
        radial-gradient(at 100% 0%, rgba(140, 184, 0, 0.25) 0%, transparent 40%),
        radial-gradient(at 100% 100%, rgba(163, 217, 0, 0.3) 0%, transparent 50%),
        radial-gradient(at 0% 100%, rgba(184, 240, 0, 0.15) 0%, transparent 40%),
        #F4FBE5
    `

    const darkBg = `
        radial-gradient(at 100% 0%, rgba(184, 240, 0, 0.12) 0px, transparent 40%),
        radial-gradient(at 0% 100%, rgba(163, 217, 0, 0.05) 0px, transparent 40%),
        #0A0C0E
    `

    return (
        <>
            {/*
              This example requires updating your template:

              ```
              <html class="h-full bg-gray-900">
              <body class="h-full">
              ```
            */}
            <div
                className="relative flex min-h-full flex-col justify-center text-[var(--text-primary)] py-12 sm:px-6 lg:px-8"
                style={{
                    background: isDark ? darkBg : lightBg,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'all 0.5s ease',
                    minHeight: '100vh',
                }}
            >
                <div className="absolute right-6 top-6 z-10">
                    <label
                        className="group relative inline-flex h-7 w-14 items-center rounded-full px-1 backdrop-blur-md outline-offset-2 transition-colors duration-200 ease-in-out"
                        style={{
                            background: isDark
                                ? 'linear-gradient(135deg, rgba(10, 12, 14, 0.88), rgba(255, 255, 255, 0.08))'
                                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.12))',
                            boxShadow: isDark
                                ? '0 8px 24px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(10, 12, 14, 0.25)'
                                : '0 8px 24px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(8px) saturate(115%)',
                            WebkitBackdropFilter: 'blur(8px) saturate(115%)',
                            border: isDark ? '1px solid rgba(10, 12, 14, 0.35)' : '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                    >
                        <input
                            type="checkbox"
                            aria-label="Alternar tema"
                            checked={isDark}
                            onChange={toggleTheme}
                            className="peer absolute inset-0 size-full cursor-pointer appearance-none focus:outline-none"
                        />
                        <span className="pointer-events-none inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text-primary)] shadow-xs ring-1 ring-[color:var(--border)] transition-transform duration-200 ease-in-out peer-checked:translate-x-6">
                            {isDark ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="text-[var(--surface)]">
                                    <path
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        d="M22 12c0 5.523-4.477 10-10 10a10 10 0 0 1-3.321-.564A9 9 0 0 1 8 18a8.97 8.97 0 0 1 2.138-5.824A6.5 6.5 0 0 0 15.5 15a6.5 6.5 0 0 0 5.567-3.143c.24-.396.933-.32.933.143"
                                        clipRule="evenodd"
                                        opacity="0.5"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M2 12c0 4.359 2.789 8.066 6.679 9.435A9 9 0 0 1 8 18c0-2.221.805-4.254 2.138-5.824A6.47 6.47 0 0 1 9 8.5a6.5 6.5 0 0 1 3.143-5.567C12.54 2.693 12.463 2 12 2C6.477 2 2 6.477 2 12"
                                    />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="text-amber-500">
                                    <path fill="currentColor" d="M18 12a6 6 0 1 1-12 0a6 6 0 0 1 12 0" />
                                    <path
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        d="M12 1.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0V2a.75.75 0 0 1 .75-.75M1.25 12a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5H2a.75.75 0 0 1-.75-.75m19 0a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75M12 20.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75"
                                        clipRule="evenodd"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M4.398 4.398a.75.75 0 0 1 1.061 0l.393.393a.75.75 0 0 1-1.06 1.06l-.394-.392a.75.75 0 0 1 0-1.06m15.202 0a.75.75 0 0 1 0 1.06l-.392.393a.75.75 0 0 1-1.06-1.06l.392-.393a.75.75 0 0 1 1.06 0m-1.453 13.748a.75.75 0 0 1 1.061 0l.393.393a.75.75 0 0 1-1.06 1.06l-.394-.392a.75.75 0 0 1 0-1.06m-12.295 0a.75.75 0 0 1 0 1.06l-.393.393a.75.75 0 1 1-1.06-1.06l.392-.393a.75.75 0 0 1 1.06 0"
                                        opacity="0.5"
                                    />
                                </svg>
                            )}
                        </span>
                    </label>
                </div>
                <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-[480px]">
                    <div className="bg-[var(--surface)] p-6 sm:p-10 outline -outline-offset-1 outline-[color:var(--border)] rounded-[12px] shadow-md">
                        <img alt="Your Company" src={Logo} className="mx-auto mb-4 h-auto w-[200px]" />
                        <h2 className="mb-8 text-center text-[28px] font-bold tracking-tight text-[var(--text-primary)]">Acesse a sua conta</h2>
                        <form
                            action="#"
                            method="POST"
                            noValidate
                            className="space-y-6"
                            onSubmit={(e) => {
                                e.preventDefault()
                                const nextErrors: { email?: string; password?: string } = {}
                                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
                                    nextErrors.email = 'Informe um email válido'
                                }
                                if (password.trim().length < 6) {
                                    nextErrors.password = 'A senha precisa ter pelo menos 6 caracteres'
                                }
                                setErrors(nextErrors)
                                if (Object.keys(nextErrors).length === 0) {
                                    navigate('/dashboard')
                                }
                            }}
                        >
                            <div>
                                <label htmlFor="email" className="block text-sm/6 font-medium text-[var(--text-primary)]">
                                    Email
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        placeholder="Digite seu email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                                        }}
                                        className="block w-full rounded-md bg-[var(--surface-nav)] px-3 py-1.5 text-base text-[var(--text-primary)] outline-1 -outline-offset-1 outline-[color:var(--border)] placeholder-[color:var(--text-soft)] focus:outline-2 focus:-outline-offset-2 focus:outline-[color:var(--primary-100)] sm:text-sm/6"
                                        aria-invalid={Boolean(errors.email)}
                                        style={errors.email ? { outlineColor: 'var(--danger)', borderColor: 'var(--danger)' } : undefined}
                                    />
                                    {errors.email ? (
                                        <p className="mt-2 text-sm text-[color:var(--danger)]">{errors.email}</p>
                                    ) : null}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm/6 font-medium text-[var(--text-primary)]">
                                    Senha
                                </label>
                                <div className="mt-2 space-y-2">
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            autoComplete="current-password"
                                            placeholder="Digite sua senha"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value)
                                                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                                            }}
                                            className="block w-full rounded-md bg-[var(--surface-nav)] px-3 py-1.5 pr-11 text-base text-[var(--text-primary)] outline-1 -outline-offset-1 outline-[color:var(--border)] placeholder-[color:var(--text-soft)] focus:outline-2 focus:-outline-offset-2 focus:outline-[color:var(--primary-100)] sm:text-sm/6"
                                            aria-invalid={Boolean(errors.password)}
                                        style={errors.password ? { outlineColor: 'var(--danger)', borderColor: 'var(--danger)' } : undefined}
                                        />
                                        <button
                                            type="button"
                                            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute inset-y-0 right-0 flex h-full items-center px-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary-100)]"
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M3 3l18 18" />
                                                    <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.59" />
                                                    <path d="M16.24 16.24A9.12 9.12 0 0 1 12 18c-5 0-9-4.5-9-6 0-.63 1.1-2.64 3.11-4.35" />
                                                    <path d="M8.56 8.56A9.51 9.51 0 0 1 12 6c5 0 9 4.5 9 6a5.74 5.74 0 0 1-.88 2.26" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password ? (
                                        <p className="text-sm text-[color:var(--danger)]">{errors.password}</p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex gap-3">
                                    <div className="flex h-6 shrink-0 items-center">
                                        <div className="group grid size-4 grid-cols-1">
                                            <input
                                                id="remember-me"
                                                name="remember-me"
                                                type="checkbox"
                                                className="col-start-1 row-start-1 appearance-none rounded-sm border border-[color:var(--border)] bg-[color:var(--surface-nav)] checked:border-[color:var(--primary-100)] checked:bg-[color:var(--primary-100)] indeterminate:border-[color:var(--primary-100)] indeterminate:bg-[color:var(--primary-100)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary-100)] disabled:border-[color:var(--border)] disabled:bg-[color:var(--surface)] disabled:checked:bg-[color:var(--surface)] forced-colors:appearance-auto"
                                            />
                                            <svg
                                                fill="none"
                                                viewBox="0 0 14 14"
                                                className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-white/25"
                                            >
                                                <path
                                                    d="M3 8L6 11L11 3.5"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="opacity-0 group-has-checked:opacity-100"
                                                />
                                                <path
                                                    d="M3 7H11"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="opacity-0 group-has-indeterminate:opacity-100"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <label htmlFor="remember-me" className="block text-sm/6 text-[var(--text-primary)]">
                                        Lembrar-me
                                    </label>
                                </div>

                                <div className="text-sm/6">
                                    <Link to="/forgot" className="font-semibold text-[var(--primary-100)] hover:text-[var(--primary-90)]">
                                        Esqueceu a senha?
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-[var(--primary-100)] px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-[var(--primary-90)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary-90)]"
                                >
                                    Entrar
                                </button>
                            </div>
                        </form>

                        <div>
                            <div className="mt-10 flex items-center gap-x-6">
                                <div className="w-full flex-1 border-t border-[color:var(--border)]" />
                                <p className="text-sm/6 font-medium text-nowrap text-[var(--text-primary)]">ou continue com</p>
                                <div className="w-full flex-1 border-t border-[color:var(--border)]" />
                            </div>

                            <div className="mt-6 flex justify-center">
                                <a
                                    href="#"
                                    className="inline-flex items-center justify-center gap-3 rounded-md bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] outline outline-1 outline-[color:var(--border)] hover:bg-[var(--secondary-50)] focus-visible:outline-2 focus-visible:outline-[color:var(--primary-100)]"
                                >
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                                        <path
                                            d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                                            fill="#EA4335"
                                        />
                                        <path
                                            d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                                            fill="#34A853"
                                        />
                                    </svg>
                                    <span className="text-sm/6 font-semibold">Google</span>
                                </a>

                        
                            </div>
                        </div>
                    </div>

                    <p className="mt-10 text-center text-md/6 text-[var(--text-soft)]">
                        Não tem uma conta?{' '}
                        <Link to="/register" className="font-semibold text-[var(--primary-100)] hover:text-[var(--primary-90)]">
                            Crie uma conta
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}


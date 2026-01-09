import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext, type PaletteName } from '../../composables/ThemeContext'
import Logo from '../../assets/logo.svg'

const palettes: PaletteName[] = [
    'NTX',
    'Brand',
    'Neutral',
    'SoftPurple',
    'Editorial',
    'DeepPurple',
    'Graphite',
    'Nude',
    'Clinic',
    'Fashion',
    'Kataloh',
]

export default function Example() {
    const { palette, setPalette, isDark, toggleTheme } = useContext(ThemeContext)
    const lightBg =
        'radial-gradient(120% 90% at 30% 35%, #8CB800 0%, #A3D900 30%, #F4FBE5 65%, #F8FAFC 100%)'
    const darkBg =
        'radial-gradient(120% 90% at 70% 30%, #B8F000 0%, #A3D900 32%, #1D2025 65%, #0A0C0E 100%)'

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
                className="flex min-h-full flex-col justify-center text-[var(--text-primary)] py-12 sm:px-6 lg:px-8"
                style={{
                    backgroundImage: isDark ? darkBg : lightBg,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-[var(--text-primary)]">Sign in to your account</h2>

                    {/* Seletor de paleta e modo */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-[var(--text-primary)]" htmlFor="palette">
                                Tema
                            </label>
                            <select
                                id="palette"
                                value={palette}
                                onChange={(e) => setPalette(e.target.value as PaletteName)}
                                className="rounded-md bg-[var(--surface-nav)] px-3 py-2 text-sm text-[var(--text-primary)] outline outline-1 outline-[color:var(--border)] placeholder-[color:var(--text-muted)] focus:outline-2 focus:outline-[color:var(--primary-100)]"
                            >
                                {palettes.map((name) => (
                                    <option key={name} value={name} className="text-black">
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </div>

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
                    <div className="bg-[var(--surface)] px-6 pt-6 pb-8 outline -outline-offset-1 outline-[color:var(--border)] sm:rounded-lg sm:px-12 shadow-md">
                        <img alt="Your Company" src={Logo} className="mx-auto mb-4 h-auto w-[200px]" />
                        <form action="#" method="POST" className="space-y-6">
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
                                        className="block w-full rounded-md bg-[var(--surface-nav)] px-3 py-1.5 text-base text-[var(--text-primary)] outline-1 -outline-offset-1 outline-[color:var(--border)] placeholder-[color:var(--text-soft)] focus:outline-2 focus:-outline-offset-2 focus:outline-[color:var(--primary-100)] sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm/6 font-medium text-[var(--text-primary)]">
                                    Senha
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        className="block w-full rounded-md bg-[var(--surface-nav)] px-3 py-1.5 text-base text-[var(--text-primary)] outline-1 -outline-offset-1 outline-[color:var(--border)] placeholder-[color:var(--text-soft)] focus:outline-2 focus:-outline-offset-2 focus:outline-[color:var(--primary-100)] sm:text-sm/6"
                                    />
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
                                <p className="text-sm/6 font-medium text-nowrap text-[var(--text-muted)]">Or continue with</p>
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
                        <Link
                            to="/register"
                            className="font-semibold text-[var(--primary-100)] hover:text-[var(--primary-90)]"
                        >
                            Crie uma conta
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}


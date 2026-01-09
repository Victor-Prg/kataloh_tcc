import { Menu, MenuButton, MenuItem, MenuItems, Popover } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { BellIcon, Bars3Icon, SunIcon, MoonIcon } from '@heroicons/react/24/outline' 
import logo from '../assets/logo.svg'
// Se o arquivo navbar.css não existir, comente a linha abaixo para evitar erros
// import '../assets/navbar.css' 
import { useTheme } from '../composables/useTheme'

const user = {
  name: 'usuário',
  email: 'usuario@example.com',
  imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
}

const userNavigation = [
  { name: 'Seu perfil', href: '#' },
  { name: 'Configurações', href: '#' },
  { name: 'Sair', href: '#' },
]

type NavbarProps = {
  onOpenMobileMenu?: () => void
}

export default function Navbar({ onOpenMobileMenu }: NavbarProps) {
  // --- CORREÇÃO PRINCIPAL AQUI ---
  // Em vez de criar um useState novo, usamos o que vem do Contexto.
  // O ThemeProvider já cuida de atualizar o HTML e salvar no localStorage.
  const { isDark, toggleTheme } = useTheme() 

  return (
    <Popover as="header" className="w-full bg-[color:var(--surface-nav)] border-b border-[color:var(--border)] transition-colors duration-300">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* --- GRUPO 1: ESQUERDA (HAMBÚRGUER + LOGO) --- */}
        <div className="flex flex-1 justify-start items-center gap-x-4">
          
          {/* BOTÃO HAMBÚRGUER */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-[color:var(--text-primary)] md:hidden"
            onClick={onOpenMobileMenu}
          >
            <span className="sr-only">Abrir menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* LOGO */}
          <div className="flex shrink-0 items-center">
            <a href="#">
              <img
                alt="Kataloh"
                src={logo}
                className="h-26 w-auto" // Ajustei altura para ficar proporcional
              />
            </a>
          </div>
        </div>

        {/* --- GRUPO 2: CENTRO (BARRA DE PESQUISA) --- */}
        <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-center">
          <div className="w-full max-w-lg lg:max-w-xs hidden sm:block">
            <div className="relative text-[color:var(--text-soft)] focus-within:text-[color:var(--text-primary)]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon aria-hidden="true" className="h-5 w-5" />
              </div>
              <input
                name="search"
                type="text"
                placeholder="Pesquisar..."
                className="block w-full rounded-md border-0 bg-[color:var(--bg-input)] py-1.5 pl-10 pr-3 text-[color:var(--text-primary)] ring-1 ring-inset ring-[color:var(--border)] placeholder:text-[color:var(--text-soft)] focus:ring-2 focus:ring-inset focus:ring-[color:var(--primary-100)] sm:text-sm sm:leading-6 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* --- GRUPO 3: DIREITA (PERFIL E AÇÕES) --- */}
        <div className="flex flex-1 items-center justify-end gap-4">
          
          {/* BOTÃO TEMA (Com Ícones) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full p-2 text-[color:var(--text-muted)] hover:bg-[color:var(--bg-hover)] hover:text-[color:var(--text-primary)] transition-colors"
            title={isDark ? 'Mudar para Claro' : 'Mudar para Escuro'}
          >
            {isDark ? (
              <SunIcon className="h-6 w-6" /> // Ícone de Sol no modo escuro
            ) : (
              <MoonIcon className="h-6 w-6" /> // Ícone de Lua no modo claro
            )}
          </button>

          <button type="button" className="relative p-1 text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]">
            <span className="sr-only">Notificações</span>
            <BellIcon aria-hidden="true" className="h-6 w-6" />
          </button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-[color:var(--border)]" aria-hidden="true" />

          {/* MENU USUÁRIO */}
          <Menu as="div" className="relative">
            <MenuButton className="-m-1.5 flex items-center p-1.5 rounded-full hover:bg-[color:var(--bg-hover)] transition-colors">
              <span className="sr-only">Abrir menu usuário</span>
              <img
                alt=""
                src={user.imageUrl}
                className="h-8 w-8 rounded-full bg-gray-50 object-cover ring-2 ring-[color:var(--border)]"
              />
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-[color:var(--text-primary)]" aria-hidden="true">
                  {user.name}
                </span>
              </span>
            </MenuButton>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-[color:var(--surface)] py-2 shadow-lg ring-1 ring-[color:var(--border)] focus:outline-none"
            >
              {userNavigation.map((item) => (
                <MenuItem key={item.name}>
                  <a href={item.href} className="block px-3 py-1 text-sm leading-6 text-[color:var(--text-primary)] data-[focus]:bg-[color:var(--bg-hover)]">
                    {item.name}
                  </a>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>
      </div>
    </Popover>
  )
}
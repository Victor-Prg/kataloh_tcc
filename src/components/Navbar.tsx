import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, MenuButton, MenuItem, MenuItems, Popover } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { BellIcon, Bars3Icon, SunIcon, MoonIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Modal } from './Modal'
import { useTheme } from '../composables/useTheme'

const user = {
  name: 'usuário',
  email: 'usuario@example.com',
  imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  birthDate: '01/01/1990',
  address: 'Rua Exemplo, 123 - Centro, São Paulo - SP',
  phone: '(11) 99999-9999',
}

const userNavigation = [
  { name: 'Seu perfil', href: '#' },
  { name: 'Configurações', href: '#' },
  { name: 'Sair', href: '#' },
]

type NavbarProps = {
  onOpenMobileMenu?: () => void
  onToggleSidebar?: () => void
  isSidebarCollapsed?: boolean
}

export default function Navbar({ onOpenMobileMenu, onToggleSidebar, isSidebarCollapsed }: NavbarProps) {
  const { isDark, toggleTheme } = useTheme()
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const navigate = useNavigate()

  const handleUserMenuClick = (itemName: string) => {
    if (itemName === 'Seu perfil') {
      setIsProfileOpen(true)
    }
    if (itemName === 'Sair') {
      navigate('/')
    }
  }

  return (
    <>
      <Popover as="header" className="w-full bg-[color:var(--surface-nav)] border-b border-[color:var(--border)] transition-colors duration-300">
        <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex flex-1 justify-start items-center gap-x-4">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-[color:var(--text-primary)] md:hidden"
              onClick={onOpenMobileMenu}
            >
              <span className="sr-only">Abrir menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onToggleSidebar?.()
                }}
                className="hidden md:inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-primary)] hover:bg-[color:var(--primary-50)] transition-all h-8 w-8 text-xs"
              >
                {isSidebarCollapsed ? (
                  <ChevronRightIcon className="h-4 w-4" />
                ) : (
                  <ChevronLeftIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

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

          <div className="flex flex-1 items-center justify-end gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full p-2 text-[color:var(--text-muted)] hover:bg-[color:var(--bg-hover)] hover:text-[color:var(--text-primary)] transition-colors"
              title={isDark ? 'Mudar para Claro' : 'Mudar para Escuro'}
            >
              {isDark ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-1 text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]"
            >
              <span className="sr-only">Notificações</span>
              <BellIcon aria-hidden="true" className="h-6 w-6" />
            </button>

            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-[color:var(--border)]" aria-hidden="true" />

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
                    <button
                      type="button"
                      onClick={() => handleUserMenuClick(item.name)}
                      className="block w-full px-3 py-1 text-left text-sm leading-6 text-[color:var(--text-primary)] data-[focus]:bg-[color:var(--bg-hover)]"
                    >
                      {item.name}
                    </button>
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>
        </div>
      </Popover>

      <Modal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        title="Notificações"
      >
        <div className="space-y-3">
          <p className="text-sm text-[color:var(--text-secondary)]">
            Você não tem novas notificações no momento.
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        title="Seu perfil"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              alt=""
              src={user.imageUrl}
              className="h-16 w-16 rounded-full bg-gray-50 object-cover ring-2 ring-[color:var(--border)]"
            />
            <div>
              <p className="text-base font-semibold text-[color:var(--text-primary)]">
                {user.name}
              </p>
              <p className="text-sm text-[color:var(--text-secondary)]">
                {user.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-[color:var(--text-secondary)]">Data de nascimento</p>
              <p className="text-sm font-medium text-[color:var(--text-primary)]">{user.birthDate}</p>
            </div>
            <div>
              <p className="text-xs text-[color:var(--text-secondary)]">Telefone</p>
              <p className="text-sm font-medium text-[color:var(--text-primary)]">{user.phone}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-[color:var(--text-secondary)]">Endereço</p>
              <p className="text-sm font-medium text-[color:var(--text-primary)]">{user.address}</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

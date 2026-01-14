import { Fragment, useState } from 'react'
import { Dialog, DialogPanel, Menu, MenuButton, MenuItem, MenuItems, Popover, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { BellIcon, Bars3Icon, SunIcon, MoonIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline' 
import logo from '../assets/logo.svg'
import { useTheme } from '../composables/useTheme'
import { useNavigate } from 'react-router-dom'

type UserMenuItemId = 'profile' | 'settings' | 'logout'

type UserNavigationItem = {
  id: UserMenuItemId
  name: string
}

const user = {
  name: 'Usuário Demo',
  email: 'usuario@example.com',
  imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  phone: '(11) 99999-9999',
  birthDate: '1990-05-15',
  address: 'Rua Exemplo, 123 – Centro, São Paulo/SP',
}

const userNavigation: UserNavigationItem[] = [
  { id: 'profile', name: 'Seu perfil' },
  { id: 'settings', name: 'Configurações' },
  { id: 'logout', name: 'Sair' },
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

  const handleUserMenuAction = (id: UserMenuItemId) => {
    if (id === 'profile') {
      setIsProfileOpen(true)
      return
    }

    if (id === 'logout') {
      navigate('/')
      return
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

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={event => {
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
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex items-center"
              >
                <img
                  alt="Kataloh"
                  src={logo}
                  className="h-26 w-auto"
                />
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
              className="relative p-1 text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]"
              onClick={() => setIsNotificationsOpen(true)}
            >
              <span className="sr-only">Notificações</span>
              <BellIcon aria-hidden="true" className="h-6 w-6" />
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-2 w-2 rounded-full bg-[color:var(--primary-100)]" />
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
                className="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md bg-[color:var(--surface)] py-2 shadow-lg ring-1 ring-[color:var(--border)] focus:outline-none"
              >
                {userNavigation.map(item => (
                  <MenuItem key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleUserMenuAction(item.id)}
                      className="block w-full text-left px-3 py-1 text-sm leading-6 text-[color:var(--text-primary)] data-[focus]:bg-[color:var(--bg-hover)]"
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

      <Transition show={isNotificationsOpen} as={Fragment}>
        <Dialog className="relative z-40" onClose={setIsNotificationsOpen}>
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="w-full max-w-md rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border)] shadow-xl">
              <div className="flex items-center justify-between border-b border-[color:var(--border)] px-4 py-3">
                <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">
                  Notificações
                </h2>
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-xs text-[color:var(--text-soft)] hover:text-[color:var(--text-primary)]"
                >
                  Fechar
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto px-4 py-3 space-y-3 text-sm">
                <div className="rounded-lg bg-[color:var(--surface-nav)] border border-[color:var(--border)] px-3 py-2">
                  <p className="font-medium text-[color:var(--text-primary)]">
                    Novo pedido recebido
                  </p>
                  <p className="text-xs text-[color:var(--text-soft)]">
                    Um novo pedido foi criado na sua loja há poucos minutos.
                  </p>
                </div>
                <div className="rounded-lg bg-[color:var(--surface-nav)] border border-[color:var(--border)] px-3 py-2">
                  <p className="font-medium text-[color:var(--text-primary)]">
                    Repasse disponível
                  </p>
                  <p className="text-xs text-[color:var(--text-soft)]">
                    Há repasses pendentes de conferência no módulo financeiro.
                  </p>
                </div>
                <div className="rounded-lg bg-[color:var(--surface-nav)] border border-[color:var(--border)] px-3 py-2">
                  <p className="font-medium text-[color:var(--text-primary)]">
                    Atualização de sistema
                  </p>
                  <p className="text-xs text-[color:var(--text-soft)]">
                    Novos recursos foram adicionados ao dashboard da loja.
                  </p>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </Transition>

      <Transition show={isProfileOpen} as={Fragment}>
        <Dialog className="relative z-40" onClose={setIsProfileOpen}>
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="w-full max-w-md rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border)] shadow-xl">
              <div className="flex items-center justify-between border-b border-[color:var(--border)] px-4 py-3">
                <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">
                  Dados do usuário
                </h2>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="text-xs text-[color:var(--text-soft)] hover:text-[color:var(--text-primary)]"
                >
                  Fechar
                </button>
              </div>
              <div className="px-4 py-4 space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={user.imageUrl}
                    alt={user.name}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-[color:var(--border)]"
                  />
                  <div>
                    <p className="text-base font-semibold text-[color:var(--text-primary)]">
                      {user.name}
                    </p>
                    <p className="text-xs text-[color:var(--text-soft)]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex flex-col text-xs">
                    <span className="text-[color:var(--text-soft)]">
                      Data de nascimento
                    </span>
                    <span className="text-[color:var(--text-primary)]">
                      {user.birthDate}
                    </span>
                  </div>
                  <div className="flex flex-col text-xs">
                    <span className="text-[color:var(--text-soft)]">
                      Endereço
                    </span>
                    <span className="text-[color:var(--text-primary)]">
                      {user.address}
                    </span>
                  </div>
                  <div className="flex flex-col text-xs">
                    <span className="text-[color:var(--text-soft)]">
                      Telefone
                    </span>
                    <span className="text-[color:var(--text-primary)]">
                      {user.phone}
                    </span>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

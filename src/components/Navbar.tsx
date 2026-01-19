import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, MenuButton, MenuItem, MenuItems, Popover } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { BellIcon, Bars3Icon, SunIcon, MoonIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Modal } from './Modal'
import { useTheme } from '../composables/useTheme'
import { Button } from './Button'
import { Input } from './Input'

type UserProfile = {
  name: string
  email: string
  imageUrl: string
  birthDate: string
  address: string
  phone: string
  addressLabel?: string
  addressStreet?: string
  addressNumber?: string
  addressDistrict?: string
  addressComplement?: string
}

type ProfileErrors = {
  email?: string
  birthDate?: string
  phone?: string
  addressStreet?: string
  addressNumber?: string
}

const STORAGE_KEY = 'kataloh:userProfile'

const initialUser: UserProfile = {
  name: 'usuário',
  email: 'usuario@example.com',
  imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  birthDate: '01/01/1990',
  address: 'Rua Exemplo, 123 - Centro, São Paulo - SP',
  phone: '(11) 99999-9999',
  addressLabel: 'Casa',
  addressStreet: 'Rua Exemplo',
  addressNumber: '123',
  addressDistrict: 'Centro',
  addressComplement: 'São Paulo - SP',
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
  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window === 'undefined') {
      return initialUser
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        return initialUser
      }
      const parsed = JSON.parse(raw) as Partial<UserProfile>
      return { ...initialUser, ...parsed }
    } catch {
      return initialUser
    }
  })
  const [editableUser, setEditableUser] = useState<UserProfile>(initialUser)
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({})
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const navigate = useNavigate()

  const formatBirthDate = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8)
    if (digits.length <= 2) {
      return digits
    }
    if (digits.length <= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`
    }
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
  }

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length === 0) {
      return ''
    }
    if (digits.length <= 2) {
      return `(${digits}`
    }
    if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  const validateProfile = () => {
    const nextErrors: ProfileErrors = {}
    const email = editableUser.email.trim()
    if (!email.includes('@') || !email.includes('.')) {
      nextErrors.email = 'Informe um e-mail válido'
    }
    const birthDigits = editableUser.birthDate.replace(/\D/g, '')
    if (birthDigits.length !== 8) {
      nextErrors.birthDate = 'Informe a data no formato DD/MM/AAAA'
    }
    const phoneDigits = editableUser.phone.replace(/\D/g, '')
    if (phoneDigits.length < 10) {
      nextErrors.phone = 'Informe um telefone válido'
    }
    if (!editableUser.addressStreet || editableUser.addressStreet.trim() === '') {
      nextErrors.addressStreet = 'Informe a rua'
    }
    if (!editableUser.addressNumber || editableUser.addressNumber.trim() === '') {
      nextErrors.addressNumber = 'Informe o número'
    }
    setProfileErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleOpenProfile = () => {
    setEditableUser(user)
    setProfileErrors({})
    setIsEditingProfile(false)
    setIsProfileOpen(true)
  }

  const handleCloseProfile = () => {
    setIsProfileOpen(false)
    setIsEditingProfile(false)
    setEditableUser(user)
    setProfileErrors({})
  }

  const handleUserMenuClick = (itemName: string) => {
    if (itemName === 'Seu perfil') {
      handleOpenProfile()
    }
    if (itemName === 'Sair') {
      navigate('/')
    }
  }

  const handleStartEditProfile = () => {
    setEditableUser(user)
    setProfileErrors({})
    setIsEditingProfile(true)
  }

  const handleCancelEditProfile = () => {
    setEditableUser(user)
    setProfileErrors({})
    setIsEditingProfile(false)
  }

  const handleSaveProfile = () => {
    if (!validateProfile()) {
      return
    }
    const addressParts: string[] = []
    if (editableUser.addressStreet || editableUser.addressNumber) {
      if (editableUser.addressStreet && editableUser.addressNumber) {
        addressParts.push(`${editableUser.addressStreet}, ${editableUser.addressNumber}`)
      } else if (editableUser.addressStreet) {
        addressParts.push(editableUser.addressStreet)
      } else if (editableUser.addressNumber) {
        addressParts.push(editableUser.addressNumber)
      }
    }
    if (editableUser.addressDistrict) {
      addressParts.push(editableUser.addressDistrict)
    }
    if (editableUser.addressComplement) {
      addressParts.push(editableUser.addressComplement)
    }
    const formattedAddress = addressParts.join(' - ')
    const nextProfile: UserProfile = {
      ...editableUser,
      address: formattedAddress || editableUser.address || user.address,
    }
    setUser(nextProfile)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile))
    }
    setIsEditingProfile(false)
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
                className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-[12px] bg-[color:var(--surface)] py-2 shadow-lg ring-1 ring-[color:var(--border)] focus:outline-none"
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
        onClose={handleCloseProfile}
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

          {isEditingProfile ? (
            <form
              className="flex flex-col gap-3"
              onSubmit={(event) => {
                event.preventDefault()
                handleSaveProfile()
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Nome"
                  maxLength={40}
                  placeholder="Ex: João Silva"
                  value={editableUser.name}
                  onChange={(event) =>
                    setEditableUser((previous) => ({ ...previous, name: event.target.value }))
                  }
                />
                <Input
                  label="Data de nascimento"
                  placeholder="Ex: 01/01/1990"
                  value={editableUser.birthDate}
                  onChange={(event) =>
                    setEditableUser((previous) => ({
                      ...previous,
                      birthDate: formatBirthDate(event.target.value),
                    }))
                  }
                  error={profileErrors.birthDate}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="E-mail"
                  type="email"
                  maxLength={20}
                  placeholder="Ex: usuario@exemplo.com"
                  value={editableUser.email}
                  onChange={(event) =>
                    setEditableUser((previous) => ({ ...previous, email: event.target.value }))
                  }
                  error={profileErrors.email}
                />
                <Input
                  label="Telefone"
                  placeholder="Ex: (11) 99999-9999"
                  value={editableUser.phone}
                  onChange={(event) =>
                    setEditableUser((previous) => ({
                      ...previous,
                      phone: formatPhone(event.target.value),
                    }))
                  }
                  error={profileErrors.phone}
                />
              </div>
              <Input
                label="Rótulo"
                maxLength={20}
                placeholder="Ex: Casa"
                value={editableUser.addressLabel ?? ''}
                onChange={(event) =>
                  setEditableUser((previous) => ({
                    ...previous,
                    addressLabel: event.target.value,
                  }))
                }
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Rua"
                  maxLength={50}
                  placeholder="Ex: Rua Exemplo"
                  value={editableUser.addressStreet ?? ''}
                  onChange={(event) =>
                    setEditableUser((previous) => ({
                      ...previous,
                      addressStreet: event.target.value,
                    }))
                  }
                  error={profileErrors.addressStreet}
                />
                <Input
                  label="Número"
                  value={editableUser.addressNumber ?? ''}
                  placeholder="Ex: 123 ou S/N"
                  onChange={(event) => {
                    let value = event.target.value
                    if (value.length > 4) {
                      value = value.slice(0, 4)
                    }
                    const normalized = value.toLowerCase()
                    const isDigits = /^[0-9]*$/.test(value)
                    const isPrefixSn = 's/n'.startsWith(normalized)
                    if (isDigits || isPrefixSn) {
                      setEditableUser((previous) => ({
                        ...previous,
                        addressNumber: value,
                      }))
                    }
                  }}
                  error={profileErrors.addressNumber}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Bairro"
                  maxLength={40}
                  placeholder="Ex: Centro"
                  value={editableUser.addressDistrict ?? ''}
                  onChange={(event) =>
                    setEditableUser((previous) => ({
                      ...previous,
                      addressDistrict: event.target.value,
                    }))
                  }
                />
                <Input
                  label="Complemento"
                  maxLength={40}
                  placeholder="Ex: Apto 101, Bloco B"
                  value={editableUser.addressComplement ?? ''}
                  onChange={(event) =>
                    setEditableUser((previous) => ({
                      ...previous,
                      addressComplement: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  label="Cancelar"
                  onClick={handleCancelEditProfile}
                />
                <Button type="submit" variant="primary" size="sm" label="Salvar" />
              </div>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[color:var(--text-secondary)]">Data de nascimento</p>
                  <p className="text-sm font-medium text-[color:var(--text-primary)]">
                    {user.birthDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[color:var(--text-secondary)]">Telefone</p>
                  <p className="text-sm font-medium text-[color:var(--text-primary)]">
                    {user.phone}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-[color:var(--text-secondary)]">Endereço</p>
                  <p className="text-sm font-medium text-[color:var(--text-primary)]">
                    {user.address}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  label="Editar informações"
                  onClick={handleStartEditProfile}
                />
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  )
}

import { useState, useEffect } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild, Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline'
import { useTheme } from '../composables/useTheme'
import type { PaletteName } from '../composables/ThemeContext'

const navigation = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
  { name: 'Team', href: '#', icon: UsersIcon, current: false },
  { name: 'Projects', href: '#', icon: FolderIcon, current: false },
  { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
  { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
  { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
]

const topNav = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
]
const teams = [
  { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
  { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
  { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
]



export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isDark, toggleTheme, palette, setPalette } = useTheme()
//'NTX' | 'Brand' | 'Neutral' | 'SoftPurple' | 'Editorial' | 'DeepPurple' | 'Graphite' | 'Nude' | 'Clinic' | 'Fashion' 
  // Define a paleta específica desta página ao montar
  useEffect(() => {
    setPalette('NTX') // Mude para 'Brand', 'Neutral', etc conforme necessário
  }, [])

  const palettes: PaletteName[] = ['NTX', 'Brand', 'Neutral', 'SoftPurple', 'Editorial', 'DeepPurple', 'Graphite', 'Nude', 'Clinic', 'Fashion']

  const classNames = (...classes: (string | boolean | null | undefined)[]) => classes.filter(Boolean).join(' ')

  return (
    <>
      <div style={{ background: 'var(--bg)', color: 'var(--text-primary)', minHeight: '100vh' }}>
        {/* Top navbar (Headless UI) */}
        <Disclosure
          as="nav"
          className="relative after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px"
          style={{
            background: 'color-mix(in srgb, var(--surface-nav) 95%, transparent)',
          }}
        >
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 focus:outline-2 focus:-outline-offset-1 focus:outline-[var(--primary-100)]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex shrink-0 items-center">
                  <img
                    alt="Your Company"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                    className="h-8 w-auto"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {topNav.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        aria-current={item.current ? 'page' : undefined}
                        className={classNames(
                          item.current
                            ? 'rounded-md px-3 py-2 text-sm font-medium'
                            : 'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        style={{
                          background: item.current
                            ? 'color-mix(in srgb, var(--surface) 20%, transparent)'
                            : 'transparent',
                          color: item.current ? 'var(--text-primary)' : 'var(--text-muted)',
                        }}
                        onMouseEnter={(e) => {
                          if (!item.current) {
                            e.currentTarget.style.background = 'color-mix(in srgb, var(--surface) 10%, transparent)'
                            e.currentTarget.style.color = 'var(--text-primary)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!item.current) {
                            e.currentTarget.style.background = 'transparent'
                            e.currentTarget.style.color = 'var(--text-muted)'
                          }
                        }}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="relative rounded-full p-1 focus:outline-2 focus:outline-offset-2"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="size-6" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ outlineColor: 'var(--primary-100)' }}
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="size-8 rounded-full"
                      style={{ background: 'var(--surface)', outlineColor: 'var(--border)' }}
                    />
                  </MenuButton>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 outline -outline-offset-1 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    style={{
                      background: 'var(--surface)',
                      outlineColor: 'var(--border)',
                    }}
                  >
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Your profile
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Settings
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Sign out
                      </a>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {topNav.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  className="block rounded-md px-3 py-2 text-base font-medium"
                  style={{
                    background: item.current ? 'color-mix(in srgb, var(--surface) 20%, transparent)' : 'transparent',
                    color: item.current ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </Disclosure>

        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 transition-opacity duration-300 ease-linear data-closed:opacity-0"
            style={{ background: 'color-mix(in srgb, var(--surface-nav) 80%, transparent)' }}
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                  <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" className="size-6" style={{ color: 'var(--text-primary)' }} />
                  </button>
                </div>
              </TransitionChild>

              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div 
                className="relative flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-2 ring before:pointer-events-none before:absolute before:inset-0"
                style={{ 
                  background: 'var(--surface-nav)',
                  '--tw-ring-color': 'var(--border)',
                  '--tw-ring-opacity': '1'
                } as any}
              >
                <div className="relative flex h-16 shrink-0 items-center">
                  <img
                    alt="Your Company"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                    className="h-8 w-auto"
                  />
                </div>
                <nav className="relative flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                              style={{
                                background: item.current ? 'color-mix(in srgb, var(--primary-100) 15%, transparent)' : 'transparent',
                                color: item.current ? 'var(--text-primary)' : 'var(--text-muted)',
                              }}
                              onMouseEnter={(e) => {
                                if (!item.current) {
                                  e.currentTarget.style.background = 'color-mix(in srgb, var(--surface) 10%, transparent)'
                                  e.currentTarget.style.color = 'var(--text-primary)'
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!item.current) {
                                  e.currentTarget.style.background = 'transparent'
                                  e.currentTarget.style.color = 'var(--text-muted)'
                                }
                              }}
                            >
                              <item.icon
                                aria-hidden="true"
                                className="size-6 shrink-0"
                                style={{ color: 'inherit' }}
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <div className="text-xs/6 font-semibold" style={{ color: 'var(--text-muted)' }}>Your teams</div>
                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {teams.map((team) => (
                          <li key={team.name}>
                            <a
                              href={team.href}
                              className="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                              style={{
                                background: team.current ? 'color-mix(in srgb, var(--primary-100) 15%, transparent)' : 'transparent',
                                color: team.current ? 'var(--text-primary)' : 'var(--text-muted)',
                              }}
                              onMouseEnter={(e) => {
                                if (!team.current) {
                                  e.currentTarget.style.background = 'color-mix(in srgb, var(--surface) 10%, transparent)'
                                  e.currentTarget.style.color = 'var(--text-primary)'
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!team.current) {
                                  e.currentTarget.style.background = 'transparent'
                                  e.currentTarget.style.color = 'var(--text-muted)'
                                }
                              }}
                            >
                              <span
                                className="flex size-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium"
                                style={{
                                  borderColor: 'var(--border)',
                                  background: 'color-mix(in srgb, var(--surface-nav) 30%, transparent)',
                                  color: 'inherit'
                                }}
                              >
                                {team.initial}
                              </span>
                              <span className="truncate">{team.name}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div 
          className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col"
          style={{ background: 'var(--surface-nav)' }}
        >
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div 
            className="flex grow flex-col gap-y-5 overflow-y-auto border-r px-6"
            style={{ 
              borderColor: 'var(--border)',
              background: 'color-mix(in srgb, var(--surface-nav) 95%, var(--bg))'
            }}
          >
            <div className="flex h-16 shrink-0 items-center justify-between">
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md"
                style={{ 
                  color: 'var(--text-muted)',
                  background: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'color-mix(in srgb, var(--surface) 10%, transparent)'
                  e.currentTarget.style.color = 'var(--text-primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--text-muted)'
                }}
              >
                {isDark ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
              </button>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                              style={{
                                background: item.current ? 'color-mix(in srgb, var(--primary-100) 15%, transparent)' : 'transparent',
                                color: item.current ? 'var(--text-primary)' : 'var(--text-muted)',
                              }}
                              onMouseEnter={(e) => {
                                if (!item.current) {
                                  e.currentTarget.style.background = 'color-mix(in srgb, var(--surface) 10%, transparent)'
                                  e.currentTarget.style.color = 'var(--text-primary)'
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!item.current) {
                                  e.currentTarget.style.background = 'transparent'
                                  e.currentTarget.style.color = 'var(--text-muted)'
                                }
                              }}
                            >
                              <item.icon
                                aria-hidden="true"
                                className="size-6 shrink-0"
                                style={{ color: 'inherit' }}
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <div className="text-xs/6 font-semibold" style={{ color: 'var(--text-muted)' }}>Your teams</div>
                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {teams.map((team) => (
                          <li key={team.name}>
                            <a
                              href={team.href}
                              className="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                              style={{
                                background: team.current ? 'color-mix(in srgb, var(--primary-100) 15%, transparent)' : 'transparent',
                                color: team.current ? 'var(--text-primary)' : 'var(--text-muted)',
                              }}
                              onMouseEnter={(e) => {
                                if (!team.current) {
                                  e.currentTarget.style.background = 'color-mix(in srgb, var(--surface) 10%, transparent)'
                                  e.currentTarget.style.color = 'var(--text-primary)'
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!team.current) {
                                  e.currentTarget.style.background = 'transparent'
                                  e.currentTarget.style.color = 'var(--text-muted)'
                                }
                              }}
                            >
                              <span
                                className="flex size-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium"
                                style={{
                                  borderColor: 'var(--border)',
                                  background: 'color-mix(in srgb, var(--surface-nav) 30%, transparent)',
                                  color: 'inherit'
                                }}
                              >
                                {team.initial}
                              </span>
                              <span className="truncate">{team.name}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <div className="text-xs/6 font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
                        Paleta: {palette}
                      </div>
                      <select
                        value={palette}
                        onChange={(e) => setPalette(e.target.value as PaletteName)}
                        className="w-full rounded-md px-3 py-2 text-sm font-medium"
                        style={{
                          background: 'var(--surface)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        {palettes.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </li>
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <a
                    href="#"
                    className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--surface) 10%, transparent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="size-8 rounded-full outline -outline-offset-1"
                      style={{ 
                        background: 'var(--surface)',
                        outlineColor: 'var(--border)'
                      }}
                    />
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">Tom Cook</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div 
          className="sticky top-0 z-40 flex items-center gap-x-6 px-4 py-4 after:pointer-events-none after:absolute after:inset-0 after:border-b sm:px-6 lg:hidden"
          style={{ 
            background: 'var(--surface-nav)',
            '--after-border-color': 'var(--border)'
          } as any}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 lg:hidden"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
          <div className="flex-1 text-sm/6 font-semibold" style={{ color: 'var(--text-primary)' }}>Dashboard</div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md"
            style={{ 
              color: 'var(--text-muted)',
              background: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'color-mix(in srgb, var(--surface) 10%, transparent)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            {isDark ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
          </button>
          <a href="#">
            <span className="sr-only">Your profile</span>
            <img
              alt=""
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              className="size-8 rounded-full outline -outline-offset-1"
              style={{ 
                background: 'var(--surface)',
                outlineColor: 'var(--border)'
              }}
            />
          </a>
        </div>

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl border px-6 py-6" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Buttons (paleta ativa)</h2>
              <div className="mt-4 grid gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="rounded-sm px-2 py-1 text-xs font-semibold"
                    style={{
                      background: 'var(--primary-100)',
                      color: 'var(--surface)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--primary-100) 85%, var(--primary-90))'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--primary-100)'
                    }}
                  >
                    Button text
                  </button>
                  <button
                    type="button"
                    className="rounded-sm px-2 py-1 text-sm font-semibold"
                    style={{
                      background: 'var(--primary-100)',
                      color: 'var(--surface)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--primary-100) 85%, var(--primary-90))'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--primary-100)'
                    }}
                  >
                    Button text
                  </button>
                  <button
                    type="button"
                    className="rounded-md px-2.5 py-1.5 text-sm font-semibold"
                    style={{
                      background: 'var(--primary-100)',
                      color: 'var(--surface)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--primary-100) 85%, var(--primary-90))'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--primary-100)'
                    }}
                  >
                    Button text
                  </button>
                  <button
                    type="button"
                    className="rounded-md px-3 py-2 text-sm font-semibold"
                    style={{
                      background: 'var(--primary-100)',
                      color: 'var(--surface)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--primary-100) 85%, var(--primary-90))'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--primary-100)'
                    }}
                  >
                    Button text
                  </button>
                  <button
                    type="button"
                    className="rounded-md px-3.5 py-2.5 text-sm font-semibold"
                    style={{
                      background: 'var(--primary-100)',
                      color: 'var(--surface)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--primary-100) 85%, var(--primary-90))'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--primary-100)'
                    }}
                  >
                    Button text
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="rounded-sm px-2 py-1 text-xs font-semibold"
                    style={{
                      background: 'color-mix(in srgb, var(--primary-100) 20%, transparent)',
                      color: 'var(--primary-90)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--primary-100) 30%, transparent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--primary-100) 20%, transparent)'
                    }}
                  >
                    Button text
                  </button>
                  <button
                    type="button"
                    className="rounded-sm px-2 py-1 text-sm font-semibold"
                    style={{
                      background: 'color-mix(in srgb, var(--primary-100) 20%, transparent)',
                      color: 'var(--primary-90)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--primary-100) 30%, transparent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--primary-100) 20%, transparent)'
                    }}
                  >
                    Button text
                  </button>
                  <button
                    type="button"
                    className="rounded-md px-2.5 py-1.5 text-sm font-semibold"
                    style={{
                      background: 'color-mix(in srgb, var(--primary-100) 20%, transparent)',
                      color: 'var(--primary-90)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--primary-100) 30%, transparent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--primary-100) 20%, transparent)'
                    }}
                  >
                    Button text
                  </button>
                  <button
                    type="button"
                    className="rounded-md px-3 py-2 text-sm font-semibold"
                    style={{
                      background: 'color-mix(in srgb, var(--primary-100) 20%, transparent)',
                      color: 'var(--primary-90)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--primary-100) 30%, transparent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--primary-100) 20%, transparent)'
                    }}
                  >
                    Button text
                  </button>
                  <button
                    type="button"
                    className="rounded-md px-3.5 py-2.5 text-sm font-semibold"
                    style={{
                      background: 'color-mix(in srgb, var(--primary-100) 20%, transparent)',
                      color: 'var(--primary-90)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--primary-100) 30%, transparent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--primary-100) 20%, transparent)'
                    }}
                  >
                    Button text
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

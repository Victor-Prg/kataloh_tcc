import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import logo from '../assets/logo.svg'
import iconKataloh from '../assets/icon kataloh.svg' // <--- IMPORTAMOS O ÍCONE AQUI
import '../assets/sidebar.css'

const navigation = [
  { name: 'Início', href: '#', icon: HomeIcon, current: true },
  {
    name: 'Times',
    icon: UsersIcon,
    current: false,
    children: [
      { name: 'Engenharia', href: '#' },
      { name: 'Recursos Humanos', href: '#' },
      { name: 'Sucesso do Cliente', href: '#' },
    ],
  },
  {
    name: 'Projetos',
    icon: FolderIcon,
    current: false,
    children: [
      { name: 'GraphQL API', href: '#' },
      { name: 'iOS App', href: '#' },
      { name: 'Android App', href: '#' },
      { name: 'Portal de Clientes', href: '#' },
    ],
  },
  { name: 'Calendário', href: '#', icon: CalendarIcon, current: false },
  { name: 'Documentos', href: '#', icon: DocumentDuplicateIcon, current: false },
  { name: 'Relatórios', href: '#', icon: ChartPieIcon, current: false },
]

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

type SidebarProps = {
  collapsed?: boolean
  onToggle?: () => void
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  return (
    <div
      className={classNames(
        'sidebar-root flex flex-col h-full w-full bg-[color:var(--surface-nav)] text-[color:var(--text-primary)] transition-all duration-300',
        collapsed ? 'items-center px-0' : 'px-6'
      )}
    >
      {/* --- CABEÇALHO --- */}
      <div
        className={classNames(
          'relative flex shrink-0 transition-all duration-300 w-full',
          collapsed 
            ? 'flex-col items-center pt-4 gap-6' 
            : 'h-16 items-center justify-between'
        )}
      >
        {/* LÓGICA DO LOGO VS ÍCONE */}
        <div className="flex items-center justify-center">
          {collapsed ? (
            // --- MODO RECOLHIDO: MOSTRA O ÍCONE KATALOH ---
            <img
              alt="Kataloh Icon"
              src={iconKataloh}
              className={classNames(
                'absolute transition-all duration-200 ease-in-out transform origin-center',
                collapsed ? "opacity-100 scale-50 pointer-events-none"
                : "opacity-100 scale-60"
              )}
            />
          ) : (
            // --- MODO EXPANDIDO: MOSTRA O LOGO COMPLETO ---
            <div className="relative">
              {/* Logo para Light Mode (Dark Mode Hidden) */}
              <img
                alt="Your Company"
                src={logo}
                className="h-18 w-auto dark:hidden transition-all"
              />
              {/* Logo para Dark Mode (Opcional, se o seu logo tiver versão branca) */}
              <img
                alt="Your Company"
                src={logo} // Se tiver um logo-dark.svg, use aqui
                className="h-18 w-auto hidden dark:block transition-all"
              />
            </div>
          )}
        </div>

        {/* BOTÃO DE TOGGLE */}
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className={classNames(
              'flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-primary)] hover:bg-[color:var(--primary-50)] transition-all z-10',
              collapsed ? 'h-9 w-9 text-[10px]' : 'h-9 w-9 text-[10px]'
            )}
          >
            {collapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <span className="font-bold">{'<'}</span>
            )}
          </button>
        )}
      </div>

      {/* --- NAVEGAÇÃO --- */}
      <nav className={classNames("flex flex-1 flex-col w-full overflow-y-auto overflow-x-hidden no-scrollbar", collapsed ? "mt-4" : "mt-8")}>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  {!item.children || collapsed ? (
                    <a
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-gray-50 dark:bg-white/5 text-[color:var(--primary-100)]'
                          : 'text-[color:var(--text-muted)] hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[color:var(--text-primary)]',
                        'group flex gap-x-3 rounded-md py-2 text-sm font-semibold leading-6 transition-all',
                        collapsed ? 'justify-center px-0 w-full' : 'px-2'
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      <item.icon
                        aria-hidden="true"
                        className={classNames(
                          item.current ? 'text-[color:var(--primary-100)]' : 'text-gray-400 group-hover:text-[color:var(--text-primary)]',
                          'h-6 w-6 shrink-0'
                        )}
                      />
                      {!collapsed && <span>{item.name}</span>}
                    </a>
                  ) : (
                    <Disclosure as="div">
                      <DisclosureButton
                        className={classNames(
                          item.current
                            ? 'bg-gray-50 dark:bg-white/5'
                            : 'hover:bg-gray-50 dark:hover:bg-white/5',
                          'group flex w-full items-center gap-x-3 rounded-md px-2 py-2 text-left text-sm font-semibold leading-6 text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]'
                        )}
                      >
                        <item.icon
                          aria-hidden="true"
                          className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-[color:var(--text-primary)]"
                        />
                        <span className="flex-1">{item.name}</span>
                        <ChevronRightIcon
                          aria-hidden="true"
                          className="h-5 w-5 shrink-0 text-gray-400 group-data-open:rotate-90 group-data-open:text-gray-500"
                        />
                      </DisclosureButton>
                      <DisclosurePanel as="ul" className="mt-1 px-2">
                        {item.children.map((subItem) => (
                          <li key={subItem.name}>
                            <DisclosureButton
                              as="a"
                              href={subItem.href}
                              className="block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-[color:var(--text-muted)] hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[color:var(--text-primary)]"
                            >
                              {subItem.name}
                            </DisclosureButton>
                          </li>
                        ))}
                      </DisclosurePanel>
                    </Disclosure>
                  )}
                </li>
              ))}
            </ul>
          </li>

          <li className="mt-auto -mx-2">
            <a
              href="#"
              className={classNames(
                'flex items-center gap-x-4 py-3 text-sm font-semibold leading-6 text-[color:var(--text-primary)] hover:bg-gray-50 dark:hover:bg-white/5 rounded-md transition-all',
                collapsed ? 'justify-center px-0' : 'px-6'
              )}
            >
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}
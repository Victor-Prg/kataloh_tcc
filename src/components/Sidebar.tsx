import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import {
  HomeIcon,
  ShoppingBagIcon,
  BanknotesIcon,
  ListBulletIcon,
  PencilSquareIcon,
  CubeIcon,
  TruckIcon,
  ArrowPathIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import logo from '../assets/logo.svg'
import iconKataloh from '../assets/icon kataloh.svg'
import '../assets/Sidebar.css'

// --- 1. ESTRUTURA DE DADOS ---
interface NavigationItem {
  name: string
  href?: string
  icon?: React.ElementType
  current?: boolean
  children?: NavigationItem[]
}

const navigation: NavigationItem[] = [
  { name: 'Início', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Loja',
    icon: ShoppingBagIcon,
    current: false,
    children: [
      { name: 'Listagem', href: '/cliente/lojas', icon: ListBulletIcon },
      { 
        name: 'Cadastro', 
        icon: PencilSquareIcon, 
        children: [
          { name: 'Produtos', href: '#', icon: CubeIcon },
          { name: 'Entregadores', href: '#', icon: TruckIcon },
        ]
      },
    ],
  },
  {
    name: 'Financeiro',
    icon: BanknotesIcon,
    current: false,
    children: [
      { name: 'Tesouraria', href: '/financeiro/tesouraria', icon: BanknotesIcon },
      { name: 'Repasses', href: '/financeiro/repasses', icon: ArrowPathIcon },
      // Link Real do Histórico
      { name: 'Histórico', href: '/financeiro/historico', icon: ClockIcon }, 
    ],
  },
]

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

// --- 2. ITEM RECURSIVO ---
type SidebarItemProps = {
  item: NavigationItem
  collapsed: boolean
  depth?: number
}

const SidebarItem = ({ item, collapsed, depth = 0 }: SidebarItemProps) => {
  const location = useLocation();
  const paddingLeftClass = depth === 0 ? 'px-2' : depth === 1 ? 'pl-9 pr-2' : 'pl-14 pr-2'
  
  // Lógica para determinar se é link real e se está ativo
  const isRealLink = item.href && item.href !== '#';
  const isActive = isRealLink ? location.pathname === item.href : false;

  const ButtonContent = () => (
    <>
      {item.icon && (
        <item.icon
          aria-hidden="true"
          className={classNames(
            isActive ? 'text-[color:var(--primary-100)]' : 'text-gray-400 group-hover:text-[color:var(--text-primary)]',
            'h-8 w-8 shrink-0'
          )}
        />
      )}
      {!collapsed && <span>{item.name}</span>}
    </>
  );

  // CASO 1: ITEM SIMPLES (SEM FILHOS)
  if (!item.children || collapsed) {
    const commonClasses = classNames(
      isActive
        ? 'bg-gray-50 dark:bg-white/5 text-[color:var(--primary-100)]'
        : 'text-[color:var(--text-muted)] hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[color:var(--text-primary)]',
      'group flex gap-x-3 rounded-md py-2 text-sm font-semibold leading-6 transition-all cursor-pointer',
      collapsed ? 'justify-center px-0 w-full' : paddingLeftClass
    );

    if (isRealLink) {
      return (
        <Link to={item.href!} className={commonClasses} title={collapsed ? item.name : undefined}>
          <ButtonContent />
        </Link>
      );
    }

    return (
      <a 
        href="#" 
        onClick={(e) => e.preventDefault()} 
        className={commonClasses} 
        title={collapsed ? item.name : undefined}
      >
        <ButtonContent />
      </a>
    );
  }

  // CASO 2: ITEM COM FILHOS (ACCORDION)
  return (
    <Disclosure as="div" className="w-full">
      {({ open }) => (
        <>
          <DisclosureButton
            className={classNames(
              'hover:bg-gray-50 dark:hover:bg-white/5',
              'group flex w-full items-center gap-x-3 rounded-md py-2 text-left text-sm font-semibold leading-6 text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]',
              paddingLeftClass
            )}
          >
            {item.icon && (
              <item.icon
                aria-hidden="true"
                className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-[color:var(--text-primary)]"
              />
            )}
            <span className="flex-1">{item.name}</span>
            <ChevronRightIcon
              aria-hidden="true"
              className={classNames(
                open ? 'rotate-90 text-gray-500' : 'text-gray-400',
                'h-5 w-5 shrink-0 transition-transform'
              )}
            />
          </DisclosureButton>
          <DisclosurePanel as="ul" className="mt-1 space-y-1">
            {item.children!.map((subItem) => (
              <li key={subItem.name}>
                <SidebarItem item={subItem} collapsed={collapsed} depth={depth + 1} />
              </li>
            ))}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  )
}

// --- 3. COMPONENTE PRINCIPAL ---
type SidebarProps = {
  collapsed?: boolean
  onToggle?: () => void
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const navigate = useNavigate()

  return (
    <div
      className={classNames(
        'sidebar-root flex flex-col h-full w-full bg-[color:var(--surface-nav)] text-[color:var(--text-primary)] transition-all duration-300',
        collapsed ? 'items-center px-0' : 'px-6'
      )}
    >
      {/* CABEÇALHO */}
      <div
        className={classNames(
          'relative flex shrink-0 transition-all duration-300 w-full',
          collapsed ? 'flex-col items-center pt-4 gap-6' : 'h-16 items-center justify-between'
        )}
      >
        <div className="flex items-center justify-center">
          {collapsed ? (
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center"
            >
              <img
                alt="Kataloh Icon"
                src={iconKataloh}
                className={classNames(
                  'absolute transition-all duration-200 ease-in-out transform origin-center',
                  collapsed ? "opacity-100 scale-100" : "opacity-0 scale-50"
                )}
                style={{ width: '32px' }}
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="relative"
            >
              <img
                alt="Your Company"
                src={logo}
                className="h-16 w-auto dark:hidden transition-all"
              />
              <img
                alt="Your Company"
                src={logo}
                className="h-16 w-auto hidden dark:block transition-all"
              />
            </button>
          )}
        </div>

        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className={classNames(
              'flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-primary)] hover:bg-[color:var(--primary-50)] transition-all z-10',
              collapsed ? 'h-8 w-8 text-[10px]' : 'h-8 w-8 text-xs'
            )}
          >
            {collapsed ? <ChevronRightIcon className="h-4 w-4" /> : <span className="font-bold">{'<'}</span>}
          </button>
        )}
      </div>

      {/* NAV */}
      <nav className={classNames("flex flex-1 flex-col w-full overflow-y-auto overflow-x-hidden no-scrollbar", collapsed ? "mt-4" : "mt-8")}>
        <ul role="list" className="flex flex-1 flex-col gap-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <SidebarItem item={item} collapsed={Boolean(collapsed)} />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

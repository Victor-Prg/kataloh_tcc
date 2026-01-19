import { useState } from 'react'
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
  ClockIcon,
  UserIcon,
  Cog6ToothIcon,
  BuildingStorefrontIcon,
  DocumentTextIcon,
  QueueListIcon,
  MapIcon,
  ChartBarIcon,
  UserGroupIcon,
  TicketIcon,
  ChatBubbleLeftRightIcon,
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
  { name: 'Home', href: '/dashboard', icon: HomeIcon },

  // --- ADMIN ---
  {
    name: 'Admin',
    icon: Cog6ToothIcon,
    current: false,
    children: [
      {
        name: 'Financeiro',
        icon: BanknotesIcon,
        children: [
          { name: 'Tesouraria', href: '/financeiro/tesouraria', icon: BanknotesIcon },
          { name: 'Repasses', href: '/financeiro/repasses', icon: ArrowPathIcon },
          { name: 'Histórico', href: '/financeiro/historico', icon: ClockIcon },
        ],
      },
      {
        name: 'Lojas',
        icon: BuildingStorefrontIcon,
        children: [
          { name: 'Gerenciar Lojas', href: '/admin/gerenciar-lojas', icon: Cog6ToothIcon },
          { name: 'Chat Firebase', href: '/admin/chat', icon: ChatBubbleLeftRightIcon },
        ],
      },
    ],
  },
  
  // --- CLIENTE ---
  {
    name: 'Cliente',
    icon: UserIcon,
    current: false,
    children: [
      { name: 'Lojas Disponíveis', href: '/cliente/lojas', icon: ShoppingBagIcon },
      { name: 'Conversas', href: '/cliente/conversas', icon: ChatBubbleLeftRightIcon },
    ],
  },

  // --- DELIVERY ---
  {
    name: 'Delivery',
    icon: TruckIcon,
    current: false,
    children: [
      { name: 'Dashboard', href: '/delivery/dashboard', icon: ChartBarIcon },
      { name: 'Lojas', href: '/delivery/lojas', icon: BuildingStorefrontIcon },
      { name: 'Entregadores', href: '/delivery/entregadores', icon: UserGroupIcon },
      { name: 'Financeiro', href: '/delivery/financeiro', icon: BanknotesIcon },
      { name: 'Histórico', href: '/delivery/historico', icon: ClockIcon },
      { name: 'Pedidos', href: '/delivery/orders', icon: MapIcon },
    ],
  },
  
  // --- LOJA ---
  {
    name: 'Loja',
    icon: ShoppingBagIcon,
    current: false,
    children: [
      { name: 'Dashboard', href: '/loja/dashboard', icon: HomeIcon },
      { name: 'Recepção', href: '/loja/recepcao', icon: ListBulletIcon },
      { name: 'Novo Pedido', href: '/loja/newpedido', icon: PencilSquareIcon },
      { name: 'Financeiro', href: '/loja/financeiro', icon: BanknotesIcon },
      { name: 'Extrato', href: '/loja/extrato', icon: DocumentTextIcon },
      {
        name: 'Cadastros',
        icon: QueueListIcon,
        children: [
          { name: 'Menu', href: '/loja/cadastros/menu', icon: DocumentTextIcon },
          { name: 'Produtos', href: '/loja/cadastros/produtos', icon: CubeIcon },
          { name: 'Entregadores', href: '/loja/cadastros/entregadores', icon: TruckIcon },
          { name: 'Cupons', href: '/loja/cadastros/cupons', icon: TicketIcon },
        ],
      },
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
  onToggle?: () => void
  onCollapsedItemClick?: (item: NavigationItem) => void
  autoOpenItemName?: string | null
  onRootGroupToggle?: (name: string) => void
}

const SidebarItem = ({
  item,
  collapsed,
  depth = 0,
  onToggle,
  onCollapsedItemClick,
  autoOpenItemName,
  onRootGroupToggle,
}: SidebarItemProps) => {
  const location = useLocation();
  const paddingLeftClass = depth === 0 ? 'px-2' : depth === 1 ? 'pl-9 pr-2' : 'pl-14 pr-2'
  
  // Lógica para determinar se é link real e se está ativo
  // Verifica se a rota atual começa com o href do item (para manter ativo em sub-rotas como /clientes/1)
  const isRealLink = item.href && item.href !== '#';
  const isActive = isRealLink 
    ? location.pathname === item.href || (item.href !== '/dashboard' && location.pathname.startsWith(item.href!))
    : false;

  const renderButtonContent = () => (
    <>
      {item.icon && (
        <item.icon
          aria-hidden="true"
          className={classNames(
            isActive ? 'text-[color:var(--primary-100)]' : 'text-gray-400 group-hover:text-[color:var(--text-primary)]',
            'h-5 w-5 shrink-0'
          )}
        />
      )}
      {!collapsed && <span className="text-sm">{item.name}</span>}
    </>
  );

  if (!item.children || collapsed) {
    const commonClasses = classNames(
      isActive
        ? 'bg-gray-50 dark:bg-white/5 text-[color:var(--primary-100)]'
        : 'text-[color:var(--text-muted)] hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[color:var(--text-primary)]',
      'group flex gap-x-3 rounded-md py-2 text-sm font-semibold leading-6 transition-all cursor-pointer',
      collapsed ? 'justify-center px-0 w-full' : paddingLeftClass
    );

    if (collapsed && onCollapsedItemClick) {
      return (
        <button
          type="button"
          onClick={() => onCollapsedItemClick(item)}
          className={commonClasses}
          title={item.name}
        >
          {renderButtonContent()}
        </button>
      );
    }

    if (isRealLink) {
      return (
        <Link to={item.href!} className={commonClasses} title={collapsed ? item.name : undefined}>
          {renderButtonContent()}
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
        {renderButtonContent()}
      </a>
    );
  }

  if (depth === 0) {
    return (
      <div className="w-full">
        <button
          type="button"
          className={classNames(
            'hover:bg-gray-50 dark:hover:bg-white/5',
            'group flex w-full items-center gap-x-3 rounded-md py-2 text-left text-sm font-semibold leading-6 text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]',
            paddingLeftClass
          )}
          onClick={() => {
            if (onRootGroupToggle) {
              onRootGroupToggle(item.name)
            }
          }}
        >
          {item.icon && (
            <item.icon
              aria-hidden="true"
              className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-[color:var(--text-primary)]"
            />
          )}
          <span className="flex-1 text-sm">{item.name}</span>
          <ChevronRightIcon
            aria-hidden="true"
            className={classNames(
              autoOpenItemName === item.name ? 'rotate-90 text-gray-500' : 'text-gray-400',
              'h-5 w-5 shrink-0 transition-transform'
            )}
          />
        </button>
        {autoOpenItemName === item.name && (
          <ul className="mt-1 space-y-1">
            {item.children!.map((subItem) => (
              <li key={subItem.name}>
                <SidebarItem
                  item={subItem}
                  collapsed={collapsed}
                  depth={depth + 1}
                  onToggle={onToggle}
                  onCollapsedItemClick={onCollapsedItemClick}
                  autoOpenItemName={autoOpenItemName}
                  onRootGroupToggle={onRootGroupToggle}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

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
                className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-[color:var(--text-primary)]"
              />
            )}
            <span className="flex-1 text-sm">{item.name}</span>
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
                <SidebarItem
                  item={subItem}
                  collapsed={collapsed}
                  depth={depth + 1}
                  onToggle={onToggle}
                  onCollapsedItemClick={onCollapsedItemClick}
                  autoOpenItemName={autoOpenItemName}
                  onRootGroupToggle={onRootGroupToggle}
                />
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
  const [autoOpenItemName, setAutoOpenItemName] = useState<string | null>(null)

  const handleCollapsedItemClick = (item: NavigationItem) => {
    if (item.children && item.children.length > 0) {
      setAutoOpenItemName(item.name)
    } else {
      setAutoOpenItemName(null)
    }

    if (onToggle) {
      onToggle()
    }
  }

  const handleRootGroupToggle = (name: string) => {
    setAutoOpenItemName((prev) => (prev === name ? null : name))
  }

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
          collapsed ? 'h-16 items-center justify-center' : 'h-16 items-center justify-between'
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
              className="relative w-full flex items-center justify-center"
            >
              <img
                alt="Kataloh Logo"
                src={logo}
                className="h-[120px] w-auto max-w-full dark:hidden transition-all"
              />
              <img
                alt="Kataloh Logo"
                src={logo}
                className="h-[120px] w-auto max-w-full hidden dark:block transition-all"
              />
            </button>
          )}
        </div>

      </div>

      <nav className={classNames("flex flex-1 flex-col w-full overflow-y-auto overflow-x-hidden no-scrollbar", collapsed ? "mt-4" : "mt-8")}>
        <ul role="list" className="flex flex-1 flex-col gap-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <SidebarItem
                item={item}
                collapsed={Boolean(collapsed)}
                onToggle={onToggle}
                onCollapsedItemClick={handleCollapsedItemClick}
                autoOpenItemName={collapsed ? null : autoOpenItemName}
                onRootGroupToggle={handleRootGroupToggle}
              />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

import { useState } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) // Novo estado para mobile

  const handleToggleSidebar = () => {
    setIsCollapsed((prev) => !prev)
  }

  return (
    <div className="flex h-screen bg-[var(--bg)] text-[color:var(--text-primary)] overflow-hidden">
      
      {/* --- SIDEBAR DESKTOP (Fixo, Hidden no Mobile) --- */}
      <aside 
        className={`
          hidden md:flex flex-col border-r border-[color:var(--border)] bg-[color:var(--surface-nav)]
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-[4.5rem]' : 'w-64'}
        `}
      >
        <Sidebar collapsed={isCollapsed} onToggle={handleToggleSidebar} />
      </aside>

      {/* --- SIDEBAR MOBILE (Dialog / Menu Hambúrguer) --- */}
      <Transition show={mobileMenuOpen}>
        <Dialog className="relative z-50 md:hidden" onClose={setMobileMenuOpen}>
          {/* Backdrop (Fundo escuro) */}
          <TransitionChild
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </TransitionChild>

          <div className="fixed inset-0 flex">
            {/* Painel Deslizante */}
            <TransitionChild
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                
                {/* Botão de Fechar (X) interno */}
                <TransitionChild
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5 text-white" onClick={() => setMobileMenuOpen(false)}>
                      <span className="sr-only">Fechar menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </TransitionChild>

                {/* Renderizamos o Componente Sidebar aqui dentro */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[color:var(--surface-nav)] ring-1 ring-white/10">
                  {/* Passamos collapsed=false para que no mobile ela esteja sempre expandida */}
                  <Sidebar collapsed={false} /> 
                </div>

              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>


      {/* --- ÁREA PRINCIPAL --- */}
      <div className="flex-1 flex flex-col min-w-0 bg-[color:var(--surface)] transition-all duration-300 ease-in-out">
        
        {/* Navbar com botão de abrir menu conectado */}
        <header className="border-b border-[color:var(--border)] sticky top-0 z-10 bg-[color:var(--surface)]">
          <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-[color:var(--text-muted)]">
              Status: {isCollapsed ? 'Recolhido' : 'Expandido'}
            </p>
            
            <div className="mt-6 border-2 border-dashed border-[color:var(--border)] rounded-lg h-[800px] flex items-center justify-center text-[color:var(--text-soft)]">
              Conteúdo da Aplicação
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
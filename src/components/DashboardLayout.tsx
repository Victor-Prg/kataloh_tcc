import { useState } from 'react';
import { Outlet } from 'react-router-dom'; // Onde as páginas serão renderizadas
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[var(--bg-body)] text-[color:var(--text-primary)] overflow-hidden transition-colors duration-300">
      
      {/* SIDEBAR DESKTOP */}
      <aside className={`hidden md:flex flex-col border-r border-[color:var(--border)] bg-[color:var(--surface-nav)] transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[4.5rem]' : 'w-64'}`}>
        <Sidebar collapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      </aside>

      {/* SIDEBAR MOBILE */}
      <Transition show={mobileMenuOpen}>
        <Dialog className="relative z-50 md:hidden" onClose={setMobileMenuOpen}>
          <TransitionChild enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-900/80" />
          </TransitionChild>

          <div className="fixed inset-0 flex">
            <TransitionChild enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
              <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                <TransitionChild enter="ease-in-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setMobileMenuOpen(false)}>
                      <span className="sr-only">Fechar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </TransitionChild>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[color:var(--surface-nav)] ring-1 ring-white/10 px-6 pb-4">
                  <Sidebar collapsed={false} />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 bg-[color:var(--bg-body)] transition-all duration-300 ease-in-out">
        <header className="border-b border-[color:var(--border)] sticky top-0 z-10 bg-[color:var(--bg-card)]">
          <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        </header>

        {/* AQUI ENTRA O CONTEÚDO DAS PÁGINAS (Histórico, Dashboard, etc) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
}
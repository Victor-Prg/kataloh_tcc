import { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom'; // Onde as páginas serão renderizadas
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
  const [swipeCurrentX, setSwipeCurrentX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Configurações do swipe
  const SWIPE_THRESHOLD = 50; // Distância mínima para considerar como swipe
  const EDGE_THRESHOLD = 20; // Área da borda esquerda sensível ao swipe (em pixels)

  // Handlers para touch events
  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    
    // Se começar da borda esquerda ou se o menu já estiver aberto
    if (startX < EDGE_THRESHOLD || mobileMenuOpen) {
      setSwipeStartX(startX);
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (swipeStartX === null || !isDragging) return;
    
    const touch = e.touches[0];
    const currentX = touch.clientX;
    setSwipeCurrentX(currentX);
    
    // Prevenir scroll durante o drag se estiver arrastando da borda
    if (swipeStartX < EDGE_THRESHOLD) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (swipeStartX === null || swipeCurrentX === null) {
      setSwipeStartX(null);
      setSwipeCurrentX(null);
      setIsDragging(false);
      return;
    }

    const swipeDistance = swipeCurrentX - swipeStartX;

    // Se arrastar da esquerda para direita (abrir)
    if (!mobileMenuOpen && swipeDistance > SWIPE_THRESHOLD) {
      setMobileMenuOpen(true);
    }
    // Se arrastar da direita para esquerda (fechar)
    else if (mobileMenuOpen && swipeDistance < -SWIPE_THRESHOLD) {
      setMobileMenuOpen(false);
    }

    setSwipeStartX(null);
    setSwipeCurrentX(null);
    setIsDragging(false);
  };

  // Adicionar listeners de touch
  useEffect(() => {
    const handleTouchStartWrapper = (e: TouchEvent) => handleTouchStart(e);
    const handleTouchMoveWrapper = (e: TouchEvent) => handleTouchMove(e);
    const handleTouchEndWrapper = () => handleTouchEnd();

    document.addEventListener('touchstart', handleTouchStartWrapper, { passive: false });
    document.addEventListener('touchmove', handleTouchMoveWrapper, { passive: false });
    document.addEventListener('touchend', handleTouchEndWrapper);

    return () => {
      document.removeEventListener('touchstart', handleTouchStartWrapper);
      document.removeEventListener('touchmove', handleTouchMoveWrapper);
      document.removeEventListener('touchend', handleTouchEndWrapper);
    };
  }, [swipeStartX, swipeCurrentX, mobileMenuOpen, isDragging]);

  // Calcular o offset para animação visual durante o drag
  const getDragOffset = () => {
    if (!isDragging || swipeStartX === null || swipeCurrentX === null) return 0;
    
    const distance = swipeCurrentX - swipeStartX;
    
    if (mobileMenuOpen) {
      // Se já está aberto, só permite arrastar para a esquerda
      return Math.min(0, distance);
    } else {
      // Se está fechado, só permite arrastar para a direita
      return Math.max(0, distance);
    }
  };

  const handleCloseSidebar = () => {
    if (!isCollapsed) {
      setIsCollapsed(true);
    }
  };

  const handleToggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-[var(--bg-body)] text-[color:var(--text-primary)] overflow-hidden transition-colors duration-300">
      
      <aside
        className={`hidden md:flex flex-col border-r border-[color:var(--border)] bg-[color:var(--surface-nav)] transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[4.5rem]' : 'w-64'}`}
        onClick={(event) => event.stopPropagation()}
      >
        <Sidebar collapsed={isCollapsed} onToggle={handleToggleSidebar} />
      </aside>

      {/* SIDEBAR MOBILE */}
      <Transition show={mobileMenuOpen}>
        <Dialog className="relative z-50 md:hidden" onClose={setMobileMenuOpen}>
          <TransitionChild enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div 
              className="fixed inset-0 bg-gray-900/80" 
              style={{ 
                opacity: isDragging ? Math.max(0, 0.8 + (getDragOffset() / 320) * 0.8) : undefined 
              }}
            />
          </TransitionChild>

          <div className="fixed inset-0 flex">
            <TransitionChild enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
              <DialogPanel 
                ref={sidebarRef}
                className="relative mr-16 flex w-full max-w-xs flex-1"
                style={{
                  transform: isDragging ? `translateX(${getDragOffset()}px)` : undefined,
                  transition: isDragging ? 'none' : undefined,
                }}
              >
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

      {/* INDICADOR VISUAL DE SWIPE (apenas quando fechado) */}
      {!mobileMenuOpen && isDragging && swipeStartX !== null && swipeStartX < EDGE_THRESHOLD && (
        <div 
          className="fixed left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-orange-500 to-transparent pointer-events-none z-40 md:hidden"
          style={{
            width: `${Math.min(getDragOffset(), 320)}px`,
            opacity: Math.min(getDragOffset() / 100, 0.3),
          }}
        />
      )}

      <div
        className="flex-1 flex flex-col min-w-0 bg-[color:var(--bg-body)] transition-all duration-300 ease-in-out"
        onClick={handleCloseSidebar}
      >
        <header className="border-b border-[color:var(--border)] sticky top-0 z-10 bg-[color:var(--bg-card)]">
          <Navbar
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onToggleSidebar={handleToggleSidebar}
            isSidebarCollapsed={isCollapsed}
          />
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

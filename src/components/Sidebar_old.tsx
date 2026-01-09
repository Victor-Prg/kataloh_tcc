import React from 'react';
import '../assets/Sidebar.css';
import { Text } from './Text';
import { ChartBar, CheckSquare, HandPointing, Image, ToggleLeft } from 'phosphor-react';

interface SidebarProps {
  collapsed: boolean;
  onNavigate?: (sectionId: string) => void;
  activeSection?: string;
}

export const Sidebar = ({ collapsed, onNavigate, activeSection }: SidebarProps) => {
  
  const handleNavigate = (id: string) => {
    if (onNavigate) onNavigate(id);
  };

  return (
    <aside className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
      
      <div className="sidebar-header-internal">
        {!collapsed && (
          <Text size="sm" style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>
            COMPONENTES
          </Text>
        )}
      </div>

      <nav className="sidebar-nav">
        <SidebarItem 
          icon={<CheckSquare size={24} />} 
          label="Status & Feedback" 
          active={activeSection === 'status'} 
          collapsed={collapsed}
          onClick={() => handleNavigate('status')} 
        />
        <SidebarItem 
          icon={<HandPointing size={24} />} 
          label="Ações" 
          active={activeSection === 'actions'} 
          collapsed={collapsed} 
          onClick={() => handleNavigate('actions')}
        />
        <SidebarItem 
          icon={<ToggleLeft size={24} />} 
          label="Formulários" 
          active={activeSection === 'forms'} 
          collapsed={collapsed} 
          onClick={() => handleNavigate('forms')}
        />
        <SidebarItem 
          icon={<Image size={24} />} 
          label="Visual & Overlay" 
          active={activeSection === 'visual'} 
          collapsed={collapsed} 
          onClick={() => handleNavigate('visual')}
        />
        <SidebarItem 
          icon={<ChartBar size={24} />} 
          label="Tamanhos" 
          active={activeSection === 'sizes'} 
          collapsed={collapsed} 
          onClick={() => handleNavigate('sizes')}
        />
      </nav>

    </aside>
  );
};

// Sub-componente auxiliar
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, label, active, collapsed, onClick }: SidebarItemProps) => {
  return (
    <div 
      className={`sidebar-item ${active ? 'active' : ''}`} 
      title={collapsed ? label : ''}
      onClick={onClick}
    >
      <div style={{ minWidth: 24, display: 'flex', justifyContent: 'center' }}>
        {icon}
      </div>
      {!collapsed && <span className="sidebar-label">{label}</span>}
    </div>
  );
};
import React from 'react';
import '../assets/Tabs.css';

interface TabsContextValue {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

export interface TabsProps {
  value: number;
  onChange: (index: number) => void;
  children: React.ReactNode;
}

export const Tabs = ({ value, onChange, children }: TabsProps) => {
  const contextValue = React.useMemo(
    () => ({
      activeIndex: value,
      setActiveIndex: onChange,
    }),
    [value, onChange],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className="tabs-root">
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TabList = ({ children, className, onKeyDown, ...props }: TabListProps) => {
  const context = React.useContext(TabsContext);

  if (!context) {
    return null;
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (onKeyDown) {
      onKeyDown(event);
    }

    if (event.defaultPrevented) {
      return;
    }

    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return;
    }

    const tabs = event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]');

    if (!tabs.length) {
      return;
    }

    const currentIndex = Array.from(tabs).findIndex(tab => tab === document.activeElement);
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + direction + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];

    nextTab.focus();
    context.setActiveIndex(nextIndex);
    event.preventDefault();
  };

  return (
    <div
      role="tablist"
      className={`tabs-list ${className || ''}`}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  );
};

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  index: number;
}

export const Tab = ({ index, className, onClick, children, ...props }: TabProps) => {
  const context = React.useContext(TabsContext);

  if (!context) {
    return null;
  }

  const isActive = context.activeIndex === index;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    context.setActiveIndex(index);

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      className={`tab ${isActive ? 'tab-active' : ''} ${className || ''}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
}

export const TabPanel = ({ index, className, children, ...props }: TabPanelProps) => {
  const context = React.useContext(TabsContext);

  if (!context) {
    return null;
  }

  const isActive = context.activeIndex === index;

  return (
    <div
      role="tabpanel"
      hidden={!isActive}
      aria-hidden={!isActive}
      className={`tab-panel ${className || ''}`}
      {...props}
    >
      {isActive && children}
    </div>
  );
};


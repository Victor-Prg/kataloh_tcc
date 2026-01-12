import '../assets/Switch.css';

interface SwitchProps {
  checked: boolean;
  onToggle: () => void;
}

export const Switch = ({ checked, onToggle }: SwitchProps) => {
  return (
    <button 
      className={`switch-track ${checked ? 'checked' : ''}`} 
      onClick={onToggle}
      role="switch"
      aria-checked={checked}
    >
      <div className="switch-thumb" />
    </button>
  );
};

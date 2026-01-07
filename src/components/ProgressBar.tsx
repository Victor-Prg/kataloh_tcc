import '../assets/ProgressBar.css';

export interface ProgressBarProps {
  value: number;
  variant?: 'default' | 'success' | 'error';
}

export const ProgressBar = ({ value, variant = 'default' }: ProgressBarProps) => {
  const clamped = Math.min(100, Math.max(0, value));
  const className = `progressbar progressbar-${variant}`;

  return (
    <div
      className={className}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="progressbar-track">
        <div className="progressbar-indicator" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
};


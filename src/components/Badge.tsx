import '../assets/Badge.css';

interface BadgeProps {
  label: string;
  variant?: 'neutro' | 'sucesso' | 'aviso' | 'perigo';
}

export const Badge = ({ label, variant = 'neutro' }: BadgeProps) => {
  return (
    <span className={`badge badge-${variant}`}>
      {label}
    </span>
  );
};
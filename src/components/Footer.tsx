import '../assets/Footer.css';
import { Text } from './Text'; // Reutilizando seu componente Text!

interface FooterProps {
  companyName?: string;
  year?: number;
}

export const Footer = ({ companyName = "Minha Empresa", year = 2024 }: FooterProps) => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        <div>
          <Text color="white" style={{ fontWeight: 'bold' }}>{companyName}</Text>
          <Text size="sm" color="#9CA3AF">© {year} Todos os direitos reservados.</Text>
        </div>

        <div className="footer-links">
          <a className="footer-link">Sobre nós</a>
          <a className="footer-link">Contato</a>
          <a className="footer-link">Privacidade</a>
        </div>

      </div>
    </footer>
  );
};
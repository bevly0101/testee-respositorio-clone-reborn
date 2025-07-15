
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = () => {
    scrollToTop();
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="font-bold text-2xl mb-6">Auto<span className="text-autofinance-blue">Finance</span></h3>
            <p className="text-gray-400 mb-6">Simplificando o controle financeiro pessoal com automação inteligente para você alcançar seus objetivos financeiros.</p>
            <div className="flex space-x-4">
              <a href="#" onClick={handleLinkClick} className="bg-gray-800 p-2 rounded-full hover:bg-autofinance-blue transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" onClick={handleLinkClick} className="bg-gray-800 p-2 rounded-full hover:bg-autofinance-blue transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" onClick={handleLinkClick} className="bg-gray-800 p-2 rounded-full hover:bg-autofinance-blue transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" onClick={handleLinkClick} className="bg-gray-800 p-2 rounded-full hover:bg-autofinance-blue transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Produto</h4>
            <ul className="space-y-2">
              <li><a href="#" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">Recursos</a></li>
              <li><Link to="/plans" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">Preços</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li><Link to="/about" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">Sobre</Link></li>
              <li><Link to="/blog" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><a href="#" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center sm:flex sm:justify-between sm:text-left">
          <p className="text-gray-400 mb-4 sm:mb-0">© 2025 AutoFinance. Todos os direitos reservados.</p>
          <div className="flex justify-center sm:justify-end space-x-6">
            <Link to="/terms" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">Termos</Link>
            <Link to="/privacy" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">Política de Privacidade</Link>
            <Link to="/cookies" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

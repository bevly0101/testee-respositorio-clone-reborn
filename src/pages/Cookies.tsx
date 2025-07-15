
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Cookies = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="flex items-center text-gray-600 hover:text-autofinance-blue">
            <ArrowLeft className="mr-1" size={20} />
            <span>Voltar para início</span>
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Política de Cookies</h1>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">O que são cookies?</h2>
            <p className="text-gray-600 mb-4">
              Cookies são pequenos arquivos de texto armazenados pelo seu navegador quando você visita nosso site. 
              Eles permitem que o site lembre suas preferências e personalize sua experiência.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Como utilizamos cookies</h2>
            <p className="text-gray-600 mb-4">
              O AutoFinance utiliza cookies para diversas finalidades, incluindo:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Manter você conectado durante sua visita</li>
              <li>Lembrar suas preferências e configurações</li>
              <li>Melhorar a velocidade e segurança do site</li>
              <li>Analisar como nosso site é utilizado para melhorarmos continuamente</li>
              <li>Personalizar conteúdo e funcionalidades relevantes para você</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Tipos de cookies que utilizamos</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Cookies essenciais</h3>
                <p className="text-gray-600">Necessários para o funcionamento básico do site. Sem eles, você não conseguiria navegar ou usar funcionalidades básicas.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Cookies de preferências</h3>
                <p className="text-gray-600">Permitem que o site lembre informações que mudam a aparência ou comportamento do site, como seu idioma preferido.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Cookies analíticos</h3>
                <p className="text-gray-600">Nos ajudam a entender como os visitantes interagem com o site, coletando e relatando informações anonimamente.</p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Como gerenciar cookies</h2>
            <p className="text-gray-600 mb-4">
              A maioria dos navegadores permite controlar cookies através de suas configurações. Você pode optar por bloquear, 
              deletar ou permitir cookies específicos. No entanto, desabilitar cookies pode afetar sua experiência no site.
            </p>
            <p className="text-gray-600">
              Para mais informações sobre nosso uso de dados pessoais, por favor consulte nossos <Link to="/terms" className="text-autofinance-blue hover:underline">Termos e Condições</Link>.
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cookies;

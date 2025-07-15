
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Database } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Privacy = () => {
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
          <div className="text-center mb-8">
            <Shield className="mx-auto h-16 w-16 text-autofinance-blue mb-4" />
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Política de Privacidade</h1>
            <p className="text-gray-600">Última atualização: Dezembro de 2024</p>
          </div>
          
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Eye className="h-6 w-6 text-autofinance-blue mr-2" />
              <h2 className="text-xl font-semibold text-gray-700">1. Informações que Coletamos</h2>
            </div>
            <p className="text-gray-600 mb-4">
              O AutoFinance coleta as seguintes informações para fornecer nossos serviços de gestão financeira:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><strong>Dados de cadastro:</strong> nome, e-mail, telefone e informações de autenticação</li>
              <li><strong>Dados financeiros:</strong> transações, categorias de gastos, orçamentos e metas financeiras</li>
              <li><strong>Dados de uso:</strong> interações com a plataforma, preferências e configurações</li>
              <li><strong>Dados técnicos:</strong> endereço IP, tipo de dispositivo e informações do navegador</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Database className="h-6 w-6 text-autofinance-blue mr-2" />
              <h2 className="text-xl font-semibold text-gray-700">2. Como Utilizamos suas Informações</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Utilizamos suas informações para:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Fornecer e melhorar nossos serviços de gestão financeira</li>
              <li>Gerar relatórios e insights personalizados sobre suas finanças</li>
              <li>Enviar notificações sobre transações e alertas de orçamento</li>
              <li>Garantir a segurança da sua conta e prevenir fraudes</li>
              <li>Cumprir obrigações legais e regulamentares</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 text-autofinance-blue mr-2" />
              <h2 className="text-xl font-semibold text-gray-700">3. Segurança dos Dados Financeiros</h2>
            </div>
            <p className="text-gray-600 mb-4">
              A segurança de seus dados financeiros é nossa prioridade máxima:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Criptografia de ponta a ponta para todas as transações</li>
              <li>Conformidade com padrões PCI DSS para proteção de dados financeiros</li>
              <li>Autenticação multifator obrigatória</li>
              <li>Monitoramento 24/7 contra atividades suspeitas</li>
              <li>Backups seguros e redundantes dos seus dados</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">4. Compartilhamento de Informações</h2>
            <p className="text-gray-600 mb-4">
              Nunca vendemos seus dados pessoais. Compartilhamos informações apenas quando:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Você autoriza expressamente</li>
              <li>Necessário para prestação de serviços (ex: processamento de pagamentos)</li>
              <li>Exigido por lei ou ordem judicial</li>
              <li>Para proteger direitos, propriedade ou segurança</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">5. Seus Direitos</h2>
            <p className="text-gray-600 mb-4">
              Você tem direito a:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Acessar e corrigir seus dados pessoais</li>
              <li>Exportar seus dados financeiros</li>
              <li>Solicitar exclusão da sua conta e dados</li>
              <li>Revogar consentimentos a qualquer momento</li>
              <li>Portabilidade de dados para outras plataformas</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">6. Retenção de Dados</h2>
            <p className="text-gray-600 mb-4">
              Mantemos seus dados pelo tempo necessário para:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Prestação dos nossos serviços</li>
              <li>Cumprimento de obrigações legais (mínimo de 5 anos para dados financeiros)</li>
              <li>Resolução de disputas e cumprimento de acordos</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">7. Cookies e Tecnologias Similares</h2>
            <p className="text-gray-600 mb-4">
              Utilizamos cookies para melhorar sua experiência. Para mais detalhes, consulte nossa{' '}
              <Link to="/cookies" className="text-autofinance-blue hover:underline">
                Política de Cookies
              </Link>.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">8. Contato</h2>
            <p className="text-gray-600 mb-4">
              Para questões sobre privacidade ou exercer seus direitos, entre em contato:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>E-mail: privacidade@autofinance.com</li>
              <li>Telefone: (11) 9999-9999</li>
              <li>Endereço: São Paulo, SP - Brasil</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">9. Alterações nesta Política</h2>
            <p className="text-gray-600 mb-4">
              Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas 
              por e-mail ou através da plataforma. O uso continuado dos nossos serviços após as alterações 
              constitui aceitação da nova política.
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;

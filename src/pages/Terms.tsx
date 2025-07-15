
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Terms = () => {
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
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Termos e Condições</h1>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">1. Aceitação dos Termos</h2>
            <p className="text-gray-600 mb-4">
              Ao acessar e utilizar o AutoFinance, você concorda em cumprir e ficar vinculado aos seguintes termos e condições. 
              Se você não concordar com algum destes termos, pedimos que não utilize nosso serviço.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">2. Descrição do Serviço</h2>
            <p className="text-gray-600 mb-4">
              O AutoFinance é uma plataforma de gerenciamento financeiro pessoal que oferece ferramentas para controle de gastos, 
              orçamento e planejamento financeiro. Nosso objetivo é ajudar usuários a alcançarem suas metas financeiras através 
              de automação inteligente e insights personalizados.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">3. Conta do Usuário</h2>
            <p className="text-gray-600 mb-4">
              Para utilizar completamente nossos serviços, pode ser necessário criar uma conta. Você é responsável por manter 
              a confidencialidade de suas credenciais de login e por todas as atividades que ocorrem em sua conta.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">4. Privacidade e Dados Pessoais</h2>
            <p className="text-gray-600 mb-4">
              Respeitamos sua privacidade e protegemos seus dados pessoais de acordo com nossa <Link to="/cookies" className="text-autofinance-blue hover:underline">Política de Cookies</Link> e 
              práticas de privacidade. Ao utilizar nosso serviço, você concorda com a coleta e uso de informações conforme descrito.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">5. Alterações nos Termos</h2>
            <p className="text-gray-600 mb-4">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente 
              após sua publicação. O uso continuado do nosso serviço após tais alterações constitui sua aceitação dos novos termos.
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;

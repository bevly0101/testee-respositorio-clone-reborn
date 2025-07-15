
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, PenTool } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Blog = () => {
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
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white p-12 rounded-xl shadow-md">
            <div className="mb-8">
              <PenTool className="mx-auto h-24 w-24 text-autofinance-blue mb-6" />
              <h1 className="text-4xl font-bold mb-4 text-gray-800">Blog em Breve</h1>
              <p className="text-xl text-gray-600 mb-8">
                Estamos preparando conteúdos incríveis sobre educação financeira, 
                dicas de investimento e estratégias para controle de gastos.
              </p>
            </div>
            
            <div className="bg-autofinance-gray-light p-6 rounded-lg mb-8">
              <Calendar className="mx-auto h-12 w-12 text-autofinance-blue mb-4" />
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">O que você pode esperar</h2>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-autofinance-blue">Educação Financeira</h3>
                  <p className="text-gray-600">Artigos sobre planejamento financeiro, orçamento pessoal e construção de reserva de emergência.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-autofinance-blue">Dicas de Investimento</h3>
                  <p className="text-gray-600">Estratégias para iniciantes e avançados em investimentos e diversificação de portfólio.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-autofinance-blue">Controle de Gastos</h3>
                  <p className="text-gray-600">Técnicas para reduzir despesas desnecessárias e otimizar seu orçamento mensal.</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Enquanto isso, aproveite para explorar nossa plataforma e descobrir como 
                o AutoFinance pode transformar sua vida financeira.
              </p>
              <Link to="/register">
                <button className="bg-autofinance-blue hover:bg-autofinance-blue-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                  Comece agora gratuitamente
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;

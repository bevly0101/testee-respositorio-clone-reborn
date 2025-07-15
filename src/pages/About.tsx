
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Users, TrendingUp, Shield } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
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
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 text-gray-800">Sobre o Auto<span className="text-autofinance-blue">Finance</span></h1>
              <p className="text-xl text-gray-600">Simplificando sua vida financeira</p>
            </div>
            
            <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6">
              <p className="text-lg">
                O AutoFinance nasceu da ideia de tornar a gestão financeira algo simples, acessível e automatizado para todos. 
                Sabemos que lidar com entradas, saídas, faturas e metas pode ser desgastante — por isso criamos uma plataforma 
                que faz isso por você, de forma inteligente e intuitiva.
              </p>
              
              <p>
                Somos uma equipe apaixonada por tecnologia, automação e educação financeira. Unimos essas áreas para construir 
                uma solução onde cada usuário pode:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-6 w-6 text-autofinance-blue mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-autofinance-blue mb-2">Acompanhar sua vida financeira em tempo real</h3>
                    <p className="text-gray-600">Visualize todas as suas movimentações financeiras de forma clara e organizada.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Target className="h-6 w-6 text-autofinance-blue mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-autofinance-blue mb-2">Receber alertas e insights personalizados</h3>
                    <p className="text-gray-600">Dicas inteligentes baseadas no seu perfil e padrão de gastos.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-autofinance-blue mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-autofinance-blue mb-2">Automatizar tarefas repetitivas</h3>
                    <p className="text-gray-600">Controle de gastos automático, sem a necessidade de inserir dados manualmente.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-autofinance-blue mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-autofinance-blue mb-2">Visualizar relatórios e gráficos claros</h3>
                    <p className="text-gray-600">Entenda para onde vai seu dinheiro com visualizações intuitivas.</p>
                  </div>
                </div>
              </div>
              
              <p>
                Nosso objetivo é ajudar você a ter mais controle, menos estresse e decisões mais inteligentes sobre seu dinheiro 
                — tudo isso com uma interface moderna e simples de usar, seja no celular ou no computador.
              </p>
              
              <p>
                Estamos constantemente melhorando nossa plataforma com base no feedback dos usuários e nas melhores práticas 
                de segurança e design. Se você procura autonomia financeira com praticidade, o AutoFinance foi feito pra você.
              </p>
              
              <div className="bg-autofinance-gray-light p-6 rounded-lg text-center mt-8">
                <h2 className="text-2xl font-semibold mb-4 text-autofinance-blue">Junte-se a nós e simplifique sua vida financeira.</h2>
                <Link to="/register">
                  <button className="bg-autofinance-blue hover:bg-autofinance-blue-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                    Comece agora gratuitamente
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;

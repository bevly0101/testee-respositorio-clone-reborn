import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, BarChart2, PieChart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-autofinance-gray-light overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-autofinance-blue opacity-5"></div>
        <div className="absolute top-1/2 -left-48 w-96 h-96 rounded-full bg-autofinance-blue opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Automatize suas <span className="text-autofinance-blue">Finanças Pessoais</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Simplifique o controle do seu dinheiro com nossa plataforma inteligente. Economize tempo, evite gastos desnecessários e tenha insights valiosos sobre seus hábitos financeiros.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login"> {/* Alterado de /plans para /login */}
                <Button className="bg-autofinance-blue hover:bg-autofinance-blue-dark text-white px-8 py-6 rounded-lg text-lg flex items-center">
                  Iniciar Teste Gratuito
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/whatsapp-demo">
                <Button variant="outline" className="border-gray-300 text-gray-700 px-8 py-6 rounded-lg text-lg">
                  Demonstração
                </Button>
              </Link>
            </div>
            {/* Trusted by section */}
            <div className="mt-10 flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-white font-medium">
                      {i}
                    </span>
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Confiado por mais de 10.000 pessoas</p>
              </div>
            </div>
          </div>

          {/* Right side with financial panel mockup */}
          <div className="w-full md:w-1/2 relative">
            <div className="bg-white rounded-2xl p-4 shadow-2xl relative z-20 animate-float">
              <div className="bg-autofinance-gray-light rounded-xl p-4 flex items-center justify-between mb-4">
                <span className="font-medium">Painel Financeiro Pessoal</span>
                <div className="flex space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-autofinance-blue bg-opacity-10 p-4 rounded-lg">
                  <BarChart2 className="h-6 w-6 text-autofinance-blue mb-2" />
                  <h3 className="font-medium">Receita</h3>
                  <p className="text-2xl font-bold">R$4.250</p>
                  <span className="text-green-500 text-sm font-medium">+5,2%</span>
                </div>
                <div className="bg-autofinance-gray p-4 rounded-lg">
                  <PieChart className="h-6 w-6 text-autofinance-blue mb-2" />
                  <h3 className="font-medium">Despesas</h3>
                  <p className="text-2xl font-bold">R$2.840</p>
                  <span className="text-red-500 text-sm font-medium">-3,8%</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-autofinance-blue to-autofinance-blue-dark p-4 rounded-lg text-white">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Saldo</h3>
                  <TrendingUp className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold mb-2">R$1.410</p>
                <div className="w-full bg-white bg-opacity-20 h-2 rounded-full">
                  <div className="bg-white h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span>Meta de Economia</span>
                  <span>65%</span>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-8 -right-4 w-20 h-20 bg-yellow-300 rounded-full opacity-20 z-10"></div>
            <div className="absolute bottom-8 -left-4 w-16 h-16 bg-autofinance-blue rounded-full opacity-20 z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


import React from 'react';
import { Shield, TrendingUp, CreditCard, AlertCircle, BarChart2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      icon: <TrendingUp className="h-8 w-8 text-autofinance-blue" />,
      title: 'Organização Financeira',
      description: 'Organize suas despesas, receitas e investimentos em um só lugar. Acompanhe seu fluxo de caixa de forma automática.'
    },
    {
      icon: <Shield className="h-8 w-8 text-autofinance-blue" />,
      title: 'Segurança Avançada',
      description: 'Seus dados financeiros protegidos com criptografia de ponta a ponta e padrões de segurança bancários.'
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-autofinance-blue" />,
      title: 'Análises Personalizadas',
      description: 'Visualize seus hábitos de consumo com gráficos intuitivos e receba sugestões para economizar mais.'
    },
    {
      icon: <CreditCard className="h-8 w-8 text-autofinance-blue" />,
      title: 'Integração Bancária',
      description: 'Conecte suas contas bancárias e cartões para ter uma visão completa das suas finanças pessoais.'
    },
    {
      icon: <AlertCircle className="h-8 w-8 text-autofinance-blue" />,
      title: 'Alertas Inteligentes',
      description: 'Receba notificações sobre contas próximas ao vencimento, gastos incomuns e oportunidades de economia.'
    },
    {
      icon: <Settings className="h-8 w-8 text-autofinance-blue" />,
      title: 'Personalização Total',
      description: 'Adapte categorias, metas financeiras e relatórios de acordo com suas necessidades específicas.'
    }
  ];

  return (
    <section id="features" className="section bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="bg-autofinance-blue bg-opacity-10 text-autofinance-blue px-4 py-2 rounded-full text-sm font-medium">Recursos</span>
          <h2 className="section-title mt-4">Simplifique suas Finanças Pessoais</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Nossas ferramentas ajudam você a gerenciar seu dinheiro de forma mais inteligente, economizar mais e alcançar seus objetivos financeiros.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="bg-autofinance-blue bg-opacity-10 rounded-full p-3 inline-flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gradient-to-r from-autofinance-blue to-autofinance-blue-dark rounded-2xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Pronto para transformar sua vida financeira?</h3>
              <p className="text-white text-opacity-90 mb-6">Junte-se a milhares de pessoas que já mudaram sua relação com o dinheiro usando nossa plataforma.</p>
              <Link to="/whatsapp-demo">
                <button className="bg-white text-autofinance-blue font-medium py-3 px-6 rounded-lg hover:shadow-lg transition-all">
                  Comece Hoje
                </button>
              </Link>
            </div>
            <div className="w-full md:w-1/2 bg-autofinance-blue-dark flex items-center justify-center p-8 md:p-12">
              <div className="relative w-full max-w-sm">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold">Economia Mensal</h4>
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Tempo Economizado</p>
                        <p className="font-bold">5 hrs/mês</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Gastos Reduzidos</p>
                        <p className="font-bold">15%</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Economia</p>
                        <p className="font-bold">R$350/mês</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Metas Alcançadas</p>
                        <p className="font-bold">3/4</p>
                      </div>
                    </div>
                    <div className="w-full bg-autofinance-gray h-2 rounded-full">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-sm text-gray-500 text-right">75% da meta anual</p>
                  </div>
                </div>
                {/* Decoration elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full opacity-60"></div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-autofinance-blue rounded-full opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;


import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Carlos Silva',
      role: 'Professor',
      content: 'A AutoFinance transformou completamente a forma como administro minhas finanças pessoais. As ferramentas de automação me ajudaram a economizar várias horas por mês no controle dos meus gastos.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      name: 'Mariana Costa',
      role: 'Profissional Autônoma',
      content: 'Como autônoma, controlar minhas finanças sempre foi um desafio. Com a AutoFinance, ganhei visibilidade completa sobre meus gastos e receitas, o que melhorou muito meu controle financeiro.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      name: 'Rafael Mendes',
      role: 'Analista de TI',
      content: 'Os recursos de análise e relatórios me deram insights que eu nunca tive antes. Consegui identificar vários gastos desnecessários e já comecei a economizar para realizar meus sonhos.',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    }
  ];

  return (
    <section id="testimonials" className="section bg-autofinance-gray-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="bg-autofinance-blue bg-opacity-10 text-autofinance-blue px-4 py-2 rounded-full text-sm font-medium">Depoimentos</span>
          <h2 className="section-title mt-4">O que nossos usuários dizem</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Descubra como a AutoFinance tem ajudado pessoas como você a organizarem suas finanças pessoais.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-6 card-shadow">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-6">Junte-se a mais de 10.000 usuários que transformaram sua gestão financeira pessoal</p>
          <button className="bg-autofinance-blue hover:bg-autofinance-blue-dark text-white font-medium py-3 px-8 rounded-lg transition-all">
            Inicie seu Período Gratuito
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

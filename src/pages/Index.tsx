
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import ChatInterface from '@/components/ChatInterface';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <section className="bg-autofinance-gray-light py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Inteligência Artificial para suas Finanças
            </h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
              Nosso assistente de IA torna o gerenciamento financeiro simples e eficiente.
              Pergunte sobre seus gastos, receba insights e acompanhe suas metas.
            </p>
            <ChatInterface />
          </div>
        </section>
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

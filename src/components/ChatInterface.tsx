
import React from 'react';
import { MessageCircle } from 'lucide-react';

const ChatInterface = () => {
  return (
    <div className="relative max-w-2xl mx-auto my-12 rounded-2xl overflow-hidden shadow-xl bg-[#1A1F2C] p-6">
      {/* Window Controls */}
      <div className="absolute top-4 left-4 flex gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      
      {/* Chat Messages */}
      <div className="mt-8 space-y-4">
        {/* AutoFinance Message */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div className="bg-gray-800 rounded-2xl p-4 text-white max-w-[80%]">
            <p>Olá! Sou o AutoFinance. Como posso ajudar com suas finanças hoje?</p>
          </div>
        </div>
        
        {/* User Message */}
        <div className="flex justify-end gap-3">
          <div className="bg-blue-500 rounded-2xl p-4 text-white max-w-[80%]">
            <p>Quanto gastei com alimentação este mês?</p>
          </div>
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
            U
          </div>
        </div>
        
        {/* AutoFinance Response */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div className="bg-gray-800 rounded-2xl p-4 text-white max-w-[80%]">
            <p>Você gastou R$ 847,50 com alimentação este mês. Isso representa 23% do seu orçamento mensal e está dentro da sua meta!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

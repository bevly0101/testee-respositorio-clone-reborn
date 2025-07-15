
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Adicionado useNavigate
import { Check, ArrowLeft, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Plans = () => {
  const navigate = useNavigate(); // Hook para navegação

  const handleSubscribe = (planName: string) => {
    toast({
      title: "Plano selecionado",
      description: `Você selecionou o plano ${planName}. Obrigado por escolher a AutoFinance!`,
      duration: 5000,
    });
    navigate('/register'); // Redirecionar para a página de cadastro
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-autofinance-blue text-white p-4">
        <div className="container mx-auto flex items-center">
          <Link to="/"> {/* Alterado de /whatsapp-demo para / */}
            <Button variant="ghost" className="p-1 text-white hover:bg-autofinance-blue-dark">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold ml-2">Planos de Assinatura</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Escolha o plano ideal para você</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Desbloqueie recursos avançados de gerenciamento financeiro e obtenha insights personalizados para controlar melhor seu dinheiro.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800">Básico</h3>
              <div className="mt-4 flex items-end">
                <span className="text-4xl font-bold">Grátis</span>
              </div>
              <p className="mt-4 text-gray-500 text-sm">Ideal para quem está começando a controlar suas finanças.</p>
            </div>
            <div className="border-t border-gray-100 px-6 py-4">
              <ul className="space-y-3">
                <li className="flex items-center text-sm">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Registro de despesas diárias</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Resumos semanais</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Até 5 categorias de gastos</span>
                </li>
              </ul>
            </div>
            <div className="p-6 pt-0">
              <Button 
                className="w-full bg-autofinance-blue hover:bg-autofinance-blue-dark"
                onClick={() => handleSubscribe("Básico")}
              >
                Começar Agora
              </Button>
            </div>
          </div>

          {/* Standard Plan */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 relative">
            <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              POPULAR
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800">Standard</h3>
              <div className="mt-4 flex items-end">
                <span className="text-4xl font-bold">R$19,90</span>
                <span className="text-gray-500 ml-1">/mês</span>
              </div>
              <p className="mt-4 text-gray-500 text-sm">Para quem quer mais controle das finanças pessoais.</p>
            </div>
            <div className="border-t border-gray-100 px-6 py-4">
              <ul className="space-y-3">
                <li className="flex items-center text-sm">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Todas as funcionalidades do plano Básico</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Lembretes personalizados</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Até 20 categorias de gastos</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Análises de consumo detalhadas</span>
                </li>
              </ul>
            </div>
            <div className="p-6 pt-0">
              <Button 
                className="w-full bg-autofinance-blue hover:bg-autofinance-blue-dark"
                onClick={() => handleSubscribe("Standard")}
              >
                Assinar Agora
              </Button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 relative">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800">Premium</h3>
              <div className="mt-4 flex items-end">
                <span className="text-4xl font-bold">R$39,90</span>
                <span className="text-gray-500 ml-1">/mês</span>
              </div>
              <p className="mt-4 text-gray-500 text-sm">Para quem quer uma gestão completa das finanças.</p>
            </div>
            <div className="border-t border-gray-100 px-6 py-4">
              <ul className="space-y-3">
                <li className="flex items-center text-sm">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Todas as funcionalidades do plano Standard</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Integração com bancos</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Planejamento financeiro</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Consultoria financeira (1x por mês)</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Categorias ilimitadas</span>
                </li>
              </ul>
            </div>
            <div className="p-6 pt-0">
              <Button 
                className="w-full bg-autofinance-blue hover:bg-autofinance-blue-dark"
                onClick={() => handleSubscribe("Premium")}
              >
                Assinar Agora
              </Button>
            </div>
          </div>

          {/* Family Plan */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800">Família</h3>
              <div className="mt-4 flex items-end">
                <span className="text-4xl font-bold">R$59,90</span>
                <span className="text-gray-500 ml-1">/mês</span>
              </div>
              <p className="mt-4 text-gray-500 text-sm">Para famílias que querem controlar finanças juntos.</p>
            </div>
            <div className="border-t border-gray-100 px-6 py-4">
              <ul className="space-y-3">
                <li className="flex items-center text-sm">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Todas as funcionalidades do Premium</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Até 5 usuários</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Controle parental</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Metas familiares compartilhadas</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Consultoria financeira familiar</span>
                </li>
              </ul>
            </div>
            <div className="p-6 pt-0">
              <Button 
                className="w-full bg-autofinance-blue hover:bg-autofinance-blue-dark"
                onClick={() => handleSubscribe("Família")}
              >
                Assinar Agora
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-4">Ainda com dúvidas?</h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Fale com nosso time de suporte para tirar suas dúvidas e descobrir qual o melhor plano para você.
          </p>
          <Button className="bg-gray-800 hover:bg-gray-900" size="lg">
            Entre em contato
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">AutoFinance</h4>
              <p className="text-gray-400">
                Soluções inteligentes para o gerenciamento das suas finanças pessoais.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/whatsapp-demo" className="text-gray-400 hover:text-white">Demonstração</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Sobre Nós</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <p className="text-gray-400">
                contato@autofinance.com<br />
                +55 11 99999-9999
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2023 AutoFinance. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Plans;

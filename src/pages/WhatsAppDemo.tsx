
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Paperclip, Mic, MoreVertical, Phone, Video, Bot, BarChart2, PieChart, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { BarChart, PieChart as RechartsPie, Tooltip, Cell, Bar, Pie, ResponsiveContainer } from 'recharts';

// Define proper message type to include isAnalyzing and optional buttons
interface Message {
  text: string;
  sender: 'user' | 'bot';
  time: string;
  isAnalyzing?: boolean;
  buttons?: {
    text: string;
    action: string;
  }[];
  chart?: boolean;
  chartType?: 'bar' | 'pie';
}

// Define expense type for tracking expenses
interface Expense {
  description: string;
  amount: number;
  category: string;
  emoji?: string;
  day?: string;
}

const WhatsAppDemo = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: 'Olá! 👋\nSou Isis, sua assistente pessoal de finanças aqui na AT.\nPra te mostrar como posso te ajudar, vamos começar com gastos cotidianos. Tudo bem?', 
      sender: 'bot', 
      time: '10:30 AM',
      buttons: [
        { text: 'Sim, bora!', action: 'start' },
        { text: 'Não entendi, me explica melhor', action: 'explain' }
      ]
    },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState('initial');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showInputField, setShowInputField] = useState(false);
  const [inputPlaceholder, setInputPlaceholder] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Days of the week
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const gastos = [30, 120, 25.80, 8, 62];
  const cores = ['#007acc', '#3399ff', '#66b3ff', '#99ccff', '#cce6ff'];
  
  // Chart data
  const weeklyData = [
    { name: 'Seg', value: 30, category: 'Almoço', fill: '#007acc' },
    { name: 'Ter', value: 120, category: 'Compras', fill: '#3399ff' },
    { name: 'Qua', value: 25.8, category: 'Transporte', fill: '#66b3ff' },
    { name: 'Qui', value: 8, category: 'Café', fill: '#99ccff' },
    { name: 'Sex', value: 62, category: 'Recarga celular', fill: '#cce6ff' },
  ];
  
  const pieData = [
    { name: 'Almoço', value: 30, fill: '#007acc' },
    { name: 'Compras', value: 120, fill: '#3399ff' },
    { name: 'Transporte', value: 25.8, fill: '#66b3ff' },
    { name: 'Café', value: 8, fill: '#99ccff' },
    { name: 'Recarga celular', value: 62, fill: '#cce6ff' },
  ];

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    // Add user message
    const userMsg: Message = { text: message, sender: 'user', time: getCurrentTime() };
    setMessages(prev => [...prev, userMsg]);
    
    processUserInput(message);
    setMessage('');
  };

  const processUserInput = (input: string) => {
    setIsAnalyzing(true);
    setMessages(prev => [...prev, { 
      text: 'Analisando sua resposta...', 
      sender: 'bot', 
      time: getCurrentTime(),
      isAnalyzing: true 
    }]);

    setTimeout(() => {
      // Remove analyzing message
      setMessages(prev => prev.filter(msg => !msg.isAnalyzing));
      setIsAnalyzing(false);

      // Process based on the current step
      if (currentStep === 'expense-entry') {
        handleExpenseInput(input);
      } else if (currentStep === 'reminder-time') {
        handleReminderTimeInput(input);
      } else {
        // This will be for other conversational inputs not related to expenses
        console.log("Processing other input:", input);
      }
    }, 1000);
  };

  const handleReminderTimeInput = (input: string) => {
    const reminderTime = input.trim();
    
    setMessages(prev => [...prev, { 
      text: `Pronto! Todos os dias às ${reminderTime} eu vou te lembrar de registrar os seus gastos.\nQuer que eu envie um resumo do dia também?`, 
      sender: 'bot', 
      time: getCurrentTime(),
      buttons: [
        { text: 'Sim, envie o resumo', action: 'send-summary' },
        { text: 'Não precisa por enquanto', action: 'finish-setup' }
      ]
    }]);

    setShowInputField(false);
  };

  const handleExpenseInput = (input: string) => {
    // Filter out words that shouldn't be considered as items
    const wordsToIgnore = ['gastei', 'gasto', 'gastou', 'gastando', 'gastar', 'gaste'];
    let processedInput = input;
    
    // Remove the words to ignore from the input
    wordsToIgnore.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      processedInput = processedInput.replace(regex, '');
    });
    
    // Extract description and amount from the expense
    const regex = /([^\d]+)(R?\$?\s?[\d,.]+)/i;
    const match = processedInput.match(regex);
    
    let description = 'Gasto';
    let amount = 0;
    
    if (match && match.length >= 3) {
      description = match[1].trim();
      // Extract only numbers and decimals from the amount part
      const amountStr = match[2].replace(/[^\d,.]/g, '').replace(',', '.');
      amount = parseFloat(amountStr);
    } else {
      // If regex doesn't match, make a best effort extraction
      const words = processedInput.split(' ');
      const amountIndex = words.findIndex(w => /\d/.test(w));
      
      if (amountIndex >= 0) {
        description = words.slice(0, amountIndex).join(' ');
        amount = parseFloat(words[amountIndex].replace(/[^\d,.]/g, '').replace(',', '.'));
      }
    }
    
    // If we couldn't extract, use defaults
    if (!description) description = 'Item';
    if (isNaN(amount)) amount = 0;
    
    // Determine emoji based on description
    let emoji = '🧾';
    if (description.toLowerCase().includes('café') || description.toLowerCase().includes('cafe')) emoji = '☕';
    else if (description.toLowerCase().includes('almoço') || description.toLowerCase().includes('almoco')) emoji = '🍽️';
    else if (description.toLowerCase().includes('uber') || description.toLowerCase().includes('transporte')) emoji = '🚕';
    else if (description.toLowerCase().includes('compra')) emoji = '🛍️';
    else if (description.toLowerCase().includes('celular')) emoji = '📱';
    
    // Add the expense to our list
    const newExpense: Expense = {
      description,
      amount,
      category: 'geral',
      emoji
    };
    
    setExpenses(prev => [...prev, newExpense]);

    // Send confirmation message
    setMessages(prev => [...prev, { 
      text: `✅ Anotado!\n"${description} R$${amount.toFixed(2)}" foi registrado.\nQuer adicionar mais alguma coisa?`, 
      sender: 'bot', 
      time: getCurrentTime(),
      buttons: [
        { text: 'Sim', action: 'add-more' },
        { text: 'Não, ver resumo', action: 'show-summary' }
      ]
    }]);

    setShowInputField(false);
  };

  const handleButtonClick = (action: string) => {
    switch (action) {
      case 'start':
        setMessages(prev => [...prev, { 
          text: 'Sim, bora!', 
          sender: 'user', 
          time: getCurrentTime() 
        }]);
        
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: 'Legal! 😄\nVocê pode me contar o que gastou hoje, e eu registro pra você. OBS: não se preocupa em escrever errado ou colocar $.\nExemplo: "Café R$8,50" ou "Uber R$22"', 
            sender: 'bot', 
            time: getCurrentTime() 
          }]);
          setCurrentStep('expense-entry');
          setShowInputField(true);
          setInputPlaceholder('Exemplo: "Café R$8,50" ou "Uber R$22"');
        }, 700);
        break;
        
      case 'explain':
        setMessages(prev => [...prev, { 
          text: 'Não entendi, me explica melhor', 
          sender: 'user', 
          time: getCurrentTime() 
        }]);
        
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: 'Claro! 👩‍🏫\nEu sou uma assistente virtual que te ajuda a controlar suas finanças. Você pode me contar seus gastos diários e eu organizo tudo para você ter uma visão clara das suas finanças.\n\nVamos experimentar? É só me falar o que você gastou hoje!', 
            sender: 'bot', 
            time: getCurrentTime(),
            buttons: [
              { text: 'Sim, vamos começar', action: 'start' }
            ]
          }]);
          setShowInputField(false);
        }, 700);
        break;
        
      case 'add-more':
        setMessages(prev => [...prev, { 
          text: 'Sim', 
          sender: 'user', 
          time: getCurrentTime() 
        }]);
        
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: 'Ótimo! O que mais você gastou hoje?', 
            sender: 'bot', 
            time: getCurrentTime() 
          }]);
          setCurrentStep('expense-entry');
          setShowInputField(true);
        }, 700);
        break;
        
      case 'show-summary':
        setMessages(prev => [...prev, { 
          text: 'Não, ver resumo', 
          sender: 'user', 
          time: getCurrentTime() 
        }]);
        
        showDailySummary();
        break;
        
      case 'show-alerts':
        setMessages(prev => [...prev, { 
          text: 'Sim, me avise', 
          sender: 'user', 
          time: getCurrentTime() 
        }]);
        
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: 'Perfeito! Vou te avisar quando você estiver perto do seu limite diário de gastos. Agora, vamos ver como foi sua semana?', 
            sender: 'bot', 
            time: getCurrentTime(),
            buttons: [
              { text: 'Sim, ver resumo da semana', action: 'show-week' }
            ]
          }]);
          setShowInputField(false);
        }, 700);
        break;
        
      case 'show-week':
        setMessages(prev => [...prev, { 
          text: 'Sim, ver resumo da semana', 
          sender: 'user', 
          time: getCurrentTime() 
        }]);
        
        showWeeklySummary();
        break;
        
      case 'show-bar-chart':
        setMessages(prev => [...prev, { 
          text: 'Gráfico de Barras', 
          sender: 'user', 
          time: getCurrentTime() 
        }]);
        
        showBarChart();
        break;

      case 'show-pie-chart':
        setMessages(prev => [...prev, { 
          text: 'Gráfico de Pizza', 
          sender: 'user', 
          time: getCurrentTime() 
        }]);
        
        showPieChart();
        break;

      case 'set-weekly-limit':
        setMessages(prev => [...prev, { 
          text: 'Estipular limite semanal', 
          sender: 'user', 
          time: getCurrentTime() 
        }]);
        
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: 'Perfeito! Vamos definir um limite de gastos para sua semana.\n\n📝 Quanto você quer gastar, no máximo, por semana?', 
            sender: 'bot', 
            time: getCurrentTime(),
            buttons: [
              { text: 'R$200', action: 'limit-200' },
              { text: 'R$400', action: 'limit-400' },
              { text: 'R$600', action: 'limit-600' }
            ]
          }]);
          setShowInputField(false);
        }, 700);
        break;

      case 'create-reminder':
        setMessages(prev => [...prev, { 
          text: 'Criar lembrete de gasto', 
          sender: 'user', 
          time: getCurrentTime() 
        }]);
        
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: 'Claro! Posso te lembrar de anotar seus gastos nos horários que preferir ou horário a pagar contas e olhar investimentos.\n\n🕒 Qual horário do dia você gostaria de ser lembrado?', 
            sender: 'bot', 
            time: getCurrentTime(),
            buttons: [
              { text: '9h', action: 'reminder-9h' },
              { text: '13h', action: 'reminder-13h' },
              { text: '20h', action: 'reminder-20h' }
            ]
          }]);
          setShowInputField(false);
        }, 700);
        break;

      case 'reminder-9h':
      case 'reminder-13h':
      case 'reminder-20h':
        const hour = action.replace('reminder-', '');
        setMessages(prev => [...prev, { 
          text: hour, 
          sender: 'user', 
          time: getCurrentTime() 
        }]);
        
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: `Pronto! Todos os dias às ${hour} eu vou te lembrar de registrar os seus gastos.\nQuer que eu envie um resumo do dia também?`, 
            sender: 'bot', 
            time: getCurrentTime(),
            buttons: [
              { text: 'Sim, envie o resumo', action: 'send-summary' },
              { text: 'Não precisa por enquanto', action: 'finish-setup' }
            ]
          }]);
        }, 700);
        break;

      case 'send-summary':
        setMessages(prev => [...prev, { 
          text: 'Sim, envie o resumo', 
          sender: 'user', 
          time: getCurrentTime() 
        }]);
        
        finalizeSetup();
        break;

      case 'finish-setup':
        setMessages(prev => [...prev, { 
          text: 'Não precisa por enquanto', 
          sender: 'user', 
          time: getCurrentTime() 
        }]);
        
        finalizeSetup();
        break;

      case 'limit-200':
      case 'limit-400': 
      case 'limit-600':
        const limit = action.replace('limit-', '');
        setMessages(prev => [...prev, { 
          text: `R$${limit}`, 
          sender: 'user', 
          time: getCurrentTime() 
        }]);
        
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: `Limite de R$${limit} definido com sucesso!\nSempre que você estiver perto de ultrapassar esse valor, eu vou te avisar aqui no WhatsApp.\nQuer configurar lembretes de gastos também?`, 
            sender: 'bot', 
            time: getCurrentTime(),
            buttons: [
              { text: 'Sim, quero criar lembretes', action: 'create-reminder' }
            ]
          }]);
        }, 700);
        break;

      case 'go-to-plans':
        setMessages(prev => [...prev, { 
          text: 'Ver planos disponíveis', 
          sender: 'user', 
          time: getCurrentTime() 
        }]);
        
        // Use window.location.href for redirect
        window.location.href = '/plans';
        break;
    }
  };

  const showDailySummary = () => {
    // Calculate total expenses
    const total = expenses.length > 0 
      ? expenses.reduce((sum, exp) => sum + exp.amount, 0)
      : 38.50; // Default mock data if no expenses added
    
    // If no expenses added, use mock data
    const summaryExpenses = expenses.length > 0 
      ? expenses 
      : [
          { description: 'Café', amount: 8.50, emoji: '☕' },
          { description: 'Almoço', amount: 30, emoji: '🍽️' }
        ];
    
    // Create the summary text
    let summaryText = `📅 Hoje você gastou R$${total.toFixed(2)} até agora:\n\n`;
    summaryExpenses.forEach(exp => {
      summaryText += `${exp.emoji} ${exp.description} R$${exp.amount.toFixed(2)}\n\n`;
    });
    summaryText += "Continue assim e eu te ajudo a manter tudo em dia! 🧾💡\nQuer que eu te avise quando você estiver perto do limite diário?";
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: summaryText, 
        sender: 'bot', 
        time: getCurrentTime(),
        buttons: [
          { text: 'Sim, me avise', action: 'show-alerts' },
          { text: 'Não, ver resumo da semana', action: 'show-week' }
        ]
      }]);
      setShowInputField(false);
    }, 700);
  };

  const showWeeklySummary = () => {
    // Create the weekly summary text
    const summaryText = `📆 Nesta semana você gastou R$245,80 até agora:\n\n` +
                       `🍔 Segunda: Almoço R$30\n\n` +
                       `🛍️ Terça: Compras R$120\n\n` +
                       `🚌 Quarta: Transporte R$25,80\n\n` +
                       `☕ Quinta: Café R$8\n\n` +
                       `📱 Sexta: Recarga celular R$62\n\n` +
                       `Que tipo de gráfico você prefere para visualizar seus gastos?`;
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: summaryText, 
        sender: 'bot', 
        time: getCurrentTime(),
        buttons: [
          { text: 'Gráfico de Barras', action: 'show-bar-chart' },
          { text: 'Gráfico de Pizza', action: 'show-pie-chart' }
        ]
      }]);
      setShowInputField(false);
    }, 700);
  };

  const showBarChart = () => {
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: 'Aqui está o gráfico de barras dos seus gastos da semana:', 
        sender: 'bot', 
        time: getCurrentTime(),
        chart: true,
        chartType: 'bar'
      }]);
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: 'Eu também posso te colocar lembretes e estipular limites de gastos para ajudar no seu controle financeiro.\n\nVocê quer que eu configure um limite semanal de gastos ou lembretes personalizados para te avisar quando estiver perto de ultrapassar seu orçamento?', 
          sender: 'bot', 
          time: getCurrentTime(),
          buttons: [
            { text: 'Estipular limite semanal', action: 'set-weekly-limit' },
            { text: 'Criar lembrete de gasto', action: 'create-reminder' }
          ]
        }]);
      }, 1500);
      
      // Toast to show the analysis
      toast({
        title: "Análise de Gastos",
        description: "Seus maiores gastos foram com Compras (49%) e Recarga de celular (25%).",
        duration: 5000,
      });
    }, 700);
  };

  const showPieChart = () => {
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: 'Aqui está o gráfico de pizza dos seus gastos da semana:', 
        sender: 'bot', 
        time: getCurrentTime(),
        chart: true,
        chartType: 'pie'
      }]);
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: 'Eu também posso te colocar lembretes e estipular limites de gastos para ajudar no seu controle financeiro.\n\nVocê quer que eu configure um limite semanal de gastos ou lembretes personalizados para te avisar quando estiver perto de ultrapassar seu orçamento?', 
          sender: 'bot', 
          time: getCurrentTime(),
          buttons: [
            { text: 'Estipular limite semanal', action: 'set-weekly-limit' },
            { text: 'Criar lembrete de gasto', action: 'create-reminder' }
          ]
        }]);
      }, 1500);
      
      // Toast to show the analysis
      toast({
        title: "Análise de Gastos",
        description: "Seus maiores gastos foram com Compras (49%) e Recarga de celular (25%).",
        duration: 5000,
      });
    }, 700);
  };

  const finalizeSetup = () => {
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: 'Legal, fico feliz em te mostrar como posso facilitar sua vida financeira! 😄\n\nAgora que você já viu um pouco do que eu posso fazer, que tal desbloquear seu **Plano gratuito**?', 
        sender: 'bot', 
        time: getCurrentTime(),
        buttons: [
          { text: 'Ver planos disponíveis', action: 'go-to-plans' }
        ]
      }]);
    }, 700);
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper function for chart rendering
  const renderChart = (type: 'bar' | 'pie') => {
    if (type === 'bar') {
      return (
        <ChartContainer className="h-40 sm:h-48 max-w-full overflow-hidden" config={{}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value">
                {weeklyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      );
    } else {
      return (
        <ChartContainer className="h-40 sm:h-48 max-w-full overflow-hidden" config={{}}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPie data={pieData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <Tooltip />
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} label />
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </RechartsPie>
          </ResponsiveContainer>
        </ChartContainer>
      );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-autofinance-blue text-white p-4 flex items-center">
        <Link to="/">
          <Button variant="ghost" className="p-1 text-white hover:bg-autofinance-blue-dark">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div className="flex items-center ml-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <img 
              src="/lovable-uploads/d26be550-b458-42d4-82c9-9cc2a23b1720.png" 
              alt="AutoFinance" 
              className="h-6 w-6 filter brightness-0 invert"
            />
          </div>
          <div className="ml-3">
            <h3 className="font-medium">AutoFinance Assistant</h3>
            <p className="text-xs opacity-80">Online</p>
          </div>
        </div>
        <div className="ml-auto flex space-x-4">
          <Button variant="ghost" className="p-1 text-white hover:bg-autofinance-blue-dark">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="p-1 text-white hover:bg-autofinance-blue-dark">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="p-1 text-white hover:bg-autofinance-blue-dark">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#e5ded8]">
        <div className="max-w-lg mx-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                msg.sender === 'user' 
                  ? 'bg-[#d9fdd3] text-gray-800' 
                  : 'bg-white text-gray-800'
              } ${msg.isAnalyzing ? 'animate-pulse' : ''}`}>
                <p className="whitespace-pre-line">{msg.text}</p>
                
                {msg.chart && (
                  <div className="mt-4 bg-white p-3 rounded-lg border border-gray-200">
                    <h4 className="text-center font-medium mb-2">Gastos da Semana</h4>
                    {msg.chartType === 'bar' ? renderChart('bar') : renderChart('pie')}
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
                      <div>Total: R$245,80</div>
                      <div className="flex items-center">
                        <BarChart2 className="h-3 w-3 mr-1" />
                        <span>Relatório completo</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {msg.buttons && msg.buttons.length > 0 && (
                  <div className="mt-3 flex flex-col space-y-2">
                    {msg.buttons.map((btn, btnIndex) => (
                      <Button 
                        key={btnIndex} 
                        variant="outline" 
                        className="bg-autofinance-blue text-white hover:bg-autofinance-blue-dark border-none w-full justify-center py-2"
                        onClick={() => handleButtonClick(btn.action)}
                      >
                        {btn.text}
                      </Button>
                    ))}
                  </div>
                )}
                
                <span className="text-xs text-gray-500 text-right block mt-1">{msg.time}</span>
                {msg.isAnalyzing && (
                  <div className="flex items-center mt-1">
                    <Bot className="h-3 w-3 mr-1 text-autofinance-blue" />
                    <span className="text-xs text-autofinance-blue">IA analisando...</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      {showInputField && (
        <div className="p-3 bg-gray-200">
          <div className="flex items-center bg-white rounded-full px-4 py-2">
            <Button variant="ghost" className="p-1 text-gray-500 hover:bg-gray-100 rounded-full">
              <Paperclip className="h-5 w-5" />
            </Button>
            <textarea
              className="flex-1 border-none focus:ring-0 resize-none max-h-32 bg-transparent px-2 py-1"
              placeholder={inputPlaceholder || 'Digite sua mensagem...'}
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <Button 
              variant="ghost" 
              className="p-1 text-autofinance-blue hover:bg-gray-100 rounded-full"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              {message.trim() ? <Send className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppDemo;

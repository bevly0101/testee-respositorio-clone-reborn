
import { useToast } from "@/components/ui/use-toast";
import { Archive } from '@/components/dashboard/types';

export const useDashboardHandlers = (
  viewingArchive: Archive | null,
  setViewingArchive: (archive: Archive | null) => void,
  user: any,
  fetchData: () => void
) => {
  const { toast } = useToast();

  const handleAddTransaction = async () => {
    if (viewingArchive) {
      toast({ 
        title: "Ação não disponível", 
        description: "Não é possível adicionar transações durante a visualização de arquivo.", 
        variant: "destructive" 
      });
      return;
    }

    if (!user || !user.id) {
      toast({ title: "Erro", description: "Você precisa estar logado para adicionar transações.", variant: "destructive" });
      return;
    }

    return true; // Permitir abrir dialog
  };

  const handleTransactionAdded = () => {
    fetchData(); // Recarregar dados após adicionar transação
  };

  const handleFilterByDate = () => {
    toast({
      title: "Em breve!",
      description: "O filtro por data estará disponível em breve.",
    });
  };

  const handleConnectWhatsApp = (whatsappNumber: string) => {
    toast({
      title: "Conexão WhatsApp",
      description: "A funcionalidade de conexão com WhatsApp e geração de QR Code será implementada em breve. Número digitado: " + whatsappNumber,
    });
  };

  const handleViewArchive = (archive: Archive) => {
    setViewingArchive(archive);
    toast({
      title: "Visualizando arquivo",
      description: `Agora você está visualizando dados do período ${archive.period_start} - ${archive.period_end}`,
    });
  };

  const handleExitArchiveView = () => {
    setViewingArchive(null);
    toast({
      title: "Voltando aos dados atuais",
      description: "Agora você está visualizando os dados atuais do painel.",
    });
  };

  return {
    handleAddTransaction,
    handleTransactionAdded,
    handleFilterByDate,
    handleConnectWhatsApp,
    handleViewArchive,
    handleExitArchiveView
  };
};

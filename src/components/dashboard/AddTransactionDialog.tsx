
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ToastFunction } from './types';

interface AddTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded: () => void;
  toast: ToastFunction;
}

const expenseCategories = [
  'Mercado', 'Transporte', 'Assinatura', 'Diversão', 'Comida', 'Educação'
];

const incomeCategories = [
  'Salário', 'Freelance', 'Investimento', 'Venda', 'Presente', 'Outros'
];

const paymentTypes = [
  'Cédula', 'PIX', 'Débito', 'Crédito'
];

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({
  isOpen,
  onClose,
  onTransactionAdded,
  toast
}) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [step, setStep] = useState<'type' | 'details'>('type');
  const [transactionType, setTransactionType] = useState<'entrada' | 'saída' | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    tipo: '',
    tipo_especificado: ''
  });
  const [loading, setLoading] = useState(false);

  const handleClose = useCallback(() => {
    setStep('type');
    setTransactionType(null);
    setFormData({ nome: '', valor: '', tipo: '', tipo_especificado: '' });
    onClose();
  }, [onClose]);

  const handleTypeSelect = useCallback((type: 'entrada' | 'saída') => {
    setTransactionType(type);
    setStep('details');
  }, []);

  const handleInputChange = useCallback((field: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleSelectChange = useCallback((field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!user?.id || !transactionType) return;

    setLoading(true);
    try {
      const table = transactionType === 'entrada' ? 'entradas' : 'gastos';
      
      const { error } = await supabase
        .from(table)
        .insert({
          user_id: user.id,
          nome: formData.nome,
          valor: parseFloat(formData.valor),
          tipo: formData.tipo,
          tipo_especificado: formData.tipo_especificado || null
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: `${transactionType === 'entrada' ? 'Entrada' : 'Gasto'} adicionado com sucesso.`,
      });

      onTransactionAdded();
      handleClose();
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar transação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, transactionType, formData, toast, onTransactionAdded, handleClose]);

  const renderTypeSelection = () => (
    <div className="space-y-4 p-3 sm:p-4">
      <div className="text-center">
        <h3 className="text-base sm:text-lg font-semibold mb-2">Que tipo de transação você quer adicionar?</h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">Selecione se é uma entrada ou saída de dinheiro</p>
      </div>
      
      <div className="space-y-3">
        <Button
          onClick={() => handleTypeSelect('entrada')}
          className="w-full h-10 sm:h-12 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
          size="lg"
        >
          💰 Entrada (Receita)
        </Button>
        <Button
          onClick={() => handleTypeSelect('saída')}
          className="w-full h-10 sm:h-12 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base"
          size="lg"
        >
          💸 Saída (Gasto)
        </Button>
      </div>
    </div>
  );

  const renderDetailsForm = () => (
    <div className="space-y-4 p-3 sm:p-4">
      <div className="space-y-3 sm:space-y-4">
        <div>
          <Label htmlFor="nome" className="text-sm">Descrição</Label>
          <Input
            id="nome"
            placeholder="Ex: Compra do supermercado"
            value={formData.nome}
            onChange={handleInputChange('nome')}
            className="mt-1 h-9 sm:h-10 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="valor" className="text-sm">Valor (R$)</Label>
          <Input
            id="valor"
            type="number"
            step="0.01"
            placeholder="0,00"
            value={formData.valor}
            onChange={handleInputChange('valor')}
            className="mt-1 h-9 sm:h-10 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="categoria" className="text-sm">
            {transactionType === 'entrada' ? 'Categoria' : 'Categoria'}
          </Label>
          <Select 
            value={formData.tipo} 
            onValueChange={handleSelectChange('tipo')}
          >
            <SelectTrigger className="mt-1 h-9 sm:h-10 text-sm">
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {(transactionType === 'entrada' ? incomeCategories : expenseCategories).map((item) => (
                <SelectItem key={item} value={item} className="text-sm">{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="tipo_especificado" className="text-sm">
            {transactionType === 'entrada' ? 'Tipo de Pagamento' : 'Tipo de Pagamento'}
          </Label>
          <Select 
            value={formData.tipo_especificado} 
            onValueChange={handleSelectChange('tipo_especificado')}
          >
            <SelectTrigger className="mt-1 h-9 sm:h-10 text-sm">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {paymentTypes.map((item) => (
                <SelectItem key={item} value={item} className="text-sm">{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex space-x-2 pt-2 sm:pt-4">
        <Button
          variant="outline"
          onClick={() => setStep('type')}
          className="flex-1 h-9 sm:h-10 text-sm"
        >
          Voltar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || !formData.nome || !formData.valor || !formData.tipo}
          className="flex-1 h-9 sm:h-10 text-sm"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={handleClose}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-left px-3 sm:px-4">
            <DrawerTitle className="text-base sm:text-lg">
              {step === 'type' ? 'Nova Transação' : `Nova ${transactionType === 'entrada' ? 'Entrada' : 'Saída'}`}
            </DrawerTitle>
            <DrawerDescription className="text-sm">
              {step === 'type' 
                ? 'Escolha o tipo de transação que deseja adicionar'
                : 'Preencha os detalhes da transação'
              }
            </DrawerDescription>
          </DrawerHeader>
          {step === 'type' ? renderTypeSelection() : renderDetailsForm()}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            {step === 'type' ? 'Nova Transação' : `Nova ${transactionType === 'entrada' ? 'Entrada' : 'Saída'}`}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {step === 'type' 
              ? 'Escolha o tipo de transação que deseja adicionar'
              : 'Preencha os detalhes da transação'
            }
          </DialogDescription>
        </DialogHeader>
        {step === 'type' ? renderTypeSelection() : renderDetailsForm()}
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;

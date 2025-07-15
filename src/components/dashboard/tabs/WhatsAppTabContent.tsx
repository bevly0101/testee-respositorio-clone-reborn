
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Smartphone } from 'lucide-react';

interface WhatsAppTabContentProps {
  whatsappNumber: string;
  setWhatsappNumber: (value: string) => void;
  onConnectWhatsApp: () => void;
}

const WhatsAppTabContent: React.FC<WhatsAppTabContentProps> = ({ whatsappNumber, setWhatsappNumber, onConnectWhatsApp }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conectar WhatsApp</CardTitle>
        <CardDescription>Conecte sua conta do WhatsApp para integrações.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Seu número de WhatsApp
          </label>
          <Input 
            id="whatsappNumber"
            type="tel"
            placeholder="(XX) XXXXX-XXXX"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
          />
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Escaneie o QR Code abaixo com seu WhatsApp:</p>
          <div className="w-48 h-48 bg-gray-200 mx-auto flex items-center justify-center rounded-lg">
            <QrCode className="w-24 h-24 text-gray-400" />
          </div>
          <p className="mt-2 text-xs text-gray-500">A geração do QR Code e a conexão real serão implementadas.</p>
        </div>

        <Button onClick={onConnectWhatsApp} className="w-full">
          <Smartphone className="mr-2 h-4 w-4" />
          Conectar WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
};

export default WhatsAppTabContent;


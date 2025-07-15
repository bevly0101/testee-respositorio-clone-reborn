
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Archive } from './types';

interface ArchiveViewAlertProps {
  viewingArchive: Archive;
  onExitArchiveView: () => void;
}

const ArchiveViewAlert: React.FC<ArchiveViewAlertProps> = ({ viewingArchive, onExitArchiveView }) => {
  return (
    <Alert className="mb-4 sm:mb-6">
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span className="text-sm">
          Visualizando arquivo: {viewingArchive.period_start} - {viewingArchive.period_end}
        </span>
        <Button variant="outline" size="sm" onClick={onExitArchiveView}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar aos dados atuais
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ArchiveViewAlert;

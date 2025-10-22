import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
  onRetry?: () => void;
}

export function ConnectionStatus({ isConnected, error, onRetry }: ConnectionStatusProps) {
  if (isConnected && !error) {
    return (
      <Alert className="mx-4 mb-4 border-green-200 bg-green-50">
        <Wifi className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Conectado al servicio de asistencia IA
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert className="mx-4 mb-4 border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="ml-2 border-red-300 text-red-700 hover:bg-red-100"
              >
                Reintentar
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mx-4 mb-4 border-yellow-200 bg-yellow-50">
      <WifiOff className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        Desconectado del servicio de asistencia IA
      </AlertDescription>
    </Alert>
  );
}



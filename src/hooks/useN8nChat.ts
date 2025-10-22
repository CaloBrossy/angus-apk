import { useState, useCallback, useEffect } from 'react';
import { n8nService, N8nWebhookRequest, N8nWebhookResponse } from '@/services/n8nService';
import { useAuthStore } from '@/stores/authStore';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

export interface UseN8nChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  isConnected: boolean;
  checkConnection: () => Promise<boolean>;
}

export function useN8nChat(): UseN8nChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuthStore();

  // Verificar conexión al inicializar
  const checkConnection = useCallback(async () => {
    try {
      const connected = await n8nService.healthCheck();
      setIsConnected(connected);
      if (!connected) {
        setError('Servicio temporalmente no disponible');
      } else {
        setError(null);
      }
      return connected;
    } catch (err) {
      setIsConnected(false);
      setError('Error de conexión con el servicio');
      return false;
    }
  }, []);

  // Verificar conexión automáticamente al montar el componente
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    // Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Verificar conexión si no está conectado
      if (!isConnected) {
        const connected = await checkConnection();
        if (!connected) {
          throw new Error('El servicio de asistencia está temporalmente no disponible. Por favor, inténtalo de nuevo en unos minutos.');
        }
      }

      // Preparar request para n8n
      const request: N8nWebhookRequest = {
        message,
        userId: user?.id,
        sessionId: `session_${Date.now()}`,
        context: {
          userEmail: user?.email,
          timestamp: new Date().toISOString(),
          source: 'angus-connect-hub',
        },
      };

      // Enviar al webhook de n8n
      const response = await n8nService.sendMessage(request);

      if (response.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(response.error || response.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);

      const errorChatMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `🤖 **Error de conexión**\n\n${errorMessage}\n\n💡 **Posibles soluciones:**\n• El webhook de N8N no está configurado\n• El workflow no está activo\n• Problema temporal del servicio\n• Verifica tu conexión a internet\n\n🔄 **Intenta:**\n• Hacer clic en "Reintentar" arriba\n• Esperar unos minutos y volver a intentar`,
        timestamp: new Date(),
        isError: true,
      };

      setMessages(prev => [...prev, errorChatMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isConnected, user, checkConnection]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    isConnected,
    checkConnection,
  };
}



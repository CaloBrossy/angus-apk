/**
 * Servicio para integrar con n8n webhooks
 * Maneja la comunicación entre el asistente IA y los workflows de n8n
 */

export interface N8nWebhookRequest {
  message: string;
  userId?: string;
  sessionId?: string;
  context?: Record<string, any>;
}

export interface N8nWebhookResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export class N8nService {
  private webhookUrl: string;
  private timeout: number;

  constructor(webhookUrl: string, timeout: number = 30000) {
    this.webhookUrl = webhookUrl;
    this.timeout = timeout;
  }

  /**
   * Envía una consulta al webhook de n8n
   */
  async sendMessage(request: N8nWebhookRequest): Promise<N8nWebhookResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Verificar si la respuesta es JSON válido
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Si no es JSON, intentar leer como texto
        const textResponse = await response.text();
        return {
          success: true,
          message: textResponse || 'Respuesta recibida',
          data: { rawResponse: textResponse },
        };
      }

      try {
        const data = await response.json();
        return {
          success: true,
          message: data.output || data.message || data.response || JSON.stringify(data),
          data: data,
        };
      } catch (jsonError) {
        // Si falla el parsing JSON, leer como texto
        const textResponse = await response.text();
        return {
          success: true,
          message: textResponse || 'Respuesta recibida',
          data: { rawResponse: textResponse },
        };
      }
    } catch (error) {
      console.error('Error al comunicarse con n8n:', error);
      
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            message: 'Tiempo de espera agotado',
            error: 'La consulta tardó demasiado en procesarse',
          };
        }
        
        return {
          success: false,
          message: 'Error de conexión',
          error: error.message,
        };
      }
      
      return {
        success: false,
        message: 'Error desconocido',
        error: 'No se pudo procesar la consulta',
      };
    }
  }


  /**
   * Verifica si el servicio de n8n está disponible
   */
  async healthCheck(): Promise<boolean> {
    try {
      // En lugar de hacer un GET, hacemos un POST con un mensaje de prueba
      const testRequest: N8nWebhookRequest = {
        message: "health_check",
        userId: "system",
        sessionId: "health_check",
        context: {
          userEmail: "system@healthcheck.com",
          timestamp: new Date().toISOString(),
          source: "angus-connect-hub"
        }
      };

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testRequest),
        signal: AbortSignal.timeout(5000),
      });

      // Considerar cualquier respuesta 200-299 como exitosa
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Configuración por defecto - debe ser configurada con las variables de entorno
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://gamay92355.app.n8n.cloud/webhook/angus-assistant';

export const n8nService = new N8nService(N8N_WEBHOOK_URL);



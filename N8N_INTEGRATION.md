# Integración con n8n Webhook

Esta documentación explica cómo configurar y usar la integración del asistente IA con workflows de n8n.

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con la siguiente variable:

```env
VITE_N8N_WEBHOOK_URL=https://gamay92355.app.n8n.cloud/webhook/angus-assistant
```

### 2. Configuración del Webhook en n8n

El webhook de n8n debe estar configurado para recibir requests POST con el siguiente formato:

#### Request Body
```json
{
  "message": "string - El mensaje del usuario",
  "userId": "string - ID del usuario (opcional)",
  "sessionId": "string - ID de sesión (opcional)",
  "context": {
    "userEmail": "string - Email del usuario",
    "timestamp": "string - Timestamp ISO",
    "source": "string - Siempre 'angus-connect-hub'"
  }
}
```

#### Response Body
```json
{
  "message": "string - Respuesta del asistente",
  "data": "any - Datos adicionales (opcional)",
  "success": "boolean - Indica si fue exitoso (opcional)"
}
```

### 3. Ejemplo de Workflow en n8n

**⚠️ IMPORTANTE:** Asegúrate de que el workflow esté **ACTIVO** para que funcione.

#### Configuración del Webhook:
- **Método HTTP**: POST
- **Path**: `angus-assistant`
- **Response Mode**: "Respond to Webhook"

#### Código JavaScript para el nodo "Code":
```javascript
// Procesar el mensaje del usuario
const userMessage = $input.first().json.message;
const userId = $input.first().json.userId;
const context = $input.first().json.context;

// Respuesta simple para probar
let responseMessage = "";

if (userMessage.toLowerCase().includes("hola")) {
  responseMessage = "¡Hola! Soy tu asistente Angus. ¿En qué puedo ayudarte hoy?";
} else if (userMessage.toLowerCase().includes("precio")) {
  responseMessage = "Los precios de toros Angus varían según la genética y calidad. Un toro de calidad promedio puede costar entre $500,000 y $1,500,000 ARS.";
} else if (userMessage.toLowerCase().includes("remate")) {
  responseMessage = "El próximo remate Angus está programado para el 15 de marzo. ¿Te gustaría más información sobre los lotes disponibles?";
} else {
  responseMessage = `He recibido tu mensaje: "${userMessage}". Soy tu asistente especializado en ganadería Angus. ¿Hay algo específico sobre remates, genética o cabañas que te gustaría saber?`;
}

// Respuesta en formato JSON válido
return {
  message: responseMessage,
  data: {
    processedAt: new Date().toISOString(),
    userId: userId,
    originalMessage: userMessage,
    context: context
  },
  success: true
};
```

#### Estructura del Workflow:
1. **Webhook** → Recibe la petición POST
2. **Code** → Procesa el mensaje y genera respuesta
3. **Respond to Webhook** → Envía la respuesta JSON

## Características de la Integración

### 1. Manejo de Errores
- Timeout configurable (30 segundos por defecto)
- Manejo de errores de conexión
- Fallback a mensajes de error amigables

### 2. Estado de Conexión
- Indicador visual del estado de conexión
- Verificación automática de salud del servicio
- Reintentos automáticos

### 3. Contexto del Usuario
- Información del usuario autenticado
- Timestamp de la consulta
- Identificador de sesión

## Uso

Una vez configurado, el asistente funcionará automáticamente:

1. El usuario escribe un mensaje
2. Se envía al webhook de n8n
3. n8n procesa el mensaje según tu workflow
4. La respuesta se muestra en la interfaz

## Debugging

### Verificar Conexión
El componente muestra el estado de conexión en la parte superior del chat.

### Logs del Navegador
Revisa la consola del navegador para ver logs detallados de las comunicaciones con n8n.

### Testing
Puedes usar herramientas como Postman o curl para probar el webhook directamente:

```bash
curl -X POST https://gamay92355.app.n8n.cloud/webhook/angus-assistant \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hola, ¿cómo estás?",
    "userId": "test-user",
    "sessionId": "test-session",
    "context": {
      "userEmail": "test@example.com",
      "timestamp": "2024-01-01T00:00:00.000Z",
      "source": "angus-connect-hub"
    }
  }'
```

## Personalización

### Modificar Timeout
En `src/services/n8nService.ts`:
```typescript
export const n8nService = new N8nService(N8N_WEBHOOK_URL, 60000); // 60 segundos
```

### Agregar Headers Personalizados
En `src/services/n8nService.ts`, modifica el método `sendMessage`:
```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer your-token', // Agregar autenticación si es necesario
},
```

### Personalizar Contexto
En `src/hooks/useN8nChat.ts`, modifica el objeto `context`:
```typescript
context: {
  userEmail: user?.email,
  timestamp: new Date().toISOString(),
  source: 'angus-connect-hub',
  customField: 'custom-value', // Agregar campos personalizados
},
```



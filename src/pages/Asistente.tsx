import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Send, Sparkles } from 'lucide-react';
import BottomTabBar from '@/components/BottomTabBar';
import { useAuthStore } from '@/stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const sugerencias = [
  '¿Cuál es el precio promedio de un toro Angus?',
  '¿Cuándo es el próximo remate?',
  'Información sobre genética Angus',
  '¿Cómo registro mi cabaña?',
];

export default function Asistente() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simular respuesta del asistente (aquí iría la integración con n8n)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Hola! Soy tu asistente de la Asociación Angus. He recibido tu consulta: "${input}". En este momento estoy en modo de demostración. Pronto estaré conectado al sistema completo de la asociación para brindarte información precisa sobre remates, genética, precios y más.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSugerencia = (sugerencia: string) => {
    setInput(sugerencia);
  };

  return (
    <div className="min-h-screen bg-background pb-24 flex flex-col">
      <header className="safe-top bg-gradient-gold text-accent-foreground p-6">
        <div className="flex items-center justify-center gap-3">
          <Bot className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Asistente IA</h1>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-accent-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">¡Hola! Soy tu asistente Angus</h2>
              <p className="text-muted-foreground mb-6">
                Puedo ayudarte con información sobre remates, genética, cabañas y más.
              </p>
              <div className="w-full max-w-md space-y-2">
                <p className="text-sm font-medium mb-3">Preguntas frecuentes:</p>
                {sugerencias.map((sug, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="w-full justify-start text-left"
                    onClick={() => handleSugerencia(sug)}
                  >
                    {sug}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4 text-accent" />
                        <span className="text-xs font-medium text-muted-foreground">
                          Asistente Angus
                        </span>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-2 opacity-70">
                      {message.timestamp.toLocaleTimeString('es-AR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <Card className="max-w-[80%] p-4 border">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-accent animate-pulse" />
                  <span className="text-sm text-muted-foreground">Escribiendo...</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-accent animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-accent animate-bounce delay-100" />
                    <div className="w-2 h-2 rounded-full bg-accent animate-bounce delay-200" />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border bg-background">
          <div className="flex gap-2 max-w-screen-xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu pregunta..."
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-gradient-primary"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>

      <BottomTabBar />
    </div>
  );
}

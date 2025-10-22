import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Sparkles, Wifi, WifiOff, MessageCircle, Zap, Brain, ArrowRight } from 'lucide-react';
import BottomTabBar from '@/components/BottomTabBar';
import { useAuthStore } from '@/stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useN8nChat, ChatMessage } from '@/hooks/useN8nChat';
import { ConnectionStatus } from '@/components/ConnectionStatus';

const sugerencias = [
  {
    text: '¿Cuál es el precio promedio de un toro Angus?',
    icon: '💰',
    category: 'Precios'
  },
  {
    text: '¿Cuándo es el próximo remate?',
    icon: '📅',
    category: 'Eventos'
  },
  {
    text: 'Información sobre genética Angus',
    icon: '🧬',
    category: 'Genética'
  },
  {
    text: '¿Cómo registro mi cabaña?',
    icon: '🏡',
    category: 'Registro'
  },
];

export default function Asistente() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const { messages, isLoading, error, sendMessage, clearMessages, isConnected, checkConnection } = useN8nChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const messageToSend = input.trim();
    setInput('');
    await sendMessage(messageToSend);
  };

  const handleSugerencia = (sugerencia: string) => {
    setInput(sugerencia);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background pb-24 flex flex-col">
      {/* Ultra-Modern Header 2024-2025 with Soft Green */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent backdrop-blur-xl border-b border-primary/20"
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: AI Assistant Info */}
            <div className="flex items-center gap-3">
              <motion.div 
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary-light to-accent flex items-center justify-center text-sm font-bold text-white shadow-lg ring-2 ring-primary/30 soft-glow">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center shadow-md">
                  <Brain className="w-2 h-2 text-accent-foreground" />
                </div>
              </motion.div>
              
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-foreground truncate">
                  Asistente IA Angus
                </h1>
                <p className="text-xs text-muted-foreground">
                  {isConnected ? 'Conectado • Listo' : 'Desconectado • Sin servicio'}
                </p>
              </div>
            </div>

            {/* Right: Status & Actions */}
            <div className="flex items-center gap-2">
              {/* Connection Status */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  isConnected 
                    ? 'bg-accent/20 text-accent border-accent/30' 
                    : 'bg-destructive/20 text-destructive border-destructive/30'
                }`}>
                  {isConnected ? (
                    <div className="flex items-center gap-1">
                      <Wifi className="w-3 h-3" />
                      <span>Conectado</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <WifiOff className="w-3 h-3" />
                      <span>Desconectado</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Clear Chat */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearMessages}
                  className="w-8 h-8 p-0 rounded-lg hover:bg-primary/10 transition-colors"
                  disabled={messages.length === 0}
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 overflow-hidden flex flex-col">
        <ConnectionStatus isConnected={isConnected} error={error} onRetry={checkConnection} />
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <motion.div 
              className="flex flex-col items-center justify-center h-full text-center p-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div 
                className="w-24 h-24 rounded-premium-xl bg-gradient-gold flex items-center justify-center mb-6 shadow-glow"
                animate={{ 
                  boxShadow: [
                    "0 0 20px hsla(43, 96%, 56%, 0.3)",
                    "0 0 40px hsla(43, 96%, 56%, 0.6)",
                    "0 0 20px hsla(43, 96%, 56%, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-12 h-12 text-accent-foreground" />
              </motion.div>
              
              <motion.h2 
                className="text-2xl font-bold mb-3 text-premium-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                ¡Hola! Soy tu asistente Angus
              </motion.h2>
              
              <motion.p 
                className="text-muted-foreground mb-8 max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Puedo ayudarte con información sobre remates, genética, cabañas y más. 
                Pregúntame lo que necesites saber.
              </motion.p>
              
              <motion.div 
                className="w-full max-w-md space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <p className="text-sm font-semibold text-muted-foreground mb-4">Preguntas frecuentes:</p>
                {sugerencias.map((sug, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-4 hover-lift glass-card"
                      onClick={() => handleSugerencia(sug.text)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{sug.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium">{sug.text}</p>
                          <p className="text-xs text-muted-foreground">{sug.category}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
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
                  <motion.div
                    className={`max-w-[85%] rounded-premium-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-primary text-primary-foreground shadow-premium'
                        : 'glass-card border border-border/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-gold flex items-center justify-center">
                          <Bot className="w-3 h-3 text-accent-foreground" />
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">
                          Asistente Angus
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          <Zap className="w-2 h-2 mr-1" />
                          IA
                        </Badge>
                      </div>
                    )}
                    <p className={`text-sm leading-relaxed ${message.isError ? 'text-red-500' : ''}`}>
                      {message.content}
                    </p>
                    <p className="text-xs mt-3 opacity-70">
                      {message.timestamp.toLocaleTimeString('es-AR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <Card className="glass-card p-4 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-gold flex items-center justify-center">
                    <Bot className="w-3 h-3 text-accent-foreground animate-pulse" />
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">Procesando...</span>
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

        {/* Premium Input Area */}
        <motion.div 
          className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex gap-3 max-w-screen-xl mx-auto">
            <div className="flex-1 relative">
              <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu pregunta..."
                className="pl-12 h-12 rounded-premium border-2 focus:border-primary transition-colors bg-background/50 backdrop-blur-sm"
                disabled={isLoading}
              />
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="h-12 px-6 bg-gradient-primary hover:shadow-glow btn-premium"
              >
                <Send className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <BottomTabBar />
    </div>
  );
}
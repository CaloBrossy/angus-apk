import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, TrendingUp, Sparkles, Sun, Moon } from 'lucide-react';
import BottomTabBar from '@/components/BottomTabBar';
import { mockRemates, mockNoticias } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();

  useEffect(() => {
    // Apply theme on mount
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const userName = user?.user_metadata?.nombre || user?.email?.split('@')[0] || 'Socio';
  const proximoRemate = mockRemates[0];
  const ultimasNoticias = mockNoticias.slice(0, 2);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header con saludo */}
      <header className="safe-top bg-gradient-primary text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-xl font-bold">
                {userName[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm opacity-90">Bienvenido,</p>
                <h1 className="text-2xl font-bold">{userName}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <Switch checked={isDark} onCheckedChange={toggleTheme} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto p-4 space-y-6 mt-4">
        {/* Próximo Remate Destacado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative h-48">
              <img
                src={proximoRemate.imagen_url}
                alt={proximoRemate.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(proximoRemate.fecha).toLocaleDateString('es-AR')}</span>
                  <MapPin className="w-4 h-4 ml-2" />
                  <span>{proximoRemate.ubicacion}</span>
                </div>
                <h2 className="text-xl font-bold mb-1">{proximoRemate.titulo}</h2>
                <p className="text-accent font-bold text-lg">
                  Desde ${proximoRemate.precio_base.toLocaleString('es-AR')}
                </p>
              </div>
            </div>
            <div className="p-4">
              <Link to="/remates">
                <Button className="w-full bg-gradient-primary">Ver Remate Completo</Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Acceso rápido */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-3">Accesos Rápidos</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/asistente">
              <Card className="p-4 text-center hover:shadow-md transition-shadow touch-feedback">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="font-medium">Asistente IA</p>
                <p className="text-xs text-muted-foreground">Consultas inteligentes</p>
              </Card>
            </Link>
            <Link to="/cabanas">
              <Card className="p-4 text-center hover:shadow-md transition-shadow touch-feedback">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="font-medium">Mi Cabaña</p>
                <p className="text-xs text-muted-foreground">Gestión y estadísticas</p>
              </Card>
            </Link>
          </div>
        </motion.div>

        {/* Últimas noticias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Últimas Noticias</h3>
            <Link to="/noticias" className="text-primary text-sm font-medium">
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {ultimasNoticias.map((noticia) => (
              <Card key={noticia.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex gap-3 p-3">
                  <img
                    src={noticia.imagen_url}
                    alt={noticia.titulo}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full mb-1">
                      {noticia.categoria}
                    </div>
                    <h4 className="font-semibold text-sm line-clamp-2 mb-1">{noticia.titulo}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(noticia.fecha_publicacion).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>

      <BottomTabBar />
    </div>
  );
}

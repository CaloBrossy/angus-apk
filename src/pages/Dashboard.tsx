import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, TrendingUp, Sparkles, Sun, Moon, ArrowRight, Clock, Users, Award, Zap, Bell } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background pb-24">
      {/* Ultra-Modern Header 2024-2025 with Soft Green */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent backdrop-blur-xl border-b border-primary/20"
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: User Info */}
            <div className="flex items-center gap-3">
              <motion.div 
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary-light to-accent flex items-center justify-center text-sm font-bold text-white shadow-lg ring-2 ring-primary/30 soft-glow">
                  {userName[0].toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center shadow-md">
                  <div className="w-2 h-2 bg-accent-foreground rounded-full" />
                </div>
              </motion.div>
              
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-foreground truncate">
                  Hola, {userName}
                </h1>
                <p className="text-xs text-muted-foreground">
                  Miembro Premium • Activo
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Quick Stats */}
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-center">
                  <div className="text-sm font-semibold text-primary">12</div>
                  <div className="text-xs text-muted-foreground">Remates</div>
                </div>
                <div className="w-px h-6 bg-primary/30" />
                <div className="text-center">
                  <div className="text-sm font-semibold text-primary">3</div>
                  <div className="text-xs text-muted-foreground">Cabañas</div>
                </div>
                <div className="w-px h-6 bg-primary/30" />
                <div className="text-center">
                  <div className="text-sm font-semibold text-primary">24</div>
                  <div className="text-xs text-muted-foreground">Noticias</div>
                </div>
              </div>

              {/* Theme Toggle */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="w-10 h-10 p-0 rounded-xl hover:bg-primary/10 transition-colors"
                >
                  <motion.div
                    animate={{ rotate: isDark ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isDark ? (
                      <Moon className="w-4 h-4 text-primary" />
                    ) : (
                      <Sun className="w-4 h-4 text-primary" />
                    )}
                  </motion.div>
                </Button>
              </motion.div>

              {/* Notification Bell */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-xl hover:bg-primary/10 transition-colors"
                >
                  <Bell className="w-4 h-4 text-primary" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-accent-foreground rounded-full" />
                  </div>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-screen-xl mx-auto px-4 py-6 space-y-8">
        {/* Featured Remate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card overflow-hidden elegant-hover">
            <div className="relative h-64">
              <img
                src={proximoRemate.imagen_url}
                alt={proximoRemate.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-accent text-accent-foreground border-0">
                  <Zap className="w-3 h-3 mr-1" />
                  Destacado
                </Badge>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-4 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(proximoRemate.fecha).toLocaleDateString('es-AR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{proximoRemate.ubicacion}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-premium-lg">{proximoRemate.titulo}</h2>
                <div className="flex items-center justify-between">
                  <p className="text-accent font-bold text-xl">
                    Desde ${proximoRemate.precio_base.toLocaleString('es-AR')}
                  </p>
                  <Link to="/remates">
                    <Button className="bg-gradient-gold hover:shadow-glow btn-premium">
                      Ver Detalles
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-premium-lg">Accesos Rápidos</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/asistente">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="glass-card p-6 text-center elegant-hover">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-premium bg-gradient-gold flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h4 className="font-semibold text-premium mb-2">Asistente IA</h4>
                  <p className="text-sm text-muted-foreground">Consultas inteligentes</p>
                </Card>
              </motion.div>
            </Link>
            <Link to="/cabanas">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="glass-card p-6 text-center elegant-hover">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-premium bg-gradient-primary flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h4 className="font-semibold text-premium mb-2">Mi Cabaña</h4>
                  <p className="text-sm text-muted-foreground">Gestión y estadísticas</p>
                </Card>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Latest News */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-premium-lg">Últimas Noticias</h3>
            </div>
            <Link to="/noticias" className="text-primary text-sm font-semibold hover:text-primary/80 transition-colors">
              Ver todas
              <ArrowRight className="w-4 h-4 ml-1 inline" />
            </Link>
          </div>
          <div className="space-y-4">
            {ultimasNoticias.map((noticia, index) => (
              <motion.div
                key={noticia.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Card className="glass-card overflow-hidden hover-lift">
                  <div className="flex gap-4 p-4">
                    <img
                      src={noticia.imagen_url}
                      alt={noticia.titulo}
                      className="w-20 h-20 rounded-premium object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {noticia.categoria}
                      </Badge>
                      <h4 className="font-semibold text-premium line-clamp-2 mb-2">{noticia.titulo}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(noticia.fecha_publicacion).toLocaleDateString('es-AR')}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <BottomTabBar />
    </div>
  );
}
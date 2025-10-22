import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Building2, LogOut, Edit2, Sun, Moon, Bell, Shield, Award, Settings } from 'lucide-react';
import BottomTabBar from '@/components/BottomTabBar';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Perfil() {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const userName = user?.user_metadata?.nombre || 'Usuario';
  const userEmail = user?.email || '';

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error al cerrar sesión');
      return;
    }
    logout();
    toast.success('Sesión cerrada exitosamente');
    navigate('/auth/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background pb-24">
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
                  <Shield className="w-2 h-2 text-accent-foreground" />
                </div>
              </motion.div>
              
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-foreground truncate">
                  {userName}
                </h1>
                <p className="text-xs text-muted-foreground">
                  Miembro Premium • Verificado
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Edit Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="h-8 px-3 rounded-lg text-xs font-medium border-primary/30 hover:bg-primary/10"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  {isEditing ? 'Cancelar' : 'Editar'}
                </Button>
              </motion.div>

              {/* Settings */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <Settings className="w-4 h-4 text-primary" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Personal Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card p-8 hover-lift">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-premium-lg mb-2">Información Personal</h2>
                <p className="text-muted-foreground">Gestiona tu información de perfil</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="btn-premium hover-glow"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancelar' : 'Editar'}
              </Button>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-6">
              <motion.div 
                className="space-y-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Label htmlFor="nombre" className="text-sm font-semibold text-muted-foreground">Nombre Completo</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="nombre"
                    value={userName}
                    disabled={!isEditing}
                    className="pl-12 h-12 rounded-premium border-2 focus:border-primary transition-colors"
                  />
                </div>
              </motion.div>

              <motion.div 
                className="space-y-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Label htmlFor="email" className="text-sm font-semibold text-muted-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    value={userEmail}
                    disabled
                    className="pl-12 h-12 rounded-premium border-2 bg-muted/50"
                  />
                </div>
              </motion.div>

              <motion.div 
                className="space-y-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Label htmlFor="telefono" className="text-sm font-semibold text-muted-foreground">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="telefono"
                    placeholder="+54 9 11 1234-5678"
                    disabled={!isEditing}
                    className="pl-12 h-12 rounded-premium border-2 focus:border-primary transition-colors"
                  />
                </div>
              </motion.div>

              <motion.div 
                className="space-y-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Label htmlFor="cabana" className="text-sm font-semibold text-muted-foreground">Cabaña Asociada</Label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="cabana"
                    placeholder="No tienes cabaña registrada"
                    disabled
                    className="pl-12 h-12 rounded-premium border-2 bg-muted/50"
                  />
                </div>
              </motion.div>
            </div>

            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-8"
              >
                <Button className="w-full h-12 bg-gradient-primary hover:shadow-glow btn-premium">
                  Guardar Cambios
                </Button>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Settings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card p-8 hover-lift">
            <div className="flex items-center gap-3 mb-8">
              <Settings className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold text-premium-lg">Configuración</h3>
            </div>
            
            <div className="space-y-6">
              <motion.div 
                className="flex items-center justify-between p-4 rounded-premium bg-muted/30 hover:bg-muted/50 transition-colors"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-premium bg-primary/10 flex items-center justify-center">
                    {isDark ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                  </div>
                  <div>
                    <p className="font-semibold text-premium">Modo Oscuro</p>
                    <p className="text-sm text-muted-foreground">
                      Tema {isDark ? 'oscuro' : 'claro'} activado
                    </p>
                  </div>
                </div>
                <Switch checked={isDark} onCheckedChange={toggleTheme} className="data-[state=checked]:bg-primary" />
              </motion.div>

              <Separator />

              <motion.div 
                className="flex items-center justify-between p-4 rounded-premium bg-muted/30 hover:bg-muted/50 transition-colors"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-premium bg-accent/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-premium">Notificaciones Push</p>
                    <p className="text-sm text-muted-foreground">
                      Recibir alertas de remates y noticias
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                  className="data-[state=checked]:bg-accent"
                />
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            variant="destructive"
            className="w-full h-12 rounded-premium btn-premium hover-glow"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Cerrar Sesión
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center py-4"
        >
          <p className="text-sm text-muted-foreground">
            Versión 1.0.0 - Asociación Argentina de Angus
          </p>
        </motion.div>
      </main>

      <BottomTabBar />
    </div>
  );
}
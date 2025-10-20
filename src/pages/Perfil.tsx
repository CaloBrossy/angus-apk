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
import { User, Mail, Phone, Building2, LogOut, Edit2, Sun, Moon, Bell } from 'lucide-react';
import BottomTabBar from '@/components/BottomTabBar';
import { toast } from 'sonner';

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
    <div className="min-h-screen bg-background pb-24">
      <header className="safe-top bg-gradient-primary text-primary-foreground p-6">
        <h1 className="text-2xl font-bold text-center">Mi Perfil</h1>
      </header>

      <main className="max-w-screen-xl mx-auto p-4 space-y-6">
        <Card className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-gold flex items-center justify-center text-3xl font-bold text-accent-foreground mb-3">
              {userName[0].toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold">{userName}</h2>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancelar' : 'Editar Perfil'}
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="nombre"
                  value={userName}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  value={userEmail}
                  disabled
                  className="pl-10 bg-muted"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="telefono"
                  placeholder="+54 9 11 1234-5678"
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cabana">Cabaña Asociada</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="cabana"
                  placeholder="No tienes cabaña registrada"
                  disabled
                  className="pl-10 bg-muted"
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <Button className="w-full mt-4 bg-gradient-primary">
              Guardar Cambios
            </Button>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Configuración</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <div>
                  <p className="font-medium">Modo Oscuro</p>
                  <p className="text-xs text-muted-foreground">
                    Tema {isDark ? 'oscuro' : 'claro'} activado
                  </p>
                </div>
              </div>
              <Switch checked={isDark} onCheckedChange={toggleTheme} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5" />
                <div>
                  <p className="font-medium">Notificaciones Push</p>
                  <p className="text-xs text-muted-foreground">
                    Recibir alertas de remates y noticias
                  </p>
                </div>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </div>
        </Card>

        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Cerrar Sesión
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Versión 1.0.0 - Asociación Argentina de Angus
        </p>
      </main>

      <BottomTabBar />
    </div>
  );
}

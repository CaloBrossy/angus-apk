import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, MapPin, TrendingUp, Search } from 'lucide-react';
import BottomTabBar from '@/components/BottomTabBar';
import { mockCabanas } from '@/data/mockData';
import { useState } from 'react';

export default function Cabanas() {
  const [searchTerm, setSearchTerm] = useState('');
  const hasOwnCabana = false; // TODO: Check from user profile

  const filteredCabanas = mockCabanas.filter((cabana) =>
    cabana.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="safe-top bg-gradient-earth text-secondary-foreground p-6">
        <h1 className="text-2xl font-bold text-center">Cabañas Angus</h1>
      </header>

      <main className="max-w-screen-xl mx-auto p-4 space-y-6">
        {hasOwnCabana ? (
          <Card className="p-6 border-2 border-primary">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Mi Cabaña</h2>
                <p className="text-sm text-muted-foreground">Gestiona tu negocio</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">24</p>
                <p className="text-xs text-muted-foreground">Animales</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">3</p>
                <p className="text-xs text-muted-foreground">Remates</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">12</p>
                <p className="text-xs text-muted-foreground">Ventas</p>
              </div>
            </div>
            <Button className="w-full bg-gradient-primary">Ver Dashboard Completo</Button>
          </Card>
        ) : (
          <Card className="p-6 text-center border-dashed border-2">
            <Building2 className="w-16 h-16 mx-auto mb-3 text-muted-foreground" />
            <h2 className="text-lg font-semibold mb-2">¿Tienes una cabaña?</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Registra tu cabaña y comienza a gestionar tus remates
            </p>
            <Button className="bg-gradient-primary">Registrar Mi Cabaña</Button>
          </Card>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-3">Directorio de Cabañas</h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar cabañas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-3">
            {filteredCabanas.map((cabana) => (
              <Card key={cabana.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex gap-4 p-4">
                  <img
                    src={cabana.logo_url}
                    alt={cabana.nombre}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-lg mb-1">{cabana.nombre}</h4>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{cabana.ubicacion}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {cabana.descripcion}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-primary" />
                        <span>{cabana.animales_destacados} animales</span>
                      </div>
                      <span className="text-accent font-semibold">
                        {cabana.remates_activos} remates activos
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <BottomTabBar />
    </div>
  );
}

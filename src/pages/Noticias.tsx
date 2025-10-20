import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Heart } from 'lucide-react';
import BottomTabBar from '@/components/BottomTabBar';
import { mockNoticias } from '@/data/mockData';
import { motion } from 'framer-motion';

const categorias = ['Todas', 'Genética', 'Mercado', 'Eventos', 'Nutrición'];

export default function Noticias() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [favoritos, setFavoritos] = useState<number[]>([]);

  const toggleFavorito = (id: number) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const noticiasFiltradas = mockNoticias.filter((noticia) => {
    const matchCategoria = categoriaActiva === 'Todas' || noticia.categoria === categoriaActiva;
    const matchSearch = noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategoria && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="safe-top bg-gradient-primary text-primary-foreground p-6">
        <h1 className="text-2xl font-bold text-center">Noticias Angus</h1>
      </header>

      <main className="max-w-screen-xl mx-auto p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar noticias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {categorias.map((cat) => (
            <Badge
              key={cat}
              variant={categoriaActiva === cat ? 'default' : 'outline'}
              className={`cursor-pointer whitespace-nowrap touch-feedback ${
                categoriaActiva === cat ? 'bg-primary' : ''
              }`}
              onClick={() => setCategoriaActiva(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>

        <div className="space-y-4">
          {noticiasFiltradas.map((noticia, index) => (
            <motion.div
              key={noticia.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={noticia.imagen_url}
                    alt={noticia.titulo}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => toggleFavorito(noticia.id)}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full glass flex items-center justify-center touch-feedback"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favoritos.includes(noticia.id)
                          ? 'fill-destructive text-destructive'
                          : 'text-white'
                      }`}
                    />
                  </button>
                  <Badge className="absolute bottom-3 left-3 bg-primary">
                    {noticia.categoria}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{noticia.titulo}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {noticia.contenido}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{noticia.autor}</span>
                    <span>{new Date(noticia.fecha_publicacion).toLocaleDateString('es-AR')}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>

      <BottomTabBar />
    </div>
  );
}

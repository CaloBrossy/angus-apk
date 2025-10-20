import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import BottomTabBar from '@/components/BottomTabBar';
import { mockRemates } from '@/data/mockData';

const categoriaColors: Record<string, string> = {
  Toros: 'bg-primary',
  Vientres: 'bg-secondary',
  Terneros: 'bg-accent',
};

export default function Remates() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % mockRemates.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + mockRemates.length) % mockRemates.length);
  };

  const currentRemate = mockRemates[currentIndex];

  const swipeVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="safe-top bg-gradient-primary text-primary-foreground p-6">
        <h1 className="text-2xl font-bold text-center">Remates Angus</h1>
      </header>

      <main className="relative h-[calc(100vh-200px)] overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -10000) {
                handleNext();
              } else if (swipe > 10000) {
                handlePrev();
              }
            }}
            className="absolute inset-0 p-4"
          >
            <Card className="h-full overflow-hidden shadow-2xl">
              <div className="relative h-3/5">
                <img
                  src={currentRemate.imagen_url}
                  alt={currentRemate.titulo}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'var(--gradient-overlay)' }}
                />
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <Badge className={`${categoriaColors[currentRemate.categoria]} text-white px-3 py-1`}>
                    {currentRemate.categoria}
                  </Badge>
                  {currentRemate.estado === 'activo' && (
                    <Badge className="bg-destructive animate-pulse text-white px-3 py-1">
                      🔴 EN VIVO
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-3xl font-bold mb-2">{currentRemate.titulo}</h2>
                  <p className="text-lg opacity-90 mb-3">{currentRemate.descripcion}</p>
                  <div className="flex items-center gap-4 text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(currentRemate.fecha).toLocaleDateString('es-AR')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{currentRemate.ubicacion}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4" />
                    <span>{currentRemate.cabana}</span>
                  </div>
                </div>
              </div>
              <div className="h-2/5 p-6 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Precio Base</p>
                  <p className="text-4xl font-bold gradient-text mb-4">
                    ${currentRemate.precio_base.toLocaleString('es-AR')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Desliza horizontalmente para ver más remates →
                  </p>
                </div>
                <Button className="w-full bg-gradient-primary h-14 text-lg">
                  Ver Detalles Completos
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass flex items-center justify-center touch-feedback"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass flex items-center justify-center touch-feedback"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {mockRemates.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all touch-feedback ${
                index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </main>

      <BottomTabBar />
    </div>
  );
}

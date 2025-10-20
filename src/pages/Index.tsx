import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
          <span className="text-5xl font-bold text-primary-foreground">AA</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
          Asociación Argentina de Angus
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          Portal exclusivo para socios - Gestiona tu cabaña, accede a remates y más
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            className="bg-gradient-primary text-lg px-8 py-6"
            onClick={() => navigate('/auth/login')}
          >
            Iniciar Sesión
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6"
            onClick={() => navigate('/auth/register')}
          >
            Registrarse
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 grid grid-cols-3 gap-6 text-center"
        >
          <div>
            <p className="text-3xl font-bold text-primary">500+</p>
            <p className="text-sm text-muted-foreground">Cabañas Asociadas</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">1000+</p>
            <p className="text-sm text-muted-foreground">Remates al Año</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">85</p>
            <p className="text-sm text-muted-foreground">Años de Historia</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;

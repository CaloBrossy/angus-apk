import { Home, Gavel, Building2, Bot, Newspaper, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const tabs = [
  { icon: Home, label: 'Inicio', path: '/dashboard' },
  { icon: Gavel, label: 'Remates', path: '/remates' },
  { icon: Building2, label: 'Cabañas', path: '/cabanas' },
  { icon: Bot, label: 'IA', path: '/asistente' },
  { icon: Newspaper, label: 'Noticias', path: '/noticias' },
  { icon: User, label: 'Perfil', path: '/perfil' },
];

export default function BottomTabBar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="glass border-t border-border/50 backdrop-blur-xl">
        <div className="max-w-screen-xl mx-auto px-2 py-2">
          <div className="flex items-center justify-around">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.path;
              
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className="relative flex flex-col items-center justify-center min-w-[64px] py-2 touch-feedback"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary/10 rounded-2xl"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <Icon
                      className={`w-6 h-6 transition-colors ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                    <span
                      className={`text-xs font-medium transition-colors ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

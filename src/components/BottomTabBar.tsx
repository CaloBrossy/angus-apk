import { Home, Gavel, Building2, Bot, Newspaper, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const tabs = [
  { icon: Home, label: 'Inicio', path: '/dashboard', color: 'primary' },
  { icon: Gavel, label: 'Remates', path: '/remates', color: 'secondary' },
  { icon: Building2, label: 'Cabañas', path: '/cabanas', color: 'accent' },
  { icon: Bot, label: 'IA', path: '/asistente', color: 'primary' },
  { icon: Newspaper, label: 'Noticias', path: '/noticias', color: 'secondary' },
  { icon: User, label: 'Perfil', path: '/perfil', color: 'accent' },
];

export default function BottomTabBar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="relative">
        {/* Background with blur */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-border/50" />
        
        {/* Content */}
        <div className="relative max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.path;
              
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className="relative flex flex-col items-center justify-center min-w-[60px] py-2 touch-feedback"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-primary rounded-premium-lg shadow-premium"
                      transition={{ 
                        type: 'spring', 
                        stiffness: 300, 
                        damping: 30 
                      }}
                    />
                  )}
                  
                  <motion.div 
                    className="relative z-10 flex flex-col items-center gap-1"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <motion.div
                      className={`w-8 h-8 rounded-premium flex items-center justify-center transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary-foreground/20' 
                          : 'bg-muted/50 hover:bg-muted'
                      }`}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon
                        className={`w-5 h-5 transition-colors ${
                          isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                        }`}
                      />
                    </motion.div>
                    
                    <motion.span
                      className={`text-xs font-semibold transition-colors ${
                        isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}
                      animate={{
                        scale: isActive ? 1.05 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {tab.label}
                    </motion.span>
                  </motion.div>
                  
                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.div
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
      </div>
    </nav>
  );
}
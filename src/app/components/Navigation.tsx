import { Link, useLocation } from 'react-router-dom';
import { Home, GraduationCap, Shield, Briefcase, Bot, Users, Trophy, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

const navItems = [
  { path: '/', label: 'Главная', icon: Home },
  { path: '/dashboard', label: 'Кабинет', icon: User },
  { path: '/learning', label: 'Обучение', icon: GraduationCap },
  { path: '/ctf', label: 'CTF', icon: Shield },
  { path: '/leaderboard', label: 'Рейтинг', icon: Trophy },
  { path: '/career', label: 'Карьера', icon: Briefcase },
  { path: '/ai', label: 'ИИ', icon: Bot },
  { path: '/community', label: 'Сообщество', icon: Users },
];

export function Navigation() {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUserName(localStorage.getItem('userName'));
  }, []);

  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/90 border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-xl">🐋</span>
              </div>
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                Cyber<span className="text-primary">Whale</span>
              </h1>
              <p className="text-xs text-muted-foreground">Universe</p>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Auth Button */}
          {token ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                setToken(null);
                window.location.href = '/';
              }}
              className="px-6 py-2 rounded-lg bg-card border border-border text-foreground font-medium hover:bg-card/80 transition-all text-sm"
            >
              Выйти ({userName || 'User'})
            </motion.button>
          ) : (
            <Link to="/auth">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(159, 239, 0, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all text-sm"
              >
                Войти
              </motion.button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden px-4 pb-4 border-t border-border"
        >
          <div className="flex flex-col gap-2 mt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'text-muted-foreground bg-card/40 hover:bg-card/60'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

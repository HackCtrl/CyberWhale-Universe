import { motion } from 'motion/react';
import { Rocket, Loader2, Bell } from 'lucide-react';
import { useState } from 'react';

interface UnderDevelopmentProps {
  title?: string;
  description?: string;
}

export function UnderDevelopment({ 
  title = 'Этот раздел готовится к запуску',
  description = 'Наша команда космических инженеров работает над этой функцией'
}: UnderDevelopmentProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Симуляция отправки
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Animated Robot/Constructor */}
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative mx-auto mb-8 w-32 h-32"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl" />
          <div className="relative w-full h-full bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Rocket className="w-16 h-16 text-white" />
          </div>
          
          {/* Orbiting particles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                transformOrigin: `${40 + i * 10}px 0px`,
              }}
            />
          ))}
        </motion.div>

        {/* Title and Description */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="text-foreground">В </span>
          <span className="text-primary">разработке</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-4">{title}</p>
        <p className="text-sm text-muted-foreground mb-8">{description}</p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Загрузка вселенной</span>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Прогресс...
            </motion.span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-secondary to-primary"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
        </div>

        {/* Email Notification Form */}
        {!submitted ? (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="max-w-md mx-auto"
          >
            <p className="text-sm text-foreground/70 mb-4">
              Хотите узнать первым о запуске?
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ваш@email.com"
                required
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-lg bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              />
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Отправка...</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span className="hidden sm:inline">Уведомить</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto p-4 rounded-lg bg-primary/10 border border-primary/30"
          >
            <div className="flex items-center justify-center gap-2 text-primary">
              <Bell className="w-5 h-5" />
              <p className="font-medium">Спасибо! Мы уведомим вас о запуске!</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

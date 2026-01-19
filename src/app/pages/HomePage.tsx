import { motion } from 'motion/react';
import { Rocket, Target, TrendingUp, Cpu, GraduationCap, Shield, Briefcase, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

const planets = [
  {
    icon: GraduationCap,
    title: 'Планета обучения',
    description: 'Курсы, база знаний, интерактивные тренажеры',
    color: 'from-primary/80 to-primary/40',
    link: '/learning',
  },
  {
    icon: Shield,
    title: 'Галактика CTF',
    description: 'Полигоны, турниры, практические задачи',
    color: 'from-secondary/80 to-secondary/40',
    link: '/ctf',
  },
  {
    icon: Briefcase,
    title: 'Орбита карьеры',
    description: 'Вакансии, подготовка к собеседованиям',
    color: 'from-purple-500/80 to-purple-500/40',
    link: '/career',
  },
  {
    icon: Bot,
    title: 'Спутники-ИИ',
    description: 'ИИ-агенты, автоматизация задач',
    color: 'from-blue-500/80 to-blue-500/40',
    link: '/ai',
  },
];

const steps = [
  { icon: Rocket, title: 'Регистрация', description: 'Создайте аккаунт и выберите направление' },
  { icon: Target, title: 'Обучение на полигонах', description: 'Практикуйтесь на реальных задачах' },
  { icon: TrendingUp, title: 'Верификация навыков', description: 'Получите сертификаты и рейтинг' },
  { icon: Cpu, title: 'Карьера/Автоматизация', description: 'Найдите работу или создайте ИИ-агента' },
];

export function HomePage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="w-[800px] h-[800px] border border-primary/30 rounded-full"
          />
          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute w-[600px] h-[600px] border border-secondary/30 rounded-full"
          />
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 80,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute w-[400px] h-[400px] border border-accent/30 rounded-full"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-foreground">Cyber</span>
              <span className="text-primary">Whale</span>{' '}
              <span className="text-foreground">Universe</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Вселенная кибербезопасности
            </p>
            <p className="text-lg text-foreground/70 mb-12 max-w-3xl mx-auto">
              Обучайтесь, практикуйтесь, развивайтесь и стройте карьеру в кибербезопасности
              с помощью интерактивных полигонов, CTF-турниров и ИИ-агентов
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(159, 239, 0, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all"
                >
                  Начать обучение
                </motion.button>
              </Link>
              <Link to="/community">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-lg border-2 border-border text-foreground hover:border-primary hover:bg-primary/5 transition-all"
                >
                  Присоединиться к сообществу
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Planets Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">4 планеты</span>{' '}
              <span className="text-primary">вселенной</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Исследуйте все грани кибербезопасности
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {planets.map((planet, index) => {
              const Icon = planet.icon;
              return (
                <Link key={index} to={planet.link}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-30 blur-xl transition-opacity rounded-2xl"
                      style={{ background: `linear-gradient(to bottom right, var(--color-${planet.color.split('-')[1]}), transparent)` }}
                    ></div>
                    <div className="relative backdrop-blur-sm bg-card/60 border border-border rounded-2xl p-6 hover:border-primary/50 transition-all">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${planet.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-center">{planet.title}</h3>
                      <p className="text-sm text-muted-foreground text-center">
                        {planet.description}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-20 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">Как это</span>{' '}
              <span className="text-primary">работает</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Ваш путь к карьере в кибербезопасности
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="relative text-center"
                >
                  <div className="relative inline-block mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center"
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent -translate-x-1/2"></div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Стартуй свою карьеру в</span>{' '}
              <span className="text-primary">кибербезопасности</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Присоединяйтесь к тысячам специалистов, которые уже развивают свои навыки на CyberWhale Universe
            </p>
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(159, 239, 0, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 rounded-lg bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all"
              >
                Начать сейчас
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
import { motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Shield, 
  Trophy, 
  Target, 
  TrendingUp, 
  Award,
  Clock,
  Flame,
  ChevronRight,
  BookOpen,
  Play
} from 'lucide-react';

interface CourseProgress {
  id: string;
  title: string;
  progress: number;
  lessons: number;
  completedLessons: number;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface CTFChallenge {
  id: string;
  title: string;
  category: string;
  points: number;
  solved: boolean;
}

export function DashboardPage() {
  const [user] = useState({
    name: 'Кибервоин',
    level: 12,
    xp: 3450,
    nextLevelXp: 5000,
    rank: 'Мастер защиты',
    streak: 7,
  });

  const [stats] = useState({
    coursesCompleted: 8,
    ctfSolved: 23,
    hoursLearned: 87,
    rank: 156,
  });

  const [activeCourses] = useState<CourseProgress[]>([
    {
      id: '1',
      title: 'Web Application Security',
      progress: 65,
      lessons: 24,
      completedLessons: 16,
      category: 'Web Security',
      difficulty: 'Intermediate',
    },
    {
      id: '2',
      title: 'Network Penetration Testing',
      progress: 30,
      lessons: 18,
      completedLessons: 5,
      category: 'Pentesting',
      difficulty: 'Advanced',
    },
    {
      id: '3',
      title: 'OSINT Fundamentals',
      progress: 90,
      lessons: 12,
      completedLessons: 11,
      category: 'Intelligence',
      difficulty: 'Beginner',
    },
  ]);

  const [recentCTF] = useState<CTFChallenge[]>([
    { id: '1', title: 'SQL Injection Master', category: 'Web', points: 250, solved: true },
    { id: '2', title: 'XSS Challenge', category: 'Web', points: 150, solved: true },
    { id: '3', title: 'Buffer Overflow', category: 'Binary', points: 500, solved: false },
    { id: '4', title: 'Crypto Puzzle', category: 'Crypto', points: 300, solved: false },
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-primary';
      case 'Intermediate': return 'text-secondary';
      case 'Advanced': return 'text-purple-500';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-foreground">Добро пожаловать, </span>
            <span className="text-primary">{user.name}</span>
          </h1>
          <p className="text-muted-foreground">Продолжайте свой путь в кибербезопасности</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: GraduationCap, label: 'Курсов завершено', value: stats.coursesCompleted, color: 'primary' },
            { icon: Shield, label: 'CTF решено', value: stats.ctfSolved, color: 'secondary' },
            { icon: Clock, label: 'Часов обучения', value: stats.hoursLearned, color: 'purple-500' },
            { icon: Trophy, label: 'Место в рейтинге', value: `#${stats.rank}`, color: 'primary' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-4 hover:border-primary/50 transition-all"
              >
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}/20 flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 text-${stat.color}`} />
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Progress & Courses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">Уровень {user.level}</h3>
                  <p className="text-sm text-muted-foreground">{user.rank}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{user.streak} дней подряд</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Прогресс до следующего уровня</span>
                  <span className="font-medium">{user.xp} / {user.nextLevelXp} XP</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                </div>
              </div>
            </motion.div>

            {/* Active Courses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Активные курсы</h3>
                <Link 
                  to="/learning"
                  className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  Все курсы <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {activeCourses.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="group cursor-pointer"
                  >
                    <Link to={`/course/${course.id}`}>
                      <div className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-card/40 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold mb-1 group-hover:text-primary transition-colors">
                              {course.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-muted-foreground">{course.category}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className={getDifficultyColor(course.difficulty)}>
                                {course.difficulty}
                              </span>
                            </div>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0"
                          >
                            <Play className="w-5 h-5 text-primary" />
                          </motion.div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              {course.completedLessons} из {course.lessons} уроков
                            </span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${course.progress}%` }}
                              transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <Link to="/learning">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 py-3 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Найти новый курс
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Right Column - CTF & Achievements */}
          <div className="space-y-6">
            {/* Recent CTF */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Последние CTF</h3>
                <Link 
                  to="/ctf"
                  className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  Все задачи <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-3">
                {recentCTF.map((challenge, i) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={{ x: -5 }}
                    className="group cursor-pointer"
                  >
                    <Link to={`/ctf/${challenge.id}`}>
                      <div className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-card/40 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
                            {challenge.title}
                          </h4>
                          {challenge.solved && (
                            <Award className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{challenge.category}</span>
                          <span className="font-medium text-primary">{challenge.points} pts</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <Link to="/ctf">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Попробовать новую задачу
                </motion.button>
              </Link>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-6"
            >
              <h3 className="text-xl font-bold mb-4">Быстрые действия</h3>
              <div className="space-y-2">
                {[
                  { icon: TrendingUp, label: 'Таблица лидеров', link: '/leaderboard' },
                  { icon: Trophy, label: 'Мои достижения', link: '/achievements' },
                  { icon: BookOpen, label: 'База знаний', link: '/learning' },
                ].map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <Link key={i} to={action.link}>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        whileHover={{ x: 5 }}
                        className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-card/40 transition-all flex items-center gap-3 group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm group-hover:text-primary transition-colors">
                          {action.label}
                        </span>
                        <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft,
  Users,
  BookOpen,
  Shield,
  Award,
  Settings,
  TrendingUp,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  students: number;
  status: 'active' | 'draft';
}

interface Challenge {
  id: string;
  title: string;
  solves: number;
  status: 'active' | 'disabled';
}

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'ctf' | 'users'>('overview');

  const [stats] = useState({
    totalUsers: 5432,
    activeCourses: 24,
    activeChallenges: 42,
    totalPoints: 125840,
  });

  const [courses] = useState<Course[]>([
    { id: '1', title: 'Web Application Security', students: 1234, status: 'active' },
    { id: '2', title: 'Network Penetration Testing', students: 856, status: 'active' },
    { id: '3', title: 'OSINT Fundamentals', students: 2341, status: 'active' },
  ]);

  const [challenges] = useState<Challenge[]>([
    { id: '1', title: 'SQL Injection Master', solves: 1234, status: 'active' },
    { id: '2', title: 'XSS Challenge', solves: 890, status: 'active' },
    { id: '3', title: 'CryptoMaster', solves: 567, status: 'active' },
  ]);

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: TrendingUp },
    { id: 'courses', label: 'Курсы', icon: BookOpen },
    { id: 'ctf', label: 'CTF', icon: Shield },
    { id: 'users', label: 'Пользователи', icon: Users },
  ];

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            to="/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться в кабинет
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                <span className="text-foreground">Админ </span>
                <span className="text-primary">панель</span>
              </h1>
              <p className="text-muted-foreground">Управление контентом платформы</p>
            </div>
            <Settings className="w-8 h-8 text-primary" />
          </div>
        </motion.div>

        {/* Stats Overview */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Пользователи', value: stats.totalUsers, icon: Users, color: 'primary' },
              { label: 'Курсы', value: stats.activeCourses, icon: BookOpen, color: 'secondary' },
              { label: 'CTF задачи', value: stats.activeChallenges, icon: Shield, color: 'purple-500' },
              { label: 'Очки выдано', value: stats.totalPoints, icon: Award, color: 'primary' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-6"
                >
                  <div className={`w-12 h-12 rounded-lg bg-${stat.color}/20 flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 text-${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-2 mb-8 flex gap-2 overflow-x-auto"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-6"
        >
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Последняя активность</h2>
              <div className="space-y-4">
                {[
                  { action: 'Новый пользователь зарегистрирован', time: '5 минут назад', type: 'user' },
                  { action: 'Курс "Web Security" обновлён', time: '1 час назад', type: 'course' },
                  { action: 'CTF задача "SQL Master" решена 50 раз', time: '2 часа назад', type: 'ctf' },
                  { action: 'Добавлен новый урок в курс', time: '3 часа назад', type: 'course' },
                ].map((activity, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="p-4 rounded-lg border border-border hover:bg-card/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span>{activity.action}</span>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Управление курсами</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Добавить курс
                </motion.button>
              </div>

              <div className="space-y-3">
                {courses.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-lg border border-border hover:bg-card/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">{course.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{course.students} студентов</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            course.status === 'active' 
                              ? 'bg-primary/20 text-primary' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {course.status === 'active' ? 'Активен' : 'Черновик'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg hover:bg-primary/20 transition-colors"
                        >
                          <Edit className="w-4 h-4 text-primary" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ctf' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Управление CTF</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Добавить задачу
                </motion.button>
              </div>

              <div className="space-y-3">
                {challenges.map((challenge, i) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-lg border border-border hover:bg-card/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">{challenge.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{challenge.solves} решений</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            challenge.status === 'active' 
                              ? 'bg-primary/20 text-primary' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {challenge.status === 'active' ? 'Активна' : 'Отключена'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg hover:bg-primary/20 transition-colors"
                        >
                          <Edit className="w-4 h-4 text-primary" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Управление пользователями</h2>
              <p className="text-muted-foreground">Функционал в разработке...</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

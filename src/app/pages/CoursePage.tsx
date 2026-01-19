import { motion } from 'motion/react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  Lock, 
  Clock, 
  BookOpen,
  Star,
  Award,
  Users
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  type: 'video' | 'reading' | 'quiz' | 'lab';
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export function CoursePage() {
  const { courseId } = useParams();
  
  const [course] = useState({
    id: courseId,
    title: 'Web Application Security',
    description: 'Изучите основы безопасности веб-приложений, включая SQL injection, XSS, CSRF и другие уязвимости OWASP Top 10',
    instructor: 'Иван Безопасников',
    rating: 4.8,
    students: 1234,
    duration: '8 недель',
    totalLessons: 24,
    completedLessons: 8,
    difficulty: 'Intermediate',
    category: 'Web Security',
  });

  const [modules] = useState<Module[]>([
    {
      id: '1',
      title: 'Введение в безопасность веб-приложений',
      lessons: [
        { id: '1', title: 'Что такое веб-безопасность', duration: '15 мин', completed: true, locked: false, type: 'video' },
        { id: '2', title: 'OWASP Top 10 обзор', duration: '20 мин', completed: true, locked: false, type: 'video' },
        { id: '3', title: 'Тестирование первой уязвимости', duration: '10 мин', completed: true, locked: false, type: 'quiz' },
      ],
    },
    {
      id: '2',
      title: 'SQL Injection',
      lessons: [
        { id: '4', title: 'Основы SQL Injection', duration: '25 мин', completed: true, locked: false, type: 'video' },
        { id: '5', title: 'Типы SQL Injection', duration: '30 мин', completed: true, locked: false, type: 'reading' },
        { id: '6', title: 'Практика: находим SQL Injection', duration: '45 мин', completed: true, locked: false, type: 'lab' },
        { id: '7', title: 'Тест по SQL Injection', duration: '15 мин', completed: true, locked: false, type: 'quiz' },
      ],
    },
    {
      id: '3',
      title: 'Cross-Site Scripting (XSS)',
      lessons: [
        { id: '8', title: 'Введение в XSS', duration: '20 мин', completed: true, locked: false, type: 'video' },
        { id: '9', title: 'Reflected XSS', duration: '25 мин', completed: false, locked: false, type: 'video' },
        { id: '10', title: 'Stored XSS', duration: '25 мин', completed: false, locked: false, type: 'video' },
        { id: '11', title: 'DOM-based XSS', duration: '30 мин', completed: false, locked: false, type: 'reading' },
        { id: '12', title: 'Практика XSS', duration: '40 мин', completed: false, locked: false, type: 'lab' },
      ],
    },
    {
      id: '4',
      title: 'Cross-Site Request Forgery (CSRF)',
      lessons: [
        { id: '13', title: 'Что такое CSRF', duration: '18 мин', completed: false, locked: false, type: 'video' },
        { id: '14', title: 'CSRF токены', duration: '22 мин', completed: false, locked: false, type: 'reading' },
        { id: '15', title: 'Практика CSRF', duration: '35 мин', completed: false, locked: false, type: 'lab' },
      ],
    },
    {
      id: '5',
      title: 'Аутентификация и сессии',
      lessons: [
        { id: '16', title: 'Основы аутентификации', duration: '20 мин', completed: false, locked: true, type: 'video' },
        { id: '17', title: 'Управление сессиями', duration: '25 мин', completed: false, locked: true, type: 'video' },
        { id: '18', title: 'Атаки на аутентификацию', duration: '30 мин', completed: false, locked: true, type: 'reading' },
      ],
    },
  ]);

  const progress = (course.completedLessons / course.totalLessons) * 100;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Play;
      case 'reading': return BookOpen;
      case 'quiz': return Award;
      case 'lab': return Users;
      default: return BookOpen;
    }
  };

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
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link 
            to="/learning"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к курсам
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Course Modules */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className={`text-sm font-medium ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{course.category}</span>
              </div>

              <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
              <p className="text-muted-foreground mb-4">{course.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="font-medium">{course.rating}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{course.students} студентов</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.totalLessons} уроков</span>
                </div>
              </div>
            </motion.div>

            {/* Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">Прогресс курса</h3>
                <span className="text-sm font-medium">{course.completedLessons} / {course.totalLessons}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">{Math.round(progress)}% завершено</p>
            </motion.div>

            {/* Modules */}
            <div className="space-y-4">
              {modules.map((module, moduleIndex) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + moduleIndex * 0.05 }}
                  className="backdrop-blur-sm bg-card/60 border border-border rounded-xl overflow-hidden"
                >
                  {/* Module Header */}
                  <div className="p-4 bg-muted/30 border-b border-border">
                    <h3 className="font-bold">
                      <span className="text-primary mr-2">Модуль {moduleIndex + 1}:</span>
                      {module.title}
                    </h3>
                  </div>

                  {/* Lessons */}
                  <div className="divide-y divide-border">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const TypeIcon = getTypeIcon(lesson.type);
                      const isAccessible = !lesson.locked;
                      
                      return (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + moduleIndex * 0.05 + lessonIndex * 0.02 }}
                          className={`p-4 ${isAccessible ? 'hover:bg-card/40 cursor-pointer' : 'opacity-50'} transition-all group`}
                        >
                          <Link 
                            to={isAccessible ? `/lesson/${lesson.id}` : '#'}
                            className={!isAccessible ? 'pointer-events-none' : ''}
                          >
                            <div className="flex items-center gap-4">
                              {/* Status Icon */}
                              <div className="flex-shrink-0">
                                {lesson.completed ? (
                                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                  </div>
                                ) : lesson.locked ? (
                                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                    <Lock className="w-4 h-4 text-muted-foreground" />
                                  </div>
                                ) : (
                                  <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors"
                                  >
                                    <TypeIcon className="w-4 h-4 text-secondary" />
                                  </motion.div>
                                )}
                              </div>

                              {/* Lesson Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className={`font-medium mb-1 ${isAccessible ? 'group-hover:text-primary' : ''} transition-colors truncate`}>
                                  {lesson.title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  <span>{lesson.duration}</span>
                                </div>
                              </div>

                              {/* Action Button */}
                              {isAccessible && !lesson.completed && (
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  className="flex-shrink-0"
                                >
                                  <div className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    Начать
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-6 sticky top-24"
            >
              <h3 className="font-bold mb-4">Действия</h3>
              
              <div className="space-y-3">
                <Link to={`/lesson/${modules[0].lessons[0].id}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Продолжить обучение
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  Сертификат
                </motion.button>
              </div>

              {/* Instructor */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Инструктор</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-sm font-bold text-white">ИБ</span>
                  </div>
                  <div>
                    <p className="font-medium">{course.instructor}</p>
                    <p className="text-xs text-muted-foreground">Эксперт по безопасности</p>
                  </div>
                </div>
              </div>

              {/* Course Features */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <p className="text-sm text-muted-foreground mb-3">Что вы получите:</p>
                {[
                  'Практические навыки',
                  'Сертификат об окончании',
                  'Доступ к материалам навсегда',
                  'Поддержка сообщества',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

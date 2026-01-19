import { motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Clock, BookOpen, Play, ChevronRight } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  image: string;
  tags: string[];
}

export function CourseCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const categories = [
    { id: 'all', name: 'Все' },
    { id: 'web', name: 'Web Security' },
    { id: 'network', name: 'Network Security' },
    { id: 'osint', name: 'OSINT' },
    { id: 'malware', name: 'Malware Analysis' },
    { id: 'crypto', name: 'Cryptography' },
  ];

  const difficulties = [
    { id: 'all', name: 'Все уровни' },
    { id: 'Beginner', name: 'Начальный' },
    { id: 'Intermediate', name: 'Средний' },
    { id: 'Advanced', name: 'Продвинутый' },
  ];

  const [courses] = useState<Course[]>([
    {
      id: '1',
      title: 'Web Application Security',
      description: 'Изучите основы безопасности веб-приложений, включая SQL injection, XSS и CSRF',
      category: 'web',
      difficulty: 'Intermediate',
      duration: '8 недель',
      lessons: 24,
      students: 1234,
      rating: 4.8,
      image: 'web-security',
      tags: ['SQL Injection', 'XSS', 'OWASP Top 10'],
    },
    {
      id: '2',
      title: 'Network Penetration Testing',
      description: 'Полный курс по тестированию на проникновение в сетевой инфраструктуре',
      category: 'network',
      difficulty: 'Advanced',
      duration: '10 недель',
      lessons: 32,
      students: 856,
      rating: 4.9,
      image: 'network-pentest',
      tags: ['Nmap', 'Metasploit', 'Network Analysis'],
    },
    {
      id: '3',
      title: 'OSINT Fundamentals',
      description: 'Основы разведки с использованием открытых источников',
      category: 'osint',
      difficulty: 'Beginner',
      duration: '4 недели',
      lessons: 12,
      students: 2341,
      rating: 4.7,
      image: 'osint',
      tags: ['OSINT', 'Reconnaissance', 'Information Gathering'],
    },
    {
      id: '4',
      title: 'Malware Analysis Basics',
      description: 'Введение в анализ вредоносного программного обеспечения',
      category: 'malware',
      difficulty: 'Intermediate',
      duration: '6 недель',
      lessons: 20,
      students: 543,
      rating: 4.6,
      image: 'malware',
      tags: ['Reverse Engineering', 'IDA Pro', 'Ghidra'],
    },
    {
      id: '5',
      title: 'Modern Cryptography',
      description: 'Современные криптографические методы и их применение',
      category: 'crypto',
      difficulty: 'Advanced',
      duration: '8 недель',
      lessons: 28,
      students: 678,
      rating: 4.9,
      image: 'crypto',
      tags: ['Encryption', 'Hash Functions', 'PKI'],
    },
    {
      id: '6',
      title: 'Bug Bounty Hunting',
      description: 'Практический курс по поиску уязвимостей для программ Bug Bounty',
      category: 'web',
      difficulty: 'Intermediate',
      duration: '6 недель',
      lessons: 18,
      students: 1876,
      rating: 4.8,
      image: 'bug-bounty',
      tags: ['Bug Bounty', 'Web Hacking', 'Reporting'],
    },
  ]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

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
            <span className="text-foreground">Каталог </span>
            <span className="text-primary">курсов</span>
          </h1>
          <p className="text-muted-foreground">Выберите курс и начните своё обучение в кибербезопасности</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-6 mb-8"
        >
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск курсов..."
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Category & Difficulty Filters */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Категория</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-input-background border border-border text-foreground focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Сложность</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-input-background border border-border text-foreground focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                >
                  {difficulties.map(diff => (
                    <option key={diff.id} value={diff.id}>{diff.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Найдено курсов: {filteredCourses.length}
          </div>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Link to={`/course/${course.id}`}>
                <div className="backdrop-blur-sm bg-card/60 border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all h-full flex flex-col">
                  {/* Course Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                    <BookOpen className="w-16 h-16 text-primary/50 relative z-10" />
                    <motion.div
                      className="absolute inset-0 bg-primary/10"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                        <Play className="w-6 h-6 text-primary-foreground" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Course Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{course.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-sm font-medium">{course.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {course.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-md bg-primary/10 text-xs text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                      {course.tags.length > 2 && (
                        <span className="px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                          +{course.tags.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{course.lessons} уроков</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-2 text-sm text-primary mt-4 group/cta"
                    >
                      <span className="group-hover/cta:underline">Начать обучение</span>
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Курсы не найдены</h3>
            <p className="text-muted-foreground">Попробуйте изменить фильтры или поисковый запрос</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

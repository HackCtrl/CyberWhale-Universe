import { motion } from 'motion/react';
import { Terminal, Trophy, Clock, Flame, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface Challenge {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  tags: string[];
  status: 'pwned' | 'active';
  solves: number;
  category: string;
}

const machines: Challenge[] = [
  { id: '1', name: 'SQL Injection Master', difficulty: 'Easy', points: 150, tags: ['Web', 'SQL'], status: 'active', solves: 1234, category: 'web' },
  { id: '2', name: 'XSS Challenge', difficulty: 'Easy', points: 120, tags: ['Web', 'XSS'], status: 'pwned', solves: 890, category: 'web' },
  { id: '3', name: 'CryptoMaster', difficulty: 'Medium', points: 300, tags: ['Crypto', 'Math'], status: 'active', solves: 567, category: 'crypto' },
  { id: '4', name: 'ForensicHunter', difficulty: 'Hard', points: 500, tags: ['Forensics', 'Memory'], status: 'active', solves: 234, category: 'forensics' },
  { id: '5', name: 'PrivEscalation', difficulty: 'Medium', points: 350, tags: ['Linux', 'PrivEsc'], status: 'pwned', solves: 789, category: 'misc' },
  { id: '6', name: 'BufferOverflow', difficulty: 'Hard', points: 550, tags: ['Binary', 'PWN'], status: 'active', solves: 123, category: 'binary' },
];

const leaderboard = [
  { rank: 1, name: 'CyberKnight', points: 8750, avatar: '👑' },
  { rank: 2, name: 'HackMaster', points: 7640, avatar: '🦅' },
  { rank: 3, name: 'CryptoWizard', points: 6890, avatar: '🧙' },
  { rank: 4, name: 'SecurityPro', points: 5940, avatar: '🛡️' },
  { rank: 5, name: 'CodeBreaker', points: 5120, avatar: '💎' },
];

export function CTFPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Все' },
    { id: 'web', name: 'Web' },
    { id: 'crypto', name: 'Crypto' },
    { id: 'binary', name: 'Binary' },
    { id: 'forensics', name: 'Forensics' },
    { id: 'misc', name: 'Misc' },
  ];

  const filteredMachines = machines.filter(machine => {
    const matchesSearch = machine.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || machine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <span className="text-foreground">Галактика </span>
            <span className="text-primary">CTF</span>
          </h1>
          <p className="text-muted-foreground">Полигоны, турниры и практические задачи</p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Активные задачи', value: '42', icon: Terminal },
            { label: 'Текущий рейтинг', value: '#156', icon: Trophy },
            { label: 'Решено задач', value: '28', icon: Flame },
            { label: 'Времени в системе', value: '87ч', icon: Clock },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-4 text-center hover:border-primary/50 transition-all"
              >
                <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-6 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск задач..."
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
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
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Challenges */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Доступные задачи</h2>
            <div className="space-y-4">
              {filteredMachines.map((machine, index) => (
                <motion.div
                  key={machine.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ x: 5 }}
                  className="group"
                >
                  <Link to={`/ctf/${machine.id}`}>
                    <div className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-5 hover:border-primary/50 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Terminal className={`w-5 h-5 ${machine.status === 'pwned' ? 'text-primary' : 'text-secondary'}`} />
                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                              {machine.name}
                            </h3>
                            {machine.status === 'pwned' && (
                              <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                                SOLVED
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {machine.tags.map((tag, i) => (
                              <span key={i} className="text-xs px-2 py-1 rounded-md bg-muted/30 text-muted-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className={`text-lg font-bold ${
                            machine.difficulty === 'Easy' ? 'text-primary' :
                            machine.difficulty === 'Medium' ? 'text-secondary' :
                            'text-purple-500'
                          }`}>
                            {machine.points} pts
                          </div>
                          <div className="text-xs text-muted-foreground">{machine.solves} solves</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          machine.difficulty === 'Easy' ? 'bg-primary/20 text-primary' :
                          machine.difficulty === 'Medium' ? 'bg-secondary/20 text-secondary' :
                          'bg-purple-500/20 text-purple-500'
                        }`}>
                          {machine.difficulty}
                        </span>
                        <span className="text-sm text-primary group-hover:underline">
                          {machine.status === 'pwned' ? 'Пройти снова →' : 'Начать →'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">🏆 Топ игроков</h2>
                <Link to="/leaderboard" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  Все →
                </Link>
              </div>
              <div className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-5 space-y-2">
                {leaderboard.map((user, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      index === 0 ? 'bg-primary/10 border border-primary/30' :
                      index === 1 ? 'bg-secondary/10 border border-secondary/30' :
                      index === 2 ? 'bg-purple-500/10 border border-purple-500/30' :
                      'bg-muted/20'
                    }`}
                  >
                    <div className={`text-xl font-bold ${
                      index === 0 ? 'text-primary' :
                      index === 1 ? 'text-secondary' :
                      index === 2 ? 'text-purple-500' :
                      'text-muted-foreground'
                    }`}>
                      #{user.rank}
                    </div>
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.points} pts</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Upcoming Tournament */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-bold mb-4">📅 Ближайший турнир</h3>
              <div className="backdrop-blur-sm bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 rounded-xl p-5">
                <div className="mb-4">
                  <h4 className="font-bold mb-1">CyberWhale CTF 2026</h4>
                  <p className="text-sm text-muted-foreground mb-2">Начало через 3 дня</p>
                  <div className="text-xs text-muted-foreground">Призовой фонд: $10,000</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all"
                >
                  Зарегистрироваться
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
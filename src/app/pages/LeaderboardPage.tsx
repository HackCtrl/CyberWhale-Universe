import { motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Medal, Award, TrendingUp, Crown, Star } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  solves: number;
  avatar: string;
  country: string;
  trend: 'up' | 'down' | 'same';
}

export function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week'>('all');
  const [category, setCategory] = useState<'all' | 'web' | 'crypto' | 'binary' | 'misc'>('all');

  const [leaderboard] = useState<LeaderboardUser[]>([
    { rank: 1, name: 'HackerPro2024', points: 15420, solves: 87, avatar: '🦈', country: 'RU', trend: 'same' },
    { rank: 2, name: 'CyberNinja', points: 14890, solves: 82, avatar: '🥷', country: 'RU', trend: 'up' },
    { rank: 3, name: 'SecurityMaster', points: 13750, solves: 79, avatar: '🛡️', country: 'UA', trend: 'down' },
    { rank: 4, name: 'CodeBreaker', points: 12340, solves: 71, avatar: '💻', country: 'BY', trend: 'up' },
    { rank: 5, name: 'BugHunter', points: 11560, solves: 68, avatar: '🐛', country: 'KZ', trend: 'same' },
    { rank: 6, name: 'WhiteHatWarrior', points: 10890, solves: 64, avatar: '⚔️', country: 'RU', trend: 'up' },
    { rank: 7, name: 'SQLNinja', points: 9870, solves: 59, avatar: '🗡️', country: 'RU', trend: 'down' },
    { rank: 8, name: 'CryptoWizard', points: 9120, solves: 56, avatar: '🧙', country: 'UA', trend: 'up' },
    { rank: 9, name: 'NetPentester', points: 8650, solves: 52, avatar: '🌐', country: 'RU', trend: 'same' },
    { rank: 10, name: 'MalwareAnalyst', points: 8200, solves: 49, avatar: '🔬', country: 'BY', trend: 'up' },
  ]);

  const [currentUser] = useState({
    rank: 156,
    name: 'Кибервоин',
    points: 3450,
    solves: 23,
    avatar: '🐋',
    country: 'RU',
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-primary" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <Trophy className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-primary via-primary to-primary/80';
      case 2: return 'from-gray-400 via-gray-300 to-gray-400';
      case 3: return 'from-amber-600 via-amber-500 to-amber-600';
      default: return 'from-muted via-muted to-muted';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-primary" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-destructive rotate-180" />;
      default: return null;
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
            <span className="text-foreground">Таблица </span>
            <span className="text-primary">лидеров</span>
          </h1>
          <p className="text-muted-foreground">Соревнуйтесь с лучшими специалистами кибербезопасности</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-6 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Период</label>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'Все время' },
                  { id: 'month', label: 'Месяц' },
                  { id: 'week', label: 'Неделя' },
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimeframe(item.id as any)}
                    className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                      timeframe === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'border-2 border-border hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Категория</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2 rounded-lg bg-input-background border border-border text-foreground focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="all">Все категории</option>
                <option value="web">Web Security</option>
                <option value="crypto">Cryptography</option>
                <option value="binary">Binary Exploitation</option>
                <option value="misc">Miscellaneous</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 grid md:grid-cols-3 gap-4"
        >
          {[leaderboard[1], leaderboard[0], leaderboard[2]].map((user, i) => {
            const actualRank = user?.rank || i + 1;
            const heightClass = i === 1 ? 'md:h-72' : i === 0 ? 'md:h-60' : 'md:h-52';
            
            return (
              <motion.div
                key={user?.name || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`backdrop-blur-sm bg-card/60 border-2 ${
                  actualRank === 1 ? 'border-primary' : 'border-border'
                } rounded-xl p-6 flex flex-col items-center justify-end ${heightClass} relative overflow-hidden`}
              >
                {/* Rank Badge */}
                <div className="absolute top-4 right-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankBadgeColor(actualRank)} flex items-center justify-center`}>
                    {getRankIcon(actualRank)}
                  </div>
                </div>

                {/* Avatar */}
                <div className={`${actualRank === 1 ? 'w-24 h-24' : 'w-20 h-20'} rounded-full bg-gradient-to-br ${getRankBadgeColor(actualRank)} flex items-center justify-center text-4xl mb-4 ring-4 ring-background`}>
                  {user?.avatar}
                </div>

                {/* User Info */}
                <h3 className="text-xl font-bold mb-1">{user?.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{user?.country}</p>

                {/* Stats */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {user?.points.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user?.solves} решений
                  </div>
                </div>

                {/* Special Badge for #1 */}
                {actualRank === 1 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="mt-3 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium flex items-center gap-1"
                  >
                    <Star className="w-3 h-3 fill-primary" />
                    Лидер рейтинга
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Current User Rank */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-sm bg-primary/10 border-2 border-primary rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl ring-4 ring-primary/20">
                {currentUser.avatar}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">{currentUser.name}</h3>
                <p className="text-sm text-muted-foreground">Ваша позиция</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">#{currentUser.rank}</div>
                <div className="text-xs text-muted-foreground">Ранг</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{currentUser.points.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Очков</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{currentUser.solves}</div>
                <div className="text-xs text-muted-foreground">Решений</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-sm bg-card/60 border border-border rounded-xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="p-4 bg-muted/30 border-b border-border grid grid-cols-12 gap-4 text-sm font-medium">
            <div className="col-span-1 text-center">Ранг</div>
            <div className="col-span-5">Пользователь</div>
            <div className="col-span-2 text-center">Очки</div>
            <div className="col-span-2 text-center">Решения</div>
            <div className="col-span-2 text-center">Тренд</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {leaderboard.map((user, i) => (
              <motion.div
                key={user.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.03 }}
                className="p-4 hover:bg-card/40 transition-colors grid grid-cols-12 gap-4 items-center"
              >
                {/* Rank */}
                <div className="col-span-1 flex justify-center">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getRankBadgeColor(user.rank)} flex items-center justify-center font-bold`}>
                    {user.rank <= 3 ? getRankIcon(user.rank) : user.rank}
                  </div>
                </div>

                {/* User Info */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xl">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate hover:text-primary transition-colors">
                      {user.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{user.country}</div>
                  </div>
                </div>

                {/* Points */}
                <div className="col-span-2 text-center">
                  <div className="font-bold text-primary">{user.points.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">pts</div>
                </div>

                {/* Solves */}
                <div className="col-span-2 text-center">
                  <div className="font-medium">{user.solves}</div>
                  <div className="text-xs text-muted-foreground">tasks</div>
                </div>

                {/* Trend */}
                <div className="col-span-2 flex justify-center">
                  {getTrendIcon(user.trend)}
                </div>
              </motion.div>
            ))}
          </div>

          {/* View More */}
          <div className="p-4 border-t border-border text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium"
            >
              Загрузить еще
            </motion.button>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Решайте задачи и поднимайтесь в рейтинге!
          </p>
          <Link to="/ctf">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(159, 239, 0, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto"
            >
              <Trophy className="w-5 h-5" />
              Перейти к CTF
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

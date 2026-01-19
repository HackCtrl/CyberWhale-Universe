import { motion } from 'motion/react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Flag,
  Award,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Lightbulb,
  Send,
  Loader2
} from 'lucide-react';

interface Hint {
  id: string;
  text: string;
  cost: number;
  revealed: boolean;
}

export function CTFChallengePage() {
  const { challengeId } = useParams();
  
  const [challenge] = useState({
    id: challengeId,
    title: 'SQL Injection Master',
    description: 'Найдите способ обойти аутентификацию и получите доступ к административной панели.',
    category: 'Web Security',
    difficulty: 'Medium',
    points: 250,
    solves: 342,
    rating: 4.7,
    solved: false,
    author: 'CyberMaster',
    tags: ['SQL Injection', 'Authentication Bypass', 'Web'],
  });

  const [hints] = useState<Hint[]>([
    { id: '1', text: 'Посмотрите на SQL-запрос, который выполняется при входе', cost: 25, revealed: false },
    { id: '2', text: 'Попробуйте использовать комментарии SQL', cost: 50, revealed: false },
    { id: '3', text: 'Используйте \' OR \'1\'=\'1 для обхода проверки пароля', cost: 100, revealed: false },
  ]);

  const [flag, setFlag] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<'success' | 'error' | null>(null);
  const [showFlag, setShowFlag] = useState(false);
  const [revealedHints, setRevealedHints] = useState<string[]>([]);

  const handleRevealHint = (hintId: string) => {
    if (!revealedHints.includes(hintId)) {
      setRevealedHints([...revealedHints, hintId]);
    }
  };

  const handleSubmitFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult(null);

    // Симуляция проверки флага
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Проверяем флаг (в реальности это было бы API запросом)
    const correctFlag = 'CTF{sql_1nj3ct10n_m4st3r}';
    
    if (flag.trim() === correctFlag) {
      setSubmitResult('success');
    } else {
      setSubmitResult('error');
    }

    setSubmitting(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-primary';
      case 'Medium': return 'text-secondary';
      case 'Hard': return 'text-purple-500';
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
            to="/ctf"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к CTF
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Challenge Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{challenge.category}</span>
              </div>

              <h1 className="text-3xl font-bold mb-4">{challenge.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="font-medium text-primary">{challenge.points} points</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{challenge.solves} solves</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>By {challenge.author}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {challenge.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-md bg-primary/10 text-xs text-primary"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Challenge Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-6"
            >
              <h2 className="text-xl font-bold mb-4">Описание задачи</h2>
              <p className="text-muted-foreground mb-4">{challenge.description}</p>

              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <h3 className="font-bold mb-2">Цель:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Исследуйте веб-приложение</li>
                  <li>• Найдите уязвимость SQL Injection</li>
                  <li>• Обойдите систему аутентификации</li>
                  <li>• Получите флаг из административной панели</li>
                </ul>
              </div>

              <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/30">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-primary mb-1">Подсказка</p>
                    <p className="text-sm text-muted-foreground">
                      Формат флага: <code className="px-2 py-0.5 rounded bg-muted">CTF&#123;...&#125;</code>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Challenge Environment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-6"
            >
              <h2 className="text-xl font-bold mb-4">Окружение</h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-input-background border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Challenge URL:</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 rounded-md bg-primary/20 text-primary text-xs hover:bg-primary/30 transition-colors"
                    >
                      Copy
                    </motion.button>
                  </div>
                  <code className="text-sm text-primary break-all">
                    https://challenge.cyberwhale.universe/sql-injection-{challengeId}
                  </code>
                </div>

                <motion.a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full py-3 rounded-lg bg-secondary text-secondary-foreground text-center font-medium hover:bg-secondary/90 transition-all"
                >
                  Открыть задачу в новой вкладке
                </motion.a>
              </div>
            </motion.div>

            {/* Submit Flag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-6"
            >
              <h2 className="text-xl font-bold mb-4">Отправить флаг</h2>

              {submitResult === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/30 flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-primary">Поздравляем! Флаг принят!</p>
                    <p className="text-sm text-muted-foreground">Вы получили {challenge.points} очков</p>
                  </div>
                </motion.div>
              )}

              {submitResult === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                  <div>
                    <p className="font-medium text-destructive">Неверный флаг</p>
                    <p className="text-sm text-muted-foreground">Попробуйте еще раз</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmitFlag} className="space-y-4">
                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showFlag ? 'text' : 'password'}
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    placeholder="CTF{...}"
                    disabled={submitting || submitResult === 'success'}
                    className="w-full pl-11 pr-11 py-3 rounded-lg bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFlag(!showFlag)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showFlag ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <motion.button
                  type="submit"
                  disabled={!flag.trim() || submitting || submitResult === 'success'}
                  whileHover={!submitting && submitResult !== 'success' ? { scale: 1.02 } : {}}
                  whileTap={!submitting && submitResult !== 'success' ? { scale: 0.98 } : {}}
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Проверка...
                    </>
                  ) : submitResult === 'success' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Решено!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Отправить флаг
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hints */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-6 sticky top-24"
            >
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Подсказки</h3>
              </div>

              <div className="space-y-3">
                {hints.map((hint, i) => {
                  const isRevealed = revealedHints.includes(hint.id);
                  
                  return (
                    <div
                      key={hint.id}
                      className="p-4 rounded-lg border border-border bg-card/40"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Подсказка {i + 1}</span>
                        <span className="text-xs text-primary">-{hint.cost} pts</span>
                      </div>

                      {isRevealed ? (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-muted-foreground"
                        >
                          {hint.text}
                        </motion.p>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleRevealHint(hint.id)}
                          className="w-full py-2 rounded-md bg-primary/20 text-primary text-sm hover:bg-primary/30 transition-colors"
                        >
                          Открыть подсказку
                        </motion.button>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-6"
            >
              <h3 className="font-bold mb-4">Действия</h3>
              <div className="space-y-2">
                <Link to="/ctf">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-sm"
                  >
                    Другие задачи
                  </motion.button>
                </Link>
                <Link to="/leaderboard">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-sm"
                  >
                    Таблица лидеров
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

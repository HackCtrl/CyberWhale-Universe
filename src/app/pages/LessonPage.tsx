import { motion } from 'motion/react';
import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  BookOpen,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  
  const [lesson] = useState({
    id: lessonId,
    title: 'Основы SQL Injection',
    courseTitle: 'Web Application Security',
    courseId: '1',
    duration: '25 мин',
    type: 'video',
    content: `
      <h2>Что такое SQL Injection?</h2>
      <p>SQL Injection (SQLi) — это тип уязвимости безопасности веб-приложений, который позволяет злоумышленнику влиять на запросы к базе данных.</p>
      
      <h3>Как это работает?</h3>
      <p>Когда приложение использует пользовательский ввод для построения SQL-запросов без должной валидации, злоумышленник может внедрить собственный SQL-код.</p>
      
      <h3>Пример уязвимого кода:</h3>
      <pre><code>SELECT * FROM users WHERE username = '$username' AND password = '$password'</code></pre>
      
      <p>Если злоумышленник введет <code>' OR '1'='1</code> в качестве имени пользователя, запрос станет:</p>
      <pre><code>SELECT * FROM users WHERE username = '' OR '1'='1' AND password = ''</code></pre>
      
      <h3>Типы SQL Injection:</h3>
      <ul>
        <li><strong>In-band SQLi:</strong> Самый простой тип, результаты видны сразу</li>
        <li><strong>Blind SQLi:</strong> Результаты не видны напрямую</li>
        <li><strong>Out-of-band SQLi:</strong> Использует другие каналы для получения данных</li>
      </ul>
      
      <h3>Защита от SQL Injection:</h3>
      <ul>
        <li>Использование параметризованных запросов (Prepared Statements)</li>
        <li>Валидация пользовательского ввода</li>
        <li>Использование ORM (Object-Relational Mapping)</li>
        <li>Принцип наименьших привилегий для БД</li>
      </ul>
    `,
    completed: false,
  });

  const [quiz] = useState<QuizQuestion[]>([
    {
      question: 'Что такое SQL Injection?',
      options: [
        'Способ оптимизации базы данных',
        'Уязвимость, позволяющая внедрять SQL-код',
        'Метод шифрования данных',
        'Инструмент для тестирования БД'
      ],
      correctAnswer: 1,
    },
    {
      question: 'Какой метод защиты наиболее эффективен против SQLi?',
      options: [
        'Использование JavaScript валидации',
        'Отключение базы данных',
        'Параметризованные запросы',
        'Увеличение размера пароля'
      ],
      correctAnswer: 2,
    },
    {
      question: 'Что произойдет при вводе \' OR \'1\'=\'1 в уязвимый запрос?',
      options: [
        'Запрос вернет ошибку',
        'Ничего не произойдет',
        'Запрос вернет все записи',
        'База данных будет удалена'
      ],
      correctAnswer: 2,
    },
  ]);

  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(quiz.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    
    // Симуляция проверки
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitting(false);
    setShowResults(true);
    
    // Проверяем, все ли ответы правильные
    const allCorrect = quiz.every((q, i) => selectedAnswers[i] === q.correctAnswer);
    if (allCorrect) {
      setLessonCompleted(true);
    }
  };

  const calculateScore = () => {
    const correct = quiz.filter((q, i) => selectedAnswers[i] === q.correctAnswer).length;
    return Math.round((correct / quiz.length) * 100);
  };

  const handleComplete = () => {
    // Редирект к следующему уроку или обратно к курсу
    navigate(`/course/${lesson.courseId}`);
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link 
            to={`/course/${lesson.courseId}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к курсу
          </Link>

          <div className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <BookOpen className="w-4 h-4" />
              <span>{lesson.courseTitle}</span>
            </div>
            <h1 className="text-3xl font-bold mb-3">{lesson.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{lesson.duration}</span>
            </div>
          </div>
        </motion.div>

        {/* Lesson Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-8 mb-6"
        >
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
            style={{
              color: 'var(--color-foreground)',
            }}
          />
        </motion.div>

        {/* Quiz Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Тест по материалу</h2>
              <p className="text-sm text-muted-foreground">Проверьте свои знания</p>
            </div>
          </div>

          {lessonCompleted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/30 flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-primary">Отлично! Урок пройден!</p>
                <p className="text-sm text-muted-foreground">Вы правильно ответили на все вопросы</p>
              </div>
            </motion.div>
          )}

          <div className="space-y-6">
            {quiz.map((question, qIndex) => (
              <motion.div
                key={qIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + qIndex * 0.1 }}
                className="p-6 rounded-xl border border-border bg-card/40"
              >
                <h3 className="font-bold mb-4">
                  <span className="text-primary mr-2">Вопрос {qIndex + 1}:</span>
                  {question.question}
                </h3>

                <div className="space-y-3">
                  {question.options.map((option, oIndex) => {
                    const isSelected = selectedAnswers[qIndex] === oIndex;
                    const isCorrect = question.correctAnswer === oIndex;
                    const showCorrectness = showResults && isSelected;
                    
                    let borderColor = 'border-border';
                    let bgColor = 'bg-input-background';
                    
                    if (showResults) {
                      if (isCorrect) {
                        borderColor = 'border-primary';
                        bgColor = 'bg-primary/10';
                      } else if (isSelected && !isCorrect) {
                        borderColor = 'border-destructive';
                        bgColor = 'bg-destructive/10';
                      }
                    } else if (isSelected) {
                      borderColor = 'border-primary';
                      bgColor = 'bg-primary/5';
                    }

                    return (
                      <motion.button
                        key={oIndex}
                        whileHover={!showResults ? { scale: 1.01, x: 5 } : {}}
                        whileTap={!showResults ? { scale: 0.99 } : {}}
                        onClick={() => !showResults && handleAnswerSelect(qIndex, oIndex)}
                        disabled={showResults}
                        className={`w-full p-4 rounded-lg border-2 ${borderColor} ${bgColor} text-left transition-all disabled:cursor-not-allowed flex items-center gap-3`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                        }`}>
                          {isSelected && (
                            <div className="w-3 h-3 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="flex-1">{option}</span>
                        {showResults && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                        {showResults && isSelected && !isCorrect && (
                          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quiz Actions */}
          {!showResults ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmitQuiz}
              disabled={selectedAnswers.includes(-1) || submitting}
              className="w-full mt-6 py-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Проверка ответов...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Проверить ответы
                </>
              )}
            </motion.button>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="p-6 rounded-xl border-2 border-primary bg-primary/5">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{calculateScore()}%</div>
                  <p className="text-muted-foreground">
                    {calculateScore() === 100 
                      ? 'Отлично! Все ответы верны!' 
                      : 'Попробуйте еще раз для получения сертификата'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                {lessonCompleted ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleComplete}
                    className="flex-1 py-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                    Следующий урок
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowResults(false);
                      setSelectedAnswers(new Array(quiz.length).fill(-1));
                    }}
                    className="flex-1 py-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                  >
                    Попробовать снова
                  </motion.button>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <Link to={`/course/${lesson.courseId}`}>
            <motion.button
              whileHover={{ scale: 1.02, x: -5 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Предыдущий урок
            </motion.button>
          </Link>

          <Link to={`/course/${lesson.courseId}`}>
            <motion.button
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-2"
            >
              Следующий урок
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

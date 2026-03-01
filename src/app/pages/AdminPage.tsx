import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
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

type Tab = 'overview' | 'courses' | 'ctf' | 'users';

interface Lesson {
  id: number;
  title: string;
  content: string | null;
  courseId: number;
}

interface Course {
  id: number;
  title: string;
  description: string | null;
  lessons: Lesson[];
}

interface Challenge {
  id: number;
  title: string;
  description: string | null;
  flag: string;
  difficulty: number;
}

interface AdminUser {
  id: number;
  email: string;
  name: string | null;
  createdAt: string;
  progressRecords: number;
}

interface AuthUser {
  id: number;
  email: string;
  name?: string | null;
}

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000';

async function request(path: string, options: RequestInit = {}, token?: string | null) {
  const headers: Record<string, string> = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(data?.error || `HTTP ${response.status}`);
  }
  return data;
}

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('cw_admin_token'));
  const [me, setMe] = useState<AuthUser | null>(null);
  const [loginEmail, setLoginEmail] = useState('admin@cyberwhale.test');
  const [loginPassword, setLoginPassword] = useState('301062');

  const [courses, setCourses] = useState<Course[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);

  const [courseForm, setCourseForm] = useState({ title: '', description: '' });
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);

  const [lessonDrafts, setLessonDrafts] = useState<Record<number, { title: string; content: string }>>({});
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [lessonEditForm, setLessonEditForm] = useState({ title: '', content: '' });

  const [challengeForm, setChallengeForm] = useState({ title: '', description: '', flag: '', difficulty: '1' });
  const [editingChallengeId, setEditingChallengeId] = useState<number | null>(null);

  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [userForm, setUserForm] = useState({ email: '', name: '' });

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: TrendingUp },
    { id: 'courses', label: 'Курсы', icon: BookOpen },
    { id: 'ctf', label: 'CTF', icon: Shield },
    { id: 'users', label: 'Пользователи', icon: Users },
  ];

  const totalLessons = useMemo(() => courses.reduce((sum, course) => sum + course.lessons.length, 0), [courses]);

  async function loadCoursesAndChallenges() {
    const [coursesData, ctfData] = await Promise.all([
      request('/api/courses'),
      request('/api/ctf'),
    ]);
    setCourses(coursesData);
    setChallenges(ctfData);
  }

  async function loadAuthData(authToken: string) {
    const [meData, usersData] = await Promise.all([
      request('/api/auth/me', {}, authToken),
      request('/api/admin/users', {}, authToken),
    ]);
    setMe(meData.user);
    setUsers(usersData);
  }

  async function loadAll() {
    try {
      setLoading(true);
      setError('');
      await loadCoursesAndChallenges();
      if (token) {
        await loadAuthData(token);
      } else {
        setUsers([]);
        setMe(null);
      }
    } catch (e: any) {
      setError(e.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, [token]);

  function setSuccess(text: string) {
    setMessage(text);
    setError('');
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const loginData = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      localStorage.setItem('cw_admin_token', loginData.token);
      setToken(loginData.token);
      setSuccess('Вход выполнен');
    } catch (e: any) {
      setError(e.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('cw_admin_token');
    setToken(null);
    setSuccess('Выход выполнен');
  }

  async function saveCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return setError('Нужна авторизация');
    if (!courseForm.title.trim()) return setError('Введите название курса');
    try {
      setLoading(true);
      const payload = { title: courseForm.title.trim(), description: courseForm.description.trim() || null };
      if (editingCourseId) {
        await request(`/api/courses/${editingCourseId}`, { method: 'PUT', body: JSON.stringify(payload) }, token);
        setSuccess('Курс обновлён');
      } else {
        await request('/api/courses', { method: 'POST', body: JSON.stringify(payload) }, token);
        setSuccess('Курс создан');
      }
      setCourseForm({ title: '', description: '' });
      setEditingCourseId(null);
      await loadCoursesAndChallenges();
    } catch (e: any) {
      setError(e.message || 'Ошибка сохранения курса');
    } finally {
      setLoading(false);
    }
  }

  function startCourseEdit(course: Course) {
    setEditingCourseId(course.id);
    setCourseForm({ title: course.title, description: course.description || '' });
  }

  async function deleteCourse(courseId: number) {
    if (!token) return setError('Нужна авторизация');
    if (!confirm('Удалить курс вместе с уроками?')) return;
    try {
      setLoading(true);
      await request(`/api/courses/${courseId}`, { method: 'DELETE' }, token);
      setSuccess('Курс удалён');
      await loadCoursesAndChallenges();
    } catch (e: any) {
      setError(e.message || 'Ошибка удаления курса');
    } finally {
      setLoading(false);
    }
  }

  async function addLesson(courseId: number) {
    if (!token) return setError('Нужна авторизация');
    const draft = lessonDrafts[courseId] || { title: '', content: '' };
    if (!draft.title.trim()) return setError('Введите название урока');
    try {
      setLoading(true);
      await request(`/api/courses/${courseId}/lessons`, {
        method: 'POST',
        body: JSON.stringify({ title: draft.title.trim(), content: draft.content.trim() || null }),
      }, token);
      setLessonDrafts((prev) => ({ ...prev, [courseId]: { title: '', content: '' } }));
      setSuccess('Урок добавлен');
      await loadCoursesAndChallenges();
    } catch (e: any) {
      setError(e.message || 'Ошибка добавления урока');
    } finally {
      setLoading(false);
    }
  }

  function startLessonEdit(lesson: Lesson) {
    setEditingLessonId(lesson.id);
    setLessonEditForm({ title: lesson.title, content: lesson.content || '' });
  }

  async function updateLesson(lessonId: number) {
    if (!token) return setError('Нужна авторизация');
    if (!lessonEditForm.title.trim()) return setError('Введите название урока');
    try {
      setLoading(true);
      await request(`/api/lessons/${lessonId}`, {
        method: 'PUT',
        body: JSON.stringify({ title: lessonEditForm.title.trim(), content: lessonEditForm.content.trim() || null }),
      }, token);
      setEditingLessonId(null);
      setLessonEditForm({ title: '', content: '' });
      setSuccess('Урок обновлён');
      await loadCoursesAndChallenges();
    } catch (e: any) {
      setError(e.message || 'Ошибка обновления урока');
    } finally {
      setLoading(false);
    }
  }

  async function deleteLesson(lessonId: number) {
    if (!token) return setError('Нужна авторизация');
    if (!confirm('Удалить урок?')) return;
    try {
      setLoading(true);
      await request(`/api/lessons/${lessonId}`, { method: 'DELETE' }, token);
      setSuccess('Урок удалён');
      await loadCoursesAndChallenges();
    } catch (e: any) {
      setError(e.message || 'Ошибка удаления урока');
    } finally {
      setLoading(false);
    }
  }

  async function saveChallenge(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return setError('Нужна авторизация');
    if (!challengeForm.title.trim() || !challengeForm.flag.trim()) return setError('Название и флаг обязательны');
    try {
      setLoading(true);
      const payload = {
        title: challengeForm.title.trim(),
        description: challengeForm.description.trim() || null,
        flag: challengeForm.flag.trim(),
        difficulty: Number(challengeForm.difficulty) || 1,
      };
      if (editingChallengeId) {
        await request(`/api/ctf/${editingChallengeId}`, { method: 'PUT', body: JSON.stringify(payload) }, token);
        setSuccess('CTF-задача обновлена');
      } else {
        await request('/api/ctf', { method: 'POST', body: JSON.stringify(payload) }, token);
        setSuccess('CTF-задача создана');
      }
      setChallengeForm({ title: '', description: '', flag: '', difficulty: '1' });
      setEditingChallengeId(null);
      await loadCoursesAndChallenges();
    } catch (e: any) {
      setError(e.message || 'Ошибка сохранения CTF-задачи');
    } finally {
      setLoading(false);
    }
  }

  function startChallengeEdit(challenge: Challenge) {
    setEditingChallengeId(challenge.id);
    setChallengeForm({
      title: challenge.title,
      description: challenge.description || '',
      flag: challenge.flag,
      difficulty: String(challenge.difficulty),
    });
  }

  async function deleteChallenge(challengeId: number) {
    if (!token) return setError('Нужна авторизация');
    if (!confirm('Удалить CTF-задачу?')) return;
    try {
      setLoading(true);
      await request(`/api/ctf/${challengeId}`, { method: 'DELETE' }, token);
      setSuccess('CTF-задача удалена');
      await loadCoursesAndChallenges();
    } catch (e: any) {
      setError(e.message || 'Ошибка удаления CTF-задачи');
    } finally {
      setLoading(false);
    }
  }

  function startUserEdit(user: AdminUser) {
    setEditingUserId(user.id);
    setUserForm({ email: user.email, name: user.name || '' });
  }

  async function saveUser(userId: number) {
    if (!token) return setError('Нужна авторизация');
    if (!userForm.email.trim()) return setError('Email обязателен');
    try {
      setLoading(true);
      await request(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ email: userForm.email.trim(), name: userForm.name.trim() || null }),
      }, token);
      setEditingUserId(null);
      setUserForm({ email: '', name: '' });
      setSuccess('Пользователь обновлён');
      await loadAuthData(token);
    } catch (e: any) {
      setError(e.message || 'Ошибка обновления пользователя');
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(userId: number) {
    if (!token) return setError('Нужна авторизация');
    if (!confirm('Удалить пользователя?')) return;
    try {
      setLoading(true);
      await request(`/api/admin/users/${userId}`, { method: 'DELETE' }, token);
      setSuccess('Пользователь удалён');
      await loadAuthData(token);
    } catch (e: any) {
      setError(e.message || 'Ошибка удаления пользователя');
    } finally {
      setLoading(false);
    }
  }

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-sm bg-card/60 border border-border rounded-xl p-4 mb-6"
        >
          {token && me ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-medium">Авторизован: {me.name || me.email}</div>
                <div className="text-sm text-muted-foreground">{me.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Выйти
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="grid md:grid-cols-4 gap-3 items-end">
              <div className="md:col-span-1">
                <label className="block text-sm mb-1">Email</label>
                <input
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-input-background border border-border"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm mb-1">Пароль</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-input-background border border-border"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-60"
              >
                Войти как админ
              </button>
              <div className="text-sm text-muted-foreground">Нужна авторизация для операций изменения данных</div>
            </form>
          )}
        </motion.div>

        {(error || message) && (
          <div className={`mb-6 p-3 rounded-lg border ${error ? 'border-destructive text-destructive' : 'border-primary text-primary'}`}>
            {error || message}
          </div>
        )}

        {/* Stats Overview */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Пользователи', value: users.length, icon: Users },
              { label: 'Курсы', value: courses.length, icon: BookOpen },
              { label: 'CTF задачи', value: challenges.length, icon: Shield },
              { label: 'Уроки', value: totalLessons, icon: Award },
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
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
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
                onClick={() => setActiveTab(tab.id as Tab)}
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
              <h2 className="text-2xl font-bold mb-6">Сводка</h2>
              <div className="space-y-3">
                {[
                  `Курсов в системе: ${courses.length}`,
                  `Уроков в системе: ${totalLessons}`,
                  `CTF задач в системе: ${challenges.length}`,
                  token ? `Пользователей доступно в админке: ${users.length}` : 'Для управления пользователями авторизуйтесь',
                ].map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="p-4 rounded-lg border border-border hover:bg-card/40 transition-colors"
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Управление курсами</h2>
                <button
                  onClick={() => {
                    setEditingCourseId(null);
                    setCourseForm({ title: '', description: '' });
                  }}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Новый курс
                </button>
              </div>

              <form onSubmit={saveCourse} className="grid md:grid-cols-4 gap-3 mb-6 p-4 rounded-lg border border-border">
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Название курса</label>
                  <input
                    value={courseForm.title}
                    onChange={(e) => setCourseForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-input-background border border-border"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Описание</label>
                  <input
                    value={courseForm.description}
                    onChange={(e) => setCourseForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-input-background border border-border"
                  />
                </div>
                <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium">
                  {editingCourseId ? 'Сохранить курс' : 'Создать курс'}
                </button>
                {editingCourseId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCourseId(null);
                      setCourseForm({ title: '', description: '' });
                    }}
                    className="px-4 py-2 rounded-lg border border-border"
                  >
                    Отмена
                  </button>
                )}
              </form>

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
                          <span>Уроков: {course.lessons.length}</span>
                          {course.description && <span>{course.description}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startCourseEdit(course)}
                          className="p-2 rounded-lg hover:bg-primary/20 transition-colors"
                        >
                          <Edit className="w-4 h-4 text-primary" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteCourse(course.id)}
                          className="p-2 rounded-lg hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </motion.button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <h4 className="font-medium mb-3">Уроки</h4>
                      <div className="space-y-2 mb-3">
                        {course.lessons.map((lesson) => (
                          <div key={lesson.id} className="p-3 rounded-lg border border-border/60">
                            {editingLessonId === lesson.id ? (
                              <div className="grid md:grid-cols-3 gap-2">
                                <input
                                  value={lessonEditForm.title}
                                  onChange={(e) => setLessonEditForm((prev) => ({ ...prev, title: e.target.value }))}
                                  className="px-3 py-2 rounded-lg bg-input-background border border-border"
                                />
                                <input
                                  value={lessonEditForm.content}
                                  onChange={(e) => setLessonEditForm((prev) => ({ ...prev, content: e.target.value }))}
                                  className="px-3 py-2 rounded-lg bg-input-background border border-border"
                                />
                                <div className="flex gap-2">
                                  <button onClick={() => updateLesson(lesson.id)} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground">Сохранить</button>
                                  <button onClick={() => setEditingLessonId(null)} className="px-3 py-2 rounded-lg border border-border">Отмена</button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <div className="font-medium">{lesson.title}</div>
                                  {lesson.content && <div className="text-sm text-muted-foreground">{lesson.content}</div>}
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => startLessonEdit(lesson)} className="p-2 rounded-lg hover:bg-primary/20"><Edit className="w-4 h-4 text-primary" /></button>
                                  <button onClick={() => deleteLesson(lesson.id)} className="p-2 rounded-lg hover:bg-destructive/20"><Trash2 className="w-4 h-4 text-destructive" /></button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="grid md:grid-cols-3 gap-2">
                        <input
                          placeholder="Название урока"
                          value={(lessonDrafts[course.id]?.title || '')}
                          onChange={(e) => setLessonDrafts((prev) => ({ ...prev, [course.id]: { title: e.target.value, content: prev[course.id]?.content || '' } }))}
                          className="px-3 py-2 rounded-lg bg-input-background border border-border"
                        />
                        <input
                          placeholder="Содержимое"
                          value={(lessonDrafts[course.id]?.content || '')}
                          onChange={(e) => setLessonDrafts((prev) => ({ ...prev, [course.id]: { title: prev[course.id]?.title || '', content: e.target.value } }))}
                          className="px-3 py-2 rounded-lg bg-input-background border border-border"
                        />
                        <button onClick={() => addLesson(course.id)} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground">Добавить урок</button>
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
                <button
                  onClick={() => {
                    setEditingChallengeId(null);
                    setChallengeForm({ title: '', description: '', flag: '', difficulty: '1' });
                  }}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Новая задача
                </button>
              </div>

              <form onSubmit={saveChallenge} className="grid md:grid-cols-4 gap-3 mb-6 p-4 rounded-lg border border-border">
                <div>
                  <label className="block text-sm mb-1">Название</label>
                  <input value={challengeForm.title} onChange={(e) => setChallengeForm((prev) => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-input-background border border-border" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Flag</label>
                  <input value={challengeForm.flag} onChange={(e) => setChallengeForm((prev) => ({ ...prev, flag: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-input-background border border-border" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Сложность</label>
                  <input type="number" min={1} value={challengeForm.difficulty} onChange={(e) => setChallengeForm((prev) => ({ ...prev, difficulty: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-input-background border border-border" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Описание</label>
                  <input value={challengeForm.description} onChange={(e) => setChallengeForm((prev) => ({ ...prev, description: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-input-background border border-border" />
                </div>
                <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground">{editingChallengeId ? 'Сохранить задачу' : 'Создать задачу'}</button>
                {editingChallengeId && <button type="button" onClick={() => setEditingChallengeId(null)} className="px-4 py-2 rounded-lg border border-border">Отмена</button>}
              </form>

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
                          <span>Сложность: {challenge.difficulty}</span>
                          {challenge.description && <span>{challenge.description}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startChallengeEdit(challenge)}
                          className="p-2 rounded-lg hover:bg-primary/20 transition-colors"
                        >
                          <Edit className="w-4 h-4 text-primary" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteChallenge(challenge.id)}
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
              {!token ? (
                <p className="text-muted-foreground">Сначала войдите как администратор.</p>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="p-4 rounded-lg border border-border">
                      {editingUserId === user.id ? (
                        <div className="grid md:grid-cols-4 gap-2">
                          <input value={userForm.email} onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))} className="px-3 py-2 rounded-lg bg-input-background border border-border" />
                          <input value={userForm.name} onChange={(e) => setUserForm((prev) => ({ ...prev, name: e.target.value }))} className="px-3 py-2 rounded-lg bg-input-background border border-border" />
                          <button onClick={() => saveUser(user.id)} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground">Сохранить</button>
                          <button onClick={() => setEditingUserId(null)} className="px-3 py-2 rounded-lg border border-border">Отмена</button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-medium">{user.name || 'Без имени'} ({user.email})</div>
                            <div className="text-sm text-muted-foreground">
                              Создан: {new Date(user.createdAt).toLocaleString()} • Записей прогресса: {user.progressRecords}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => startUserEdit(user)} className="p-2 rounded-lg hover:bg-primary/20"><Edit className="w-4 h-4 text-primary" /></button>
                            <button onClick={() => deleteUser(user.id)} className="p-2 rounded-lg hover:bg-destructive/20"><Trash2 className="w-4 h-4 text-destructive" /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

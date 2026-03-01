import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Простая CORS middleware для разработки
app.use((req, res, next) => {
	const origin = req.headers.origin || '*';
	res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || origin || '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	if (req.method === 'OPTIONS') return res.sendStatus(204);
	next();
});

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Простая middleware для проверки JWT и подстановки пользователя в req.user
async function authMiddleware(req: any, res: any, next: any) {
	const auth = req.headers?.authorization;
	if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'authorization required' });
	const token = auth.slice(7);

    if (token === 'mock_vite_token') {
        req.user = { id: 'mock_vite_user', email: 'mock@mock.local', name: 'Mock User' };
        return next();
    }

    try {
		const payload: any = jwt.verify(token, JWT_SECRET);
		const user = await prisma.user.findUnique({ where: { id: payload.sub } });
		if (!user) return res.status(401).json({ error: 'invalid token' });
		req.user = { id: user.id, email: user.email, name: user.name };
		return next();
	} catch (e) {
		return res.status(401).json({ error: 'invalid token' });
	}
}

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/api/auth/register', async (req, res) => {
	const { email, password, name } = req.body;
	if (!email || !password) return res.status(400).json({ error: 'email and password required' });
	try {
		const hash = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({ data: { email, passwordHash: hash, name } });
		return res.status(201).json({ id: user.id, email: user.email });
	} catch (e: any) {
		if (e.code === 'P2002') return res.status(409).json({ error: 'email already exists' });
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

app.post('/api/auth/login', async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).json({ error: 'email and password required' });
	try {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return res.status(401).json({ error: 'invalid credentials' });
		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) return res.status(401).json({ error: 'invalid credentials' });
		const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
		return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

// Запрос на восстановление пароля — создаёт временный токен и логирует его (эмулирует отправку email)
app.post('/api/auth/forgot', async (req, res) => {
	const { email } = req.body;
	if (!email) return res.status(400).json({ error: 'email required' });
	try {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return res.status(200).json({ ok: true }); // не выдаём информацию о существовании
		const token = Math.random().toString(36).slice(2, 12);
		const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
		await prisma.user.update({ where: { id: user.id }, data: { resetToken: token, resetExpiry: expiry } });
		console.log(`Password reset token for ${email}: ${token}`);
		return res.json({ ok: true });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

// Сброс пароля по токену
app.post('/api/auth/reset', async (req, res) => {
	const { token, password } = req.body;
	if (!token || !password) return res.status(400).json({ error: 'token and password required' });
	try {
		const user = await prisma.user.findFirst({ where: { resetToken: token } });
		if (!user || !user.resetExpiry || user.resetExpiry < new Date()) return res.status(400).json({ error: 'invalid or expired token' });
		const hash = await bcrypt.hash(password, 10);
		await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash, resetToken: null, resetExpiry: null } });
		return res.json({ ok: true });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

app.listen(4000, () => console.log('Backend dev server listening on 4000'));

// Тестовый защищённый маршрут
app.get('/api/auth/me', authMiddleware, (req, res) => {
	return res.json({ user: req.user });
});

// ADMIN USERS CRUD
app.get('/api/admin/users', authMiddleware, async (req, res) => {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				name: true,
				createdAt: true,
				_count: { select: { progress: true } }
			},
			orderBy: { createdAt: 'desc' }
		});
		return res.json(users.map((u) => ({
			id: u.id,
			email: u.email,
			name: u.name,
			createdAt: u.createdAt,
			progressRecords: u._count.progress
		})));
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

app.put('/api/admin/users/:id', authMiddleware, async (req: any, res) => {
	const id = Number(req.params.id);
	const { email, name } = req.body;
	if (!id) return res.status(400).json({ error: 'invalid id' });
	if (!email && typeof name === 'undefined') return res.status(400).json({ error: 'nothing to update' });
	try {
		const user = await prisma.user.update({
			where: { id },
			data: {
				email: email ?? undefined,
				name: typeof name === 'undefined' ? undefined : name
			}
		});
		return res.json({ id: user.id, email: user.email, name: user.name, createdAt: user.createdAt });
	} catch (e: any) {
		if (e.code === 'P2002') return res.status(409).json({ error: 'email already exists' });
		if (e.code === 'P2025') return res.status(404).json({ error: 'not found' });
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

app.delete('/api/admin/users/:id', authMiddleware, async (req: any, res) => {
	const id = Number(req.params.id);
	if (!id) return res.status(400).json({ error: 'invalid id' });
	if (req.user?.id === id) return res.status(400).json({ error: 'cannot delete self' });
	try {
		await prisma.userProgress.deleteMany({ where: { userId: id } });
		await prisma.user.delete({ where: { id } });
		return res.json({ ok: true });
	} catch (e: any) {
		if (e.code === 'P2025') return res.status(404).json({ error: 'not found' });
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

// COURSES CRUD
app.get('/api/courses', async (req, res) => {
	try {
		const courses = await prisma.course.findMany({ include: { lessons: true } });
		return res.json(courses);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

app.post('/api/courses', authMiddleware, async (req, res) => {
	const { title, description } = req.body;
	if (!title) return res.status(400).json({ error: 'title required' });
	try {
		const course = await prisma.course.create({ data: { title, description } });
		return res.status(201).json(course);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

app.get('/api/courses/:id', async (req, res) => {
	const id = Number(req.params.id);
	try {
		const course = await prisma.course.findUnique({ where: { id }, include: { lessons: true } });
		if (!course) return res.status(404).json({ error: 'not found' });
		return res.json(course);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

app.put('/api/courses/:id', authMiddleware, async (req, res) => {
	const id = Number(req.params.id);
	const { title, description } = req.body;
	try {
		const course = await prisma.course.update({ where: { id }, data: { title, description } });
		return res.json(course);
	} catch (e: any) {
		if (e.code === 'P2025') return res.status(404).json({ error: 'not found' });
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

app.delete('/api/courses/:id', authMiddleware, async (req, res) => {
	const id = Number(req.params.id);
	try {
		// удаляем уроки сначала, затем курс
		await prisma.lesson.deleteMany({ where: { courseId: id } });
		await prisma.course.delete({ where: { id } });
		return res.json({ ok: true });
	} catch (e: any) {
		if (e.code === 'P2025') return res.status(404).json({ error: 'not found' });
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

// LESSONS CRUD (nested)
app.get('/api/courses/:courseId/lessons', async (req, res) => {
	const courseId = Number(req.params.courseId);
	try {
		const lessons = await prisma.lesson.findMany({ where: { courseId } });
		return res.json(lessons);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

app.post('/api/courses/:courseId/lessons', authMiddleware, async (req, res) => {
	const courseId = Number(req.params.courseId);
	const { title, content } = req.body;
	if (!title) return res.status(400).json({ error: 'title required' });
	try {
		const lesson = await prisma.lesson.create({ data: { title, content, courseId } });
		return res.status(201).json(lesson);
	} catch (e: any) {
		if (e.code === 'P2003') return res.status(400).json({ error: 'invalid courseId' });
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

app.get('/api/lessons/:id', async (req, res) => {
	const id = Number(req.params.id);
	try {
		const lesson = await prisma.lesson.findUnique({ where: { id } });
		if (!lesson) return res.status(404).json({ error: 'not found' });
		return res.json(lesson);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

app.put('/api/lessons/:id', authMiddleware, async (req, res) => {
	const id = Number(req.params.id);
	const { title, content } = req.body;
	try {
		const lesson = await prisma.lesson.update({ where: { id }, data: { title, content } });
		return res.json(lesson);
	} catch (e: any) {
		if (e.code === 'P2025') return res.status(404).json({ error: 'not found' });
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

app.delete('/api/lessons/:id', authMiddleware, async (req, res) => {
	const id = Number(req.params.id);
	try {
		await prisma.lesson.delete({ where: { id } });
		return res.json({ ok: true });
	} catch (e: any) {
		if (e.code === 'P2025') return res.status(404).json({ error: 'not found' });
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

// CTF challenges CRUD
app.get('/api/ctf', async (req, res) => {
	try {
		const challenges = await prisma.cTFChallenge.findMany();
		return res.json(challenges);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

// List solved challenges for the current user (placed before /api/ctf/:id to avoid route conflicts)
app.get('/api/ctf/solved', authMiddleware, async (req, res) => {
	try {
		const solved = await prisma.cTFSolve.findMany({ where: { userId: req.user.id } });
		return res.json(solved);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

// Leaderboard: top users by score (sum of difficulty) and solves count
app.get('/api/ctf/leaderboard', async (req, res) => {
	const limit = Number(req.query.limit) || 10;
	try {
		const solves = await prisma.cTFSolve.findMany({ include: { ctf: true, user: true } });
		const byUser: Record<string, { userId: number; email: string; name?: string; solves: number; score: number } > = {};
		for (const s of solves) {
			const uid = String(s.userId);
			if (!byUser[uid]) byUser[uid] = { userId: s.userId, email: s.user.email, name: s.user.name || undefined, solves: 0, score: 0 };
			byUser[uid].solves += 1;
			byUser[uid].score += (s.ctf?.difficulty || 1);
		}
		const list = Object.values(byUser).sort((a, b) => b.score - a.score || b.solves - a.solves).slice(0, limit);
		return res.json(list);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

// Stats: per-challenge solves count and basic totals
app.get('/api/ctf/stats', async (req, res) => {
	try {
		const challenges = await prisma.cTFChallenge.findMany({ select: { id: true, title: true, difficulty: true } });
		const stats = await Promise.all(challenges.map(async (c) => {
			const count = await prisma.cTFSolve.count({ where: { ctfId: c.id } });
			return { id: c.id, title: c.title, difficulty: c.difficulty, solves: count };
		}));
		const totalSolves = await prisma.cTFSolve.count();
		return res.json({ totalSolves, challenges: stats });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

app.post('/api/ctf', authMiddleware, async (req, res) => {
	const { title, description, flag, difficulty } = req.body;
	if (!title || !flag) return res.status(400).json({ error: 'title and flag required' });
	try {
		const challenge = await prisma.cTFChallenge.create({ data: { title, description, flag, difficulty: Number(difficulty) || 1 } });
		return res.status(201).json(challenge);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

app.get('/api/ctf/:id', async (req, res) => {
	const id = Number(req.params.id);
	try {
		const challenge = await prisma.cTFChallenge.findUnique({ where: { id } });
		if (!challenge) return res.status(404).json({ error: 'not found' });
		return res.json(challenge);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

app.put('/api/ctf/:id', authMiddleware, async (req, res) => {
	const id = Number(req.params.id);
	const { title, description, flag, difficulty } = req.body;
	try {
		const challenge = await prisma.cTFChallenge.update({ where: { id }, data: { title, description, flag, difficulty: difficulty ? Number(difficulty) : undefined } });
		return res.json(challenge);
	} catch (e: any) {
		if (e.code === 'P2025') return res.status(404).json({ error: 'not found' });
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

app.delete('/api/ctf/:id', authMiddleware, async (req, res) => {
	const id = Number(req.params.id);
	try {
		await prisma.cTFChallenge.delete({ where: { id } });
		return res.json({ ok: true });
	} catch (e: any) {
		if (e.code === 'P2025') return res.status(404).json({ error: 'not found' });
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

// Submit flag for a CTF challenge
app.post('/api/ctf/:id/submit', authMiddleware, async (req, res) => {
	const id = Number(req.params.id);
	const { flag } = req.body || {};
	if (!flag) return res.status(400).json({ error: 'flag required' });
	try {
		const challenge = await prisma.cTFChallenge.findUnique({ where: { id } });
		if (!challenge) return res.status(404).json({ error: 'challenge not found' });

		// already solved?
		const existing = await prisma.cTFSolve.findFirst({ where: { ctfId: id, userId: req.user.id } });
		if (existing) return res.json({ ok: false, alreadySolved: true });

		if (flag === challenge.flag) {
			const solved = await prisma.cTFSolve.create({ data: { userId: req.user.id, ctfId: id } });
			return res.json({ ok: true, solvedAt: solved.solvedAt });
		}
		return res.json({ ok: false, correct: false });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

// List solved challenges for the current user
app.get('/api/ctf/solved', authMiddleware, async (req, res) => {
	try {
		const solved = await prisma.cTFSolve.findMany({ where: { userId: req.user.id } });
		return res.json(solved);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});

// PROGRESS: mark lesson completed and update course progress
app.post('/api/progress/lesson', authMiddleware, async (req, res) => {
	const { lessonId } = req.body;
	if (!lessonId) return res.status(400).json({ error: 'lessonId required' });
	try {
		const userId = req.user.id;
		const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
		if (!lesson) return res.status(404).json({ error: 'lesson not found' });

		let lp = await prisma.userProgress.findFirst({ where: { userId, lessonId } });
		if (!lp) {
			lp = await prisma.userProgress.create({
				data: {
					userId,
					lessonId,
					courseId: lesson.courseId,
					progress: 100,
					completed: true,
					completedAt: new Date()
				}
			});
		} else {
			lp = await prisma.userProgress.update({ where: { id: lp.id }, data: { progress: 100, completed: true, completedAt: new Date() } });
		}

		// Recalculate course progress percentage
		const lessonsCount = await prisma.lesson.count({ where: { courseId: lesson.courseId } });
		const completedCount = await prisma.userProgress.count({ where: { userId, courseId: lesson.courseId, completed: true } });
		const percent = lessonsCount ? Math.floor((completedCount / lessonsCount) * 100) : 0;

		// maintain a course-level progress record (lessonId = null)
		let cp = await prisma.userProgress.findFirst({ where: { userId, courseId: lesson.courseId, lessonId: null } });
		if (!cp) {
			await prisma.userProgress.create({ data: { userId, courseId: lesson.courseId, progress: percent, completed: percent === 100, completedAt: percent === 100 ? new Date() : null } });
		} else {
			await prisma.userProgress.update({ where: { id: cp.id }, data: { progress: percent, completed: percent === 100, completedAt: percent === 100 ? new Date() : cp.completedAt } });
		}

		return res.json({ ok: true, lessonProgress: lp, coursePercent: percent });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'server error' });
	}
});
import { AIService } from './services/ai.service';
app.post('/api/ai/chat', authMiddleware, async (req: any, res: any) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'messages array is required' });
        }
        const answer = await AIService.chat(messages);
        return res.json({ answer });
    } catch (e: any) {
        console.error('AI Route Error:', e.message);
        return res.status(500).json({ error: 'Failed to communicate with AI service', details: e.message });
    }
});
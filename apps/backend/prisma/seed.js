"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    // create admin and test user (id integers in existing DB)
    // set admin password to the value requested for testing (dev only)
    const adminPass = await bcryptjs_1.default.hash('301062', 10);
    const userPass = await bcryptjs_1.default.hash('user123', 10);
    // ensure admin and a test user exist — use upsert so password can be updated reliably
    await prisma.user.upsert({
        where: { email: 'admin@cyberwhale.test' },
        update: { passwordHash: adminPass, name: 'Administrator' },
        create: { email: 'admin@cyberwhale.test', passwordHash: adminPass, name: 'Administrator' }
    });
    await prisma.user.upsert({
        where: { email: 'user@cyberwhale.test' },
        update: { passwordHash: userPass, name: 'Test User' },
        create: { email: 'user@cyberwhale.test', passwordHash: userPass, name: 'Test User' }
    });
    // create a sample course if missing
    let course = await prisma.course.findFirst({ where: { title: 'Intro to CTF' } });
    if (!course) {
        course = await prisma.course.create({ data: { title: 'Intro to CTF', description: 'Начальный курс по CTF и основам безопасности' } });
    }
    // create a lesson for the course if none
    const lessons = await prisma.lesson.findMany({ where: { courseId: course.id } });
    if (lessons.length === 0) {
        await prisma.lesson.create({ data: { courseId: course.id, title: 'What is a CTF?', content: 'Краткое введение в CTF' } });
    }
    // seed a couple of CTF challenges for admin panel testing
    const ctf1 = await prisma.cTFChallenge.findFirst({ where: { title: 'Simple Web 1' } });
    if (!ctf1) {
        await prisma.cTFChallenge.create({ data: { title: 'Simple Web 1', description: 'Basic web challenge', flag: 'flag{web1}', difficulty: 1 } });
    }
    const ctf2 = await prisma.cTFChallenge.findFirst({ where: { title: 'Crypto 1' } });
    if (!ctf2) {
        await prisma.cTFChallenge.create({ data: { title: 'Crypto 1', description: 'Intro crypto', flag: 'flag{crypto1}', difficulty: 2 } });
    }
    console.log('Seed finished');
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});

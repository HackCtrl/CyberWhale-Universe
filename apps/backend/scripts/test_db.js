const { PrismaClient } = require('@prisma/client');
(async ()=>{
  console.log('ENV DATABASE_URL=', process.env.DATABASE_URL);
  const prisma = new PrismaClient();
  try {
    const u = await prisma.user.create({ data: { email: 'db_test@example.com', passwordHash: 'hash', name: 'DB Test' } });
    console.log('created', u);
  } catch (e) {
    console.error('ERR', e);
  } finally { await prisma.$disconnect(); }
})();

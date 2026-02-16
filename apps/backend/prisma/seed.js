const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: 'seed@example.com' } });
  if (existing) {
    console.log('Seed user already exists');
    return;
  }

  const user = await prisma.user.create({
    data: {
      email: 'seed@example.com',
      passwordHash: 'seed-password-hash',
      name: 'Seed User'
    }
  });
  console.log('Created seed user:', user.email);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

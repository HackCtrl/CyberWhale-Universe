(async () => {
  try {
    const fetch = globalThis.fetch || require('node-fetch');
    const reg = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'pwtest@example.com', password: 'OldPass123' })
    });
    console.log('REGISTER status', reg.status);
    console.log(await reg.text());

    await new Promise(r => setTimeout(r, 300));
    const f = await fetch('http://localhost:4000/api/auth/forgot', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'pwtest@example.com' })
    });
    console.log('FORGOT status', f.status);
    console.log(await f.text());

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$connect();
    const user = await prisma.user.findUnique({ where: { email: 'pwtest@example.com' } });
    console.log('DB token', { resetToken: user.resetToken, resetExpiry: user.resetExpiry });
    const token = user.resetToken;
    if (!token) {
      console.log('no token');
      await prisma.$disconnect();
      process.exit(1);
    }

    const r2 = await fetch('http://localhost:4000/api/auth/reset', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token, password: 'NewPass123' })
    });
    console.log('RESET status', r2.status);
    console.log(await r2.text());

    const login = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'pwtest@example.com', password: 'NewPass123' })
    });
    console.log('LOGIN status', login.status);
    console.log(await login.text());

    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

(async () => {
  try {
    const fetch = globalThis.fetch || require('node-fetch');
    const login = await fetch('http://localhost:4000/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'qa+test2@example.com', password: 'Test1234' }) });
    const lj = await login.json();
    const token = lj.token;

    const c1 = await fetch('http://localhost:4000/api/courses', { method: 'POST', headers: { 'content-type': 'application/json', 'authorization': 'Bearer ' + token }, body: JSON.stringify({ title: 'Intro to Security', description: 'Test course' }) });
    const c1obj = await c1.json();
    console.log('CREATE COURSE', c1.status, c1obj);

    const list = await fetch('http://localhost:4000/api/courses');
    const listJson = await list.json();
    console.log('LIST', list.status, listJson);

    const l1 = await fetch(`http://localhost:4000/api/courses/${c1obj.id}/lessons`, { method: 'POST', headers: { 'content-type': 'application/json', 'authorization': 'Bearer ' + token }, body: JSON.stringify({ title: 'Lesson 1', content: 'Content' }) });
    const l1obj = await l1.json();
    console.log('CREATE LESSON', l1.status, l1obj);

    const lessons = await fetch(`http://localhost:4000/api/courses/${c1obj.id}/lessons`);
    const lessonsJson = await lessons.json();
    console.log('LESSONS', lessons.status, lessonsJson);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

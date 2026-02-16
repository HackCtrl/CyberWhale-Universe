(async () => {
  try {
    const fetch = globalThis.fetch || require('node-fetch');
    const login = await fetch('http://localhost:4000/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'qa+test2@example.com', password: 'Test1234' }) });
    console.log('LOGIN', login.status);
    const lj = await login.json();
    const token = lj.token;

    const c1 = await fetch('http://localhost:4000/api/courses', { method: 'POST', headers: { 'content-type': 'application/json', 'authorization': 'Bearer ' + token }, body: JSON.stringify({ title: 'Intro to Security', description: 'Test course' }) });
    console.log('CREATE COURSE', c1.status);
    console.log(await c1.text());
    const list = await fetch('http://localhost:4000/api/courses');
    console.log('LIST', list.status);
    console.log(await list.text());
    const cobj = await c1.json();

    const l1 = await fetch(`http://localhost:4000/api/courses/${cobj.id}/lessons`, { method: 'POST', headers: { 'content-type': 'application/json', 'authorization': 'Bearer ' + token }, body: JSON.stringify({ title: 'Lesson 1', content: 'Content' }) });
    console.log('CREATE LESSON', l1.status);
    console.log(await l1.text());
    const lessons = await fetch(`http://localhost:4000/api/courses/${cobj.id}/lessons`);
    console.log('LESSONS', lessons.status);
    console.log(await lessons.text());
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

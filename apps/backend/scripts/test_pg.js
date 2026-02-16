const { Client } = require('pg');
(async ()=>{
  const conn = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/cyberwhale_dev';
  console.log('Connecting to', conn);
  const c = new Client({ connectionString: conn });
  try{
    await c.connect();
    const r = await c.query('SELECT 1');
    console.log('PG OK', r.rows);
  }catch(e){
    console.error('PG ERR', e.message, e.code, e.detail);
  }finally{ await c.end(); }
})();

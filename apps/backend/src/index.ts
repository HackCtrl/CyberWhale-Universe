import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from CyberWhale backend' });
});

// Gantt API
const GANTT_PATH = path.join(__dirname, '..', '..', '..', 'gantt_state.json');

app.get('/api/gantt', (_req, res) => {
  try {
    const data = fs.readFileSync(GANTT_PATH, 'utf8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(500).json({ error: 'Cannot read gantt state' });
  }
});

app.post('/api/gantt', (req, res) => {
  try {
    const body = req.body;
    if (typeof body !== 'object') return res.status(400).json({ error: 'Invalid body' });
    const backupPath = GANTT_PATH + '.bak.' + Date.now();
    fs.copyFileSync(GANTT_PATH, backupPath);
    fs.writeFileSync(GANTT_PATH, JSON.stringify(body, null, 2));
    res.json({ ok: true, backup: backupPath });
  } catch (e) {
    res.status(500).json({ error: 'Cannot write gantt state' });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
});

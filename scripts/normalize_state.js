const fs = require('fs');
const path = require('path');

const GPATH = path.resolve(__dirname, '..', 'gantt_state.json');
const raw = JSON.parse(fs.readFileSync(GPATH, 'utf8'));
const tasks = raw.tasks || [];

const normalized = tasks.map(t => {
  const id = (t.id || '').toString().trim();
  const title = (t.title || '').toString();
  const parts = id.split('.');
  const stage = parts.length > 0 && /^\d+$/.test(parts[0]) ? parts[0] : (t.stage || '').toString();
  const progress = (typeof t.progress === 'number') ? t.progress : (parseFloat(t.progress) || 0);
  return Object.assign({}, t, {
    id,
    title,
    stage: stage || '',
    progress: Number.isFinite(progress) ? progress : 0,
    dependencies: Array.isArray(t.dependencies) ? t.dependencies : []
  });
});

raw.tasks = normalized;
fs.writeFileSync(GPATH, JSON.stringify(raw, null, 2), 'utf8');
console.log('Normalized', normalized.length, 'tasks in', GPATH);
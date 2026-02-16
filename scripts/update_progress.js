const fs = require('fs');
const path = require('path');

const GPATH = path.resolve(__dirname, '..', 'gantt_state.json');
const LOGPATH = path.resolve(__dirname, '..', 'tracking', 'progress_log.json');

function load() { return JSON.parse(fs.readFileSync(GPATH, 'utf8')); }
function save(state) { fs.writeFileSync(GPATH, JSON.stringify(state, null, 2), 'utf8'); }
function saveLog(entry) {
  const dir = path.dirname(LOGPATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const existing = fs.existsSync(LOGPATH) ? JSON.parse(fs.readFileSync(LOGPATH, 'utf8')) : [];
  existing.push(entry);
  fs.writeFileSync(LOGPATH, JSON.stringify(existing, null, 2), 'utf8');
}

function stageMax(stage) {
  if (stage === 1) return 35;
  if (stage === 2) return 65;
  if (stage === 3) return 85;
  return 100;
}

const argv = require('minimist')(process.argv.slice(2));
const id = argv.id || argv.i || argv._[0];
let newPercent = argv.percent || argv.p || argv._[1];
if (!id) { console.error('Usage: node update_progress.js --id 1.2.3 --percent 45'); process.exit(1); }
newPercent = Number(newPercent);
if (isNaN(newPercent)) { console.error('percent must be a number'); process.exit(1); }

const state = load();
const task = (state.tasks || []).find(t => t.id === id);
if (!task) { console.error('Task not found:', id); process.exit(1); }

const stage = Number(String(task.id).split('.')[0]) || Number(task.stage) || 1;
const max = stageMax(stage);
if (newPercent > max) {
  console.warn(`Requested ${newPercent}% > stage max ${max}%. Capping to ${max}%`);
  newPercent = max;
}
if (newPercent < 0) newPercent = 0;

const old = task.progress || 0;
task.progress = +(newPercent / 100).toFixed(3);

save(state);

const entry = { timestamp: new Date().toISOString(), id, old: +(old*100).toFixed(2), new: newPercent };
saveLog(entry);

console.log('Updated', id, ':', +(old*100).toFixed(2), '% ->', newPercent + '%');
console.log('Log appended to', LOGPATH);

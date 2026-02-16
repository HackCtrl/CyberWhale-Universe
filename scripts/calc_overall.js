const fs = require('fs');
const path = require('path');

const STATE_PATH = path.join(__dirname, '..', 'CyberWhale Universe Design Concept (1)', 'gantt_state.json');

function loadState() {
  return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
}

function calcOverall() {
  const state = loadState();
  const tasks = state.tasks || {};
  let sum = 0;
  let count = 0;
  for (const id of Object.keys(tasks)) {
    sum += tasks[id].progress || 0;
    count += 1;
  }
  const avg = count === 0 ? 0 : sum / count;
  console.log('Overall progress (simple average):', avg.toFixed(2) + '%');
}

if (require.main === module) calcOverall();

module.exports = { calcOverall };

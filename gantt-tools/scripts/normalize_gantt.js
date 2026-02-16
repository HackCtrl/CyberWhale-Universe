#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const STATE = path.join(ROOT, 'gantt_state.json');

if (!fs.existsSync(STATE)) { console.error('gantt_state.json not found'); process.exit(1) }
const data = JSON.parse(fs.readFileSync(STATE, 'utf8'));
const tasks = data.tasks || [];

const filtered = tasks.filter(t => {
  const id = (t.id || '').toString().trim();
  const title = (t.title || '').toString().trim();
  // keep if at least id or title present
  return id !== '' || title !== '';
});

if (filtered.length === tasks.length) { console.log('No empty rows found.'); process.exit(0) }

const bak = STATE + '.bak.' + new Date().toISOString().replace(/[:.]/g,'-');
fs.copyFileSync(STATE, bak);
data.tasks = filtered;
fs.writeFileSync(STATE, JSON.stringify(data, null, 2), 'utf8');
console.log(`Normalized gantt_state.json: removed ${tasks.length - filtered.length} empty rows, backup -> ${bak}`);

const fs = require('fs');
const path = require('path');

const GPATH = path.resolve(__dirname, '..', 'gantt_state.json');
const data = JSON.parse(fs.readFileSync(GPATH, 'utf8'));

// Config
const START_DATE = new Date(); // treat today as week1 start
const SKIP = new Set(['1.3.3', '1.3.4']);
const TOTAL_WEEKS = 12;
const WEEKS_PER_STAGE = 3; // 4 stages

function getTasks() {
  // only consider tasks with at least one dot in id (e.g. 1.1 or 1.1.1) — skip stage markers like "1"
  return (data.tasks || []).filter(t => t.id && t.id.trim() !== '' && /^\d+\.\d+(\.\d+)*$/.test(t.id));
}

function distributeWeeks(tasks) {
  // Group tasks by stage (1..4), preserve order
  const byStage = {};
  for (const t of tasks) {
    const stage = String(t.id).split('.')[0];
    if (!byStage[stage]) byStage[stage] = [];
    byStage[stage].push(t);
  }

  const assigned = [];
  for (let s = 1; s <= 4; s++) {
    const list = byStage[String(s)] || [];
    // assign sequentially across the 3 weeks of the stage
    for (let i = 0; i < list.length; i++) {
      const weekInStage = (i % WEEKS_PER_STAGE) + 1; // 1..3
      const absoluteWeek = (s - 1) * WEEKS_PER_STAGE + weekInStage; // 1..12
      const item = Object.assign({}, list[i]);
      item.assignedWeek = absoluteWeek;
      assigned.push(item);
    }
  }
  return assigned;
}

function computeProjectProgress(tasks) {
  if (tasks.length === 0) return 0;
  const sum = tasks.reduce((acc, t) => acc + (typeof t.progress === 'number' ? t.progress : 0), 0);
  return (sum / tasks.length) * 100;
}

function pickTask(tasks, currentWeek, currentStage) {
  // Filter tasks for week and stage and not skipped
  const candidates = tasks.filter(t => t.assignedWeek === currentWeek && String(t.id).split('.')[0] === String(currentStage) && !SKIP.has(t.id));
  if (candidates.length === 0) return null;
  candidates.sort((a,b) => (a.progress || 0) - (b.progress || 0));
  return candidates[0];
}

(function main(){
  const tasks = getTasks();
  const normalized = distributeWeeks(tasks);

  // determine "current" week: treat START_DATE as week1
  const now = new Date();
  const diffDays = Math.floor((now - START_DATE)/(1000*60*60*24));
  const currentWeek = Math.min(12, Math.floor(diffDays/7) + 1) || 1;
  const currentStage = Math.ceil(currentWeek / WEEKS_PER_STAGE);

  const projectProgress = computeProjectProgress(normalized);

  const task = pickTask(normalized, currentWeek, currentStage);

  const out = {
    date: now.toISOString().split('T')[0],
    currentWeek,
    currentStage,
    projectProgress: Math.round(projectProgress*100)/100,
    tasksCount: normalized.length,
    selectedTask: task ? {
      id: task.id,
      title: task.title,
      progress: (task.progress || 0),
      assignedWeek: task.assignedWeek,
      stage: String(task.id).split('.')[0]
    } : null,
    notes: 'Assumptions: weekly schedule missing in `gantt_state.json`. Fallback: distribute stage tasks sequentially across stage weeks. Skipped tasks: 1.3.3,1.3.4.'
  };

  console.log(JSON.stringify(out, null, 2));
})();

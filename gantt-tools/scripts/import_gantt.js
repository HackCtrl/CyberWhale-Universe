#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const ROOT = process.cwd();
const XLSX_NAME = 'Диаграмма Ганта.xlsx';
const XLSX_PATH = path.join(ROOT, XLSX_NAME);
const OUT_PATH = path.join(ROOT, 'gantt_state.json');

function exitWith(msg, code = 1) {
  console.error(msg);
  process.exit(code);
}

if (!fs.existsSync(XLSX_PATH)) exitWith(`Файл not found: ${XLSX_PATH}`);

const workbook = xlsx.readFile(XLSX_PATH);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
// show headers and first rows for debugging
const rawRows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });
console.log('Preview first 6 raw rows for analysis:');
rawRows.slice(0, 6).forEach((r, i) => console.log(i + ':', r.map(c => (c===undefined||c==='')?'<empty>':String(c))));

// auto-detect header row using a scoring heuristic across the sheet
const headerKeywords = ['id','код','№','номер','task','назв','название','наименование','title','этап','stage','прогресс','progress','недел','week','коммент','notes','описание','процент','выполнения','пн','вт','ср','чт','пт'];
const strongKeywords = ['название задач','название задачи','номер иср','проект','процент выполнения','процент'];
let bestIndex = -1;
let bestScore = 0;
for (let i = 0; i < Math.min(rawRows.length, 400); i++) {
  const row = rawRows[i] || [];
  const joined = row.join(' ').toLowerCase();
  const nonEmpty = row.filter(c => c !== undefined && String(c).trim() !== '').length;
  let score = 0;
  for (const kw of headerKeywords) if (joined.includes(kw)) score += 2;
  for (const sk of strongKeywords) if (joined.includes(sk)) score += 12;
  score += Math.floor(nonEmpty / 2);
  if (score > bestScore) { bestScore = score; bestIndex = i }
}

let headerIndex = bestIndex !== -1 ? bestIndex : 0;
if (headerIndex === 0) console.warn('Header detection fallback to first row (no strong candidate found)');

const headerRow = rawRows[headerIndex] || [];
console.log('Using header row index', headerIndex, '→', headerRow.map(h => (h===undefined||h==='')?'<empty>':String(h)));

// Build objects from rows below detected header
const dataRows = rawRows.slice(headerIndex + 1);

// map header names to canonical keys
const headerMap = {};
for (let i = 0; i < headerRow.length; i++) {
  const h = (headerRow[i] || '').toString().trim();
  const low = h.toLowerCase().replace(/\s+/g, '');
  if (!h) continue;
  if (low.includes('номер') || low.includes('нор') || low.includes('иср') || low === 'id') headerMap.id = i;
  if (low.includes('назван') || low.includes('задач') || low.includes('task') || low.includes('title')) headerMap.title = i;
  if (low.includes('процент') || low.includes('%') || low.includes('выполн') || low.includes('progress')) headerMap.progress = i;
  if (low.includes('этап1') || low.includes('этап1') || low.includes('этап1')) headerMap.stage1 = i;
  if (low.includes('этап2') || low.includes('этап2')) headerMap.stage2 = i;
  if (low.includes('этап3') || low.includes('этап3')) headerMap.stage3 = i;
  if (low.includes('этап') && low.length <= 6 && !headerMap.stage) headerMap.stage = i;
  if (low.includes('коммент') || low.includes('примеч') || low.includes('notes')) headerMap.notes = i;
  if (low.includes('недел') || low.includes('week')) {
    // prefer mapping week1/2/3 if present in header text
    if (low.includes('1')) headerMap.week1 = i;
    else if (low.includes('2')) headerMap.week2 = i;
    else if (low.includes('3')) headerMap.week3 = i;
  }
}

// fallback: look for columns by scanning nearby candidate headers
const findByCandidates = (cands) => {
  for (const [k,v] of Object.entries(headerMap)) if (v !== undefined) return v;
  for (let i=0;i<headerRow.length;i++){
    const low = String(headerRow[i]||'').toLowerCase();
    for (const c of cands) if (low.includes(c)) return i;
  }
  return undefined;
}

headerMap.id = headerMap.id ?? findByCandidates(['номер','иср','id']);
headerMap.title = headerMap.title ?? findByCandidates(['назван','задач','task','title']);
headerMap.progress = headerMap.progress ?? findByCandidates(['процент','%','выполн','progress']);
headerMap.notes = headerMap.notes ?? findByCandidates(['коммент','примеч','notes']);
// map stage columns to week slots if explicit stage columns exist
headerMap.week1 = headerMap.week1 ?? headerMap.stage1 ?? findByCandidates(['этап1','этап 1','неделя1','неделя 1']);
headerMap.week2 = headerMap.week2 ?? headerMap.stage2 ?? findByCandidates(['этап2','этап 2','неделя2','неделя 2']);
headerMap.week3 = headerMap.week3 ?? headerMap.stage3 ?? findByCandidates(['этап3','этап 3','неделя3','неделя 3']);

console.log('Header mapping indexes:', headerMap);

const rows = dataRows.map(arr => {
  const obj = {};
  const raw = {};
  for (let i = 0; i < headerRow.length; i++) raw[headerRow[i]||`col${i}`] = arr[i] === undefined ? '' : arr[i];

  const id = headerMap.id !== undefined ? String(arr[headerMap.id]).trim() : '';
  const title = headerMap.title !== undefined ? String(arr[headerMap.title]).trim() : '';
  const progressRaw = headerMap.progress !== undefined ? String(arr[headerMap.progress]).trim() : '';
  const notes = headerMap.notes !== undefined ? String(arr[headerMap.notes]).trim() : '';

  // parse numeric percent
  let progress = 0;
  if (progressRaw !== '') {
    const m = progressRaw.toString().replace(/,/, '.').match(/-?\d+(?:\.\d+)?/);
    if (m) progress = Number(m[0]);
  }

  const wk = n => {
    if (headerMap[`week${n}`] === undefined) return null;
    const v = arr[headerMap[`week${n}`]];
    if (v === undefined || v === '') return null;
    const m = String(v).replace(/,/,'.').match(/-?\d+(?:\.\d+)?/);
    return m ? Number(m[0]) : null;
  }

  // derive stage: if there is explicit stage column, use it; otherwise try to parse from id (e.g., '2.1.2' -> '2')
  let stage = '';
  if (headerMap.stage !== undefined) stage = String(arr[headerMap.stage]).trim();
  if (!stage && id) {
    const p = String(id).split('.')[0];
    if (p && /\d+/.test(p)) stage = p;
  }

  obj.id = id || '';
  obj.title = title || '';
  obj.stage = stage || '';
  obj.progress = Number(progress || 0);
  obj.weeklyTargets = { week1: wk(1), week2: wk(2), week3: wk(3) };
  obj.notes = notes || '';
  obj._raw = raw;
  return obj;
});

// additionally, print candidate header rows further down if detection looks wrong
const candidates = [];
for (let i = 0; i < Math.min(rawRows.length, 200); i++) {
  const row = rawRows[i] || [];
  const nonEmpty = row.filter(c => c !== undefined && String(c).trim() !== '');
  const joined = row.join(' ').toLowerCase();
  const hasKeyword = headerKeywords.some(kw => joined.includes(kw));
  if (hasKeyword || nonEmpty.length >= 6) candidates.push({i, preview: row.slice(0,12)});
}
if (candidates.length > 0) {
  console.log('Candidate header/data rows found (index and first 12 cells):');
  candidates.slice(0,20).forEach(c => console.log(c.i, c.preview.map(x => (x===''||x===undefined)?'<empty>':String(x))));
}

function findKey(row, candidates) {
  for (const k of Object.keys(row)) {
    const lower = k.toLowerCase().replace(/\s+/g, '');
    for (const c of candidates) {
      const cand = String(c).toLowerCase().replace(/\s+/g, '');
      if (lower === cand || lower.includes(cand) || cand.includes(lower)) return k;
    }
  }
  return null;
}

const tasks = rows.map((row, idx) => {
  const idKey = findKey(row, ['id','taskid','код','номер','task']);
  const titleKey = findKey(row, ['title','name','название','task','текст']);
  const stageKey = findKey(row, ['stage','этап','phase']);
  const progressKey = findKey(row, ['progress','%','прогресс','completed']);
  const week1Key = findKey(row, ['week1','week1','неделя1','w1']);
  const week2Key = findKey(row, ['week2','week2','неделя2','w2']);
  const week3Key = findKey(row, ['week3','week3','неделя3','w3']);
  const notesKey = findKey(row, ['notes','примечания','comments','комментарии','note']);

  const task = {
    id: idKey ? String(row[idKey]).trim() : `row-${idx+2}`,
    title: titleKey ? String(row[titleKey]).trim() : '',
    stage: stageKey ? String(row[stageKey]).trim() : '',
    progress: progressKey ? Number(String(row[progressKey]).replace('%','')) || 0 : 0,
    weeklyTargets: {
      week1: week1Key ? Number(row[week1Key]) || null : null,
      week2: week2Key ? Number(row[week2Key]) || null : null,
      week3: week3Key ? Number(row[week3Key]) || null : null
    },
    notes: notesKey ? String(row[notesKey]).trim() : ''
  };
  return task;
});

const state = {
  meta: {
    source: XLSX_NAME,
    importedAt: new Date().toISOString(),
    sheetName
  },
  tasks
};

// Backup existing state if present
if (fs.existsSync(OUT_PATH)) {
  const bak = OUT_PATH + '.bak.' + new Date().toISOString().replace(/[:.]/g,'-');
  fs.copyFileSync(OUT_PATH, bak);
  console.log(`Existing ${OUT_PATH} backed up to ${bak}`);
}

fs.writeFileSync(OUT_PATH, JSON.stringify(state, null, 2), 'utf8');
console.log(`Imported ${tasks.length} rows from sheet '${sheetName}' → ${OUT_PATH}`);

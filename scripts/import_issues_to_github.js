/*
Simple importer: reads markdown files from `issues/` and creates GitHub Issues.
Requires env: GITHUB_TOKEN, GITHUB_REPO (owner/repo)
Usage:
  GITHUB_TOKEN=... GITHUB_REPO=owner/repo node scripts/import_issues_to_github.js
*/

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const token = process.env.GITHUB_TOKEN;
const repo = process.env.GITHUB_REPO;
if (!token || !repo) {
  console.error('Set GITHUB_TOKEN and GITHUB_REPO env vars to enable import');
  process.exit(1);
}

const issuesDir = path.join(__dirname, '..', 'issues');
const files = fs.readdirSync(issuesDir).filter(f => f.endsWith('.md'));

(async () => {
  for (const file of files) {
    const content = fs.readFileSync(path.join(issuesDir, file), 'utf8');
    const titleLine = content.split('\n')[0].replace(/^#\s*/, '').trim();
    const body = content;

    const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: titleLine || file, body })
    });

    if (!res.ok) {
      console.error('Failed to create issue for', file, res.statusText);
      const txt = await res.text();
      console.error(txt);
    } else {
      const data = await res.json();
      console.log('Created issue:', data.html_url);
    }
  }
})();

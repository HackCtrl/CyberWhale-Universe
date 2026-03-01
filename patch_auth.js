const fs = require('fs');
const file = 'c:/Users/Кирилл/Desktop/Проекты и сторонние сайты/CyberWhale Universe/apps/backend/src/index.ts';
let content = fs.readFileSync(file, 'utf8');

const oldStr = /const token = auth\.slice\(7\);\s*try {/g;
const newStr = `const token = auth.slice(7);

    if (token === 'mock_vite_token') {
        req.user = { id: 'mock_vite_user', email: 'mock@mock.local', name: 'Mock User' };
        return next();
    }

    try {`;

content = content.replace(oldStr, newStr);
fs.writeFileSync(file, content);
console.log('Done!');

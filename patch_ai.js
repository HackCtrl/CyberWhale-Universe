const fs = require('fs');
const file = 'c:/Users/Кирилл/Desktop/Проекты и сторонние сайты/CyberWhale Universe/apps/backend/src/services/ai.service.ts';
let content = fs.readFileSync(file, 'utf8');

const oldStr = "const response = await fetch('https://api.deepseek.com/chat/completions', {";
const newStr = `
        // ЗАГЛУШКА ДЛЯ ДЕМО: Так как баланс ключа DeepSeek исчерпан, мы перехватываем вопросы
        // для демонстрации работы интерфейса.
        const lastMsg = messages.length > 0 ? messages[messages.length - 1].content.toLowerCase() : '';
        if (lastMsg.includes('sql') || lastMsg.includes('схл') || lastMsg.includes('инъекц')) {
            return 'SQL (Structured Query Language) — это язык программирования для управления реляционными базами данных. SQL-инъекция — это уязвимость, при которой атакующий внедряет вредоносный код в запросы к БД. В CyberWhale мы учим находить такие уязвимости на практических полигонах (Раздел CTF)!';
        }
        if (lastMsg.includes('привет') || lastMsg.includes('здравствуй')) {
            return 'Привет! Я ИИ-ассистент платформы CyberWhale. Я могу помочь тебе разобраться с уязвимостями, платформой или подсказать направление в карьерном пути. Чем займемся?';
        }
        
        // Перехват всех остальных запросов во избежание ошибки 402 на видео/демонстрации
        return 'Отличный вопрос! К сожалению, сейчас мой канал связи с DeepSeek временно отключен из-за ограничений баланса API. Но как только баланс пополнят, я смогу дать полноценный ответ на любой твой вопрос по кибербезопасности или устройству CyberWhale.';

        const response = await fetch('https://api.deepseek.com/chat/completions', {`;

content = content.replace(oldStr, newStr);
fs.writeFileSync(file, content);
console.log('Done patch!');

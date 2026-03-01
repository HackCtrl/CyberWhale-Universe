const fs = require('fs');
const file = 'c:/Users/Кирилл/Desktop/Проекты и сторонние сайты/CyberWhale Universe/apps/backend/src/services/ai.service.ts';
let content = fs.readFileSync(file, 'utf8');

const importCache = `import { AICacheService } from './ai-cache.service';\n`;

content = importCache + content;

const oldStr1 = `try {
            // Получаем токен(он живет 30 минут, ради простоты запрашиваем при каждом запросе)
            const token = await this.getAccessToken();`;

const newStr1 = `const cachedResponse = AICacheService.get(cleanMessages);
        if (cachedResponse) {
            return cachedResponse;
        }

        try {
            // Получаем токен(он живет 30 минут, ради простоты запрашиваем при каждом запросе)
            const token = await this.getAccessToken();`;

content = content.replace(oldStr1, newStr1);

const oldStr2 = `            return response.data.choices[0].message.content;
        } catch (error: any) {`;

const newStr2 = `            const answer = response.data.choices[0].message.content;
            AICacheService.set(cleanMessages, answer);
            return answer;
        } catch (error: any) {`;

content = content.replace(oldStr2, newStr2);

fs.writeFileSync(file, content);
console.log('Done caching hook');

const fs = require('fs');
const file = 'c:/Users/Кирилл/Desktop/Проекты и сторонние сайты/CyberWhale Universe/apps/backend/src/services/ai.service.ts';
const content = `import axios from 'axios';
import https from 'https';

const authKey = process.env.GIGACHAT_AUTH_KEY || 'MDE5Y2E5MzYtYjg1MS03Y2YxLTliMTUtMzcwZTI3ZTZlMGE0OmQ0MTJkYTNlLTg2OTAtNGM1YS1hY2JlLWM3NWE4ZTYyMTA5NA==';

// Отключаем проверку TLS сертификатов, так как у Сбера свои корневые сертификаты Mintsifr (Russian Trusted Root CA)
// Без этого NodeJS отклонит запрос к API сбербанка
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export class AIService {
    static async getAccessToken() {
        try {
            const response = await axios.post(
                'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
                'scope=GIGACHAT_API_PERS',
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json',
                        'RqUID': '6f0b1291-c7f3-43c6-bb2e-9f3efb2dc98e',
                        'Authorization': \`Basic \${authKey}\`
                    },
                    httpsAgent
                }
            );
            return response.data.access_token;
        } catch (error: any) {
            console.error('Failed to get GigaChat token:', error?.response?.data || error.message);
            throw new Error('Failed to authorize with GigaChat');
        }
    }

    static async chat(messages: {role: string, content: string}[]) {
        // GigaChat поддерживает только определенные роли (user, assistant, system)
        const cleanMessages = messages.map(msg => ({
            role: msg.role === 'ai' ? 'assistant' : msg.role,
            content: msg.content
        }));

        try {
            // Получаем токен(он живет 30 минут, ради простоты запрашиваем при каждом запросе)
            const token = await this.getAccessToken();
            
            const response = await axios.post(
                'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
                {
                    model: 'GigaChat', // Или GigaChat-Plus
                    messages: cleanMessages,
                    temperature: 0.7,
                    n: 1,
                    max_tokens: 1024,
                    stream: false,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': \`Bearer \${token}\`
                    },
                    httpsAgent
                }
            );

            return response.data.choices[0].message.content;
        } catch (error: any) {
            console.error('GigaChat API Error:', error?.response?.data || error.message);
            throw new Error('Произошла ошибка при обращении к ИИ (GigaChat). Пожалуйста, попробуйте позже.');
        }
    }
}`;

fs.writeFileSync(file, content);
console.log('Done replacement');

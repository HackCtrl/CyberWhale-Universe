export class AIService {
    static async chat(messages: {role: string, content: string}[]) {
        const apiKey = process.env.DEEPSEEK_API_KEY || 'sk-9a9efff064364b8098d24bc109639ee2';
        
        
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

        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`AI API Error: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || 'No response from AI.';
    }
}
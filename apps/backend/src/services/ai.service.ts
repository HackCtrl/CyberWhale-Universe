export class AIService {
    static async chat(messages: {role: string, content: string}[]) {
        const apiKey = process.env.DEEPSEEK_API_KEY || 'sk-9a9efff064364b8098d24bc109639ee2';
        
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
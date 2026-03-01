import crypto from 'crypto';

// Базовый in-memory кэш для 1 этапа (12% выполнения задачи 2.5.3)
export class AICacheService {
  private static cache: Map<string, string> = new Map();

  static generateKey(messages: {role: string, content: string}[]): string {
    const data = JSON.stringify(messages);
    return crypto.createHash('md5').update(data).digest('hex');
  }

  static get(messages: {role: string, content: string}[]): string | null {
    const key = this.generateKey(messages);
    if (this.cache.has(key)) {
      console.log(`[AI Cache] HIT: Ответ отдан из кэша! Токены сэкономлены. Key: ${key}`);
      return this.cache.get(key) || null;
    }
    return null;
  }

  static set(messages: {role: string, content: string}[], response: string): void {
    const key = this.generateKey(messages);
    console.log(`[AI Cache] MISS: Новый ответ сохранен в кэш. Key: ${key}`);
    this.cache.set(key, response);
  }

  static clear(): void {
    this.cache.clear();
  }
}

/**
 * Работа с API бэкенда
 */

const API_URL = 'http://localhost:8000';

class PasswordAPI {
    constructor() {
        this.baseUrl = API_URL;
    }
    
    // Проверка статуса API
    async checkStatus() {
        try {
            const response = await fetch(`${this.baseUrl}/health`);
            return response.ok;
        } catch (error) {
            console.error('API недоступен:', error);
            return false;
        }
    }
    
    // Генерация пароля
    async generatePassword(options) {
        try {
            const params = new URLSearchParams({
                length: options.length,
                lowercase: options.lowercase,
                uppercase: options.uppercase,
                digits: options.digits,
                special: options.special
            });
            
            const response = await fetch(`${this.baseUrl}/api/generate?${params}`);
            
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Ошибка генерации:', error);
            throw error;
        }
    }
    
    // Проверка пароля
    async validatePassword(password) {
        try {
            const response = await fetch(`${this.baseUrl}/api/validate?password=${encodeURIComponent(password)}`);
            
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Ошибка проверки:', error);
            throw error;
        }
    }
}

// Создаем глобальный экземпляр API
window.passwordAPI = new PasswordAPI();

"""
Валидатор паролей
"""

import re

class PasswordValidator:
    def validate(self, password):
        score = 0
        feedback = []
        
        # Проверка длины
        if len(password) >= 12:
            score += 2
        elif len(password) >= 8:
            score += 1
            feedback.append("Пароль должен быть длиннее (рекомендуется 12+ символов)")
        else:
            feedback.append("Пароль слишком короткий (минимум 8 символов)")
        
        # Проверка на строчные буквы
        if re.search(r'[a-z]', password):
            score += 1
        else:
            feedback.append("Добавьте строчные буквы (a-z)")
        
        # Проверка на заглавные буквы
        if re.search(r'[A-Z]', password):
            score += 1
        else:
            feedback.append("Добавьте заглавные буквы (A-Z)")
        
        # Проверка на цифры
        if re.search(r'\d', password):
            score += 1
        else:
            feedback.append("Добавьте цифры (0-9)")
        
        # Проверка на специальные символы
        if re.search(r'[!@#$%^&*]', password):
            score += 1
        else:
            feedback.append("Добавьте специальные символы (!@#$%^&*)")
        
        # Определяем уровень безопасности
        if score >= 6:
            strength = "Очень надежный"
        elif score >= 4:
            strength = "Надежный"
        elif score >= 2:
            strength = "Средний"
        else:
            strength = "Слабый"
        
        return {
            "password": password,
            "score": score,
            "max_score": 6,
            "strength": strength,
            "feedback": feedback
        }

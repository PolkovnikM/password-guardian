"""
Модуль для проверки паролей
"""

import re

class PasswordValidator:
    def __init__(self):
        self.common_passwords = [
            "password", "123456", "qwerty", "admin", "welcome"
        ]
    
    def validate(self, password):
        """Проверка надежности пароля"""
        checks = {
            "length_ok": len(password) >= 8,
            "has_lower": bool(re.search(r'[a-z]', password)),
            "has_upper": bool(re.search(r'[A-Z]', password)),
            "has_digit": bool(re.search(r'\d', password)),
            "has_special": bool(re.search(r'[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]', password)),
            "not_common": password.lower() not in self.common_passwords,
        }
        
        score = sum(checks.values())
        
        if score == 6:
            strength = "Очень надежный"
        elif score >= 4:
            strength = "Надежный"
        elif score >= 3:
            strength = "Средний"
        else:
            strength = "Слабый"
        
        suggestions = []
        if not checks["length_ok"]:
            suggestions.append("Увеличьте длину до 8+ символов")
        if not checks["has_lower"]:
            suggestions.append("Добавьте строчные буквы")
        if not checks["has_upper"]:
            suggestions.append("Добавьте заглавные буквы")
        if not checks["has_digit"]:
            suggestions.append("Добавьте цифры")
        if not checks["has_special"]:
            suggestions.append("Добавьте спецсимволы")
        if not checks["not_common"]:
            suggestions.append("Используйте более сложную комбинацию")
        
        return {
            "password": password,
            "strength": strength,
            "score": score,
            "max_score": 6,
            "checks": checks,
            "suggestions": suggestions
        }

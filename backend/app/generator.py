"""
Генератор паролей
"""

import random
import string

class PasswordGenerator:
    def generate(self, length=12, lowercase=True, uppercase=True, 
                 digits=True, special=False):
        """Генерирует пароль с настройками"""
        
        # Собираем символы для генерации
        chars = ""
        
        if lowercase:
            chars += string.ascii_lowercase
        if uppercase:
            chars += string.ascii_uppercase
        if digits:
            chars += string.digits
        if special:
            chars += "!@#$%^&*"
        
        # Если ничего не выбрано - используем всё
        if not chars:
            chars = string.ascii_letters + string.digits
        
        # Генерируем пароль
        password = ''.join(random.choice(chars) for _ in range(length))
        
        return {
            "password": password,
            "length": length,
            "settings": {
                "lowercase": lowercase,
                "uppercase": uppercase,
                "digits": digits,
                "special": special
            }
        }

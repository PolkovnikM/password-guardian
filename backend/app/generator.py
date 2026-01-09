"""
Модуль для генерации паролей
"""

import random
import string

class PasswordGenerator:
    def __init__(self):
        self.lowercase = string.ascii_lowercase
        self.uppercase = string.ascii_uppercase
        self.digits = string.digits
        self.special = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    
    def generate(self, length=12, **options):
        """Генерация пароля с настройками"""
        if length < 8:
            length = 8
        if length > 32:
            length = 32
        
        chars = ""
        if options.get('lowercase', True):
            chars += self.lowercase
        if options.get('uppercase', True):
            chars += self.uppercase
        if options.get('digits', True):
            chars += self.digits
        if options.get('special', False):
            chars += self.special
        
        if not chars:
            chars = self.lowercase + self.uppercase + self.digits
        
        password = ''.join(random.choice(chars) for _ in range(length))
        
        return {
            "password": password,
            "length": length,
            "options": options
        }

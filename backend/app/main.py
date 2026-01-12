"""
Password Guardian API
Главный файл FastAPI приложения
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .generator import PasswordGenerator
from .validator import PasswordValidator

# Создаем приложение
app = FastAPI(
    title="Password Guardian",
    description="API для генерации и проверки паролей",
    version="1.0.0"
)

# Разрешаем доступ с фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем все источники
    allow_methods=["*"],  # Разрешаем все методы
    allow_headers=["*"],  # Разрешаем все заголовки
)

# Создаем генератор и валидатор
generator = PasswordGenerator()
validator = PasswordValidator()

@app.get("/")
def home():
    """Главная страница API"""
    return {
        "message": "Password Guardian API",
        "version": "1.0.0",
        "endpoints": {
            "/api/generate": "Генерация пароля (GET параметры: length, lowercase, uppercase, digits, special)",
            "/api/validate": "Проверка пароля (GET параметр: password)",
            "/health": "Проверка здоровья сервера"
        },
        "docs": "http://localhost:8000/docs"
    }

@app.get("/health")
def health_check():
    """Проверка работы сервера"""
    return {"status": "ok", "service": "password-guardian"}

@app.get("/api/generate")
def generate_password(
    length: int = 12,
    lowercase: bool = True,
    uppercase: bool = True,
    digits: bool = True,
    special: bool = False
):
    """Генерация пароля с настройками"""
    # Генерируем пароль
    result = generator.generate(
        length=length,
        lowercase=lowercase,
        uppercase=uppercase,
        digits=digits,
        special=special
    )
    
    # Проверяем его
    validation = validator.validate(result["password"])
    
    return {
        **result,
        "strength": validation["strength"],
        "score": validation["score"],
        "feedback": validation.get("feedback", [])
    }

@app.get("/api/validate")
def validate_password(password: str):
    """Проверка пароля"""
    if not password:
        return {"error": "Введите пароль"}
    
    result = validator.validate(password)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

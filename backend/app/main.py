"""
Главный файл API
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .generator import PasswordGenerator
from .validator import PasswordValidator

app = FastAPI(
    title="Password Guardian API",
    description="Генератор и проверка паролей",
    version="1.0.0"
)

# Разрешаем доступ с фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Создаем экземпляры
generator = PasswordGenerator()
validator = PasswordValidator()

@app.get("/")
def home():
    return {"message": "Password Guardian API", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/api/generate")
def generate(
    length: int = 12,
    lowercase: bool = True,
    uppercase: bool = True,
    digits: bool = True,
    special: bool = False
):
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
        "score": validation["score"]
    }

@app.get("/api/validate")
def validate(password: str):
    if not password:
        return {"error": "Введите пароль"}
    
    result = validator.validate(password)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

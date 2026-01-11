/**
 * Основной файл фронтенда
 */

// Глобальные переменные
let currentTab = 'generate';

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

async function initApp() {
    // Настраиваем слайдер длины
    setupLengthSlider();
    
    // Проверяем API
    await checkApiStatus();
    
    // Заполняем информацию о студенте
    document.getElementById('student-name').textContent = '[Твое Имя]';
    document.getElementById('student-group').textContent = '[Твоя Группа]';
}

function setupLengthSlider() {
    const slider = document.getElementById('length');
    const valueDisplay = document.getElementById('length-value');
    
    if (slider && valueDisplay) {
        slider.addEventListener('input', function() {
            valueDisplay.textContent = this.value;
        });
    }
}

async function checkApiStatus() {
    const statusElement = document.getElementById('api-status');
    if (!statusElement) return;
    
    try {
        const response = await fetch('http://localhost:8000/health');
        if (response.ok) {
            statusElement.textContent = ' Онлайн';
            statusElement.className = 'status online';
        } else {
            throw new Error();
        }
    } catch (error) {
        statusElement.textContent = ' Офлайн';
        statusElement.className = 'status offline';
    }
}

// Переключение вкладок
function switchTab(tabName) {
    // Скрываем все вкладки
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Убираем активность у кнопок
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Показываем нужную вкладку
    const tab = document.getElementById(tabName + '-tab');
    if (tab) {
        tab.classList.add('active');
    }
    
    // Активируем кнопку
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    
    currentTab = tabName;
}

// Генерация пароля
async function generatePassword() {
    // === ВАЖНО: ПРОВЕРКА ГАЛОЧЕК ===
    const lowercase = document.getElementById('lowercase').checked;
    const uppercase = document.getElementById('uppercase').checked;
    const digits = document.getElementById('digits').checked;
    const special = document.getElementById('special').checked;
    
    // Проверяем что выбрана хотя бы одна галочка
    if (!lowercase && !uppercase && !digits && !special) {
        alert(' Ошибка! Выберите хотя бы один тип символов.');
        return; // Выходим из функции
    }
    
    const length = parseInt(document.getElementById('length').value);
    const generateBtn = document.querySelector('.btn[onclick="generatePassword()"]');
    
    if (!generateBtn) return;
    
    const originalText = generateBtn.innerHTML;
    
    try {
        // Показываем индикатор загрузки
        generateBtn.innerHTML = '⏳ Генерация...';
        generateBtn.disabled = true;
        
        // Собираем параметры для API
        const params = new URLSearchParams({
            length: length,
            lowercase: lowercase,
            uppercase: uppercase,
            digits: digits,
            special: special
        });
        
        // Отправляем запрос
        const response = await fetch('http://localhost:8000/api/generate?' + params);
        
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Показываем результат
        showGeneratedPassword(data);
        
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось сгенерировать пароль. Проверьте, запущен ли сервер.');
    } finally {
        // Восстанавливаем кнопку
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
    }
}

// Показ сгенерированного пароля
function showGeneratedPassword(data) {
    const passwordOutput = document.getElementById('password-output');
    const strengthText = document.getElementById('strength-text');
    const strengthDisplay = document.getElementById('strength-display');
    const resultDiv = document.getElementById('generate-result');
    
    if (!passwordOutput || !strengthText || !strengthDisplay || !resultDiv) return;
    
    // Показываем пароль
    passwordOutput.value = data.password || '';
    
    // Показываем надежность
    strengthText.textContent = data.strength || 'Неизвестно';
    
    // Настраиваем цвет индикатора
    strengthDisplay.className = 'strength ';
    const strength = (data.strength || '').toLowerCase();
    
    if (strength.includes('очень надежный') || strength.includes('надежный')) {
        strengthDisplay.classList.add('strength-strong');
    } else if (strength.includes('средний')) {
        strengthDisplay.classList.add('strength-medium');
    } else {
        strengthDisplay.classList.add('strength-weak');
    }
    
    // Показываем результат
    resultDiv.classList.add('active');
}

// Проверка пароля
async function validatePassword() {
    const passwordInput = document.getElementById('password-input');
    const password = passwordInput ? passwordInput.value.trim() : '';
    
    if (!password) {
        alert('Введите пароль для проверки!');
        if (passwordInput) passwordInput.focus();
        return;
    }
    
    const validateBtn = document.querySelector('.btn[onclick="validatePassword()"]');
    if (!validateBtn) return;
    
    const originalText = validateBtn.innerHTML;
    
    try {
        // Показываем индикатор
        validateBtn.innerHTML = ' Проверка...';
        validateBtn.disabled = true;
        
        // Отправляем запрос
        const response = await fetch('http://localhost:8000/api/validate?password=' + encodeURIComponent(password));
        
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Показываем результат
        showValidationResult(data);
        
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось проверить пароль');
    } finally {
        // Восстанавливаем кнопку
        validateBtn.innerHTML = originalText;
        validateBtn.disabled = false;
    }
}

// Показ результата проверки
function showValidationResult(data) {
    const scoreValue = document.getElementById('score-value');
    const validateStrengthText = document.getElementById('strength-text-validate');
    const validateStrength = document.getElementById('validate-strength');
    const suggestionsDiv = document.getElementById('suggestions');
    const resultDiv = document.getElementById('validate-result');
    
    if (!scoreValue || !validateStrengthText || !validateStrength || !suggestionsDiv || !resultDiv) return;
    
    // Показываем оценку
    scoreValue.textContent = (data.score || 0) + '/' + (data.max_score || 6);
    
    // Показываем надежность
    validateStrengthText.textContent = data.strength || 'Неизвестно';
    
    // Настраиваем цвет индикатора
    validateStrength.className = 'strength ';
    const strength = (data.strength || '').toLowerCase();
    
    if (strength.includes('очень надежный') || strength.includes('надежный')) {
        validateStrength.classList.add('strength-strong');
    } else if (strength.includes('средний')) {
        validateStrength.classList.add('strength-medium');
    } else {
        validateStrength.classList.add('strength-weak');
    }
    
    // Показываем рекомендации
    suggestionsDiv.innerHTML = '';
    if (data.suggestions && data.suggestions.length > 0) {
        const ul = document.createElement('ul');
        data.suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            ul.appendChild(li);
        });
        suggestionsDiv.appendChild(ul);
    } else {
        const p = document.createElement('p');
        p.textContent = 'Отличный пароль!';
        p.style.color = 'green';
        p.style.fontWeight = 'bold';
        suggestionsDiv.appendChild(p);
    }
    
    // Показываем результат
    resultDiv.classList.add('active');
}

// Копирование пароля
function copyPassword() {
    const passwordField = document.getElementById('password-output');
    if (!passwordField || !passwordField.value) {
        alert('Сначала сгенерируйте пароль!');
        return;
    }
    
    try {
        passwordField.select();
        document.execCommand('copy');
        alert(' Пароль скопирован в буфер обмена!');
    } catch (error) {
        console.error('Ошибка копирования:', error);
        alert('Не удалось скопировать пароль');
    }
}

// Переключение видимости пароля
function togglePassword() {
    const passwordInput = document.getElementById('password-input');
    const eyeBtn = event ? event.currentTarget : null;
    
    if (!passwordInput) return;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        if (eyeBtn) {
            const icon = eyeBtn.querySelector('i');
            if (icon) icon.className = 'far fa-eye-slash';
        }
    } else {
        passwordInput.type = 'password';
        if (eyeBtn) {
            const icon = eyeBtn.querySelector('i');
            if (icon) icon.className = 'far fa-eye';
        }
    }
}

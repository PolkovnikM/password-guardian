/**
 * Основной файл фронтенда
 */

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

async function initApp() {
    // Настраиваем слайдер длины
    setupLengthSlider();
    
    // Проверяем API
    await checkApiStatus();
    
    // Генерируем первый пароль
    setTimeout(generatePassword, 1000);
    
    // Заполняем информацию о студенте
    document.getElementById('student-name').textContent = '[Твое Имя]';
    document.getElementById('student-group').textContent = '[Твоя Группа]';
}

// Настройка слайдера длины
function setupLengthSlider() {
    const slider = document.getElementById('length');
    const valueDisplay = document.getElementById('length-value');
    
    slider.addEventListener('input', function() {
        valueDisplay.textContent = this.value;
    });
}

// Проверка статуса API
async function checkApiStatus() {
    const statusElement = document.getElementById('api-status');
    
    try {
        const isOnline = await passwordAPI.checkStatus();
        
        if (isOnline) {
            statusElement.textContent = '✅ Онлайн';
            statusElement.className = 'status online';
        } else {
            statusElement.textContent = '❌ Офлайн';
            statusElement.className = 'status offline';
        }
    } catch (error) {
        statusElement.textContent = '❌ Ошибка';
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
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Активируем кнопку
    event.currentTarget.classList.add('active');
}

// Генерация пароля
async function generatePassword() {
    const generateBtn = document.querySelector('.btn[onclick="generatePassword()"]');
    const originalText = generateBtn.innerHTML;
    
    try {
        // Показываем индикатор загрузки
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Генерация...';
        generateBtn.disabled = true;
        
        // Получаем настройки
        const options = {
            length: parseInt(document.getElementById('length').value),
            lowercase: document.getElementById('lowercase').checked,
            uppercase: document.getElementById('uppercase').checked,
            digits: document.getElementById('digits').checked,
            special: document.getElementById('special').checked
        };
        
        // Проверяем, что выбран хотя бы один тип символов
        if (!options.lowercase && !options.uppercase && !options.digits && !options.special) {
            utils.showNotification('Выберите хотя бы один тип символов!', 'error');
            return;
        }
        
        // Генерируем пароль
        const result = await passwordAPI.generatePassword(options);
        
        // Показываем результат
        showGeneratedPassword(result);
        
        // Уведомление
        utils.showNotification('Пароль сгенерирован!', 'success');
        
    } catch (error) {
        console.error('Ошибка:', error);
        utils.showNotification('Не удалось сгенерировать пароль. Запущен ли бэкенд?', 'error');
        
    } finally {
        // Восстанавливаем кнопку
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
    }
}

// Показ сгенерированного пароля
function showGeneratedPassword(data) {
    // Показываем пароль
    document.getElementById('password-output').value = data.password;
    
    // Показываем надежность
    const strengthText = document.getElementById('strength-text');
    strengthText.textContent = utils.formatStrength(data.strength);
    
    // Настраиваем индикатор
    const strengthDisplay = document.getElementById('strength-display');
    strengthDisplay.className = 'strength ';
    
    if (data.strength.includes('Очень надежный') || data.strength.includes('Надежный')) {
        strengthDisplay.classList.add('strength-strong');
    } else if (data.strength.includes('Средний')) {
        strengthDisplay.classList.add('strength-medium');
    } else {
        strengthDisplay.classList.add('strength-weak');
    }
    
    // Показываем результат
    document.getElementById('generate-result').classList.add('active');
}

// Проверка пароля
async function validatePassword() {
    const validateBtn = document.querySelector('.btn[onclick="validatePassword()"]');
    const passwordInput = document.getElementById('password-input');
    const password = passwordInput.value.trim();
    
    if (!password) {
        utils.showNotification('Введите пароль для проверки!', 'error');
        passwordInput.focus();
        return;
    }
    
    const originalText = validateBtn.innerHTML;
    
    try {
        // Показываем индикатор
        validateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Проверка...';
        validateBtn.disabled = true;
        
        // Проверяем пароль
        const result = await passwordAPI.validatePassword(password);
        
        // Показываем результат
        showValidationResult(result);
        
        // Уведомление
        utils.showNotification('Пароль проверен!', 'success');
        
    } catch (error) {
        console.error('Ошибка:', error);
        utils.showNotification('Не удалось проверить пароль', 'error');
        
    } finally {
        // Восстанавливаем кнопку
        validateBtn.innerHTML = originalText;
        validateBtn.disabled = false;
    }
}

// Показ результата проверки
function showValidationResult(data) {
    // Показываем оценку
    document.getElementById('score-value').textContent = 
        utils.formatScore(data.score, data.max_score);
    
    // Показываем надежность
    const strengthText = document.getElementById('strength-text-validate');
    strengthText.textContent = utils.formatStrength(data.strength);
    
    // Настраиваем индикатор
    const strengthDisplay = document.getElementById('validate-strength');
    strengthDisplay.className = 'strength ';
    
    if (data.strength.includes('Очень надежный') || data.strength.includes('Надежный')) {
        strengthDisplay.classList.add('strength-strong');
    } else if (data.strength.includes('Средний')) {
        strengthDisplay.classList.add('strength-medium');
    } else {
        strengthDisplay.classList.add('strength-weak');
    }
    
    // Показываем рекомендации
    const suggestionsDiv = document.getElementById('suggestions');
    suggestionsDiv.innerHTML = '<h4><i class="fas fa-lightbulb"></i> Рекомендации:</h4>';
    
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
        p.textContent = 'Отличный пароль! Все требования выполнены.';
        p.style.color = '#48bb78';
        p.style.fontWeight = 'bold';
        suggestionsDiv.appendChild(p);
    }
    
    // Показываем результат
    document.getElementById('validate-result').classList.add('active');
}

// Копирование пароля
async function copyPassword() {
    const passwordField = document.getElementById('password-output');
    
    try {
        await navigator.clipboard.writeText(passwordField.value);
        utils.showNotification('Пароль скопирован!', 'success');
    } catch (error) {
        // Fallback для старых браузеров
        passwordField.select();
        document.execCommand('copy');
        utils.showNotification('Пароль скопирован (старый метод)', 'success');
    }
}

// Переключение видимости пароля
function togglePassword() {
    const passwordInput = document.getElementById('password-input');
    const eyeIcon = event.currentTarget.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className = 'far fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className = 'far fa-eye';
    }
}

// script.js

// Elementy DOM
const clickArea = document.getElementById('click-area');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const attemptsInput = document.getElementById('attempts');
const gameModeSelect = document.getElementById('game-mode');
const statsPanel = document.getElementById('stats');
const shortestTimeSpan = document.getElementById('shortest-time');
const longestTimeSpan = document.getElementById('longest-time');
const averageTimeSpan = document.getElementById('average-time');
const bestTimeSpan = document.getElementById('best-time');
const wrongClicksSpan = document.getElementById('wrong-clicks');

// Zmienne gry
let attempts = 0;
let maxAttempts = 5;
let wrongClicks = 0;
let times = [];
let bestTime = null;
let timeoutId = null;
let gameActive = false;

// Funkcja startująca grę
function startGame() {
    maxAttempts = parseInt(attemptsInput.value) || 5;
    attempts = 0;
    wrongClicks = 0;
    times = [];
    gameActive = true;

    // Reset statystyk
    statsPanel.style.display = 'none';
    wrongClicksSpan.textContent = wrongClicks;

    startButton.disabled = true;
    stopButton.disabled = false;

    nextAttempt();
}

// Funkcja zatrzymująca grę
function stopGame() {
    gameActive = false;
    clearTimeout(timeoutId);

    startButton.disabled = false;
    stopButton.disabled = true;

    // Wyświetlenie statystyk
    if (times.length > 0) {
        displayStats();
    }
}

// Funkcja obsługująca kolejną próbę
function nextAttempt() {
    if (attempts >= maxAttempts) {
        stopGame();
        return;
    }

    attempts++;
    const randomDelay = Math.random() * 2000 + 1000; // Losowy czas od 1 do 3 sekund

    timeoutId = setTimeout(() => {
        clickArea.classList.add('active');
        const startTime = Date.now();

        // Obsługa kliknięcia lub klawisza
        const handleClickOrKeyPress = () => {
            if (!clickArea.classList.contains('active')) {
                wrongClicks++;
                wrongClicksSpan.textContent = wrongClicks;
                return;
            }

            const reactionTime = Date.now() - startTime;
            times.push(reactionTime);

            clickArea.classList.remove('active');
            clickArea.removeEventListener('click', handleClickOrKeyPress);
            document.removeEventListener('keydown', handleClickOrKeyPress);

            nextAttempt();
        };

        if (gameModeSelect.value === 'mouse') {
            clickArea.addEventListener('click', handleClickOrKeyPress);
        } else {
            document.addEventListener('keydown', handleClickOrKeyPress);
        }
    }, randomDelay);
}

// Funkcja wyświetlająca statystyki
function displayStats() {
    const shortestTime = Math.min(...times);
    const longestTime = Math.max(...times);
    const averageTime = times.reduce((a, b) => a + b, 0) / times.length;

    if (bestTime === null || shortestTime < bestTime) {
        bestTime = shortestTime;
    }

    shortestTimeSpan.textContent = shortestTime.toFixed(2);
    longestTimeSpan.textContent = longestTime.toFixed(2);
    averageTimeSpan.textContent = averageTime.toFixed(2);
    bestTimeSpan.textContent = bestTime.toFixed(2);

    statsPanel.style.display = 'block';
}

// Obsługa przycisków
startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', stopGame);

// Zliczanie kliknięć przed zmianą koloru
clickArea.addEventListener('click', () => {
    if (!clickArea.classList.contains('active')) {
        wrongClicks++;
        wrongClicksSpan.textContent = wrongClicks;
    }
});

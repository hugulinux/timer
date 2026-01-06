// Elements
const configScreen = document.getElementById('config-screen');
const timerScreen = document.getElementById('timer-screen');
const endScreen = document.getElementById('end-screen');

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const stopBtn = document.getElementById('stopBtn');
const backBtn = document.getElementById('backBtn');
const endBackBtn = document.getElementById('endBackBtn');

const timerDisplay = document.getElementById('timer-display');
const overtimeDisplay = document.getElementById('overtime-display');

// Inputs
const bgColorInput = document.getElementById('bgColor');
const textColorInput = document.getElementById('textColor');
const timeInput = document.getElementById('timeInput');
const modeSelect = document.getElementById('modeSelect');
const fontSizeSelect = document.getElementById('fontSizeSelect');
const fontFamilySelect = document.getElementById('fontFamilySelect');
const fullscreenCheck = document.getElementById('fullscreenCheck');
const logoDisplay = document.getElementById('logo-display');

// State
let timerInterval;
let overtimeInterval;
let totalSeconds = 0;
let remainingSeconds = 0;
let isPaused = false;
let mode = 'regressive'; // 'regressive' or 'progressive'

// Helper to format time MM:SS
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

function applyStyles() {
    const bg = bgColorInput.value;
    const text = textColorInput.value;
    const size = fontSizeSelect.value;
    const fontFamily = fontFamilySelect.value;

    // Apply to timer screen
    timerScreen.style.backgroundColor = bg;
    timerScreen.style.color = text;
    timerDisplay.style.fontSize = size;
    timerDisplay.style.fontFamily = fontFamily;
    overtimeDisplay.style.fontFamily = fontFamily;
}

function startTimer() {
    const minutes = parseInt(timeInput.value) || 0;
    totalSeconds = minutes * 60;
    mode = modeSelect.value;

    if (mode === 'regressive') {
        remainingSeconds = totalSeconds;
    } else {
        remainingSeconds = 0; // Starts at 0 for progressive
    }

    // Apply styles
    applyStyles();

    // Fullscreen
    if (fullscreenCheck.checked) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(e => console.log(e));
        }
    }

    updateDisplay();
    showScreen(timerScreen);

    isPaused = false;
    pauseBtn.style.display = 'inline-block';
    resumeBtn.style.display = 'none';

    clearInterval(timerInterval);
    timerInterval = setInterval(tick, 1000);
}

function tick() {
    if (isPaused) return;

    if (mode === 'regressive') {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            updateDisplay();
        } else {
            finishTimer();
        }
    } else {
        // Progressive
        remainingSeconds++;
        updateDisplay();

        // If totalSeconds > 0, we have a limit. If 0, it's infinite.
        if (totalSeconds > 0 && remainingSeconds >= totalSeconds) {
            finishTimer();
        }
    }
}

function updateDisplay() {
    timerDisplay.textContent = formatTime(remainingSeconds);
}

function pauseTimer() {
    isPaused = true;
    pauseBtn.style.display = 'none';
    resumeBtn.style.display = 'inline-block';
}

function resumeTimer() {
    isPaused = false;
    pauseBtn.style.display = 'inline-block';
    resumeBtn.style.display = 'none';
}

function stopTimer() {
    clearInterval(timerInterval);
    showScreen(configScreen);
    exitFullscreen();
}

function finishTimer() {
    clearInterval(timerInterval);
    showScreen(endScreen);
    startOvertime();
}

// Overtime logic for Screen 3
let overtimeSeconds = 0;
function startOvertime() {
    overtimeSeconds = 0;
    overtimeDisplay.textContent = formatTime(overtimeSeconds);
    clearInterval(overtimeInterval);
    overtimeInterval = setInterval(() => {
        overtimeSeconds++;
        overtimeDisplay.textContent = formatTime(overtimeSeconds);
    }, 1000);
}

function exitFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(e => console.log(e));
    }
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resumeBtn.addEventListener('click', resumeTimer);
stopBtn.addEventListener('click', stopTimer);
backBtn.addEventListener('click', stopTimer); // Back behaves like stop/reset to config

endBackBtn.addEventListener('click', () => {
    clearInterval(overtimeInterval);
    showScreen(configScreen);
    exitFullscreen();
});

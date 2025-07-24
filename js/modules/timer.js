export const timerState = {
    remaining: 0,
    interval: null,
    callback: null,
    running: false
};

const timerEl = document.getElementById('timer');

function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
}

function updateDisplay() {
    if (timerEl) {
        timerEl.textContent = formatTime(timerState.remaining);
    }
}

export function startTimer(seconds, cb) {
    clearInterval(timerState.interval);
    timerState.remaining = seconds;
    timerState.callback = cb;
    timerState.running = true;
    updateDisplay();
    timerState.interval = setInterval(() => {
        timerState.remaining--;
        if (timerState.remaining <= 0) {
            stopTimer();
            if (typeof timerState.callback === 'function') {
                timerState.callback();
            }
        }
        updateDisplay();
    }, 1000);
}

export function stopTimer() {
    if (timerState.interval) {
        clearInterval(timerState.interval);
        timerState.interval = null;
    }
    timerState.running = false;
    timerState.remaining = 0;
    updateDisplay();
}

export function finishTimer() {
    if (timerState.interval) {
        clearInterval(timerState.interval);
        timerState.interval = null;
    }
    const cb = timerState.callback;
    timerState.running = false;
    timerState.remaining = 0;
    updateDisplay();
    if (typeof cb === 'function') {
        cb();
    }
}

export function isTimerRunning() {
    return timerState.running;
}

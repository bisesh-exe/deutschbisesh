// timer.js

let timerInterval;
const STUDY_TIME = 20 * 60; // 20 minutes in seconds
let timeLeft = STUDY_TIME; 
let isRunning = false;

const playIcon = `<path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653Z" />`;
const pauseIcon = `<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />`;

function updateDisplay() {
    const display = document.getElementById('timer-display');
    if (!display) return; // Safety check

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function playAlarm() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime); 
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 1.5); 

    setTimeout(() => {
        alert("Die 20 Minuten sind um! Zeit für eine Pause.\n(20 minutes are up! Time for a break.)");
    }, 100);
}

function toggleTimer() {
    const btnIcon = document.getElementById('timer-icon');
    if (!btnIcon) return;

    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        btnIcon.innerHTML = playIcon;
    } else {
        isRunning = true;
        btnIcon.innerHTML = pauseIcon;
        
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                playAlarm();
                resetTimer();
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = STUDY_TIME;
    updateDisplay();
    
    const btnIcon = document.getElementById('timer-icon');
    if (btnIcon) {
        btnIcon.innerHTML = playIcon;
    }
}

// Initialize the display when the file loads
document.addEventListener('DOMContentLoaded', updateDisplay);
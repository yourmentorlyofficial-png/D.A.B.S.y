// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('DABSy ServiceWorker registered with scope:', reg.scope))
      .catch((err) => console.error('ServiceWorker registration failed:', err));
  });
}

// PWA Install Prompt Capture
let deferredPrompt;
const installCard = document.getElementById('installCard');
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installCard) installCard.style.display = 'flex';
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        installCard.style.display = 'none';
      }
      deferredPrompt = null;
    }
  });
}

// Tab Switching Logic
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const targetId = item.getAttribute('data-target');

    navItems.forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');

    tabContents.forEach(tab => {
      tab.classList.remove('active');
      if (tab.id === targetId) {
        tab.classList.add('active');
      }
    });
  });
});

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const htmlRoot = document.documentElement;

themeToggle.addEventListener('click', () => {
  const currentTheme = htmlRoot.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  htmlRoot.setAttribute('data-theme', newTheme);
});

// Pomodoro Timer Logic
let timerInterval;
let timeLeft = 25 * 60;
let isRunning = false;

const timerDisplay = document.getElementById('timerDisplay');
const timerToggleBtn = document.getElementById('timerToggleBtn');
const timerResetBtn = document.getElementById('timerResetBtn');
const quickStartTimer = document.getElementById('quickStartTimer');

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function toggleTimer() {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
    timerToggleBtn.textContent = 'Start';
  } else {
    isRunning = true;
    timerToggleBtn.textContent = 'Pause';
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        isRunning = false;
        timerToggleBtn.textContent = 'Start';
        alert('Pomodoro session complete! Great focus.');
      }
    }, 1000);
  }
}

if (timerToggleBtn) timerToggleBtn.addEventListener('click', toggleTimer);
if (quickStartTimer) {
  quickStartTimer.addEventListener('click', () => {
    document.querySelector('[data-target="tab-tools"]').click();
    if (!isRunning) toggleTimer();
  });
}

if (timerResetBtn) {
  timerResetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = 25 * 60;
    updateTimerDisplay();
    timerToggleBtn.textContent = 'Start';
  });
}

// Simple Chat Simulator (V1 stub ready for AI in V2)
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

function sendChatMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  // User message
  const userBubble = document.createElement('div');
  userBubble.style.cssText = 'background: var(--primary); color: white; padding: 10px 14px; border-radius: 12px; font-size: 0.85rem; max-width: 85%; align-self: flex-end; margin-left: auto;';
  userBubble.textContent = text;
  chatMessages.appendChild(userBubble);
  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Simulated AI response
  setTimeout(() => {
    const aiBubble = document.createElement('div');
    aiBubble.style.cssText = 'background: var(--bg-color); border: 1px solid var(--surface-border); padding: 10px 14px; border-radius: 12px; font-size: 0.85rem; max-width: 85%;';
    aiBubble.textContent = `I am processing "${text}". V2 AI integration will bring live responses and memory soon!`;
    chatMessages.appendChild(aiBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 600);
}

if (chatSend) chatSend.addEventListener('click', sendChatMessage);
if (chatInput) {
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });
}

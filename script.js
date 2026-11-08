/* ========================================================
   CONFIGURABLE SETTINGS & ASSETS
======================================================== */
const CONFIG = {
  correctPasscode: "1234", // Passcode for Omkar (or 2026)
  friendName: "Omkar",
  slideshowPhotos: [
    {
      url: "Images/image6.jpeg",
      caption: "Cricket is Love ✨"
    },
    {
      url: "Images/image7.jpeg",
      caption: "Nemophilist  😎"
    },
    {
      url: "Images/image8.jpeg",
      caption: "Maharaj Paglu 🚩 "
    }
  ]
};

/* Keypad logic */
let enteredPin = "";

function pressKey(num) {
  if (enteredPin.length < 4) {
    enteredPin += num;
    playTone(320 + (enteredPin.length * 90), 0.08);
    renderPinDots();
    if (enteredPin.length === 4) {
      setTimeout(verifyPin, 250);
    }
  }
}

function deletePin() {
  if (enteredPin.length > 0) {
    enteredPin = enteredPin.slice(0, -1);
    playTone(280, 0.06);
    renderPinDots();
  }
}

function clearPin() {
  enteredPin = "";
  playTone(220, 0.08);
  renderPinDots();
}

function renderPinDots() {
  for (let i = 0; i < 4; i++) {
    const box = document.getElementById(`pin${i}`);
    if (i < enteredPin.length) {
      box.textContent = "✱";
    } else {
      box.textContent = "";
    }
  }
}

function verifyPin() {
  if (enteredPin === CONFIG.correctPasscode || enteredPin === "2026") {
    playCheerSound();
    triggerConfetti();
    goToScreen('screenTeaserA');
    enteredPin = "";
    renderPinDots();
  } else {
    playBuzzerSound();
    goToScreen('screenWrong');
    enteredPin = "";
    renderPinDots();
  }
}

/* Screen Transition Navigation */
function goToScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
  }
}

function enterGiftHub() {
  triggerConfetti();
  playCheerSound();
  goToScreen('screenGiftHub');
}

/* Gift Modals */
function openGiftModal(modalId) {
  playTone(450, 0.1);
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
  }
}

function closeModals() {
  document.querySelectorAll('.gift-modal-overlay').forEach(m => m.classList.remove('open'));
}

/* Cake Candles Blow Out */
let candlesBlown = false;
function blowCandles() {
  if (!candlesBlown) {
    document.querySelectorAll('.candle-flame').forEach(f => f.classList.add('blown-out'));
    document.getElementById('cakeWishNotice').innerHTML = "🎉 WISH GRANTED! Happy Birthday Omkar! ❤️";
    triggerConfetti();
    playCheerSound();
    candlesBlown = true;
  } else {
    document.querySelectorAll('.candle-flame').forEach(f => f.classList.remove('blown-out'));
    document.getElementById('cakeWishNotice').innerHTML = "💨 Tap the cake to blow candles!";
    candlesBlown = false;
  }
}

/* Slideshow reel logic */
let slideIndex = 0;
function showSlide(index) {
  slideIndex = (index + CONFIG.slideshowPhotos.length) % CONFIG.slideshowPhotos.length;
  const img = document.getElementById('reelSlideImg');
  const caption = document.getElementById('slideCaption');
  img.src = CONFIG.slideshowPhotos[slideIndex].url;
  caption.textContent = CONFIG.slideshowPhotos[slideIndex].caption;
}

function nextSlide() {
  playTone(420, 0.06);
  showSlide(slideIndex + 1);
}

function prevSlide() {
  playTone(380, 0.06);
  showSlide(slideIndex - 1);
}

/* Confetti Burst */
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

/* Web Audio Synthesizer */
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, duration = 0.1) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio context may be waiting for initial user interaction
  }
}

function playBuzzerSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.setValueAtTime(120, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch(e) {}
}

function playCheerSound() {
  const melody = [261.6, 329.6, 392.0, 523.2];
  melody.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.18), i * 90);
  });
}

/* Cute Chiptune Happy Birthday BGM Loop */
let bgmInterval = null;
let isBgmPlaying = false;

const bdayNotes = [
  { f: 261.6, d: 250 }, { f: 261.6, d: 250 }, { f: 293.6, d: 500 }, { f: 261.6, d: 500 }, { f: 349.2, d: 500 }, { f: 329.6, d: 900 },
  { f: 261.6, d: 250 }, { f: 261.6, d: 250 }, { f: 293.6, d: 500 }, { f: 261.6, d: 500 }, { f: 392.0, d: 500 }, { f: 349.2, d: 900 }
];

function toggleBGM() {
  const btn = document.getElementById('audioToggleBtn');
  if (isBgmPlaying) {
    clearInterval(bgmInterval);
    isBgmPlaying = false;
    btn.textContent = "🔇";
  } else {
    isBgmPlaying = true;
    btn.textContent = "🎶";
    playBdayMelody();
  }
}

function playBdayMelody() {
  if (!isBgmPlaying) return;
  let delay = 0;
  bdayNotes.forEach((item) => {
    setTimeout(() => {
      if (isBgmPlaying) playTone(item.f, item.d / 1000);
    }, delay);
    delay += item.d + 60;
  });
  bgmInterval = setTimeout(playBdayMelody, delay + 1000);
}

document.getElementById('audioToggleBtn').addEventListener('click', toggleBGM);

// Close modal when tapping overlay background
document.querySelectorAll('.gift-modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModals();
  });
});

// Keyboard support for keypad
window.addEventListener('keydown', (e) => {
  if (!document.getElementById('screenPasscode').classList.contains('active')) return;
  if (e.key >= '0' && e.key <= '9') {
    pressKey(e.key);
  } else if (e.key === 'Backspace') {
    deletePin();
  } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
    clearPin();
  }
});

/* ========================================================
   UNIVERSE MODAL HANDLERS
======================================================== */
function openUniverseModal(modalId) {
  playTone(480, 0.1);
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
  }
}

function closeUniverseModals() {
  document.querySelectorAll('.gift-modal-overlay').forEach(m => m.classList.remove('open'));
}
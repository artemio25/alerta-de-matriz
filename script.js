const startBtn = document.getElementById("startBtn");
const typedMessage = document.getElementById("typedMessage");
const alertMessage = document.getElementById("alertMessage");
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
let i = 0;
let alarmInterval;

// Sons
function playBeep(ctx) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(800, ctx.currentTime);
  gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.05);
}

function playAlarm(ctx) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(400, ctx.currentTime);
  gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.5);
}

// Digitação da mensagem com beep
const text = "⚠️ Tome cuidado na próxima vez que acessar esse site";
function typeWriter(ctx) {
  if (i < text.length) {
    typedMessage.textContent += text.charAt(i);
    playBeep(ctx);
    i++;
    setTimeout(() => typeWriter(ctx), 80);
  } else {
    alertMessage.style.display = "block";
    alarmInterval = setInterval(() => playAlarm(ctx), 3000);
  }
}

// Matrix Rain
function startMatrix() {
  canvas.style.display = "block";
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  const letters = 'アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const lettersArray = letters.split('');
  const fontSize = 16;
  const columns = canvas.width / fontSize;
  const drops = [];
  for (let x = 0; x < columns; x++) drops[x] = 1;

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
      const text = lettersArray[Math.floor(Math.random() * lettersArray.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(draw, 33);
}

// Ao clicar no botão
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  document.body.style.background = "black";
  startMatrix();
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  typeWriter(audioCtx);
});
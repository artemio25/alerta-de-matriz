// Função para salvar usuário no localStorage
function salvarUsuario(usuario, senha) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // Verifica se já existe usuário com esse nome
  const existe = usuarios.find(u => u.usuario === usuario);
  if (existe) {
    alert("Esse usuário já está cadastrado!");
    return false;
  }

  usuarios.push({ usuario, senha });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  return true;
}

// Função para verificar login
function verificarLogin(usuario, senha) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  return usuarios.find(u => u.usuario === usuario && u.senha === senha);
}

// Cadastro
const cadastroForm = document.getElementById("cadastroForm");
if (cadastroForm) {
  cadastroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const usuario = cadastroForm.usuario.value;
    const senha = cadastroForm.senha.value;
    const confirmarSenha = cadastroForm.confirmarSenha.value;

    // Validação da senha
    if (senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    // Confirmação de senha
    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    if (salvarUsuario(usuario, senha)) {
      alert("Cadastro realizado com sucesso!");
      window.location.href = "index.html"; // redireciona para login
    }
  });
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const usuario = loginForm.usuario.value;
    const senha = loginForm.senha.value;

    if (verificarLogin(usuario, senha)) {
      document.querySelector(".login-box").style.display = "none";
      document.body.style.background = "black";
      iniciarMatrix();
    } else {
      alert("Usuário ou senha incorretos!");
    }
  });
}

// ---------------- MATRIX + ALERTAS ----------------
function iniciarMatrix() {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
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

  // Mensagem digitada
  const typedMessage = document.createElement("div");
  typedMessage.style.position = "fixed";
  typedMessage.style.top = "40%";
  typedMessage.style.left = "50%";
  typedMessage.style.transform = "translate(-50%, -50%)";
  typedMessage.style.color = "#0f0";
  typedMessage.style.fontSize = "1.5rem";
  typedMessage.style.zIndex = "2";
  document.body.appendChild(typedMessage);

  const text = "⚠️ Acesso autorizado. Bem-vindo ao sistema.";
  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      typedMessage.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 80);
    } else {
      const alertMessage = document.createElement("div");
      alertMessage.textContent = ">>>> Você está sendo monitorado por MDF <<<<";
      alertMessage.style.position = "fixed";
      alertMessage.style.top = "60%";
      alertMessage.style.left = "50%";
      alertMessage.style.transform = "translate(-50%, -50%)";
      alertMessage.style.fontSize = "2rem";
      alertMessage.style.fontWeight = "bold";
      alertMessage.style.color = "red";
      alertMessage.style.zIndex = "2";
      document.body.appendChild(alertMessage);

      // 🔊 Som de alerta repetindo
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      function playAlarm() {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
      }
      setInterval(playAlarm, 3000); // toca a cada 3 segundos
    }
  }
  typeWriter();
}
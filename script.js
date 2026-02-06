// Função para transformar texto em Hash SHA-256 (Criptografia de via única)
async function gerarHash(senha) {
    const msgUint8 = new TextEncoder().encode(senha);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Cadastro
async function salvarUsuario(usuario, senha) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (usuarios.find(u => u.usuario === usuario)) {
        alert("Esse usuário já está cadastrado!");
        return false;
    }

    const senhaHash = await gerarHash(senha); // Gera o Hash
    usuarios.push({ usuario, senha: senhaHash });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    return true;
}

// Verificação de Login
async function verificarLogin(usuario, senha) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const senhaHash = await gerarHash(senha); // Transforma a tentativa em hash para comparar
    return usuarios.find(u => u.usuario === usuario && u.senha === senhaHash);
}

// Evento de Cadastro
const cadastroForm = document.getElementById("cadastroForm");
if (cadastroForm) {
    cadastroForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const usuario = cadastroForm.usuario.value;
        const senha = cadastroForm.senha.value;
        const confirmarSenha = cadastroForm.confirmarSenha.value;

        if (senha.length < 6) {
            alert("A senha deve ter pelo menos 6 caracteres!");
            return;
        }
        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        if (await salvarUsuario(usuario, senha)) {
            alert("Cadastro realizado com segurança!");
            window.location.href = "index.html";
        }
    });
}

// Evento de Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const usuario = loginForm.usuario.value;
        const senha = loginForm.senha.value;

        if (await verificarLogin(usuario, senha)) {
            document.querySelector(".login-box").style.display = "none";
            document.body.style.background = "black";
            iniciarMatrix();
        } else {
            alert("Credenciais incorretas!");
        }
    });
}

// --- Efeito Matrix (Mantido) ---
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

    const typedMessage = document.createElement("div");
    Object.assign(typedMessage.style, {
        position: "fixed", top: "40%", left: "50%", transform: "translate(-50%, -50%)",
        color: "#0f0", fontSize: "1.5rem", zIndex: "2"
    });
    document.body.appendChild(typedMessage);

    const text = "⚠️ Acesso autorizado. Bem-vindo ao sistema.";
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            typedMessage.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 80);
        } else {
            exibirAlertaFinal();
        }
    }
    typeWriter();
}

function exibirAlertaFinal() {
    const alertMessage = document.createElement("div");
    alertMessage.textContent = ">>>> Você está sendo monitorado por MDF <<<<";
    Object.assign(alertMessage.style, {
        position: "fixed", top: "60%", left: "50%", transform: "translate(-50%, -50%)",
        fontSize: "2rem", fontWeight: "bold", color: "red", zIndex: "2"
    });
    document.body.appendChild(alertMessage);

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    setInterval(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
    }, 3000);
}
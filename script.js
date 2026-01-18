// --- SOUND SYSTEM (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode); gainNode.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === 'jump') {
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now); osc.stop(now + 0.1);
    } else if (type === 'score') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, now);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.start(now); osc.stop(now + 0.1);
    } else if (type === 'crash') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
        gainNode.gain.setValueAtTime(0.5, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'correct') {
        playNote(523.25, now, 0.1); playNote(659.25, now + 0.1, 0.1); playNote(783.99, now + 0.2, 0.2);
    } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.4);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now); osc.stop(now + 0.4);
    } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now); osc.stop(now + 0.05);
    } else if (type === 'win') {
        playNote(523.25, now, 0.15, 'square'); playNote(659.25, now+0.15, 0.15, 'square'); 
        playNote(783.99, now+0.3, 0.15, 'square'); playNote(1046.50, now+0.45, 0.4, 'square'); 
    }
}
function playNote(freq, time, duration, type='sine') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type; osc.frequency.value = freq;
    osc.connect(gain); gain.connect(audioCtx.destination);
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.linearRampToValueAtTime(0.01, time + duration);
    osc.start(time); osc.stop(time + duration);
}

// --- KONFETI EFFECT ---
const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas.getContext('2d');
let confettiParticles = [];

function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfetti);
resizeConfetti();

function createConfetti() {
    for (let i = 0; i < 150; i++) {
        confettiParticles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            size: Math.random() * 10 + 5,
            speed: Math.random() * 5 + 3,
            angle: Math.random() * 360,
            spin: Math.random() * 10 - 5
        });
    }
}

function updateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach((p, index) => {
        p.y += p.speed;
        p.angle += p.spin;
        p.x += Math.sin(p.angle * Math.PI / 180) * 2;
        if (p.y > confettiCanvas.height) confettiParticles.splice(index, 1);
        confettiCtx.fillStyle = p.color;
        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate(p.angle * Math.PI / 180);
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        confettiCtx.restore();
    });
    if (confettiParticles.length > 0) requestAnimationFrame(updateConfetti);
}

function fireConfetti() {
    createConfetti();
    updateConfetti();
}

// --- DATA LEVEL ---
const levelsData = [
    {
        question: "Di dunia ini cuma ada satu laki-laki yang kalau pesan makan banyak malah tidak dibolehkan. Siapakah dia?",
        choices: ["Koki restoran", "Fikri", "Pria yang sedang diet", "Pria yang tidak punya uang"],
        validAnswers: ["fikri"],
        reason: "👉 Karena satu Indonesia udah trauma bilangin dia. 'Nggak habis, Fikri!' adalah kalimat pemersatu bangsa."
    },
    {
        question: "Dalam pertandingan sepak bola ada babak pertama dan babak kedua. Biasanya di tengah-tengah permainan ada babak yang paling seru. Apa itu?",
        choices: ["Babak belur", "Babak istirahat", "Babak tambahan", "Babak adu penalti"],
        validAnswers: ["babak belur"],
        reason: "👉 Ya iyalah, kalau nggak belur namanya bukan berantem, tapi arisan ibu-ibu komplek."
    },
    {
        question: "Ada kelereng jumlahnya 1345, ditambah 4391 lalu dikali 37, kemudian dikurang 19. Tinggal berapa?",
        choices: ["0", "210.000-an", "Tinggalin aja", "174.000-an"],
        validAnswers: ["tinggalin aja"],
        reason: "👉 Ngapain diitung woy! Emangnya mau ujian nasional? Mending rebahan, scroll TikTok."
    },
    {
        question: "Tahukah kamu kenapa kita hanya bisa melihat pelangi setengah lingkaran?",
        choices: ["Karena hukum fisika", "Karena setengahnya ada di matamu", "Karena posisi matahari", "Karena terhalang cakrawala"],
        validAnswers: ["karena setengahnya ada di matamu", "karena setengahnya lagi ada di matamu"],
        reason: "👉 Eaaa! Gombal dikit gapapa lah ya biar nggak stres."
    },
    {
        question: "Misalkan Adi punya uang 20 juta. Dikasih ke ibunya 3 juta, ke bapaknya 2 juta. Besoknya dicopet 4 juta. Berapa sisa uang Adi?",
        choices: ["14 juta", "Tidak ada", "10 juta", "0"],
        validAnswers: ["tidak ada"],
        reason: "👉 Yaelah serius amat ngitungnya! Namanya juga 'Misalkan'. Aslinya mah si Adi lagi pusing dikejar pinjol."
    },
    {
        question: "Binatang apa yang sudah diberi parfum tapi tetap saja nggak wangi?",
        choices: ["Kambing", "Kerbau", "Anjing", "Kucing"],
        validAnswers: ["kerbau"],
        reason: "👉 Mau mandi kembang 7 rupa juga tetep aja namanya KER-BAU! Kecuali ganti KTP jadi Ker-wangi."
    },
    {
        question: "Bundaran HI kalau diputerin tiga kali jadi apa?",
        validAnswers: ["hihihi"],
        clue: "Ketawa.",
        reason: "👉 HI... HI... HI... Kuntilanak kali ah! Awas jangan diputer malem Jumat."
    },
    {
        question: "Apa yang kelihatannya sederhana, tidak bersuara, tapi sekali muncul bisa bikin hari orang langsung cerah?",
        validAnswers: ["senyum manismu", "senyummu", "senyum"],
        clue: "Ada di wajahmu.",
        reason: "👉 Aduh, awas diabetes! Gulanya pabrik tebu kalah manis sama senyum kamu."
    },
    {
        question: "Aku adalah instrumen yang menghasilkan suara, namun bukan sesuatu yang bisa dimainkan. Siapakah aku?",
        validAnswers: ["suaramu", "suara kamu"],
        clue: "Bunyi bicaramu.",
        reason: "👉 Nggak bisa dipetik kayak gitar, tapi bisa bikin hati bergetar. Eaaa!"
    },
    {
        question: "Cuka apa yang nggak bikin sakit lambung, malah bikin senang hati?",
        validAnswers: ["cuka sama kamu", "suka sama kamu"],
        clue: "Plesetan perasaan.",
        reason: "👉 Rasanya asem-asem seger gimanaaa gitu, bikin nagih! Cuka... Cuka banget sama kamu! Uwuuu~"
    }
];

const roasts = [
    "Salah woy! Sekolah di mana sih?",
    "Yakin jawaban itu? Coba pikir pake lutut.",
    "Dih, gitu aja gatau. Malu sama ayam tetangga.",
    "Hadeuh... Beban keluarga detected.",
    "Mending google dulu deh, daripada malu.",
    "Salah! Coba lagi (kalo punya malu).",
    "Otaknya ketinggalan di mana bang?",
    "Jawaban macam apa itu? Ngawur!",
    "IQ anda sedang offline sepertinya.",
    "Ayolah, jangan bikin malu admin dong."
];

// --- STATE VARIABLES ---
let currentLevels = [];
let currentLevelIndex = 0;
let lives = 15;
let isProcessing = false;
let wrongAttempts = 0;

// --- DOM ELEMENTS ---
const screens = {
    welcome: document.getElementById('screen-welcome'),
    riddle: document.getElementById('screen-riddle'),
    game: document.getElementById('screen-game'),
    win: document.getElementById('screen-win'),
    gameover: document.getElementById('screen-gameover')
};
const elements = {
    riddleText: document.getElementById('riddle-text'),
    levelIndicator: document.getElementById('level-indicator'),
    inputArea: document.getElementById('input-area'),
    answerInput: document.getElementById('answer-input'),
    choicesArea: document.getElementById('choices-area'),
    btnClue: document.getElementById('btn-clue'),
    clueText: document.getElementById('clue-text'),
    messageBox: document.getElementById('message'),
    btnContinue: document.getElementById('btn-continue'),
    scoreDisplay: document.getElementById('score'),
    container: document.getElementById('app-container'),
    livesContainer: document.getElementById('lives-container'),
    livesText: document.getElementById('lives-text'),
    gameOverlay: document.getElementById('game-overlay'),
    gameLevelText: document.getElementById('game-level-text'),
    targetText: document.getElementById('target-text'),
    speedText: document.getElementById('speed-text'),
    targetScoreDisplay: document.getElementById('target-score-display')
};

// --- GAME VARIABLES ---
let canvas, ctx;
let bird, pipes;
let frames = 0;
let animationFrameId;
let isGameRunning = false;
let gameScore = 0;
let targetScore = 3;
let gravity = 0.20;
let jumpStrength = -3.5;
let pipeSpeed = 1.5;
let pipeSpawnRate = 140;
let pipeGap = 150;

// --- FUNCTIONS ---
function showScreen(screenName) {
    Object.values(screens).forEach(el => {
        if (el) el.classList.add('hidden');
    });
    screens[screenName].classList.remove('hidden');
    
    if (screenName === 'riddle' || screenName === 'game') {
        elements.livesContainer.classList.remove('hidden');
    } else {
        elements.livesContainer.classList.add('hidden');
    }
    
    elements.container.classList.remove('pop-in');
    void elements.container.offsetWidth;
    elements.container.classList.add('pop-in');
}

function updateLivesDisplay() {
    let hearts = "";
    if (lives > 5) elements.livesText.innerText = lives;
    else elements.livesText.innerText = lives > 0 ? lives : "💀";
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function initAudioAndStart() {
    playSound('click');
    startGame();
}

function startGame() {
    currentLevelIndex = 0;
    lives = 15;
    updateLivesDisplay();
    currentLevels = shuffleArray(levelsData); 
    loadLevel();
}

function retryLevel() {
    lives = 15; 
    updateLivesDisplay();
    loadLevel();
}

function loadLevel() {
    if (currentLevelIndex >= currentLevels.length) {
        playSound('win');
        showScreen('win');
        fireConfetti();
        return;
    }

    const level = currentLevels[currentLevelIndex];
    isProcessing = false;
    wrongAttempts = 0;
    
    elements.btnContinue.classList.add('hidden'); 
    
    elements.levelIndicator.innerText = `LEVEL ${currentLevelIndex + 1}`;
    elements.riddleText.innerText = level.question;
    elements.messageBox.innerText = "";
    elements.messageBox.className = "";
    
    if (level.choices && level.choices.length > 0) {
        elements.inputArea.classList.add('hidden');
        elements.choicesArea.classList.remove('hidden');
        renderChoices(level.choices);
    } else {
        elements.inputArea.classList.remove('hidden');
        elements.choicesArea.classList.add('hidden');
        elements.answerInput.value = "";
        elements.clueText.classList.add('hidden');
        elements.clueText.innerText = "";
        
        if (level.clue) elements.btnClue.classList.remove('hidden');
        else elements.btnClue.classList.add('hidden');
    }
    showScreen('riddle');
}

function showClue() {
    playSound('click');
    const level = currentLevels[currentLevelIndex];
    if (level.clue) {
        elements.clueText.innerText = "Nih Petunjuknya: " + level.clue;
        elements.clueText.classList.remove('hidden');
        elements.btnClue.classList.add('hidden');
    }
}

function renderChoices(choices) {
    elements.choicesArea.innerHTML = "";
    choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = "choice-btn";
        btn.innerText = choice;
        btn.onclick = () => {
            if(isProcessing) return;
            playSound('click');
            checkAnswerChoice(btn, choice);
        };
        elements.choicesArea.appendChild(btn);
    });
}

function checkAnswerInput() {
    playSound('click');
    if(isProcessing) return;
    const userAnswer = elements.answerInput.value.toLowerCase().trim();
    validateAnswer(userAnswer);
}

function checkAnswerChoice(btnElement, answerText) {
    if(isProcessing) return;
    const userAnswer = answerText.toLowerCase().trim();
    const correctAnswers = currentLevels[currentLevelIndex].validAnswers;
    
    if (correctAnswers.includes(userAnswer)) btnElement.classList.add('correct');
    else btnElement.classList.add('wrong');
    
    validateAnswer(userAnswer);
}

function validateAnswer(userAnswer) {
    const correctAnswers = currentLevels[currentLevelIndex].validAnswers;

    if (correctAnswers.includes(userAnswer)) {
        // BENAR
        isProcessing = true;
        playSound('correct');
        
        const reasonText = currentLevels[currentLevelIndex].reason || "Gokil!";
        elements.messageBox.innerText = `NAH GITU DONG!\n${reasonText}`;
        elements.messageBox.className = "success-text";
        
        elements.btnContinue.classList.remove('hidden');
        setTimeout(() => {
            elements.container.scrollTo({ top: elements.container.scrollHeight, behavior: 'smooth' });
        }, 100);

    } else {
        // SALAH
        lives--;
        wrongAttempts++;
        updateLivesDisplay();
        playSound('wrong');
        
        elements.container.classList.add('shake');
        setTimeout(() => elements.container.classList.remove('shake'), 500);
        elements.messageBox.className = "error-text";

        if (lives <= 0) {
            isProcessing = true;
            setTimeout(() => showScreen('gameover'), 800);
            return;
        }

        if (wrongAttempts >= 2) {
            const correctAns = correctAnswers[0];
            const displayAns = correctAns.charAt(0).toUpperCase() + correctAns.slice(1);
            elements.messageBox.innerText = `Udah salah 2x, nyerah aja deh. Jawabannya: ${displayAns}`;
            
            const level = currentLevels[currentLevelIndex];
            if (level.choices && level.choices.length > 0) {
                const buttons = elements.choicesArea.querySelectorAll('.choice-btn');
                buttons.forEach(btn => {
                    if (correctAnswers.includes(btn.innerText.toLowerCase())) {
                        btn.classList.add('correct');
                    }
                });
            } else {
                elements.answerInput.value = displayAns;
            }
            elements.btnContinue.classList.remove('hidden');
            isProcessing = true;

        } else {
            const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
            elements.messageBox.innerText = `${randomRoast}\n(Nyawa -1)`;
        }
    }
}

function proceedToGame() {
    playSound('click');
    startFlappyGame();
}

elements.answerInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") checkAnswerInput();
});

// --- FLAPPY GAME LOGIC ---
function resizeGameCanvas() {
    const gameArea = document.getElementById('game-area');
    if (canvas && gameArea) {
        canvas.width = gameArea.clientWidth;
        canvas.height = gameArea.clientHeight;
    }
}
window.addEventListener('resize', resizeGameCanvas);

function startFlappyGame() {
    showScreen('game');
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    resizeGameCanvas();

    targetScore = 3 + currentLevelIndex; 
    
    pipeSpeed = 1.5 + (currentLevelIndex * 0.1); 
    pipeSpawnRate = Math.max(90, 140 - (currentLevelIndex * 5));
    pipeGap = Math.max(120, 150 - (currentLevelIndex * 3));

    elements.gameLevelText.innerText = currentLevelIndex + 1;
    elements.targetText.innerText = targetScore + " tiang";
    elements.targetScoreDisplay.innerText = targetScore;
    
    if(pipeSpeed < 2) elements.speedText.innerText = "Nyantai";
    else if(pipeSpeed < 2.5) {
        elements.speedText.innerText = "Ngebut Dikit";
        elements.speedText.style.color = "var(--accent)";
    } else {
        elements.speedText.innerText = "MODE SETAN 🔥";
        elements.speedText.style.color = "var(--danger)";
    }

    bird = { x: 50, y: 150, width: 30, height: 30, velocity: 0 };
    pipes = [];
    gameScore = 0;
    frames = 0;
    elements.scoreDisplay.innerText = "0";

    isGameRunning = false;
    elements.gameOverlay.classList.remove('hidden');
    drawGame();

    // Event Listeners for Game
    const handleInput = (e) => {
        if (e.type !== 'keydown') e.preventDefault(); 
        if(isGameRunning) {
            birdJump();
        } else if(!elements.gameOverlay.classList.contains('hidden') && !screens.game.classList.contains('hidden')) {
            startGameLoop();
        }
    };

    canvas.onmousedown = handleInput;
    canvas.ontouchstart = handleInput;
    document.onkeydown = (e) => {
        if (e.target.tagName === 'INPUT') return;
        if (e.code === 'Space') {
            e.preventDefault();
            handleInput(e);
        }
    };
}

function startGameLoop() {
    playSound('click');
    elements.gameOverlay.classList.add('hidden');
    isGameRunning = true;
    gameLoop();
}

function birdJump() {
    playSound('jump');
    bird.velocity = jumpStrength;
}

function gameLoop() {
    if (!isGameRunning) return;
    updateGame();
    drawGame();
    animationFrameId = requestAnimationFrame(gameLoop);
}

function updateGame() {
    bird.velocity += gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) handleCrash();

    if (frames % pipeSpawnRate === 0) {
        const minHeight = 40;
        const maxHeight = canvas.height - pipeGap - minHeight;
        const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

        pipes.push({ x: canvas.width, y: 0, width: 50, height: topHeight, type: 'top', passed: false });
        pipes.push({ x: canvas.width, y: topHeight + pipeGap, width: 50, height: canvas.height, type: 'bottom' });
    }

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
        
        // Collision Detection
        if (
            bird.x < pipe.x + pipe.width && bird.x + bird.width > pipe.x &&
            bird.y < pipe.y + pipe.height && bird.y + bird.height > pipe.y
        ) {
            handleCrash();
        }

        if (pipe.type === 'top' && pipe.x + pipe.width < bird.x && !pipe.passed) {
            pipe.passed = true;
            gameScore++;
            playSound('score');
            elements.scoreDisplay.innerText = gameScore;
            if (gameScore >= targetScore) winMiniGame();
        }
    });

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
    frames++;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sky gradient
    let gradSky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradSky.addColorStop(0, '#81ecec');
    gradSky.addColorStop(1, '#74b9ff');
    ctx.fillStyle = gradSky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    
    // Awan 1
    let c1 = (frames * 1.5) % (canvas.width + 200) - 150;
    ctx.beginPath(); ctx.arc(c1, 50, 20, 0, Math.PI * 2); ctx.arc(c1 + 30, 40, 30, 0, Math.PI * 2); ctx.arc(c1 + 60, 50, 20, 0, Math.PI * 2); ctx.fill();

    // Awan 2
    let c2 = (frames * 0.8 + 250) % (canvas.width + 250) - 180;
    ctx.beginPath(); ctx.arc(c2, 120, 25, 0, Math.PI * 2); ctx.arc(c2 + 35, 105, 35, 0, Math.PI * 2); ctx.arc(c2 + 70, 120, 25, 0, Math.PI * 2); ctx.fill();

    // Pipes
    pipes.forEach(pipe => {
        let grad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
        grad.addColorStop(0, '#55efc4'); grad.addColorStop(0.5, '#00b894'); grad.addColorStop(1, '#00cec9');
        ctx.fillStyle = grad;
        ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
        ctx.strokeStyle = '#006266'; ctx.lineWidth = 2;
        ctx.strokeRect(pipe.x, pipe.y, pipe.width, pipe.height);
        
        // Pipe Caps
        if(pipe.type === 'top') {
            ctx.fillRect(pipe.x - 2, pipe.y + pipe.height - 20, pipe.width + 4, 20);
            ctx.strokeRect(pipe.x - 2, pipe.y + pipe.height - 20, pipe.width + 4, 20);
        } else {
            ctx.fillRect(pipe.x - 2, pipe.y, pipe.width + 4, 20);
            ctx.strokeRect(pipe.x - 2, pipe.y, pipe.width + 4, 20);
        }
    });

    // Bird (Yellow)
    const centerX = bird.x + bird.width / 2;
    const centerY = bird.y + bird.height / 2;
    const radius = bird.width / 2;

    ctx.fillStyle = '#f1c40f';
    ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#f39c12'; ctx.lineWidth = 2; ctx.stroke();

    // Bird Eye
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(centerX + 6, centerY - 6, 8, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(centerX + 8, centerY - 6, 3, 0, Math.PI*2); ctx.fill();

    // Bird Beak
    ctx.fillStyle = '#e67e22'; ctx.beginPath(); ctx.moveTo(centerX + 10, centerY + 2); ctx.lineTo(centerX + 22, centerY + 6); ctx.lineTo(centerX + 10, centerY + 10); ctx.fill();

    // Wing
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'; ctx.beginPath(); ctx.ellipse(centerX - 5, centerY + 5, 10, 6, -0.2, 0, Math.PI*2); ctx.fill();
}

function handleCrash() {
    if(!isGameRunning) return;
    isGameRunning = false;
    lives--;
    updateLivesDisplay();
    playSound('crash');

    if (lives <= 0) {
        setTimeout(() => showScreen('gameover'), 500);
    } else {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 30px Poppins, sans-serif';
        ctx.textAlign = 'center';
        
        const crashMsgs = ["ADEUH!", "REMUK!", "NABRAK!", "AW SAKIT!", "GUBRAK!"];
        const msg = crashMsgs[Math.floor(Math.random() * crashMsgs.length)];
        
        ctx.fillText(msg, canvas.width/2, canvas.height/2);
        ctx.font = '16px Poppins, sans-serif';
        ctx.fillText(`Nyawa tinggal ${lives} bang...`, canvas.width/2, canvas.height/2 + 35);
        
        setTimeout(() => {
            bird.y = 150; bird.velocity = 0; pipes = []; frames = 0; gameScore = 0;
            elements.scoreDisplay.innerText = "0";
            startFlappyGame();
        }, 1200);
    }
}

function winMiniGame() {
    isGameRunning = false;
    cancelAnimationFrame(animationFrameId);
    currentLevelIndex++;
    playSound('correct'); 
    
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 10;
    ctx.fillStyle = '#00b894';
    ctx.font = 'bold 28px Poppins, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText("MANTAP JIWA!", canvas.width/2, canvas.height/2 - 15);
    ctx.shadowBlur = 0; ctx.fillStyle = '#ffffff';
    ctx.font = '16px Poppins, sans-serif';
    ctx.fillText("Lanjut level berikutnya...", canvas.width/2, canvas.height/2 + 20);
    ctx.restore();

    setTimeout(() => {
        loadLevel();
    }, 2000);
}
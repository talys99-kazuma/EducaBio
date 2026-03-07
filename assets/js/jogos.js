const btn = document.getElementById("menu-mobile-btn");
const menu = document.getElementById("menu-links");
const overlay = document.getElementById("overlay");

/* abrir / fechar menu */
function toggleMenu() {
  btn.classList.toggle("ativo");
  menu.classList.toggle("ativo");
  overlay.classList.toggle("ativo");
  document.body.classList.toggle("menu-aberto");
}

btn.addEventListener("click", toggleMenu);
overlay.addEventListener("click", toggleMenu);

/* fechar ao clicar em um link */
document.querySelectorAll(".menu-links a").forEach(link => {
  link.addEventListener("click", toggleMenu);
});

/* destacar página ativa */
const paginaAtual = location.pathname.split("/").pop();
document.querySelectorAll(".menu-links a").forEach(link => {
  if (link.getAttribute("href") === paginaAtual) {
    link.classList.add("ativo");
  }
});

// ===== SISTEMA DE TABS DOS JOGOS =====
document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const gameTabs = document.querySelectorAll('.game-tab');
    const gameSections = document.querySelectorAll('.game-section');
    
    gameTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const gameId = tab.dataset.game;
            
            gameTabs.forEach(t => t.classList.remove('active'));
            gameSections.forEach(s => s.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`game-${gameId}`).classList.add('active');
        });
    });
    
    // Initialize games
    initMemoriaGame();
    initInterativoGame();
    initQuizGame();
    
    // Render rankings
    renderMemoriaRanking();
    renderInterativoRanking();
    renderQuizRanking();

    // Clear ranking buttons

       // Setup mobile interativo
    setupMobileInterativo();
});


// ===== JOGO DA MEMORIA =====
const memoriaImages = [
    { id: 'arara', name: 'Arara-azul', img: 'img/jogos/arara.jpg' },
    { id: 'onca', name: 'Onça-pintada', img: 'img/jogos/onca.jpg' },
    { id: 'capivara', name: 'Capivara', img: 'img/jogos/capivara.jpg'},
    { id: 'Loboguara', name: 'Lobo-guará', img: 'img/jogos/loboguara.jpg' },
    { id: 'tuiuiu', name: 'Tuiuiu', img: 'img/jogos/Tuiuiu.jpg' },
    { id: 'mico', name: 'Mico-leão-dourado', img: 'img/jogos/mico.jpg' },
    { id: 'Boto', name: 'Boto-Cor-de-Rosa', img: 'img/jogos/BotoCordeRosa.jpg' },
    { id: 'seringueira', name: 'Seringueira', img: 'img/jogos/seringueira.jpg' },
    { id: 'pequi', name: 'Pequi', img: 'img/jogos/pequi.jpg' },
    { id: 'cacto ', name: 'Cacto ', img: 'img/jogos/cacto.jpg' },
    { id: 'ipe ', name: 'Ipê ', img: 'img/jogos/ipê.jpg' },
    { id: 'vitoriaregia', name: 'Vitória-régia', img: 'img/jogos/vitoriaregia.jpg' }

];



let memoriaState = {
    cards: [],
    flipped: [],
    matched: 0,
    attempts: 0,
    canFlip: true,
    timerInterval: null,
    startTime: null,
    playerName: 'Jogador',
    gameStarted: false
};

function initMemoriaGame() {
    document.getElementById('start-memoria').addEventListener('click', startMemoriaGame);
    document.getElementById('reset-memoria').addEventListener('click', resetMemoriaGame);
}

function startMemoriaGame() {
    const nameInput = document.getElementById('memoria-player-name');
    memoriaState.playerName = nameInput.value.trim() || 'Jogador';
    
    document.getElementById('memoria-name-input').classList.add('hidden');
    document.getElementById('memoria-game-area').classList.remove('hidden');
    
    setupMemoriaGame();
}

function resetMemoriaGame() {
    clearInterval(memoriaState.timerInterval);
    setupMemoriaGame();
}

function setupMemoriaGame() {
    memoriaState = {
        ...memoriaState,
        cards: [],
        flipped: [],
        matched: 0,
        attempts: 0,
        canFlip: true,
        timerInterval: null,
        startTime: null,
        gameStarted: false
    };
    
    const pairs = [...memoriaImages, ...memoriaImages];
    memoriaState.cards = shuffleArray(pairs);
    
    renderMemoriaGrid();
    updateMemoriaStats();
    document.getElementById('memoria-tempo').textContent = '00:00';
}

function renderMemoriaGrid() {
    const grid = document.getElementById('memoria-grid');
    grid.innerHTML = '';
    
    memoriaState.cards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'memoria-card';
        cardEl.dataset.index = index;
        cardEl.innerHTML = `
            <div class="memoria-card-inner">
                <div class="memoria-card-front">
                    <span class="card-question">?</span>
                </div>
                <div class="memoria-card-back">
                    <img src="${card.img}" alt="${card.name}">
                    <span class="card-name">${card.name}</span>
                </div>
            </div>
        `;
        cardEl.addEventListener('click', () => flipMemoriaCard(index));
        grid.appendChild(cardEl);
    });
}



function adjustColor(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

function flipMemoriaCard(index) {
    if (!memoriaState.canFlip) return;
    
    if (!memoriaState.gameStarted) {
        memoriaState.gameStarted = true;
        memoriaState.startTime = Date.now();
        memoriaState.timerInterval = setInterval(updateMemoriaTimer, 100);
    }
    
    const card = memoriaState.cards[index];
    const cardEl = document.querySelectorAll('.memoria-card')[index];
    
    if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;
    if (memoriaState.flipped.length >= 2) return;
    
    cardEl.classList.add('flipped');
    memoriaState.flipped.push({ index, card });
    
    if (memoriaState.flipped.length === 2) {
        memoriaState.attempts++;
        memoriaState.canFlip = false;
        setTimeout(() => checkMemoriaMatch(), 800);
    }
    
    updateMemoriaStats();
}

function checkMemoriaMatch() {
    const [first, second] = memoriaState.flipped;
    const cards = document.querySelectorAll('.memoria-card');
    
    if (first.card.id === second.card.id) {
        cards[first.index].classList.add('matched');
        cards[second.index].classList.add('matched');
        memoriaState.matched++;
        
      if (memoriaState.matched === memoriaImages.length) {
    clearInterval(memoriaState.timerInterval);
    const finalTime = Date.now() - memoriaState.startTime;

    setTimeout(() => {
        saveMemoriaScore(memoriaState.playerName, finalTime, memoriaState.attempts);
        renderMemoriaRanking();

        // Atualiza overlay
        document.getElementById('memoria-game-over-player').textContent = memoriaState.playerName;
        document.getElementById('memoria-game-over-time').textContent = formatTime(finalTime);
        document.getElementById('memoria-game-over-attempts').textContent = memoriaState.attempts;
        document.getElementById('memoria-game-over-overlay').classList.remove('hidden');
    }, 500);
  }
} else {
        cards[first.index].classList.remove('flipped');
        cards[second.index].classList.remove('flipped');
}
    
    memoriaState.flipped = [];
    memoriaState.canFlip = true;
    updateMemoriaStats();
}

document.getElementById('memoria-game-over-restart').addEventListener('click', () => {
    document.getElementById('memoria-game-over-overlay').classList.add('hidden');
    resetMemoriaGame();
});



function updateMemoriaTimer() {
    if (memoriaState.startTime) {
        const elapsed = Date.now() - memoriaState.startTime;
        document.getElementById('memoria-tempo').textContent = formatTime(elapsed);
    }
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateMemoriaStats() {
    document.getElementById('memoria-pares').textContent = memoriaState.matched + '/' + memoriaImages.length;
    document.getElementById('memoria-tentativas').textContent = memoriaState.attempts;
}

function saveMemoriaScore(name, time, attempts) {

    salvarRankingGlobal("rankingMemoria", {
        name: name,
        time: time,
        attempts: attempts,
        date: new Date().toISOString()
    });

}

function renderMemoriaRanking() {

    const { collection, query, orderBy, limit, onSnapshot } = window.firebaseFunctions;
    const db = window.db;

    const q = query(
        collection(db, "rankingMemoria"),
        orderBy("time", "asc"), // menor tempo primeiro
        limit(500)
    );

    const tbody = document.getElementById('ranking-memoria-body');
    const emptyMsg = document.getElementById('ranking-memoria-empty');

    onSnapshot(q, (snapshot) => {

        tbody.innerHTML = '';

        if (snapshot.empty) {
            emptyMsg.style.display = 'block';
            return;
        }

        emptyMsg.style.display = 'none';

        let pos = 1;

        snapshot.forEach(doc => {
            const entry = doc.data();

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${pos++}</td>
                <td>${entry.name}</td>
                <td>${formatTime(entry.time)}</td>
                <td>${entry.attempts}</td>
            `;

            tbody.appendChild(tr);
        });

    });
}

// ===== JOGO INTERATIVO =====
// Imagens de fundo reais para cada bioma
const biomaBackgrounds = {
    'Amazonia': 'img/jogos/amazonia.jpg',
    'Cerrado': 'img/jogos/cerrado.jpg',
    'Mata Atlantica': 'img/jogos/mata-atlantica.jpg',
    'Caatinga': 'img/jogos/caatinga.jpg',
    'Pantanal': 'img/jogos/pantanal.jpg',
    'Pampa': 'img/jogos/pampa.jpg'
};

// Imagens dos itens do jogo
const gameImages = {
    personagem: 'img/jogos/personagem.png',
    semente: 'img/jogos/semente.png',
    fruta1: 'img/jogos/fruta1.png',
    fruta: 'img/jogos/fruta.png',
    fruta2: 'img/jogos/fruta2.png',
    agua: 'img/jogos/agua.png',
    animal: 'img/jogos/animal.png',
    animal1: 'img/jogos/animal1.png',
    flor: 'img/jogos/flor.png',
    flor2: 'img/jogos/flor2.png',
    queimada: 'img/jogos/queimada.png',
    fogo: 'img/jogos/fogo.png',
    jaburicaba: 'img/jogos/jabuticaba.png',
    poluicao: 'img/jogos/poluicao.png',
    desmatamento: 'img/jogos/desmatamento.png',
    lixo: 'img/jogos/lixo.png'
};

// Cache de imagens carregadas
const loadedImages = {};
let imagesLoaded = false;

// Pre-carregar todas as imagens
function preloadImages() {
    return new Promise((resolve) => {
        const allImages = [
            ...Object.values(biomaBackgrounds),
            ...Object.values(gameImages)
        ];
        
        let loaded = 0;
        const total = allImages.length;
        
        allImages.forEach(src => {
            const img = new Image();
            
            
            img.onload = () => {
                loadedImages[src] = img;
                loaded++;
                if (loaded >= total) {
                    imagesLoaded = true;
                    resolve();
                }
            };
            img.onerror = () => {
                loaded++;
                if (loaded >= total) {
                    imagesLoaded = true;
                    resolve();
                }
            };
            img.src = src;
        });
        
        // Timeout fallback
        setTimeout(() => {
            imagesLoaded = true;
            resolve();
        }, 5000);
    });
}

const biomasConfig = [
    { 
        id: 'Amazonia', 
        desc: 'Colete sementes e agua. Evite queimadas e desmatamento!',
        items: [
            { type: 'semente', points: 50, img: 'semente' },
            { type: 'agua', points: 40, img: 'agua' },
            { type: 'fruta', points: 60, img: 'fruta' }
        ],
        hazards: [
            { type: 'queimada', damage: 1, img: 'queimada' },
            { type: 'desmatamento', damage: 1, img: 'desmatamento' }
        ]
    },
    { 
        id: 'Cerrado', 
        desc: 'Proteja o cerrado! Colete frutos e evite queimadas.',
        items: [
            { type: 'fruta1', points: 55, img: 'fruta1' },
            { type: 'agua', points: 45, img: 'agua' },
            { type: 'flor2', points: 50, img: 'flor2' }
        ],
        hazards: [
            { type: 'fogo', damage: 1, img: 'fogo' },
            { type: 'poluicao', damage: 1, img: 'poluicao' }
        ]
    },
    { 
        id: 'Mata Atlantica', 
        desc: 'Salve especies endemicas! Colete frutas e evite poluicao.',
        items: [
            { type: 'animal', points: 65, img: 'animal' },
            { type: 'flor', points: 50, img: 'flor' },
            { type: 'fruta2', points: 55, img: 'fruta2' }
        ],
        hazards: [
            { type: 'desmatamento', damage: 1, img: 'desmatamento' },
            { type: 'poluicao', damage: 1, img: 'poluicao' }
        ]
    },
    { 
        id: 'Caatinga', 
        desc: 'Colete agua e sementes. Evite a desertificacao!',
        items: [
            { type: 'agua', points: 70, img: 'agua' },
            { type: 'semente', points: 45, img: 'semente' }
        ],
        hazards: [
            { type: 'fogo', damage: 1, img: 'fogo' },
            { type: 'lixo', damage: 1, img: 'lixo' }
        ]
    },
    { 
        id: 'Pantanal', 
        desc: 'Proteja as aguas! Colete animais e evite poluicao.',
        items: [
            { type: 'animal', points: 55, img: 'animal' },
            { type: 'agua', points: 45, img: 'agua' },
            { type: 'flor', points: 50, img: 'flor' }
        ],
        hazards: [
            { type: 'poluicao', damage: 1, img: 'poluicao' },
            { type: 'fogo', damage: 1, img: 'fogo' }
        ]
    },
    { 
        id: 'Pampa', 
        desc: 'Preserve os campos! Colete sementes nativas.',
        items: [
            { type: 'semente', points: 50, img: 'semente' },
            { type: 'animal1', points: 40, img: 'animal1' }
        ],
        hazards: [
            { type: 'desmatamento', damage: 1, img: 'desmatamento' },
            { type: 'lixo', damage: 1, img: 'lixo' }
        ]
    }
];

let interativoState = {
    running: false,
    paused: false,
    player: { x: 80, y: 200, w: 80, h: 80, speed: 5, frame: 0 },
    entities: [],
    decorations: [],
    score: 0,
    lives: 3,
    currentBioma: 0,
    keys: {},
    spawnTimer: 0,
    animationId: null,
    playerName: 'Jogador',
    frameCount: 0,
    difficulty: 0.3, // Comeca bem devagar
    gameTime: 0, // Tempo de jogo em frames
    bgImage: null,
    isFirstGame: true // Controla se é o primeiro jogo
};

function initInterativoGame() {
    // Pre-carregar imagens
    preloadImages().then(() => {
        drawInitialCanvas();
    });
    
    document.getElementById('interativo-start').addEventListener('click', startInterativo);
    document.getElementById('interativo-pause').addEventListener('click', togglePauseInterativo);
    document.getElementById('interativo-restart').addEventListener('click', restartInterativo);
    document.getElementById('game-over-restart').addEventListener('click', restartFromGameOver);
    document.getElementById('bioma-select').addEventListener('change', (e) => {
        interativoState.currentBioma = parseInt(e.target.value);
        updateInterativoMissao();
        loadBiomaBackground();
        drawInitialCanvas();
    });
    
    // Keyboard controls
    window.addEventListener('keydown', (e) => {
        interativoState.keys[e.key.toLowerCase()] = true;
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
            e.preventDefault();
        }
    });
    window.addEventListener('keyup', (e) => {
        interativoState.keys[e.key.toLowerCase()] = false;
    });
    
    setupMobileControls();
    updateInterativoMissao();
    loadBiomaBackground();
}

function loadBiomaBackground() {
    const bioma = biomasConfig[interativoState.currentBioma];
    const bgSrc = biomaBackgrounds[bioma.id];
    
    if (loadedImages[bgSrc]) {
        interativoState.bgImage = loadedImages[bgSrc];
        drawInitialCanvas();
    } else {
        const img = new Image();
        
        
        img.onload = () => {
            interativoState.bgImage = img;
            loadedImages[bgSrc] = img;
            drawInitialCanvas();
        };
        img.src = bgSrc;
    }
}

function drawInitialCanvas() {
    const canvas = document.getElementById('interativo-canvas');
    const ctx = canvas.getContext('2d');
    const bioma = biomasConfig[interativoState.currentBioma];
    drawBackground(ctx, canvas, bioma);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    
    // Desenhar personagem inicial
    drawPlayer(ctx, { x: 80, y: 200, w: 80, h: 80 });
}

function setupMobileControls() {
    const buttons = {
        'btn-up': 'arrowup',
        'btn-down': 'arrowdown',
        'btn-left': 'arrowleft',
        'btn-right': 'arrowright'
    };
    
    Object.entries(buttons).forEach(([btnId, key]) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            const setKey = (val) => { interativoState.keys[key] = val; };
            btn.addEventListener('touchstart', (e) => { e.preventDefault(); setKey(true); });
            btn.addEventListener('touchend', () => setKey(false));
            btn.addEventListener('mousedown', () => setKey(true));
            btn.addEventListener('mouseup', () => setKey(false));
            btn.addEventListener('mouseleave', () => setKey(false));
        }
    });
}

function startInterativo() {
    const nameInput = document.getElementById('interativo-player-name');

    // So pega o nome na primeira vez
    if (interativoState.isFirstGame) {
        interativoState.playerName = nameInput.value.trim() || 'Jogador';
        interativoState.isFirstGame = false;
    }
    
    document.getElementById('interativo-overlay').classList.add('hidden');
    document.getElementById('game-over-overlay').classList.add('hidden');

    interativoState.running = true;
    interativoState.paused = false;
    interativoState.score = 0;
    interativoState.lives = 3;
    interativoState.entities = [];
    interativoState.player = { x: 80, y: 200, w: 80, h: 80, speed: 5, frame: 0 };
    interativoState.frameCount = 0;
    interativoState.difficulty = 1; // Comeca BEM devagar
    interativoState.gameTime = 0;
    interativoState.spawnTimer = 0;
    
    loadBiomaBackground();
    updateInterativoUI();
    document.getElementById('interativo-pause').textContent = 'Pausar';
    gameLoopInterativo();
}

function togglePauseInterativo() {
    interativoState.paused = !interativoState.paused;
    document.getElementById('interativo-pause').textContent = interativoState.paused ? 'Retomar' : 'Pausar';
    if (!interativoState.paused && interativoState.running) {
        gameLoopInterativo();
    }
}

function restartInterativo() {
    interativoState.running = false;
    if (interativoState.animationId) {
        cancelAnimationFrame(interativoState.animationId);
    }
   
    // Esconde game over e mostra overlay inicial
    document.getElementById('game-over-overlay').classList.add('hidden');
    document.getElementById('interativo-overlay').classList.remove('hidden');
    
    // Esconde o campo de nome se nao for o primeiro jogo
    if (!interativoState.isFirstGame) {
        document.getElementById('interativo-name-section').classList.add('hidden');
    }
    
    document.getElementById('interativo-pause').textContent = 'Pausar';
    loadBiomaBackground();
    drawInitialCanvas();
}

function restartFromGameOver() {
    document.getElementById('game-over-overlay').classList.add('hidden');
    
    // Reinicia o jogo diretamente sem pedir nome
    interativoState.running = true;
    interativoState.paused = false;
    interativoState.score = 0;
    interativoState.lives = 3;
    interativoState.entities = [];
    interativoState.player = { x: 80, y: 200, w: 80, h: 80, speed: 5, frame: 0 };
    interativoState.frameCount = 0;
    interativoState.difficulty = 0.3;
    interativoState.gameTime = 0;
    interativoState.spawnTimer = 0;
    
    loadBiomaBackground();
    updateInterativoUI();
    document.getElementById('interativo-pause').textContent = 'Pausar';
    gameLoopInterativo();
}

function drawBackground(ctx, canvas, bioma) {
    // Desenhar imagem de fundo do bioma
    if (interativoState.bgImage) {
        ctx.drawImage(interativoState.bgImage, 0, 0, canvas.width, canvas.height);
        
        // Overlay semi-transparente para melhor visibilidade
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        // Fallback: gradiente colorido
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87ceeb');
        gradient.addColorStop(0.5, '#2e7d32');
        gradient.addColorStop(1, '#1b4332');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Faixa preta transparente no topo
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, 50);

    
    // Chao com transparencia
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    
    // Bioma label com fundo
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(10, 10, ctx.measureText(bioma.id).width + 30, 35);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'Arial Rounded MT Bold, Arial';
    ctx.textAlign = 'left';
    ctx.fillText(bioma.id, 20, 33);
}

function drawPlayer(ctx, player) {
    const p = player;
    interativoState.frameCount++;
    
    // Bounce animation
    const bounce = Math.sin(interativoState.frameCount * 0.08) * 1.5;
    
    // Sombra
     ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(p.x + p.w/2, p.y + p.h + 3, p.w/2.5, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Tentar usar imagem do personagem
    const playerImgSrc = gameImages.personagem;
    if (loadedImages[playerImgSrc]) {
        ctx.drawImage(loadedImages[playerImgSrc], p.x, p.y + bounce, p.w, p.h);
    } else { 
         // Fallback: desenhar personagem manualmente
        // Corpo (uniforme verde de explorador)
        ctx.fillStyle = '#2e7d32';
        ctx.beginPath();
        ctx.roundRect(p.x + 8, p.y + 20 + bounce, 34, 28, 4);
        ctx.fill();
       
        // Cabeca
        ctx.fillStyle = '#ffcc80';
        ctx.beginPath();
        ctx.arc(p.x + p.w/2, p.y + 14 + bounce, 14, 0, Math.PI * 2);
        ctx.fill();
       
        // Chapeu de explorador
        ctx.fillStyle = '#8d6e63';
        ctx.beginPath();
        ctx.ellipse(p.x + p.w/2, p.y + 6 + bounce, 18, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#6d4c41';
        ctx.beginPath();
        ctx.roundRect(p.x + 12, p.y - 3 + bounce, 26, 10, 2);
        ctx.fill();
       
        // Olhos
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(p.x + 20, p.y + 12 + bounce, 2, 0, Math.PI * 2);
        ctx.arc(p.x + 30, p.y + 12 + bounce, 2, 0, Math.PI * 2);
        ctx.fill();
       
        // Sorriso
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x + p.w/2, p.y + 17 + bounce, 5, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
       
        // Bracos
        ctx.fillStyle = '#ffcc80';
        ctx.beginPath();
        ctx.roundRect(p.x + 2, p.y + 22 + bounce, 8, 16, 2);
        ctx.roundRect(p.x + 40, p.y + 22 + bounce, 8, 16, 2);
        ctx.fill();
       
        // Pernas
        ctx.fillStyle = '#5d4037';
        ctx.beginPath();
        ctx.roundRect(p.x + 12, p.y + 44 + bounce, 10, 12, 2);
        ctx.roundRect(p.x + 28, p.y + 44 + bounce, 10, 12, 2);
        ctx.fill();
    }
}


function drawEntity(ctx, entity) {
    const e = entity;
    const float = Math.sin(mobileGame.frameCount * 0.05 + e.x * 0.01) * 1;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(e.x + e.w/2, e.y + e.h + 5, e.w/3, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Tentar usar imagem do item
    const imgSrc = gameImages[e.img];
    if (loadedImages[imgSrc]) {
        // Glow para itens beneficos
        if (e.isItem) {
            ctx.shadowColor = '#4caf50';
            ctx.shadowBlur = 10;
        } else {
            ctx.shadowColor = '#f44336';
            ctx.shadowBlur = 10;
        }
        
        const scale = 1.5; // aumenta 50%
        ctx.drawImage(loadedImages[imgSrc], e.x, e.y + float, e.w * scale, e.h * scale);
        ctx.shadowBlur = 0;
    } else {
        // Fallback: desenhar com emojis
        const emojis = {
            semente: '🌱',
            agua: '💧',
            fruta: '🍇',
            jabuticaba: '🫐',
            animal: '🐒',
            flor: '🌺',
            fogo: '🔥',
            poluicao: '🏭',
            desmatamento: '🪓',
            lixo: '🗑️'
            
        };
        ctx.shadowBlur = 0; // remove qualquer sombra ctx.shadowColor = 'transparent'; // garante que não haja sombra visível ctx.fillStyle = '#000000'; // ou qualquer cor sólida desejada
        ctx.shadowBlur = 0; // remove qualquer sombra 
        ctx.fillStyle = '#000000'; // ou qualquer cor sólida desejada
        ctx.font = `${e.w - 5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emojis[e.type] || '?', e.x + e.w/2, e.y + e.h/2 + float);
    }
}

function gameLoopInterativo() {
    if (!interativoState.running || interativoState.paused) return;
    
    const canvas = document.getElementById('interativo-canvas');
    const ctx = canvas.getContext('2d');
    const bioma = biomasConfig[interativoState.currentBioma];

    // Incrementar tempo de jogo
    interativoState.gameTime++;
    
    // Limpar e desenhar fundo
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx, canvas, bioma);
    
    // Atualizar posicao do jogador
    const p = interativoState.player;
    if (interativoState.keys['arrowup'] || interativoState.keys['w']) p.y -= p.speed;
    if (interativoState.keys['arrowdown'] || interativoState.keys['s']) p.y += p.speed;
    if (interativoState.keys['arrowleft'] || interativoState.keys['a']) p.x -= p.speed;
    if (interativoState.keys['arrowright'] || interativoState.keys['d']) p.x += p.speed;
    
    p.x = Math.max(0, Math.min(canvas.width - p.w, p.x));
    p.y = Math.max(50, Math.min(canvas.height - p.h - 60, p.y));
    
    // Desenhar jogador
    drawPlayer(ctx, p);
    
    // ===============================================
    // SISTEMA DE DIFICULDADE PROGRESSIVA
    // ===============================================
    // Fase 1: Primeiros 5 segundos (300 frames) - Aquecimento
    // Fase 2: 5-20 segundos - Vai ficando mais rapido
    // Fase 3: 20+ segundos - Dificuldade desafiadora
    
    if (interativoState.gameTime < 200) {
        // Fase inicial: aquecimento rapido
        interativoState.difficulty = 0.7 + (interativoState.gameTime / 200) * 0.5;
    } else if (interativoState.gameTime < 600) {
        // Fase intermediaria: aumenta bem
        interativoState.difficulty = 0.9 + ((interativoState.gameTime - 200) / 450) * 0.8;
    } else {
        // Fase final: dificuldade alta mas jogavel
        interativoState.difficulty = Math.min(2.2, 1.7 + ((interativoState.gameTime - 600) / 1000) * 0.7);
    }
    
    // Spawn de entidades baseado na dificuldade
    interativoState.spawnTimer++;
    
    // Taxa de spawn: comeca em 90 frames, vai ate 30 frames minimo (mais itens)
    const spawnRate = Math.max(40, 100 - (interativoState.difficulty * 35) + Math.random() * 10);

   if (interativoState.spawnTimer > spawnRate) {
    const quantidade = Math.floor(1 + interativoState.difficulty * 0.5); 
    for (let i = 0; i < quantidade; i++) {
        spawnEntity(canvas, bioma);
    }
    interativoState.spawnTimer = 0;
}

    
    // Atualizar e desenhar entidades
    interativoState.entities = interativoState.entities.filter(e => {
        e.x += e.vx;
        drawEntity(ctx, e);
        
        // Verificar colisao
        if (checkCollision(p, e)) {
            if (e.isItem) {
                interativoState.score += e.points;
                showEffect(ctx, e.x, e.y, `+${e.points}`, '#4caf50');
            } else {
                interativoState.lives--;
                showEffect(ctx, e.x, e.y, '-1', '#f44336');
                if (interativoState.lives <= 0) {
                    endInterativo();
                }
            }
            updateInterativoUI();
            return false;
        }
        
        return e.x > -50;
    });
    
    interativoState.animationId = requestAnimationFrame(gameLoopInterativo);
}

function spawnEntity(canvas, bioma) {
    // Chance de spawn de perigo aumenta com dificuldade
    const hazardChance = 0.35 + (interativoState.difficulty * 0.08);
    const isItem = Math.random() > Math.min(hazardChance, 0.5);
    const templates = isItem ? bioma.items : bioma.hazards;
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // cidade aumenta com dificuldade
    const baseSpeed = 1.2 + (interativoState.difficulty * 1.0);
    const speedVariation = Math.random() * 0.5;
    
    interativoState.entities.push({
        x: canvas.width + 20,
        y: 60 + Math.random() * (canvas.height - 150),
        w: 40,
        h: 40,
        vx: -(baseSpeed + speedVariation),
        isItem: isItem,
        type: template.type,
        points: template.points || 0,
        damage: template.damage || 0,
        img: template.img
    });
}

function checkCollision(a, b) {
    const padding = 8;
    return a.x + padding < b.x + b.w - padding && 
           a.x + a.w - padding > b.x + padding && 
           a.y + padding < b.y + b.h - padding && 
           a.y + a.h - padding > b.y + padding;
}

function showEffect(ctx, x, y, text, color) {
    ctx.fillStyle = color;
    ctx.font = 'Arial Rounded MT Bold, Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 4;
    ctx.fillText(text, x + 20, y - 10);
    ctx.shadowBlur = 0;
}

function updateInterativoUI() {
    document.getElementById('interativo-score').textContent = interativoState.score;
    document.getElementById('interativo-lives').textContent = interativoState.lives;
}

function updateInterativoMissao() {
    const bioma = biomasConfig[interativoState.currentBioma];
    document.getElementById('interativo-missao').textContent = bioma.desc;
}

function endInterativo() {
    interativoState.running = false;
    const bioma = biomasConfig[interativoState.currentBioma];
    
    saveInterativoScore(interativoState.playerName, interativoState.score, bioma.id);
    
    // Mostra o overlay de game over em vez de pedir o nome
    document.getElementById('game-over-player').textContent = interativoState.playerName;
    document.getElementById('game-over-score-value').textContent = interativoState.score;
    document.getElementById('game-over-bioma').textContent = `Bioma: ${bioma.id}`;
    document.getElementById('game-over-overlay').classList.remove('hidden');
    
    renderInterativoRanking();
}

function saveInterativoScore(name, score, bioma) {

    salvarRankingGlobal("rankingInterativo", {
        name: name,
        score: score,
        bioma: bioma,
        date: new Date().toISOString()
    });

}
function renderInterativoRanking() {

    const { collection, query, orderBy, limit, onSnapshot } = window.firebaseFunctions;
    const db = window.db;

    const q = query(
        collection(db, "rankingInterativo"),
        orderBy("score", "desc"),
        limit(500)
    );

    const tbody = document.getElementById('ranking-interativo-body');
    const emptyMsg = document.getElementById('ranking-interativo-empty');

    onSnapshot(q, (snapshot) => {

        tbody.innerHTML = '';

        if (snapshot.empty) {
            emptyMsg.style.display = 'block';
            return;
        }

        emptyMsg.style.display = 'none';

        let pos = 1;

        snapshot.forEach(doc => {
            const entry = doc.data();

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${pos++}</td>
                <td>${entry.name}</td>
                <td>${entry.score}</td>
                <td>${entry.bioma || '-'}</td>
            `;

            tbody.appendChild(tr);
        });

    });
}


// =====================================================
// MOBILE FULLSCREEN INTERATIVO GAME
// Landscape mode with virtual joystick and HUD
// =====================================================
let mobileGame = {
    running: false, paused: false,
    player: { x: 80, y: 150, w: 60, h: 70, speed: 3 },
    entities: [], score: 0, lives: 3, currentBioma: 0,
    spawnTimer: 0, animationId: null,
    playerName: 'Jogador', frameCount: 0,
    difficulty: 0.3, gameTime: 0, bgImage: null,
    joystickX: 0, joystickY: 0
};

function isMobileOrTablet() {
    return window.innerWidth <= 900 || ('ontouchstart' in window);
}

function setupMobileInterativo() {
    if (!isMobileOrTablet()) return;

    // Build bioma options
    let biomaOptions = '';
    biomasConfig.forEach((b, i) => {
        biomaOptions += '<option value="' + i + '">' + b.id + '</option>';
    });

    // Inject embedded start screen (replaces old "Jogar em Tela Cheia" button)
    const interativoCard = document.querySelector('.interativo-card');
    if (interativoCard) {
        const embeddedStart = document.createElement('div');
        embeddedStart.className = 'tablet-start-embedded';
        embeddedStart.innerHTML =
            '<img class="ts-icon" src="https://cdn-icons-png.flaticon.com/512/3048/3048122.png" alt="Explorador">' +
            '<h3>Biomas & Impactos</h3>' +
            '<p class="ts-subtitle">Jogo Interativo</p>' +
            '<p class="ts-hint">Colete itens benéficos e evite perigos ambientais!</p>' +
            '<div class="ts-form">' +
                '<div class="ts-field">' +
                    '<label>Escolher Bioma:</label>' +
                    '<select id="tablet-bioma-select">' + biomaOptions + '</select>' +
                '</div>' +
                '<div class="ts-missao-box" id="tablet-missao-box">' +
                    '<strong>Missão:</strong>' +
                    '<span id="tablet-missao-text">' + biomasConfig[0].desc + '</span>' +
                '</div>' +
                '<div class="ts-field">' +
                    '<input type="text" class="ts-name-input" id="tablet-name-input" placeholder="Digite seu nome" maxlength="20">' +
                '</div>' +
                '<button class="ts-start-btn" id="tablet-start-btn">Iniciar Aventura</button>' +
            '</div>';

        const headerBox = interativoCard.querySelector('.game-header-box');
        if (headerBox) headerBox.after(embeddedStart);

        // Bioma select change -> update missao
        const tabletBiomaSelect = document.getElementById('tablet-bioma-select');
        if (tabletBiomaSelect) {
            tabletBiomaSelect.addEventListener('change', function() {
                const idx = parseInt(this.value);
                const missaoText = document.getElementById('tablet-missao-text');
                if (missaoText) missaoText.textContent = biomasConfig[idx].desc;
            });
        }

        // Start button -> open fullscreen game with chosen bioma/name
        var tabletStartBtn = document.getElementById('tablet-start-btn');
        if (tabletStartBtn) {
            tabletStartBtn.addEventListener('click', function() {
                var nameInput = document.getElementById('tablet-name-input');
                var biomaSelect = document.getElementById('tablet-bioma-select');
                mobileGame.playerName = (nameInput && nameInput.value.trim()) || 'Jogador';
                mobileGame.currentBioma = biomaSelect ? parseInt(biomaSelect.value) : 0;
                launchGameFullscreen(true);
            });
        }
    }

    // Mobile start screen button
    const mobileStartBtn = document.getElementById('mobile-start-btn');
    if (mobileStartBtn) {
        mobileStartBtn.addEventListener('click', () => {
            const nameInput = document.getElementById('mobile-start-name-input');
            mobileGame.playerName = nameInput.value.trim() || 'Jogador';
            const biomaSelect = document.getElementById('mobile-start-bioma-select');
            mobileGame.currentBioma = parseInt(biomaSelect.value);
            document.getElementById('mobile-start-screen').classList.add('hidden');
            startMobileGame();
        });
    }

    // Config button
    const configBtn = document.getElementById('mobile-config-btn');
    if (configBtn) configBtn.addEventListener('click', () => {
        mobileGame.paused = true;
        document.getElementById('mobile-config-panel').classList.remove('hidden');
        const sel = document.getElementById('mobile-bioma-select');
        if (sel) sel.value = mobileGame.currentBioma;
        updateMobileMissao();
    });

    // Config close
    const configClose = document.getElementById('mobile-config-close');
    if (configClose) configClose.addEventListener('click', () => {
        document.getElementById('mobile-config-panel').classList.add('hidden');
        mobileGame.paused = false;
        if (mobileGame.running) mobileGameLoop();
    });

    // Config bioma change
    const mobileBiomaSelect = document.getElementById('mobile-bioma-select');
    if (mobileBiomaSelect) mobileBiomaSelect.addEventListener('change', (e) => {
        mobileGame.currentBioma = parseInt(e.target.value);
        loadMobileBgImage();
        updateMobileMissao();
    });

    // Pause
    const pauseBtn = document.getElementById('mobile-pause-btn');
    if (pauseBtn) pauseBtn.addEventListener('click', () => {
        document.getElementById('mobile-config-panel').classList.add('hidden');
        mobileGame.paused = !mobileGame.paused;
        if (!mobileGame.paused && mobileGame.running) mobileGameLoop();
    });

    // Restart from config
    const restartBtn = document.getElementById('mobile-restart-btn');
    if (restartBtn) restartBtn.addEventListener('click', () => {
        document.getElementById('mobile-config-panel').classList.add('hidden');
        startMobileGame();
    });

    // Exit
    const exitBtn = document.getElementById('mobile-exit-btn');
    if (exitBtn) exitBtn.addEventListener('click', closeMobileFullscreenGame);

    // Game over restart
    const goRestart = document.getElementById('mobile-go-restart');
    if (goRestart) goRestart.addEventListener('click', () => {
        document.getElementById('mobile-game-over').classList.add('hidden');
        startMobileGame();
    });

    // Game over exit
    const goExit = document.getElementById('mobile-go-exit');
    if (goExit) goExit.addEventListener('click', () => {
        document.getElementById('mobile-game-over').classList.add('hidden');
        closeMobileFullscreenGame();
    });

    // Setup joystick
    setupJoystick();
}

// Launch game in fullscreen + landscape lock (works even with rotation lock OFF)
function launchGameFullscreen(skipStartScreen) {
    var container = document.getElementById('mobile-fullscreen-game');
    container.classList.remove('hidden');

    // Hide/show screens
    if (skipStartScreen) {
        document.getElementById('mobile-start-screen').classList.add('hidden');
    } else {
        document.getElementById('mobile-start-screen').classList.remove('hidden');
    }
    document.getElementById('mobile-game-over').classList.add('hidden');
    document.getElementById('mobile-config-panel').classList.add('hidden');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Request fullscreen FIRST, then lock orientation inside the callback
    var fsPromise = null;
    try {
        if (container.requestFullscreen) {
            fsPromise = container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
    } catch(e) {}

    function afterFullscreen() {
        // Try to lock orientation to landscape (only works in fullscreen)
        try {
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('landscape').catch(function(){});
            }
        } catch(e) {}
        // Resize and start after a short delay for layout
        setTimeout(function() {
            resizeMobileCanvas();
            window.addEventListener('resize', resizeMobileCanvas);
            if (skipStartScreen) startMobileGame();
        }, 200);
    }

    if (fsPromise && typeof fsPromise.then === 'function') {
        fsPromise.then(afterFullscreen).catch(function() {
            // Fullscreen failed - still show the game as fixed overlay
            afterFullscreen();
        });
    } else {
        afterFullscreen();
    }
}

function openMobileFullscreenGame() {
    launchGameFullscreen(false);
}

function closeMobileFullscreenGame() {
    mobileGame.running = false;
    if (mobileGame.animationId) cancelAnimationFrame(mobileGame.animationId);
    
    var container = document.getElementById('mobile-fullscreen-game');
    container.classList.add('hidden');
    
    // Exit fullscreen
    try {
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            if (document.exitFullscreen) document.exitFullscreen().catch(function(){});
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        }
    } catch(e) {}

    // Unlock orientation
    try {
        if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock();
    } catch(e) {}
    
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    window.removeEventListener('resize', resizeMobileCanvas);
}

function resizeMobileCanvas() {
    var canvas = document.getElementById('mobile-canvas');
    if (!canvas) return;
    // In fullscreen, use screen dimensions; otherwise use viewport
    var w = window.innerWidth || screen.width;
    var h = window.innerHeight || screen.height;
    canvas.width = w;
    canvas.height = Math.max(h - 44, 200);
}

function startMobileGame() {
    const canvas = document.getElementById('mobile-canvas');
    resizeMobileCanvas();
    
    mobileGame.running = true;
    mobileGame.paused = false;
    mobileGame.score = 0;
    mobileGame.lives = 3;
    mobileGame.entities = [];
    mobileGame.frameCount = 0;
    mobileGame.difficulty = 0.3;
    mobileGame.gameTime = 0;
    mobileGame.spawnTimer = 0;
    mobileGame.player = { x: 60, y: canvas.height / 2 - 35, w: 80, h: 80, speed: 3 };
    
    loadMobileBgImage();
    updateMobileHUD();
    
    document.getElementById('mobile-bioma-name').textContent = biomasConfig[mobileGame.currentBioma].id;
    
    mobileGameLoop();
}

function loadMobileBgImage() {
    const bioma = biomasConfig[mobileGame.currentBioma];
    const bgSrc = biomaBackgrounds[bioma.id];
    if (loadedImages[bgSrc]) mobileGame.bgImage = loadedImages[bgSrc];
    else {
        const img = new Image();
        
        img.onload = () => { mobileGame.bgImage = img; loadedImages[bgSrc] = img; };
        img.src = bgSrc;
    }
}

function updateMobileHUD() {
    const scoreEl = document.getElementById('mobile-score');
    const livesEl = document.getElementById('mobile-lives');
    if (scoreEl) scoreEl.textContent = mobileGame.score;
    if (livesEl) livesEl.textContent = mobileGame.lives;
}

function updateMobileMissao() {
    const bioma = biomasConfig[mobileGame.currentBioma];
    const el = document.getElementById('mobile-missao');
    if (el) el.textContent = bioma.desc;
}

function mobileGameLoop() {
    if (!mobileGame.running || mobileGame.paused) return;
    
    const canvas = document.getElementById('mobile-canvas');
    const ctx = canvas.getContext('2d');
    const bioma = biomasConfig[mobileGame.currentBioma];
    
    mobileGame.gameTime++;
    mobileGame.frameCount++;
    
    // Clear and draw background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (mobileGame.bgImage) {
        ctx.drawImage(mobileGame.bgImage, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87ceeb');
        gradient.addColorStop(0.5, '#2e7d32');
        gradient.addColorStop(1, '#1b4332');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    

    
    // Ground bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    
    // Player movement from joystick
    const p = mobileGame.player;

const moveX = mobileGame.joystickX * p.speed;
const moveY = mobileGame.joystickY * p.speed;

p.x += moveX;
p.y += moveY;

p.x = Math.max(0, Math.min(canvas.width - p.w, p.x));
p.y = Math.max(10, Math.min(canvas.height - p.h - 40, p.y));

    // Draw player
    const bounce = Math.sin(mobileGame.frameCount * 0.08) * 1.5;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(p.x + p.w/2, p.y + p.h + 3, p.w/2.5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    const playerImgSrc = gameImages.personagem;
    if (loadedImages[playerImgSrc]) {
        ctx.drawImage(loadedImages[playerImgSrc], p.x, p.y + bounce, p.w, p.h);
    } else { 
         // Fallback: desenhar personagem manualmente
        // Corpo (uniforme verde de explorador)
        ctx.fillStyle = '#2e7d32';
        ctx.beginPath();
        ctx.roundRect(p.x + 8, p.y + 20 + bounce, 34, 28, 4);
        ctx.fill();
       
        // Cabeca
        ctx.fillStyle = '#ffcc80';
        ctx.beginPath();
        ctx.arc(p.x + p.w/2, p.y + 14 + bounce, 12, 0, Math.PI * 2);
        ctx.fill();
       
        // Chapeu de explorador
        ctx.fillStyle = '#8d6e63';
        ctx.beginPath();
        ctx.ellipse(p.x + p.w/2, p.y + 6 + bounce, 18, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#6d4c41';
        ctx.beginPath();
        ctx.roundRect(p.x + 12, p.y - 3 + bounce, 26, 10, 2);
        ctx.fill();
       
        // Olhos
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(p.x + 20, p.y + 12 + bounce, 2, 0, Math.PI * 2);
        ctx.arc(p.x + 30, p.y + 12 + bounce, 2, 0, Math.PI * 2);
        ctx.fill();
       
        // Sorriso
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x + p.w/2, p.y + 17 + bounce, 5, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
       
        // Bracos
        ctx.fillStyle = '#ffcc80';
        ctx.beginPath();
        ctx.roundRect(p.x + 2, p.y + 22 + bounce, 8, 16, 2);
        ctx.roundRect(p.x + 40, p.y + 22 + bounce, 8, 16, 2);
        ctx.fill();
       
        // Pernas
        ctx.fillStyle = '#5d4037';
        ctx.beginPath();
        ctx.roundRect(p.x + 12, p.y + 44 + bounce, 10, 12, 2);
        ctx.roundRect(p.x + 28, p.y + 44 + bounce, 10, 12, 2);
        ctx.fill();
    }
    
    // Difficulty - progressão mais rápida (igual PC)
if (mobileGame.gameTime < 200) mobileGame.difficulty = 0.4 + (mobileGame.gameTime / 300) * 0.4;
    else if (mobileGame.gameTime < 800) mobileGame.difficulty = 0.8 + ((mobileGame.gameTime - 300) / 500) * 0.5;
    else mobileGame.difficulty = Math.min(2.0, 1.3 + ((mobileGame.gameTime - 800) / 1200) * 0.3);
    
    // Spawn entities - slower spawn rate
    mobileGame.spawnTimer++;
    var spawnRate = Math.max(40, 100 - (mobileGame.difficulty * 35) + Math.random() * 10);
    if (mobileGame.spawnTimer > spawnRate) {
        var quantidade = Math.floor(1 + mobileGame.difficulty * 0.5);
        for (let i = 0; i < quantidade; i++) {
            var hazardChance = 0.3 + (mobileGame.difficulty * 0.06);
            var isItem = Math.random() > Math.min(hazardChance, 0.45);
            var templates = isItem ? bioma.items : bioma.hazards;
            var template = templates[Math.floor(Math.random() * templates.length)];
            var baseSpeed = 1.0 + (mobileGame.difficulty * 0.9);
            mobileGame.entities.push({
                x: canvas.width + 20, y: 20 + Math.random() * (canvas.height - 100),
                w: 35, h: 35, vx: -(baseSpeed + Math.random() * 0.4),
                isItem: isItem, type: template.type, points: template.points || 0,
                damage: template.damage || 0, img: template.img
            });
        }
        mobileGame.spawnTimer = 0;
    } 

    
    // Update entities
    mobileGame.entities = mobileGame.entities.filter(e => {
        e.x += e.vx;
        const float = Math.sin(mobileGame.frameCount * 0.05 + e.x * 0.01) * 1;
        ctx.imageSmoothingEnabled = true;
        const imgSrc = gameImages[e.img];
        if (loadedImages[imgSrc]) {
            if (e.isItem) { ctx.shadowColor = '#4caf50'; ctx.shadowBlur = 8; }
            else { ctx.shadowColor = '#f44336'; ctx.shadowBlur = 8; }
            ctx.drawImage(loadedImages[imgSrc], e.x, e.y + float, e.w * 1.4, e.h * 1.4);
            ctx.shadowBlur = 0;
        } else {
        // Fallback: desenhar com emojis
        const emojis = {
            semente: '🌱',
            agua: '💧',
            fruta: '🍇',
            jabuticaba: '🫐',
            animal: '🐒',
            flor: '🌺',
            fogo: '🔥',
            poluicao: '🏭',
            desmatamento: '🪓',
            lixo: '🗑️'
            
        }

            ctx.fillStyle = e.isItem ? '#4caf50' : '#f44336';
            ctx.font = 'bold ' + (e.w - 5) + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(emojis[e.type] || '?' , e.x + e.w/2, e.y + e.h/2 + float);
        }
        
        // Collision
        const pad = 6;
        if (p.x + pad < e.x + e.w - pad && p.x + p.w - pad > e.x + pad && p.y + pad < e.y + e.h - pad && p.y + p.h - pad > e.y + pad) {
            if (e.isItem) {
                mobileGame.score += e.points;
                ctx.fillStyle = '#4caf50';
                ctx.font = 'Arial Rounded MT Bold, Arial';
                ctx.textAlign = 'center';
                ctx.fillText('+' + e.points, e.x + 20, e.y - 10);
            } else {
                mobileGame.lives--;
                ctx.fillStyle = '#f44336';
                ctx.font = 'Arial Rounded MT Bold, Arial';
                ctx.textAlign = 'center';
                ctx.fillText('-1', e.x + 20, e.y - 10);
                if (mobileGame.lives <= 0) {
                    endMobileGame();
                }
            }
            updateMobileHUD();
            return false;
        }
        return e.x > -50;
    });
    
    mobileGame.animationId = requestAnimationFrame(mobileGameLoop);
}

function endMobileGame() {
    mobileGame.running = false;
    const bioma = biomasConfig[mobileGame.currentBioma];
    saveInterativoScore(mobileGame.playerName, mobileGame.score, bioma.id);
    renderInterativoRanking();
    
    document.getElementById('mobile-go-player').textContent = mobileGame.playerName;
    document.getElementById('mobile-go-score-value').textContent = mobileGame.score;
    document.getElementById('mobile-go-bioma').textContent = 'Bioma: ' + bioma.id;
    document.getElementById('mobile-game-over').classList.remove('hidden');
}

// ===== JOYSTICK VIRTUAL =====
function setupJoystick() {
    const zone = document.getElementById('joystick-zone');
    const base = document.getElementById('joystick-base');
    const thumb = document.getElementById('joystick-thumb');
    if (!zone || !base || !thumb) return;
    
    let touching = false;
    var baseRadius = 70;
    var thumbRadius = 22;
    var maxDist = baseRadius - thumbRadius;
    
    function getCenter() {
        const rect = base.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
    
    function handleMove(clientX, clientY) {
        var center = getCenter();
        var dx = clientX - center.x;
        var dy = clientY - center.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > maxDist) { dx = dx / dist * maxDist; dy = dy / dist * maxDist; }
        thumb.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
        mobileGame.joystickX = Math.max(-1, Math.min(1, dx / maxDist));
        mobileGame.joystickY = Math.max(-1, Math.min(1, dy / maxDist));
    }
    
    function resetJoystick() {
        touching = false;
        thumb.style.transform = 'translate(0px, 0px)';
        mobileGame.joystickX = 0;
        mobileGame.joystickY = 0;
    }
    
    zone.addEventListener('touchstart', (e) => { e.preventDefault(); touching = true; const t = e.touches[0]; handleMove(t.clientX, t.clientY); }, { passive: false });
    zone.addEventListener('touchmove', (e) => { e.preventDefault(); if (!touching) return; const t = e.touches[0]; handleMove(t.clientX, t.clientY); }, { passive: false });
    zone.addEventListener('touchend', (e) => { e.preventDefault(); resetJoystick(); }, { passive: false });
    zone.addEventListener('touchcancel', (e) => { resetJoystick(); });
}

// ===== QUIZ AMBIENTAL =====
const quizQuestions = {
    nivel1: [ // Questões Introdutórias Simples
        {
            question: "O que é meio ambiente?",
            options: [
                "Apenas as florestas e rios",
                "Tudo o que nos cerca: natureza, ar, água, solo e seres vivos",
                "Somente os animais selvagens",
                "Apenas as plantas"
            ],
            correct: 1,
            explanation: "O meio ambiente é tudo que nos rodeia: ar, água, solo, plantas, animais e até nós mesmos!"
        },
        {
            question: "Qual destes é um recurso natural renovável?",
            options: [
                "Petróleo",
                "Carvão mineral",
                "Água",
                "Gás natural"
            ],
            correct: 2,
            explanation: "A água é um recurso renovável através do ciclo hidrológico. Petróleo, carvão e gás são recursos não renováveis."
        },
        {
            question: "O que significa 'sustentabilidade'?",
            options: [
                "Usar tudo o que temos sem pensar no futuro",
                "Preservar recursos para as próximas gerações",
                "Plantar árvores apenas",
                "Reciclar apenas plástico"
            ],
            correct: 1,
            explanation: "Sustentabilidade é usar os recursos naturais de forma responsável, pensando nas gerações futuras!"
        },
        {
            question: "Qual é a importância das árvores?",
            options: [
                "Apenas para dar sombra",
                "Produzem oxigênio, absorvem CO2 e protegem o solo",
                "Apenas para madeira",
                "Não têm importância"
            ],
            correct: 1,
            explanation: "As árvores são essenciais: produzem oxigênio, absorvem CO2, protegem o solo e abrigam animais!"
        },
        {
            question: "O que é reciclagem?",
            options: [
                "Jogar lixo em qualquer lugar",
                "Queimar todo o lixo",
                "Transformar materiais usados em novos produtos",
                "Enterrar todo o lixo"
            ],
            correct: 2,
            explanation: "Reciclagem é transformar materiais que seriam descartados em novos produtos, economizando recursos!"
        }
    ],
    nivel2: [ // Questões Mais Elaboradas
        {
            question: "O aquecimento global é causado principalmente por qual fenômeno?",
            options: [
                "Aumento da temperatura do Sol",
                "Efeito estufa intensificado por gases poluentes",
                "Derretimento natural dos polos",
                "Vulcões ativos"
            ],
            correct: 1,
            explanation: "O aquecimento global resulta do efeito estufa intensificado por emissões de CO2 e outros gases."
        },
        {
            question: "Qual é a principal função de uma Unidade de Conservação?",
            options: [
                "Permitir qualquer tipo de exploração econômica",
                "Proteger ecossistemas e biodiversidade",
                "Servir apenas para turismo",
                "Extrair recursos minerais"
            ],
            correct: 1,
            explanation: "Unidades de Conservação protegem ecossistemas, preservam biodiversidade e garantem sustentabilidade."
        },
        {
            question: "O que caracteriza um desenvolvimento sustentável?",
            options: [
                "Crescimento econômico sem limites",
                "Equilíbrio entre economia, sociedade e meio ambiente",
                "Exploração máxima de recursos naturais",
                "Industrialização sem controle"
            ],
            correct: 1,
            explanation: "Desenvolvimento sustentável equilibra crescimento econômico, justiça social e proteção ambiental."
        },
        {
            question: "Qual é o principal impacto da poluição dos oceanos?",
            options: [
                "Deixa a água mais bonita",
                "Morte de vida marinha e entrada de plástico na cadeia alimentar",
                "Aumenta a quantidade de peixes",
                "Não causa impacto"
            ],
            correct: 1,
            explanation: "A poluição oceânica mata vida marinha e contamina a cadeia alimentar com microplásticos."
        },
        {
            question: "O que são espécies endêmicas?",
            options: [
                "Espécies que vivem em vários lugares do mundo",
                "Espécies que existem apenas em uma região específica",
                "Espécies extintas",
                "Espécies domesticadas"
            ],
            correct: 1,
            explanation: "Espécies endêmicas são aquelas que existem naturalmente apenas em uma determinada região!"
        }
    ],
    nivel3: [ // Identificar Biomas por Imagens
        {
            question: "Identifique o bioma mostrado na imagem:",
            image: "img/jogos/quiz/floresta-amazonica.jpg",
            options: [
                "Amazônia",
                "Cerrado",
                "Caatinga",
                "Pampa"
            ],
            correct: 0,
            explanation: "A Amazônia é a maior floresta tropical do mundo, com vegetação densa e alta biodiversidade!"
        },
        {
            question: "Que bioma brasileiro é caracterizado por árvores retorcidas e cascas grossas?",
            image: "img/jogos/quiz/cerrado.jpg",
            options: [
                "Mata Atlântica",
                "Cerrado",
                "Pantanal",
                "Amazônia"
            ],
            correct: 1,
            explanation: "O Cerrado possui árvores com troncos retorcidos e cascas grossas, adaptadas ao fogo e seca."
        },
        {
            question: "Este bioma tem clima semi-árido e vegetação adaptada à seca. Qual é?",
            image: "img/jogos/quiz/caatinga.jpg",
            options: [
                "Pantanal",
                "Amazônia",
                "Caatinga",
                "Pampa"
            ],
            correct: 2,
            explanation: "A Caatinga é o único bioma exclusivamente brasileiro, com vegetação adaptada ao clima seco!"
        },
        {
            question: "Identifique o bioma caracterizado por áreas alagadas:",
            image: "img/jogos/quiz/pantanal.jpg",
            options: [
                "Cerrado",
                "Pantanal",
                "Pampa",
                "Mata Atlântica"
            ],
            correct: 1,
            explanation: "O Pantanal é a maior planície alagável do mundo, com incrível diversidade de fauna!"
        },
        {
            question: "Qual bioma brasileiro é o mais devastado, com apenas 12% de cobertura original?",
            image: "img/jogos/quiz/mata.jpg",
            options: [
                "Amazônia",
                "Cerrado",
                "Mata Atlântica",
                "Caatinga"
            ],
            correct: 2,
            explanation: "A Mata Atlântica é o bioma mais ameaçado, mas ainda abriga alta biodiversidade!"
        }
    ],
    nivel4: [ // Análise de Ações Antrópicas
        {
            question: "Qual é o principal impacto do desmatamento?",
            options: [
                "Aumenta a biodiversidade",
                "Perda de habitat, erosão do solo e mudanças climáticas",
                "Melhora a qualidade do ar",
                "Aumenta a quantidade de água"
            ],
            correct: 1,
            explanation: "O desmatamento causa perda de biodiversidade, erosão, assoreamento e contribui para mudanças climáticas."
        },
        {
            question: "Como a urbanização descontrolada afeta o meio ambiente?",
            options: [
                "Melhora a qualidade da água",
                "Impermeabilização do solo, poluição e perda de áreas verdes",
                "Aumenta a vegetação nativa",
                "Reduz a poluição do ar"
            ],
            correct: 1,
            explanation: "Urbanização sem planejamento causa impermeabilização, enchentes, poluição e perda de vegetação."
        },
        {
            question: "Qual é o impacto das queimadas na biodiversidade?",
            options: [
                "Aumenta o número de espécies",
                "Morte de animais, destruição de habitat e poluição do ar",
                "Melhora o solo",
                "Não causa impacto"
            ],
            correct: 1,
            explanation: "Queimadas matam animais, destroem habitats, empobrecem o solo e poluem o ar."
        },
        {
            question: "Como a agricultura intensiva afeta o meio ambiente?",
            options: [
                "Preserva os ecossistemas naturais",
                "Uso excessivo de agrotóxicos, erosão e contaminação da água",
                "Aumenta a diversidade de espécies",
                "Melhora a qualidade do solo"
            ],
            correct: 1,
            explanation: "Agricultura intensiva pode causar erosão, contaminação por agrotóxicos e perda de biodiversidade."
        },
        {
            question: "Qual é o principal problema da mineração para o meio ambiente?",
            options: [
                "Aumenta a vegetação local",
                "Destruição de ecossistemas, poluição da água e do solo",
                "Melhora a qualidade do ar",
                "Não causa impacto ambiental"
            ],
            correct: 1,
            explanation: "A mineração causa devastação de áreas, contaminação da água e solo por metais pesados."
        }
    ],
    nivel5: [ // Reflexão sobre Leis Ambientais
        {
            question: "O que estabelece a Lei de Crimes Ambientais (Lei 9.605/98)?",
            options: [
                "Apenas multas para empresas",
                "Sanções penais e administrativas para condutas lesivas ao meio ambiente",
                "Libera qualquer tipo de exploração",
                "Proíbe apenas a caça"
            ],
            correct: 1,
            explanation: "A Lei de Crimes Ambientais pune quem agride a natureza, com multas, restrições e até prisão."
        },
        {
            question: "O que é o Código Florestal Brasileiro?",
            options: [
                "Lei que permite desmatar livremente",
                "Lei que regula proteção de vegetação nativa e Áreas de Preservação Permanente",
                "Lei apenas sobre plantio de árvores",
                "Lei sobre caça de animais"
            ],
            correct: 1,
            explanation: "O Código Florestal estabelece regras para proteção de florestas, APPs e Reservas Legais."
        },
        {
            question: "O que é a Política Nacional de Resíduos Sólidos (PNRS)?",
            options: [
                "Lei que permite jogar lixo em qualquer lugar",
                "Lei que estabelece responsabilidade compartilhada pelo ciclo de vida dos produtos",
                "Lei apenas sobre reciclagem de papel",
                "Lei que proíbe todo tipo de lixo"
            ],
            correct: 1,
            explanation: "A PNRS responsabiliza fabricantes, comerciantes e consumidores pelo destino correto dos resíduos."
        },
        {
            question: "Por que é importante o licenciamento ambiental?",
            options: [
                "Apenas para burocracia",
                "Para avaliar e prevenir impactos ambientais de atividades econômicas",
                "Para liberar qualquer construção",
                "Não tem importância"
            ],
            correct: 1,
            explanation: "O licenciamento ambiental previne danos ao meio ambiente através de estudos e medidas mitigadoras."
        },
        {
            question: "O que é o Sistema Nacional de Unidades de Conservação (SNUC)?",
            options: [
                "Sistema que libera exploração em áreas protegidas",
                "Lei que estabelece critérios para criação e gestão de áreas protegidas",
                "Sistema apenas para parques urbanos",
                "Lei sobre zoológicos"
            ],
            correct: 1,
            explanation: "O SNUC organiza e protege áreas de importância ecológica em categorias como parques e reservas."
        }
    ]
};

let quizState = {
    currentLevel: 1,
    currentQuestion: 0,
    correctAnswers: 0,
    stars: 0,
    lives: 3,
    playerName: 'Jogador',
    questions: []
};

function initQuizGame() {
    document.getElementById('quiz-start-btn').addEventListener('click', startQuiz);
    document.getElementById('next-question-btn').addEventListener('click', nextQuestion);
    document.getElementById('quiz-restart-btn').addEventListener('click', restartQuiz);
    
    renderQuizRanking();
}

function startQuiz() {
    const nameInput = document.getElementById('quiz-player-name');
    quizState.playerName = nameInput.value.trim() || 'Jogador';
    
    quizState.currentLevel = 1;
    quizState.currentQuestion = 0;
    quizState.correctAnswers = 0;
    quizState.stars = 0;
    quizState.lives = 3;
    
    loadLevelQuestions();
    
    document.getElementById('quiz-start-screen').classList.add('hidden');
    document.getElementById('quiz-game-screen').classList.remove('hidden');
    
    updateQuizUI();
    displayQuestion();
}

function loadLevelQuestions() {
    const levelKey = `nivel${quizState.currentLevel}`;
    quizState.questions = shuffleArray(quizQuestions[levelKey]);
    quizState.currentQuestion = 0;
}

function displayQuestion() {
    const question = quizState.questions[quizState.currentQuestion];
    
    document.getElementById('question-num').textContent = quizState.currentQuestion + 1;
    document.getElementById('question-level-badge').textContent = `Nível ${quizState.currentLevel}`;
    document.getElementById('question-text').textContent = question.question;
    
    // Imagem (se houver)
    const imageContainer = document.getElementById('question-image-container');
    if (question.image) {
        document.getElementById('question-image').src = question.image;
        imageContainer.classList.remove('hidden');
    } else {
        imageContainer.classList.add('hidden');
    }
    
    // Opções
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';

    // Guardar a opção correta antes de embaralhar
    const correctOption = question.options[question.correct]; 
    const shuffledOptions = shuffleArray(question.options); 
    const newCorrectIndex = shuffledOptions.indexOf(correctOption);

    // Atualizar índice correto 
    question.correct = newCorrectIndex;
    
    shuffledOptions.forEach((option, index) => { const button = document.createElement('button'); 
        button.className = 'quiz-option'; 
        button.textContent = option; 
        button.addEventListener('click', () => selectAnswer(index)); 
        optionsContainer.appendChild(button); }); document.getElementById('feedback-box').classList.add('hidden'); updateQuizUI(); 
    }

function selectAnswer(selectedIndex) {
    const question = quizState.questions[quizState.currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    const isCorrect = selectedIndex === question.correct;
    
    // Desabilita todas as opções
    options.forEach(opt => opt.classList.add('disabled'));
    
    // Marca resposta
    options[selectedIndex].classList.add(isCorrect ? 'correct' : 'wrong');
    options[question.correct].classList.add('correct');
    
    // Feedback
    const feedbackBox = document.getElementById('feedback-box');
    const feedbackIcon = feedbackBox.querySelector('.feedback-icon');
    const feedbackText = feedbackBox.querySelector('.feedback-text');
    
    if (isCorrect) {
        quizState.correctAnswers++;
        quizState.stars += 20;
        feedbackBox.classList.remove('wrong');
        feedbackBox.classList.add('correct');
        feedbackIcon.textContent = '✅';
        feedbackText.textContent = `Correto! ${question.explanation}`;
    } else {
        quizState.lives--;
        feedbackBox.classList.remove('correct');
        feedbackBox.classList.add('wrong');
        feedbackIcon.textContent = '❌';
        feedbackText.textContent = `Ops! ${question.explanation}`;
        
        if (quizState.lives === 0) {
            setTimeout(() => endQuiz(), 2000);
            return;
        }
    }
    
    feedbackBox.classList.remove('hidden');
    updateQuizUI();
}

function nextQuestion() {
    quizState.currentQuestion++;
    
    // Se terminou as questões do nível
    if (quizState.currentQuestion >= quizState.questions.length) {
        if (quizState.currentLevel < 5) {
            // Avança para próximo nível
            quizState.currentLevel++;
            quizState.stars += 50; // Bônus por completar o nível
            loadLevelQuestions();
            displayQuestion();
        } else {
            // Terminou todos os níveis
            endQuiz();
        }
    } else {
        displayQuestion();
    }
}

function endQuiz() {
    document.getElementById('quiz-game-screen').classList.add('hidden');
    document.getElementById('quiz-result-screen').classList.remove('hidden');
    
    // Mensagem personalizada
    let title, message;
    if (quizState.currentLevel === 5 && quizState.correctAnswers >= 20) {
        title = '🏆 Mestre Ambiental!';
        message = 'Incrível! Você dominou todos os níveis e é um verdadeiro defensor do meio ambiente!';
    } else if (quizState.currentLevel >= 4) {
        title = '🌟 Excelente!';
        message = 'Você tem grande conhecimento sobre meio ambiente. Continue aprendendo!';
    } else if (quizState.currentLevel >= 3) {
        title = '👏 Muito Bom!';
        message = 'Você está no caminho certo! Continue estudando sobre meio ambiente.';
    } else {
        title = '💚 Bom Trabalho!';
        message = 'Você tem uma boa base. Continue praticando para aprender mais!';
    }
    
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-message').textContent = message;
    document.getElementById('final-stars').textContent = quizState.stars;
    document.getElementById('final-correct').textContent = quizState.correctAnswers;
    document.getElementById('final-level').textContent = quizState.currentLevel;
    
    saveQuizScore(quizState.playerName, quizState.stars, quizState.currentLevel);
    renderQuizRanking();
}

function restartQuiz() {
    document.getElementById('quiz-result-screen').classList.add('hidden');
    document.getElementById('quiz-start-screen').classList.remove('hidden');
}

function updateQuizUI() {
    document.getElementById('current-level').textContent = quizState.currentLevel;
    document.getElementById('quiz-stars').textContent = quizState.stars;
    document.getElementById('quiz-correct').textContent = quizState.correctAnswers;
    document.getElementById('quiz-lives').textContent = quizState.lives;
    
    const progress = ((quizState.currentLevel - 1) / 4) * 100;
    document.getElementById('level-progress').style.width = `${progress}%`;
}

function saveQuizScore(name, stars, level) {

    salvarRankingGlobal("rankingQuiz", {
        name: name,
        stars: stars,
        level: level,
        date: new Date().toISOString()
    });

}

function renderQuizRanking() {

    const { collection, query, orderBy, limit, onSnapshot } = window.firebaseFunctions;
    const db = window.db;

    const q = query(
        collection(db, "rankingQuiz"),
        orderBy("stars", "desc"),
        limit(500)
    );

    const tbody = document.getElementById('ranking-quiz-body');
    const emptyMsg = document.getElementById('ranking-quiz-empty');

    onSnapshot(q, (snapshot) => {

        tbody.innerHTML = '';

        if (snapshot.empty) {
            emptyMsg.style.display = 'block';
            return;
        }

        emptyMsg.style.display = 'none';

        let pos = 1;

        snapshot.forEach(doc => {
            const entry = doc.data();

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${pos++}</td>
                <td>${entry.name}</td>
                <td>${entry.stars}</td>
                <td>Nível ${entry.level}</td>
            `;

            tbody.appendChild(tr);
        });

    });
}

// ===== UTILIDADES =====
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

async function salvarRankingGlobal(nomeColecao, dados) {
    const { collection, addDoc } = window.firebaseFunctions;
    const db = window.db;

    await addDoc(collection(db, nomeColecao), {
        ...dados,
        createdAt: new Date()
    });
}

function renderRankingGlobal(nomeColecao, tbodyId, campoOrdenacao) {

    const { collection, query, orderBy, limit, onSnapshot } = window.firebaseFunctions;
    const db = window.db;

    const q = query(
        collection(db, nomeColecao),
        orderBy(campoOrdenacao, "desc"),
        limit(500)
    );

    onSnapshot(q, (snapshot) => {

        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;

        tbody.innerHTML = "";

        let pos = 1;

        snapshot.forEach(doc => {
            const data = doc.data();
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${pos++}</td>
                <td>${data.name}</td>
                <td>${data.score ?? data.time}</td>
            `;

            tbody.appendChild(tr);
        });

    });
}

async function limparTodosRankings() {

    const { getFirestore, collection, getDocs, deleteDoc, doc } =
        await import("https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js");

    const db = getFirestore();

    const tipos = ["rankingMemoria", "rankingInterativo", "rankingQuiz"];

    for (const tipo of tipos) {

        const rankingRef = collection(db, tipo);
        const snapshot = await getDocs(rankingRef);

        for (const item of snapshot.docs) {
            await deleteDoc(doc(db, tipo, item.id));
        }
    }

    console.log("Todos os rankings foram apagados!");
}

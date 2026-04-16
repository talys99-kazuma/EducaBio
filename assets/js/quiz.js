// ===== QUIZ AMBIENTAL =====
// Este arquivo é usado tanto na página quiz.html quanto na página jogos.html
// Os rankings são compartilhados via Firebase (collection "rankingQuiz")

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
                "Produzem oxigênio, absorvem CO₂ e protegem o solo",
                "Apenas para madeira",
                "Não têm importância"
            ],
            correct: 1,
            explanation: "As árvores são essenciais: produzem oxigênio, absorvem CO₂, protegem o solo e abrigam animais!"
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
            explanation: "O aquecimento global resulta do efeito estufa intensificado por emissões de CO₂ e outros gases."
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
            question: "Observe as características dessa imagem e marque a alternativa correspondente ao seu bioma:",
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
            question: "Qual bioma brasileiro é caracterizado por apresentar árvores retorcidas e caules com casca grossa?",
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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initQuizGame();
    renderQuizRanking();
});

function initQuizGame() {
    document.getElementById('quiz-start-btn').addEventListener('click', startQuiz);
    document.getElementById('next-question-btn').addEventListener('click', nextQuestion);
    document.getElementById('quiz-restart-btn').addEventListener('click', restartQuiz);
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
    const shuffledOptions = shuffleArray([...question.options]); 
    const newCorrectIndex = shuffledOptions.indexOf(correctOption);

    // Atualizar índice correto temporariamente
    const originalCorrect = question.correct;
    question.correct = newCorrectIndex;
    
    shuffledOptions.forEach((option, index) => { 
        const button = document.createElement('button'); 
        button.className = 'quiz-option'; 
        button.textContent = option; 
        button.addEventListener('click', () => selectAnswer(index)); 
        optionsContainer.appendChild(button); 
    }); 
    
    document.getElementById('feedback-box').classList.add('hidden'); 
    updateQuizUI(); 
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
    const tbody = document.getElementById('ranking-quiz-body');
    const emptyMsg = document.getElementById('ranking-quiz-empty');

    if (!tbody) return;

    db.collection("rankingQuiz")
      .orderBy("stars", "desc")
      .limit(50)
      .onSnapshot((snapshot) => {
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
      }, (error) => {
          console.error("Erro ao carregar ranking do quiz:", error);
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
    try {
        await db.collection(nomeColecao).add({
            ...dados,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error("Erro ao salvar no banco de dados:", error);
    }
}

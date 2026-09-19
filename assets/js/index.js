document.addEventListener('DOMContentLoaded', function () {

    /*
    ============================================================
    CONTROLE DO QUESTIONÁRIO
    ============================================================

    A informação sobre o questionário respondido agora vem
    exclusivamente do Firestore e está vinculada ao UID do usuário.

    NÃO usamos mais:
    - versaoRespondida
    - diagnosticoRespondido
    - versaoGlobal

    Isso evita que o navegador de uma pessoa influencie outra.
    */

    const homeUrl = "assets/home.html";

    let questionarioInicializado = false;


    // ============================================================
    // VERIFICA SE O USUÁRIO JÁ RESPONDEU O QUESTIONÁRIO
    // ============================================================

    async function verificarQuestionarioRespondido(user) {

        // Usuário não logado:
        // permanece no questionário.
        if (!user) {
            return false;
        }

        try {

            const doc = await db
                .collection("users")
                .doc(user.uid)
                .get();

            if (
                doc.exists &&
                doc.data().questionarioRespondido === true
            ) {
                return true;
            }

            return false;

        } catch (error) {

            console.error(
                "Erro ao verificar questionário no Firestore:",
                error
            );

            // Em caso de erro, NÃO manda o usuário para a Home.
            // Ele permanece no questionário.
            return false;
        }
    }


    // ============================================================
    // CONTROLE DO ESTADO DE LOGIN
    // ============================================================

    auth.onAuthStateChanged(async function (user) {

        const jaRespondeu =
            await verificarQuestionarioRespondido(user);

        /*
        Se estiver logado E já respondeu:
        QR Code → index → Home
        */

        if (jaRespondeu) {

            window.location.replace(homeUrl);

            return;
        }

        /*
        Se:
        - não estiver logado; OU
        - estiver logado mas ainda não respondeu

        permanece no questionário.
        */

        inicializarQuestionario();

    });


    // ============================================================
    // INICIALIZA O QUESTIONÁRIO
    // ============================================================

    function inicializarQuestionario() {

        // Evita renderizar duas vezes.
        if (questionarioInicializado) {
            return;
        }

        questionarioInicializado = true;


        const questionsContainer =
            document.getElementById('questions-container');

        const submitBtn =
            document.getElementById('submit-btn');

        const resultMessage =
            document.getElementById('result-message');

        const diagnosticForm =
            document.getElementById('diagnostic-form');


        // ========================================================
        // QUESTÕES
        // ========================================================

        const questions = [

            {
                id: 1,
                question:
                    "Qual bioma brasileiro é conhecido por ser a maior floresta tropical úmida do mundo, com a maior biodiversidade do planeta?",
                options: [
                    {
                        value: "a",
                        text: "Pantanal"
                    },
                    {
                        value: "b",
                        text: "Caatinga"
                    },
                    {
                        value: "c",
                        text: "Amazônia"
                    },
                    {
                        value: "d",
                        text: "Mata Atlântica"
                    }
                ],
                correct: "c"
            },

            {
                id: 2,
                question:
                    "O Pantanal é conhecido por qual característica ambiental marcante?",
                options: [
                    {
                        value: "a",
                        text: "Regime de cheias e biodiversidade aquática"
                    },
                    {
                        value: "b",
                        text: "Presença de dunas e vegetação rasteira"
                    },
                    {
                        value: "c",
                        text: "Florestas densas e úmidas"
                    },
                    {
                        value: "d",
                        text: "Clima seco e vegetação esparsa"
                    }
                ],
                correct: "a"
            },

            {
                id: 3,
                question:
                    "Qual bioma brasileiro é mais ameaçado pela urbanização e pela expansão agrícola?",
                options: [
                    {
                        value: "a",
                        text: "Caatinga"
                    },
                    {
                        value: "b",
                        text: "Cerrado"
                    },
                    {
                        value: "c",
                        text: "Mata Atlântica"
                    },
                    {
                        value: "d",
                        text: "Pampa"
                    }
                ],
                correct: "c"
            },

            {
                id: 4,
                question:
                    "Qual bioma brasileiro é conhecido por seu clima semiárido e vegetação adaptada à seca?",
                options: [
                    {
                        value: "a",
                        text: "Caatinga"
                    },
                    {
                        value: "b",
                        text: "Pampa"
                    },
                    {
                        value: "c",
                        text: "Cerrado"
                    },
                    {
                        value: "d",
                        text: "Pantanal"
                    }
                ],
                correct: "a"
            },

            {
                id: 5,
                question:
                    "Quais atividades humanas contribuem para o desmatamento em todos os biomas?",
                options: [
                    {
                        value: "a",
                        text: "Turismo ecológico e Poluição luminosa"
                    },
                    {
                        value: "b",
                        text: "Pesca artesanal e Nevascas"
                    },
                    {
                        value: "c",
                        text: "Preservação ambiental e Poluição sonora"
                    },
                    {
                        value: "d",
                        text: "Expansões agropecuárias e queimadas"
                    }
                ],
                correct: "d"
            },

            {
                id: 6,
                question:
                    "Como o desmatamento pode afetar o clima de uma região?",
                options: [
                    {
                        value: "a",
                        text: "Reduzindo a temperatura média"
                    },
                    {
                        value: "b",
                        text: "Alterando o ciclo das chuvas"
                    },
                    {
                        value: "c",
                        text: "Estabilizando o clima local"
                    },
                    {
                        value: "d",
                        text: "Aumentando a umidade do ar"
                    }
                ],
                correct: "b"
            },

            {
                id: 7,
                question:
                    "Qual medida ajuda a combater o desmatamento nos biomas brasileiros?",
                options: [
                    {
                        value: "a",
                        text: "Criação de áreas de proteção ambiental"
                    },
                    {
                        value: "b",
                        text: "Expansão de monoculturas"
                    },
                    {
                        value: "c",
                        text: "Construção de rodovias em florestas"
                    },
                    {
                        value: "d",
                        text: "Exploração de madeira sem controle"
                    }
                ],
                correct: "a"
            },

            {
                id: 8,
                question:
                    "Na sua comunidade, quais impactos ambientais você percebe relacionados ao bioma local? Como poderiam ser minimizados?",
                type: "textarea",
                placeholder:
                    "Compartilhe sua percepção sobre os impactos ambientais na sua região e suas sugestões..."
            }

        ];


        // ========================================================
        // RENDERIZAR QUESTÕES
        // ========================================================

        function renderQuestions() {

            questionsContainer.innerHTML = "";

            questions.forEach(function (q, index) {

                const questionBlock =
                    document.createElement('div');

                questionBlock.className =
                    'question-block';


                const questionHeader =
                    document.createElement('div');

                questionHeader.className =
                    'question-header';


                const questionNumber =
                    document.createElement('div');

                questionNumber.className =
                    'question-number';

                questionNumber.textContent =
                    index + 1;


                const questionText =
                    document.createElement('div');

                questionText.className =
                    'question-text';

                questionText.textContent =
                    q.question;


                questionHeader.appendChild(
                    questionNumber
                );

                questionHeader.appendChild(
                    questionText
                );

                questionBlock.appendChild(
                    questionHeader
                );


                // QUESTÃO ABERTA

                if (q.type === 'textarea') {

                    const textarea =
                        document.createElement('textarea');

                    textarea.className =
                        'textarea-input';

                    textarea.name =
                        `question_${q.id}`;

                    textarea.id =
                        `question_${q.id}`;

                    textarea.placeholder =
                        q.placeholder;

                    textarea.required = true;

                    questionBlock.appendChild(
                        textarea
                    );

                }

                // QUESTÃO DE ALTERNATIVAS

                else {

                    const optionsList =
                        document.createElement('div');

                    optionsList.className =
                        'options-list';


                    q.options.forEach(function (option) {

                        const label =
                            document.createElement('label');

                        label.className =
                            'option-label';


                        const input =
                            document.createElement('input');

                        input.type = 'radio';

                        input.className =
                            'option-input';

                        input.name =
                            `question_${q.id}`;

                        input.value =
                            option.value;

                        input.required = true;


                        const span =
                            document.createElement('span');

                        span.className =
                            'option-text';

                        span.textContent =
                            `${option.value.toUpperCase()}) ${option.text}`;


                        label.appendChild(input);

                        label.appendChild(span);

                        optionsList.appendChild(label);

                    });


                    questionBlock.appendChild(
                        optionsList
                    );
                }


                questionsContainer.appendChild(
                    questionBlock
                );

            });
        }


        // ========================================================
        // VALIDAÇÃO
        // ========================================================

        function validateForm() {

            let isValid = true;

            const formData =
                new FormData(diagnosticForm);


            questions.forEach(function (q) {

                const answer =
                    formData.get(`question_${q.id}`);


                if (
                    !answer ||
                    answer.trim() === ''
                ) {

                    isValid = false;

                }

            });


            return isValid;
        }


        // ========================================================
        // ENVIO DO QUESTIONÁRIO
        // ========================================================

        submitBtn.addEventListener(
            'click',
            async function (e) {

                e.preventDefault();


                if (!validateForm()) {

                    resultMessage.textContent =
                        'Por favor, responda todas as questões antes de continuar.';

                    resultMessage.className =
                        'result-message';

                    resultMessage.classList.remove(
                        'hidden'
                    );

                    return;
                }


                submitBtn.disabled = true;

                submitBtn.innerHTML =
                    '<span>Enviando...</span>';


                const formData =
                    new FormData(diagnosticForm);


                const data = {

                    q1:
                        formData.get('question_1'),

                    q2:
                        formData.get('question_2'),

                    q3:
                        formData.get('question_3'),

                    q4:
                        formData.get('question_4'),

                    q5:
                        formData.get('question_5'),

                    q6:
                        formData.get('question_6'),

                    q7:
                        formData.get('question_7'),

                    q8:
                        formData.get('question_8'),

                    timestamp:
                        new Date().toISOString()

                };


                try {

                    /*
                    ==================================================
                    PRIMEIRO: VERIFICAR LOGIN
                    ==================================================
                    */

                    const user =
                        auth.currentUser;


                    if (!user) {

                        resultMessage.textContent =
                            'Para enviar o questionário, faça login ou crie uma conta primeiro.';

                        resultMessage.className =
                            'result-message';

                        resultMessage.classList.remove(
                            'hidden'
                        );


                        submitBtn.disabled =
                            false;

                        submitBtn.innerHTML =
                            '<span>Enviar Respostas</span><span class="btn-icon">➜</span>';


                        // Abre o modal de login/cadastro.

                        const authModal =
                            document.getElementById(
                                'auth-modal-overlay'
                            );


                        if (authModal) {

                            authModal.classList.remove(
                                'hidden'
                            );

                        }


                        return;
                    }


                    /*
                    ==================================================
                    SEGUNDO: ENVIAR PARA GOOGLE SHEETS
                    ==================================================
                    */

                    fetch(
                        'https://script.google.com/macros/s/AKfycbxtQNPrlMzdLxiF3wUpOjx1XXnck8eSe9TD_bjgdJaoIhh5vEgLqilOmgPDujhdxErp/exec',
                        {
                            method: 'POST',
                            body: JSON.stringify(data)
                        }
                    ).catch(function () {
                        console.warn(
                            'Não foi possível confirmar o envio ao Google Sheets.'
                        );
                    });


                    /*
                    ==================================================
                    TERCEIRO: MARCAR QUESTIONÁRIO COMO RESPONDIDO
                    ==================================================
                    */

                    await db
                        .collection('users')
                        .doc(user.uid)
                        .set(
                            {
                                questionarioRespondido: true,

                                respostasQuestionario:
                                    data,

                                dataQuestionario:
                                    firebase.firestore.FieldValue.serverTimestamp()

                            },
                            {
                                merge: true
                            }
                        );


                    /*
                    ==================================================
                    QUARTO: MENSAGEM
                    ==================================================
                    */

                    resultMessage.textContent =
                        'Respostas enviadas com sucesso! Redirecionando...';

                    resultMessage.className =
                        'result-message success';

                    resultMessage.classList.remove(
                        'hidden'
                    );


                    /*
                    ==================================================
                    QUINTO: HOME
                    ==================================================
                    */

                    setTimeout(function () {

                        window.location.replace(
                            'assets/home.html'
                        );

                    }, 1000);


                } catch (error) {

                    console.error(
                        'Erro ao enviar:',
                        error
                    );


                    resultMessage.textContent =
                        'Erro ao enviar respostas. Tente novamente.';


                    resultMessage.className =
                        'result-message';

                    resultMessage.classList.remove(
                        'hidden'
                    );


                    submitBtn.disabled =
                        false;


                    submitBtn.innerHTML =
                        '<span>Enviar Respostas</span><span class="btn-icon">➜</span>';

                }

            }
        );


        // ========================================================
        // INICIALIZAR
        // ========================================================

        renderQuestions();


        // ========================================================
        // ANIMAÇÃO DAS QUESTÕES
        // ========================================================

        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry, index) {

                            if (
                                entry.isIntersecting
                            ) {

                                setTimeout(
                                    function () {

                                        entry.target.style.opacity =
                                            '1';

                                        entry.target.style.transform =
                                            'translateY(0)';

                                    },
                                    index * 100
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.1
                }
            );


        document
            .querySelectorAll('.question-block')
            .forEach(function (block) {

                block.style.opacity = '0';

                block.style.transform =
                    'translateY(20px)';

                block.style.transition =
                    'opacity 0.5s ease, transform 0.5s ease';

                observer.observe(block);

            });


        // ========================================================
        // PRIMEIRA VISITA
        // ========================================================

        const primeiraVisita =
            localStorage.getItem(
                "jaVisitouEducaBio"
            );

        const authModalOverlay =
            document.getElementById(
                'auth-modal-overlay'
            );


        if (
            !primeiraVisita &&
            authModalOverlay
        ) {

            setTimeout(function () {

                authModalOverlay.classList.remove(
                    'hidden'
                );

                localStorage.setItem(
                    "jaVisitouEducaBio",
                    "true"
                );

            }, 500);

        }

    }

});
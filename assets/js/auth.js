async function salvarUsuarioSeNovo(user) {
    const userRef = db.collection('users').doc(user.uid);
    const doc = await userRef.get();

    if (!doc.exists) {
        await userRef.set({
            nome: user.displayName || "Usuário",
            email: user.email,
            criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
            photoURL: user.photoURL || null
        });
    }
}

// ===============================
// ELEMENTOS DE AUTENTICACAO
// ===============================
const authModalOverlay = document.getElementById('auth-modal-overlay');
const modalClose = document.getElementById('modal-close');

const btnEntrarDesktop = document.getElementById('btn-entrar-desktop');
const btnEntrarMobile = document.getElementById('btn-entrar-mobile');
const btnGoogle = document.getElementById('btn-google');

const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const forgotForm = document.getElementById('forgot-form');

const switchToRegister = document.getElementById('switch-to-register');
const switchToLogin = document.getElementById('switch-to-login');
const btnForgotPassword = document.getElementById('btn-forgot-password');
const backToLogin = document.getElementById('back-to-login');

const authMessage = document.getElementById('auth-message');
const btnLogoutDesktop = document.getElementById('btn-logout-desktop');
const btnLogoutMobile = document.getElementById('btn-sair-mobile');

// ===============================
// FUNCOES DO MODAL
// ===============================
function openModal() {
    if (authModalOverlay) {
        authModalOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (authModalOverlay) {
        authModalOverlay.classList.add('hidden');
        document.body.style.overflow = '';
        hideMessage();
    }
}

function showLoginForm() {
    loginForm?.classList.remove('hidden');
    registerForm?.classList.add('hidden');
    forgotForm?.classList.add('hidden');
    tabLogin?.classList.add('active');
    tabRegister?.classList.remove('active');
    hideMessage();
}

function showRegisterForm() {
    loginForm?.classList.add('hidden');
    registerForm?.classList.remove('hidden');
    forgotForm?.classList.add('hidden');
    tabLogin?.classList.remove('active');
    tabRegister?.classList.add('active');
    hideMessage();
}

function showForgotForm() {
    loginForm?.classList.add('hidden');
    registerForm?.classList.add('hidden');
    forgotForm?.classList.remove('hidden');
    tabLogin?.classList.remove('active');
    tabRegister?.classList.remove('active');
    hideMessage();
}

function showMessage(message, type = 'error') {
    if (authMessage) {
        authMessage.textContent = message;
        authMessage.className = 'auth-message ' + type;
        authMessage.classList.remove('hidden');
    }
}

function hideMessage() {
    authMessage?.classList.add('hidden');
}

async function vincularSenhaAoUsuario(senha) {
    const user = auth.currentUser;
    if (!user) return;
    try {
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, senha);
        await user.linkWithCredential(credential);
        showMessage('Senha criada com sucesso!', 'success');
    } catch (error) {
        console.error(error);
        showMessage('Erro ao criar senha.', 'error');
    }
}

function usuarioTemSenha(user) {
    return user.providerData.some(p => p.providerId === firebase.auth.EmailAuthProvider.PROVIDER_ID);
}

function perguntarCriarSenha() {
    if (localStorage.getItem('naoPerguntarSenha')) return;
    const criar = confirm('Deseja criar uma senha para acessar com email também?');
    if (!criar) {
        localStorage.setItem('naoPerguntarSenha', 'true');
        return;
    }
    const senha = prompt('Digite uma senha (mínimo 6 caracteres):');
    if (senha && senha.length >= 6) {
        vincularSenhaAoUsuario(senha);
    }
}

// EVENTOS MODAL
btnEntrarDesktop?.addEventListener('click', openModal);
btnEntrarMobile?.addEventListener('click', openModal);
modalClose?.addEventListener('click', closeModal);

authModalOverlay?.addEventListener('click', (e) => {
    if (e.target === authModalOverlay) closeModal();
});

tabLogin?.addEventListener('click', showLoginForm);
tabRegister?.addEventListener('click', showRegisterForm);
switchToRegister?.addEventListener('click', (e) => { e.preventDefault(); showRegisterForm(); });
switchToLogin?.addEventListener('click', (e) => { e.preventDefault(); showLoginForm(); });
btnForgotPassword?.addEventListener('click', (e) => { e.preventDefault(); showForgotForm(); });
backToLogin?.addEventListener('click', (e) => { e.preventDefault(); showLoginForm(); });

// 🔥 CORREÇÃO DO OLHINHO DA SENHA
document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        let input = document.getElementById(targetId);
        
        // Se o botão for do formulário de cadastro, mas estiver com o ID errado no HTML (login-password)
        if (!input || (targetId === 'login-password' && btn.closest('#register-form'))) {
            input = btn.previousElementSibling;
        }

        if (input) {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            btn.innerHTML = isPassword ? '<i class="bi bi-eye-slash-fill"></i>' : '<i class="bi bi-eye-fill"></i>';
        }
    });
});

const userButton = document.getElementById('user-button');
const desktopDropdown = document.getElementById('desktop-dropdown-menu');

if (userButton && desktopDropdown) {
    userButton.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!auth.currentUser) {
            openModal();
            return;
        }
        desktopDropdown.classList.toggle('show');
    });
}

loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const submitBtn = loginForm.querySelector('.btn-submit-auth');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Entrando...';
    try {
        await auth.signInWithEmailAndPassword(email, password);
        showMessage('Login realizado com sucesso!', 'success');
        setTimeout(() => { closeModal(); }, 1000);
    } catch (error) {
        showMessage('Ops! E-mail ou senha incorretos. Verifique os dados ou clique em "Esqueceu a senha?" para redefinir.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Entrar';
    }
});

// 🔥 CORREÇÃO DO CADASTRO (Adicionado tratamento de erro)
registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const termsAccepted = document.getElementById('register-terms').checked;
    const submitBtn = registerForm.querySelector('.btn-submit-auth');
    
    if (password !== confirmPassword) return showMessage('As senhas não coincidem.', 'error');
    if (!termsAccepted) return showMessage('Aceite os termos.', 'error');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Criando conta...';

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        await user.updateProfile({ displayName: name });
        await user.reload();
        await db.collection('users').doc(user.uid).set({
            nome: name,
            email: email,
            criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
            photoURL: null
        });
        showMessage('Conta criada com sucesso!', 'success');
        setTimeout(() => {
            updateUIForLoggedUser(auth.currentUser);
            closeModal();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Criar Conta';
        }, 1000);
    } catch (error) {
        console.error("Erro no cadastro:", error);
        if (error.code === 'auth/email-already-in-use') {
            showMessage('Este email já está cadastrado.', 'error');
        } else if (error.code === 'auth/weak-password') {
            showMessage('A senha deve ter pelo menos 6 caracteres.', 'error');
        } else {
            showMessage('Erro ao criar conta. Tente novamente.', 'error');
        }
        submitBtn.disabled = false;
        submitBtn.textContent = 'Criar Conta';
    }
});

// ==========================================
// 🔥 NOVO: ENVIO DE E-MAIL DE RECUPERAÇÃO
// ==========================================
forgotForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;
    const submitBtn = forgotForm.querySelector('.btn-submit-auth');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
        await auth.sendPasswordResetEmail(email);
        showMessage('Link enviado! Verifique sua caixa de entrada.', 'success');
        
        setTimeout(() => {
            forgotForm.reset();
            showLoginForm();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Link';
        }, 3000);
    } catch (error) {
        console.error("Erro na recuperação:", error);
        if (error.code === 'auth/user-not-found') {
            showMessage('Nenhum usuário cadastrado com este e-mail.', 'error');
        } else if (error.code === 'auth/invalid-email') {
            showMessage('E-mail inválido.', 'error');
        } else {
            showMessage('Erro ao enviar. Tente novamente.', 'error');
        }
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Link';
    }
});

btnGoogle?.addEventListener('click', async () => {
    try {
        const googleProvider = new firebase.auth.GoogleAuthProvider();
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
            await auth.signInWithRedirect(googleProvider);
        } else {
            const result = await auth.signInWithPopup(googleProvider);
            await salvarUsuarioSeNovo(result.user);
            closeModal();
        }
    } catch (error) {
        showMessage('Erro Google.', 'error');
    }
});

// 🔥 CORREÇÃO DO REDIRECIONAMENTO AO SAIR
async function logout() {
    try {
        await auth.signOut();
        
        // Verifica se o usuário já fez o questionário no passado
        const respondeuQuiz = localStorage.getItem("versaoRespondida") !== null || localStorage.getItem("diagnosticoRespondido") === "true";
        const isInAssets = window.location.pathname.includes('/assets/');

        if (respondeuQuiz) {
            // Se já respondeu, ou ele continua na página atual (se for a home) ou vai pra home
            if (isInAssets) {
                window.location.reload(); 
            } else {
                window.location.href = "assets/home.html";
            }
        } else {
            // Se não respondeu, volta para o index
            window.location.href = isInAssets ? "../index.html" : "index.html";
        }

    } catch (error) {
        console.error('Erro ao sair:', error);
    }
}

btnLogoutDesktop?.addEventListener('click', logout);
btnLogoutMobile?.addEventListener('click', logout);

function getCorrectUserIconPath() {
    const isInAssets = window.location.pathname.includes('/assets/');
    return isInAssets ? 'img/user.png' : 'assets/img/user.png';
}

async function updateUIForLoggedUser(user) {
    let nomeExibicao = "Usuário";
    
    if (user.displayName) {
        const partes = user.displayName.trim().split(/\s+/);
        nomeExibicao = partes.length > 1 
            ? `${partes[0]} ${partes[partes.length - 1]}` 
            : partes[0];
    }

    let photoURL = user.photoURL;
    try {
        const doc = await db.collection('users').doc(user.uid).get();
        if (doc.exists && !photoURL) photoURL = doc.data().photoURL;
    } catch (e) {}

    photoURL = photoURL || getCorrectUserIconPath();

    const btnEntrarMobileEl = document.getElementById('btn-entrar-mobile');
    const btnEntrarDesktopEl = document.getElementById('btn-entrar-desktop');
    if (btnEntrarMobileEl) btnEntrarMobileEl.classList.add('hidden');
    if (btnEntrarDesktopEl) btnEntrarDesktopEl.classList.add('hidden');

    const mobileUserProfileCard = document.getElementById('mobile-user-profile');
    const mobileProfileToggle = document.getElementById('mobile-profile-toggle');
    const userButtonDesktop = document.getElementById('user-button');
    if (mobileUserProfileCard) mobileUserProfileCard.classList.remove('hidden');
    if (mobileProfileToggle) mobileProfileToggle.classList.remove('hidden');
    if (userButtonDesktop) userButtonDesktop.classList.remove('hidden');

    const mobileUserName = document.getElementById('mobile-user-name');
    if (mobileUserName) mobileUserName.textContent = nomeExibicao;
    const desktopFullName = document.getElementById('desktop-full-name');
    if (desktopFullName) desktopFullName.textContent = nomeExibicao;

    const desktopUserAvatarMain = document.getElementById('desktop-user-avatar');
    if (desktopUserAvatarMain) desktopUserAvatarMain.src = photoURL;
    const mobileUserAvatar = document.getElementById('mobile-user-avatar');
    if (mobileUserAvatar) mobileUserAvatar.src = photoURL;
}

function updateUIForLoggedOutUser() {
    const userIcon = getCorrectUserIconPath();
    const mobileAuthSectionOut = document.getElementById('btn-entrar-mobile');
    const desktopAuthSectionOut = document.getElementById('btn-entrar-desktop');
    
    if (mobileAuthSectionOut) mobileAuthSectionOut.classList.remove('hidden');
    if (desktopAuthSectionOut) desktopAuthSectionOut.classList.remove('hidden');

    const mobileUserProfileCard = document.getElementById('mobile-user-profile');
    const mobileProfileToggle = document.getElementById('mobile-profile-toggle');
    const userButtonDesktop = document.getElementById('user-button');
    
    if (mobileUserProfileCard) mobileUserProfileCard.classList.add('hidden');
    if (mobileProfileToggle) mobileProfileToggle.classList.add('hidden');
    
    if (userButtonDesktop) userButtonDesktop.classList.remove('hidden');

    const desktopUserAvatarMain = document.getElementById('desktop-user-avatar');
    if (desktopUserAvatarMain) desktopUserAvatarMain.src = userIcon;
    const mobileUserAvatar = document.getElementById('mobile-user-avatar');
    if (mobileUserAvatar) mobileUserAvatar.src = userIcon;
}

// ==========================================
// ESTADO DE AUTENTICAÇÃO UNIFICADO
// ==========================================

auth.getRedirectResult().then(async (result) => {
    if (result && result.user) {
        await salvarUsuarioSeNovo(result.user);
        if (!usuarioTemSenha(result.user)) setTimeout(() => perguntarCriarSenha(), 1000);
    }
});

auth.onAuthStateChanged(async (user) => {
    if (user) {
        try {
            const doc = await db.collection('users').doc(user.uid).get();
            const caminhoAtual = window.location.pathname;
            const estaNoIndex = caminhoAtual.endsWith('index.html') || caminhoAtual === '/' || caminhoAtual.endsWith('EducaBio/');

            if (doc.exists && doc.data().questionarioRespondido && estaNoIndex) {
                window.location.href = "assets/home.html";
                return; 
            }

            await updateUIForLoggedUser(user);
        } catch (error) {
            await updateUIForLoggedUser(user);
        }
    } else {
        updateUIForLoggedOutUser();
    }
});
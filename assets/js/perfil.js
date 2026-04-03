// ==========================================
// PERFIL.JS - Lógica com ImgBB (Sem Erro de CORS/Faturamento)
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
    
    // ===============================
    // ELEMENTOS DA PÁGINA
    // ===============================
    const welcomeName = document.getElementById('welcome-name');
    const profileAvatarImg = document.getElementById('profile-avatar-img');
    const avatarInput = document.getElementById('avatar-input');
    const btnChangeAvatar = document.getElementById('btn-change-avatar');
    const btnLogoutProfile = document.getElementById('btn-logout-profile');
    
    const displayNameField = document.getElementById('display-name');
    const displayEmailField = document.getElementById('display-email');
    
    const changePasswordForm = document.getElementById('change-password-form');
    const btnSavePassword = changePasswordForm.querySelector('.btn-save-password');
    const authMessagePerfil = document.getElementById('auth-message-perfil');

    // ==========================================
    // FUNÇÃO AUXILIAR: UPLOAD PARA IMGBB
    // ==========================================
    async function uploadParaImgBB(arquivo) {
        // COLOQUE SUA CHAVE DO IMGBB ENTRE AS ASPAS ABAIXO:
        const apiKey = 'e2bcc503e9297fe0a50394fc94e6a720'; 
        
        const formData = new FormData();
        formData.append('image', arquivo);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            return data.data.url; // Retorna o link direto (ex: https://i.ibb.co/...)
        } else {
            throw new Error("Falha no upload do ImgBB");
        }
    }

    // ===============================
    // OBSERVER DE AUTENTICACAO
    // ===============================
    auth.onAuthStateChanged((user) => {
        if (user) {
            updateUI(user);
        } else {
            alert('Você precisa estar logado para acessar esta página.');
            window.location.href = 'home.html';
        }
    });

    // ===============================
    // FUNÇÕES DE UI
    // ===============================
    function updateUI(user) {
        let fullName = user.displayName || "Usuário";
        const partes = fullName.trim().split(/\s+/);
        let welcomeFullName = partes.length > 1 ? `${partes[0]} ${partes[partes.length - 1]}` : partes[0];
        
        welcomeName.textContent = `Olá, ${welcomeFullName}`;
        displayNameField.value = fullName;
        displayEmailField.value = user.email;
        
        if (user.photoURL) {
            profileAvatarImg.src = user.photoURL;
        } else {
            profileAvatarImg.src = 'img/user.png';
        }
    }
    
    function showMessagePerfil(message, type = 'error') {
        if (authMessagePerfil) {
            authMessagePerfil.textContent = message;
            authMessagePerfil.className = 'auth-message-perfil ' + type;
            authMessagePerfil.classList.remove('hidden');
            authMessagePerfil.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (type === 'success') {
                setTimeout(hideMessagePerfil, 5000);
            }
        }
    }
    
    function hideMessagePerfil() {
        authMessagePerfil?.classList.add('hidden');
    }

    // Olho da senha
    document.querySelectorAll('.toggle-password-perfil').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    btn.innerHTML = '<i class="bi bi-eye-slash-fill"></i>';
                } else {
                    input.type = 'password';
                    btn.innerHTML = '<i class="bi bi-eye-fill"></i>';
                }
            }
        });
    });

    // Logout
    btnLogoutProfile?.addEventListener('click', function() {
        btnLogoutProfile.disabled = true;
        btnLogoutProfile.textContent = 'Saindo...';
        auth.signOut().then(() => {
            window.location.href = 'home.html';
        }).catch((error) => {
            console.error('Erro ao sair:', error);
            btnLogoutProfile.disabled = false;
            btnLogoutProfile.textContent = 'Sair';
        });
    });

// ========================================== 
// FUNCIONALIDADE: MUDAR FOTO PERFIL (AVATAR)
// ==========================================
btnChangeAvatar?.addEventListener('click', () => {
    avatarInput.click();
});

avatarInput?.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const user = auth.currentUser;
    if (!user) return;

    btnChangeAvatar.disabled = true;
    const originalHTML = btnChangeAvatar.innerHTML;
    btnChangeAvatar.innerHTML = '<i class="bi bi-hourglass-split"></i> Enviando...';
    hideMessagePerfil();

    try {
        // 1. Upload
        const downloadURL = await uploadParaImgBB(file);

        // 2. Atualiza Firebase Auth
        await user.updateProfile({ photoURL: downloadURL });

        // 3. Atualiza usuário
        await user.reload();
        const updatedUser = auth.currentUser;

        // 4. Atualiza UI
        updateUI(updatedUser);

        // ✅ 5. Firestore isolado (NÃO quebra o fluxo)
        try {
            await db.collection('users').doc(user.uid).set({
                photoURL: downloadURL
            }, { merge: true });
        } catch (firestoreError) {
            console.warn('Erro no Firestore (ignorado):', firestoreError);
        }

        // 6. Sucesso REAL
        showMessagePerfil('Foto atualizada com sucesso!', 'success');

    } catch (error) {
        console.error("Erro REAL:", error);
        showMessagePerfil('Ops! Ocorreu um erro ao enviar a foto. Tente novamente.', 'error');
    } finally {
        btnChangeAvatar.disabled = false;
        btnChangeAvatar.innerHTML = originalHTML;
        avatarInput.value = '';
    }
});

    // ==========================================
    // FUNCIONALIDADE: ALTERAR SENHA
    // ==========================================
    changePasswordForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) return;
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;
        
        hideMessagePerfil();
        
        if (newPassword !== confirmNewPassword) {
            showMessagePerfil('As novas senhas não coincidem.', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            showMessagePerfil('A nova senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }
        
        btnSavePassword.disabled = true;
        btnSavePassword.textContent = 'Verificando...';
        
        try {
            const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
            await user.reauthenticateWithCredential(credential);
            await user.updatePassword(newPassword);
            
            showMessagePerfil('Senha alterada com sucesso!', 'success');
            changePasswordForm.reset(); 
        } catch (error) {
            let errorMessage = 'Erro ao alterar senha.';
            if (error.code === 'auth/wrong-password') errorMessage = 'A senha atual está incorreta.';
            showMessagePerfil(errorMessage, 'error');
        } finally {
            btnSavePassword.disabled = false;
            btnSavePassword.textContent = 'Alterar Senha';
        }
    });
});
// ============================================
// CONFIGURAÇÕES INICIAIS
// ============================================
const tocLinks = document.querySelectorAll('.toc-list a');
const articles = document.querySelectorAll('.article');
const scrollProgress = document.getElementById('scrollProgress');

// ============================================
// BARRA DE PROGRESSO DO SCROLL
// ============================================
window.addEventListener('scroll', () => {
    // Só executa se o elemento "scrollProgress" existir no seu HTML
    if (scrollProgress) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
    }
});

// ============================================
// HIGHLIGHT DO ÍNDICE (ATIVAR LINK AO ROLAR)
// ============================================
function highlightTocOnScroll() {
    let currentArticle = '';
    
    articles.forEach(article => {
        const rect = article.getBoundingClientRect();
        // Se o artigo estiver perto do topo da tela (150px)
        if (rect.top <= 150 && rect.bottom >= 150) {
            currentArticle = article.id;
        }
    });

    tocLinks.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        link.classList.toggle('active', href === currentArticle);
    });
}

window.addEventListener('scroll', highlightTocOnScroll);

// ============================================
// SMOOTH SCROLL (ROLAGEM SUAVE AO CLICAR)
// ============================================
tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').replace('#', '');
        const target = document.getElementById(targetId);
        
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Atualiza a URL sem recarregar a página
            history.pushState(null, null, `#${targetId}`);
        }
    });
});

// ============================================
// VERIFICAR HASH INICIAL (SE ENTRAR COM # NA URL)
// ============================================
function checkInitialHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        const element = document.getElementById(hash);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
        }
    }
}

window.addEventListener('load', checkInitialHash);

console.log("[v0] EducaBio: Sistema de navegação unificado carregado!");
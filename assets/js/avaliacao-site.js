
document.addEventListener('DOMContentLoaded', function () {

    // 🔹 MENU SANFONA MOBILE (Perfil Logado)
    const toggle = document.getElementById('mobile-profile-toggle');
    const menu = document.getElementById('mobile-profile-menu');
    const card = document.getElementById('mobile-user-profile');
  
    if (toggle && menu) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        menu.classList.toggle('show');
        card.classList.toggle('open');
      });
    }
  
    // 🔹 MENU MOBILE (HAMBÚRGUER)
    const btn = document.getElementById("menu-mobile-btn");
    const menuLinks = document.getElementById("menu-links");
    const overlay = document.getElementById("overlay");
  
    function toggleMenu() {
      btn?.classList.toggle("ativo");
      menuLinks?.classList.toggle("ativo");
      overlay?.classList.toggle("ativo");
      document.body.classList.toggle("menu-aberto");
    }
  
    btn?.addEventListener("click", toggleMenu);
    overlay?.addEventListener("click", toggleMenu);
  
    // Fecha o menu ao clicar em um link
    document.querySelectorAll(".menu-links a").forEach(link => {
      link.addEventListener("click", toggleMenu);
    });
  
    // Destaca a página atual
    const paginaAtual = location.pathname.split("/").pop();
    document.querySelectorAll(".menu-links a").forEach(link => {
      if (link.getAttribute("href") === paginaAtual) {
        link.classList.add("ativo");
      }
    });
 
  
    // Fechar dropdowns clicando fora
    document.addEventListener("click", function (e) {
        const userButton = document.getElementById('user-button');
        const desktopDropdown = document.getElementById('desktop-dropdown-menu');
        if (desktopDropdown && userButton && !userButton.contains(e.target) && !desktopDropdown.contains(e.target)) {
            desktopDropdown.classList.remove('show');
        }
  
        const card = document.getElementById('mobile-user-profile');
        const menu = document.getElementById('mobile-profile-menu');
        if (card && !card.contains(e.target)) {
            menu?.classList.remove('show');
            card.classList.remove('open');
        }
    });
  });

  // Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)


document.getElementById("form-sugestao").addEventListener("submit", function(e){
    e.preventDefault();

    const sugestaoInput = document.getElementById("sugestao");
    const mensagem = document.getElementById("mensagem-envio");
    const texto = sugestaoInput.value.trim();
    const botao = this.querySelector("button");

    const satisfacaoValue = localStorage.getItem("avaliacaoEducaBio");

    if (!satisfacaoValue) {

        mensagem.textContent = "Por favor, selecione sua satisfação.";
        mensagem.className = "mensagem-erro";
        mensagem.style.display = "block";

        document.querySelector('.faces-wrapper')
        .scrollIntoView({ behavior: 'smooth', block: 'center' });

        return;
    }

    if (texto === "") {
        mensagem.textContent = "Por favor, escreva sua sugestão antes de continuar.";
        mensagem.className = "mensagem-erro";
        mensagem.style.display = "block";
        sugestaoInput.focus();
        return;
    }

    botao.disabled = true;
    botao.innerHTML = "<span>Enviando...</span>";

    fetch("https://script.google.com/macros/s/AKfycbwCTe_n9UPUVV99y8t1RzQ1p-zwHGi9O79y_xkOrK8XBVINAcfRyEZaWzt0NCTMD_z3/exec", {
        method: "POST",
        body: JSON.stringify({ sugestao: texto })
    })
    .then(response => response.text())
    .then(() => {

        mensagem.textContent = "Sugestão enviada com sucesso!";
        mensagem.className = "mensagem-sucesso";
        mensagem.style.display = "block";

        this.reset();

        botao.disabled = false;
        botao.innerHTML = "<span>Enviar Sugestão</span>";

        const thankSection = document.querySelector(".thank-you-section");

        // Mostrar seção com animação
        thankSection.classList.add("show");

        // Scroll suave até ela
        thankSection.scrollIntoView({ behavior: "smooth" });
    })
    .catch(() => {
        mensagem.textContent = "Erro ao enviar. Tente novamente.";
        mensagem.className = "mensagem-erro";
        mensagem.style.display = "block";

        botao.disabled = false;
        botao.innerHTML = "<span>Enviar Sugestão</span>";
    });
});

// MANTENHA O SEU NOVO URL AQUI
const scriptURL = "https://script.google.com/macros/s/AKfycbwPOnREZ4rHpcwvnQlP9NjarPDxVMfvM6bCNODvdOOeJDw7kqG8bmoZFFeK0AhzFeVrEg/exec";

// --- LÓGICA DE CONTROLE DE VERSÃO (BOTÃO MESTRE) ---
fetch(scriptURL)
  .then(res => res.text())
  .then(versaoServidor => {
    const versaoLocal = localStorage.getItem("educaBio_versao");

    // Se o dono mudou o número na planilha, reseta o navegador do usuário
    if (versaoLocal !== versaoServidor) {
      localStorage.removeItem("avaliacaoEducaBio");
      localStorage.setItem("educaBio_versao", versaoServidor);
      location.reload(); 
    }
    
    inicializarAvaliacao(versaoServidor);
  });

function inicializarAvaliacao(versaoAtual) {
  const faces = document.querySelectorAll(".face");
  const msg = document.getElementById("avaliacao-msg");
  
  // Recupera ou cria ID do usuário
  let usuarioID = localStorage.getItem("usuarioEducaBio");
  if(!usuarioID){
    usuarioID = "user_" + Math.random().toString(36).slice(2,11);
    localStorage.setItem("usuarioEducaBio", usuarioID);
  }

  let votoSalvo = localStorage.getItem("avaliacaoEducaBio");

  // Bloqueio visual se já votou
  if(votoSalvo){
    msg.textContent = "Você já avaliou este site. Obrigado!";
    faces.forEach(face => {
      if(face.dataset.nivel === votoSalvo){
        face.classList.add("selected");
        face.parentElement.classList.add("selected");
      }
      face.style.pointerEvents = "none";
      face.style.opacity = "0.7";
    });
  }

  // Evento de clique nos emojis
  faces.forEach(face => {
    face.addEventListener("click", () => {
      if(localStorage.getItem("avaliacaoEducaBio")) return;

      const nivel = face.dataset.nivel;
      localStorage.setItem("avaliacaoEducaBio", nivel);
      
      faces.forEach(f => {
        f.classList.remove("selected");
        f.parentElement.classList.remove("selected");
      });
      face.classList.add("selected");
      face.parentElement.classList.add("selected");
      
      msg.textContent = "Obrigado pela avaliação!";

      fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify({
          usuario: usuarioID,
          satisfacao: nivel,
          versao: versaoAtual
        })
      });
    });
  });
}

function resetarTudo(){
    // Limpa os dados de voto e a versão gravada no navegador
    localStorage.removeItem("avaliacaoEducaBio");
    localStorage.removeItem("educaBio_versao");
    
    location.reload(); 
}
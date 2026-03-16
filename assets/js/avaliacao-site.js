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
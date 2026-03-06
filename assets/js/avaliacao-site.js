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

        mensagem.textContent = "Sugestão enviada com sucesso! 💚";
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


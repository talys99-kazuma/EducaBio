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

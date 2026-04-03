
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
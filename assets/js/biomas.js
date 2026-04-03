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


// CTA button interactions
document.querySelectorAll(".btn-primary, .btn-secondary").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault()

    // Create ripple effect
    const ripple = document.createElement("span")
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    ripple.style.width = ripple.style.height = size + "px"
    ripple.style.left = x + "px"
    ripple.style.top = y + "px"
    ripple.classList.add("ripple")

    button.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)

    // Add your action here
    console.log("[v0] Button clicked:", button.textContent)
  })
})

// Video play tracking
document.querySelectorAll(".video-container iframe").forEach((iframe) => {
  iframe.addEventListener("load", () => {
    console.log("[v0] Video loaded:", iframe.title)
  })
})

console.log("[v0] EducaBio página carregada com sucesso!")
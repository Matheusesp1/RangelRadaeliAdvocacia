/**
 * ================================================================
 * RANGEL RADAELI ADVOCACIA — script.js
 *
 * Módulos:
 *  1. Header — comportamento ao scroll (sombra)
 *  2. Menu Mobile — hamburguer / fechar ao clicar em link
 *  3. Navegação suave — offset pelo header fixo
 *  4. Animações — Intersection Observer (fade-in ao rolar)
 *  5. Formulário de Contato — validação + feedback
 *  6. Botão Voltar ao Topo
 *  7. Ano dinâmico no footer
 * ================================================================
 */

/* ---------------------------------------------------------------
   Espera o DOM carregar completamente antes de executar
--------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initFadeInObserver();
  initContactForm();
  initBackToTop();
  setCurrentYear();
});

/* ================================================================
   1. HEADER — Adiciona sombra ao rolar a página
================================================================ */
function initHeader() {
  var header = document.getElementById("header");
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  }

  // Executa imediatamente (caso já esteja rolado)
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ================================================================
   2. MENU MOBILE — abre/fecha e fecha ao clicar em link
================================================================ */
function initMobileMenu() {
  var btn = document.getElementById("hamburgerBtn");
  var menu = document.getElementById("mobileMenu");
  var links = document.querySelectorAll(".nav-mobile__link");

  if (!btn || !menu) return;

  // Abre / fecha ao clicar no botão hamburguer
  btn.addEventListener("click", function () {
    var isOpen = menu.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menu.setAttribute("aria-hidden", isOpen ? "false" : "true");
    animateHamburger(btn, isOpen);
  });

  // Fecha o menu ao clicar em qualquer link de navegação
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
      animateHamburger(btn, false);
    });
  });

  // Fecha o menu ao clicar fora dele
  document.addEventListener("click", function (e) {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
      animateHamburger(btn, false);
    }
  });
}

/**
 * Anima as linhas do hamburguer (X / hamburguer)
 * @param {HTMLElement} btn    - botão hamburguer
 * @param {boolean}     isOpen - true = menu aberto (mostrar X)
 */
function animateHamburger(btn, isOpen) {
  var lines = btn.querySelectorAll(".hamburger__line");
  if (lines.length < 3) return;

  if (isOpen) {
    // Transforma em X
    lines[0].style.transform = "translateY(7px) rotate(45deg)";
    lines[1].style.opacity = "0";
    lines[2].style.transform = "translateY(-7px) rotate(-45deg)";
  } else {
    // Volta ao hamburguer
    lines[0].style.transform = "";
    lines[1].style.opacity = "";
    lines[2].style.transform = "";
  }
}

/* ================================================================
   3. NAVEGAÇÃO SUAVE — offset pelo header fixo
================================================================ */
function initSmoothScroll() {
  var headerH =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--header-h"),
      10,
    ) || 72;

  // Captura todos os links âncora internos
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = link.getAttribute("href");
      if (targetId === "#") return; // ignora "#" puro

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      var targetTop =
        target.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    });
  });
}

/* ================================================================
   4. ANIMAÇÕES — Fade-in ao entrar na viewport (Intersection Observer)
================================================================ */
function initFadeInObserver() {
  // Adiciona a classe fade-in em elementos animáveis
  var targets = document.querySelectorAll(
    ".diff-card, .area-card, .stat-card, .multi-item, " +
      ".sobre__text, .sobre__stats, " +
      ".multidisciplinar__text, .multi-grid, " +
      ".contato__info, .contato__form-wrapper",
  );

  targets.forEach(function (el) {
    el.classList.add("fade-in");
  });

  // Verifica suporte ao IntersectionObserver
  if (!("IntersectionObserver" in window)) {
    // Fallback: mostra tudo imediatamente
    targets.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Para de observar após animar (melhora performance)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12, // dispara quando 12% do elemento está visível
      rootMargin: "0px 0px -40px 0px", // margem inferior para suavizar
    },
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
}
/* ================================================================
   5. 
================================================================ */

function initContactForm() { var form = document.getElementById("contactForm"); var submitBtn = document.getElementById("submitBtn"); var feedback = document.getElementById("formFeedback"); if (!form) return; 
  // Validação em tempo real ao sair de cada campo
   var fields = form.querySelectorAll(".form__input"); fields.forEach(function (field) { field.addEventListener("blur", function () { validateField(field); }); 
   // Remove estado de erro enquanto digita 
   field.addEventListener("input", function () { field.classList.remove("is-error"); var errorEl = document.getElementById(field.id + "-error"); if (errorEl) errorEl.textContent = ""; }); }); 
   // Envio do formulário 
   form.addEventListener("submit", function (e) { e.preventDefault(); 
    // Valida todos os campos obrigatórios 
    var isValid = true; fields.forEach(function (field) { if (!validateField(field)) { isValid = false; } }); if (!isValid) return; 
    // Simula envio (substitua aqui pelo seu endpoint real) 
    submitBtn.disabled = true; submitBtn.textContent = "Enviando…"; setTimeout(function () { showFeedback( feedback, "✓ Mensagem enviada! Entraremos em contato em breve.", "success", ); form.reset(); submitBtn.disabled = false; submitBtn.textContent = "Enviar Mensagem"; }, 1500); }); }
/* ================================================================
   6. BOTÃO VOLTAR AO TOPO
================================================================ */
function initBackToTop() {
  var btn = document.getElementById("backToTop");
  if (!btn) return;

  // Exibe o botão após rolar 400px
  window.addEventListener(
    "scroll",
    function () {
      if (window.scrollY > 400) {
        btn.classList.add("is-visible");
        btn.setAttribute("aria-hidden", "false");
      } else {
        btn.classList.remove("is-visible");
        btn.setAttribute("aria-hidden", "true");
      }
    },
    { passive: true },
  );

  // Rola suavemente ao topo ao clicar
  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ================================================================
   7. ANO DINÂMICO NO FOOTER
================================================================ */
function setCurrentYear() {
  var el = document.getElementById("currentYear");
  if (el) {
    el.textContent = new Date().getFullYear();
  }
}

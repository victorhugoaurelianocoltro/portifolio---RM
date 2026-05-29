/**
 * RM Engenharia Elétrica — Premium Portfolio
 * Vanilla JS — sem dependências externas
 */

(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- Preloader ---------- */
  function initPreloader() {
    const preloader = $('#preloader');
    if (!preloader) return;

    const hide = () => {
      preloader.classList.add('is-hidden');
      document.body.classList.remove('no-scroll');
    };

    document.body.classList.add('no-scroll');

    if (document.readyState === 'complete') {
      setTimeout(hide, 800);
    } else {
      window.addEventListener('load', () => setTimeout(hide, 600));
    }
    setTimeout(hide, 3500);
  }

  /* ---------- Header / Navbar dinâmica ---------- */
  function initHeader() {
    const header = $('#header');
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Menu mobile ---------- */
  function initMobileMenu() {
    const toggle = $('#navToggle');
    const nav = $('#nav');
    const overlay = $('#navOverlay');
    if (!toggle || !nav) return;

    const close = () => {
      toggle.classList.remove('is-active');
      nav.classList.remove('is-open');
      overlay?.classList.remove('is-visible');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    };

    const open = () => {
      toggle.classList.add('is-active');
      nav.classList.add('is-open');
      overlay?.classList.add('is-visible');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
    };

    toggle.addEventListener('click', () => {
      nav.classList.contains('is-open') ? close() : open();
    });

    overlay?.addEventListener('click', close);
    $$('.nav__link').forEach((link) => link.addEventListener('click', close));
  }

  /* ---------- Smooth scroll + active nav ---------- */
  function initSmoothScroll() {
    const sections = $$('section[id]');
    const links = $$('.nav__link[href^="#"]');

    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;
        const target = $(id);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });

    const setActive = () => {
      const scrollY = window.scrollY + 120;
      let current = '';
      sections.forEach((sec) => {
        if (scrollY >= sec.offsetTop) current = sec.id;
      });
      links.forEach((link) => {
        const href = link.getAttribute('href')?.slice(1);
        link.classList.toggle('is-active', href === current);
      });
    };

    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }

  /* ---------- Scroll reveal ---------- */
  function initScrollReveal() {
    const reveals = $$('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 6, 5) * 0.08}s`;
      observer.observe(el);
    });
  }

  /* ---------- Contadores animados ---------- */
  function animateCounter(el, target, suffix, duration = 2000) {
    const start = performance.now();
    const from = 0;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(from + (target - from) * eased);
      el.textContent = value + (suffix || '');
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + (suffix || '');
    };
    requestAnimationFrame(tick);
  }

  function initCounters() {
    const counters = $$('.counter-card__value');
    const heroCounters = $$('.hero__stat-num[data-count]');

    const run = (elements) => {
      elements.forEach((el) => {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.hasAttribute('data-suffix') ? el.dataset.suffix : '+';
        if (isNaN(target)) return;
        animateCounter(el, target, suffix);
      });
    };

    const section = $('#numeros');
    if (section) {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            run(counters);
            obs.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      obs.observe(section);
    }

    const hero = $('.hero');
    if (hero) {
      const obsHero = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            heroCounters.forEach((el) => {
              const target = parseInt(el.dataset.count, 10);
              if (!isNaN(target)) animateCounter(el, target, '+', 1800);
            });
            obsHero.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      obsHero.observe(hero);
    }
  }

  /* ---------- Slider infinito de clientes ---------- */
  function initClientsSlider() {
    const track = $('#clientsTrack');
    if (!track) return;

    const clone = track.innerHTML;
    track.innerHTML = clone + clone;
  }

  /* ---------- Modal de projetos ---------- */
  function initProjectModal() {
    const modal = $('#projectModal');
    const cards = $$('.project-card');
    if (!modal || !cards.length) return;

    const modalImg = $('#modalImg');
    const modalTitle = $('#modalTitle');
    const modalCat = $('#modalCat');
    const modalDesc = $('#modalDesc');

    const openModal = (card) => {
      modalImg.src = card.dataset.img || '';
      modalImg.alt = card.dataset.title || '';
      modalTitle.textContent = card.dataset.title || '';
      modalCat.textContent = card.dataset.category || '';
      modalDesc.textContent = card.dataset.desc || '';
      modal.removeAttribute('hidden');
      modal.classList.add('is-open');
      document.body.classList.add('no-scroll');
    };

    const closeModal = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('hidden', '');
      document.body.classList.remove('no-scroll');
    };

    cards.forEach((card) => {
      card.addEventListener('click', () => openModal(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(card);
        }
      });
    });

    $$('[data-close]', modal).forEach((el) => el.addEventListener('click', closeModal));
    $$('[data-close-modal]', modal).forEach((el) =>
      el.addEventListener('click', () => {
        closeModal();
      })
    );

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  /* ---------- Parallax ---------- */
  function initParallax() {
    const layers = $$('[data-parallax]');
    if (!layers.length) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        layers.forEach((el) => {
          const speed = parseFloat(el.dataset.parallax) || 0.2;
          const offset = scrollY * speed;
          el.style.transform = `translate3d(0, ${offset}px, 0)`;
        });
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Partículas (Hero) ---------- */
  function initParticles() {
    const canvas = $('#particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;
    let animationId;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };

    const createParticles = (count) => {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.5 + 0.3,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${p.opacity})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.08 * (1 - dist / 100)})`;
            ctx.stroke();
          }
        }
      });
      animationId = requestAnimationFrame(draw);
    };

    resize();
    createParticles(Math.min(60, Math.floor((w * h) / 15000)));
    draw();

    window.addEventListener('resize', () => {
      resize();
      createParticles(Math.min(60, Math.floor((w * h) / 15000)));
    });

    return () => cancelAnimationFrame(animationId);
  }

  /* ---------- Ano no footer ---------- */
  function initYear() {
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Init ---------- */
  function init() {
    initPreloader();
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initCounters();
    initClientsSlider();
    initProjectModal();
    initParallax();
    initParticles();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

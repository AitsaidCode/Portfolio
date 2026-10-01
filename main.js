/**
 * devsurmesure - Core Runtime Engine
 * Single-page controller: Adaptive navigation observer, form validation guard clauses,
 * Supabase BaaS persistence, and direct communication bridges.
 */

// Supabase Configuration (publishable key: insert-only access enforced by RLS)
const SUPABASE_URL = 'https://zhzxsrjctdpntbqtsdts.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_vxUopPhT9Uq-rMvlyEp8Cw_W9oduodz';
const WHATSAPP_PHONE_NUMBER = '33758018720';
const CONTACT_EMAIL = 'contact98hicham@gmail.com';

// 1. Safe Supabase Initialization with Guard Clauses
let supabaseClient = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY && typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (initError) {
    console.warn('Supabase initialization failed, running in fallback mode:', initError);
    supabaseClient = null;
  }
}

// 2. Email Validation Guard Clause
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const sanitized = email.trim();
  if (sanitized.length === 0 || sanitized.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(sanitized);
}

// 3. String Sanitization Guard
function sanitizeInput(value) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/[<>]/g, '');
}

// 4. WhatsApp Message Builder
function buildWhatsAppText({ name, email, phone, type, message }) {
  return (
    `Bonjour Hicham,\n\n` +
    `Je vous contacte depuis votre portfolio :\n` +
    `• Nom : ${name}\n` +
    `• Email : ${email}\n` +
    `• Téléphone : ${phone.length > 0 ? phone : 'Non renseigné'}\n` +
    `• Besoin : ${type}\n\n` +
    `Détails de ma demande :\n${message}`
  );
}

// 5. Main Event Controller (browser only)
if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', () => {
  const navPill = document.getElementById('nav-pill');
  const darkSections = document.querySelectorAll('.dark-background');
  const form = document.getElementById('portfolio-form');
  const notice = document.getElementById('form-notice');
  const submitBtn = document.getElementById('btn-submit-main');

  // 4.1. High-Performance Adaptive Nav Pill Observer
  let ticking = false;
  function evaluateNavTheme() {
    if (!navPill) {
      ticking = false;
      return;
    }

    const navRect = navPill.getBoundingClientRect();
    const navCenterY = navRect.top + navRect.height / 2;

    let isOverDark = false;
    for (let i = 0; i < darkSections.length; i++) {
      const sectionRect = darkSections[i].getBoundingClientRect();
      if (sectionRect.top <= navCenterY && sectionRect.bottom >= navCenterY) {
        isOverDark = true;
        break;
      }
    }

    if (isOverDark) {
      navPill.classList.add('theme-dark-nav');
    } else {
      navPill.classList.remove('theme-dark-nav');
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(evaluateNavTheme);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  evaluateNavTheme();

  // 4.2. Mobile Menu Sheet
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    const setMenuOpen = (open) => {
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      mobileMenu.hidden = !open;
      document.body.classList.toggle('menu-open', open);
    };
    menuBtn.addEventListener('click', () => setMenuOpen(mobileMenu.hidden));
    mobileMenu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenuOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || mobileMenu.hidden) return;
      setMenuOpen(false);
      menuBtn.focus();
    });
    window.matchMedia('(min-width: 821px)').addEventListener('change', (mq) => {
      if (mq.matches) setMenuOpen(false);
    });
  }

  // 4.3. Scrollspy: highlight the nav link of the section in view
  const navLinks = document.querySelectorAll('.nav-links .nav-item[href^="#"]');
  if (navLinks.length > 0 && 'IntersectionObserver' in window) {
    const linkById = new Map();
    navLinks.forEach((link) => linkById.set(link.getAttribute('href').slice(1), link));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = linkById.get(entry.target.id);
        if (!link) return;
        link.classList.toggle('is-active', entry.isIntersecting);
        if (entry.isIntersecting) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    linkById.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  // 4.4. Scroll Reveal (skipped when the user prefers reduced motion)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.section-title-wrap, .work-card, .bento-tile, .pricing-card, .bio-main-text, .bio-sidebar-card, .faq-item, .contact-box-surinder'
    );
    document.documentElement.classList.add('js-reveal');
    const revealer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealTargets.forEach((el) => {
      const siblings = el.parentElement ? Array.from(el.parentElement.children).filter((c) => c.matches('.bento-tile, .pricing-card, .faq-item')) : [];
      const index = siblings.indexOf(el);
      if (index > 0) el.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 0.08}s`);
      el.classList.add('reveal');
      revealer.observe(el);
    });
  }

  // 4.5. Contact Form Submission Engine with Strict Guard Clauses
  if (!form || !notice || !submitBtn) {
    return;
  }

  function setFieldError(input, message) {
    if (!input) return;
    const errorSlot = document.getElementById(`${input.id}-error`);
    if (message) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
    if (errorSlot) errorSlot.textContent = message;
  }

  form.addEventListener('input', (event) => {
    if (event.target.getAttribute('aria-invalid') === 'true') setFieldError(event.target, '');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('f-name');
    const emailInput = document.getElementById('f-email');
    const phoneInput = document.getElementById('f-phone');
    const typeSelect = document.getElementById('f-type');
    const messageInput = document.getElementById('f-message');

    if (!nameInput || !emailInput || !typeSelect || !messageInput) {
      notice.textContent = 'Erreur technique interne du formulaire.';
      notice.className = 'form-notice error';
      return;
    }

    const name = sanitizeInput(nameInput.value);
    const email = sanitizeInput(emailInput.value);
    const phone = phoneInput ? sanitizeInput(phoneInput.value) : '';
    const type = sanitizeInput(typeSelect.value);
    const message = sanitizeInput(messageInput.value);

    // Guard Clause: validate every field, report all errors at once, focus the first
    const fieldErrors = [
      [nameInput, name.length < 2 ? 'Indiquez votre nom (au moins 2 caractères).' : ''],
      [emailInput, !isValidEmail(email) ? 'Adresse email invalide (ex. nom@domaine.fr).' : ''],
      [messageInput, message.length < 10 ? 'Décrivez votre besoin en quelques mots (au moins 10 caractères).' : '']
    ];
    fieldErrors.forEach(([input, error]) => setFieldError(input, error));

    const invalidFields = fieldErrors.filter(([, error]) => error);
    if (invalidFields.length > 0) {
      notice.textContent = invalidFields.length === 1
        ? 'Merci de corriger le champ indiqué.'
        : `Merci de corriger les ${invalidFields.length} champs indiqués.`;
      notice.className = 'form-notice error';
      invalidFields[0][0].focus();
      return;
    }

    // Step 1: Open WhatsApp synchronously, inside the submit gesture, so popup blockers allow it
    const waUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(buildWhatsAppText({ name, email, phone, type, message }))}`;
    const waWindow = window.open(waUrl, '_blank');
    if (waWindow) {
      try {
        waWindow.opener = null;
      } catch (openerError) {
        console.warn('Unable to detach WhatsApp window opener:', openerError);
      }
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Enregistrement...</span> <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>`;
    notice.textContent = 'Enregistrement de votre demande en cours...';
    notice.className = 'form-notice';

    // Step 2: Remote Persistence via Supabase BaaS
    let persistenceSuccessful = false;
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient.from('contact_submissions').insert([
          {
            name: name,
            email: email,
            phone: phone.length > 0 ? phone : null,
            need: type,
            message: message
          }
        ]);
        if (!error) {
          persistenceSuccessful = true;
        } else {
          console.warn('Supabase DB error notice:', error);
        }
      } catch (networkError) {
        console.warn('Network exception during Supabase dispatch:', networkError);
      }
    }

    form.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span>Envoyer ma demande</span> <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>`;
    notice.className = 'form-notice success';

    // Guard: popup blocked → navigate the current tab to WhatsApp as a fallback
    if (!waWindow) {
      notice.textContent = 'Redirection vers WhatsApp pour envoyer votre message...';
      window.location.href = waUrl;
      return;
    }

    notice.textContent = persistenceSuccessful
      ? `Demande enregistrée ! Finalisez l'envoi dans WhatsApp, ou écrivez-moi à ${CONTACT_EMAIL}.`
      : `Finalisez l'envoi dans WhatsApp, ou écrivez-moi directement à ${CONTACT_EMAIL}.`;
  });
});

// 6. Node export for the test suite
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { isValidEmail, sanitizeInput, buildWhatsAppText };
}

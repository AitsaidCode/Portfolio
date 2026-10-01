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

  // 4.2. Contact Form Submission Engine with Strict Guard Clauses
  if (!form || !notice || !submitBtn) {
    return;
  }

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

    // Guard Clause 1: Name validation
    if (name.length < 2) {
      notice.textContent = 'Veuillez saisir un nom valide (au moins 2 caractères).';
      notice.className = 'form-notice error';
      nameInput.focus();
      return;
    }

    // Guard Clause 2: Email validation
    if (!isValidEmail(email)) {
      notice.textContent = 'Veuillez saisir une adresse email valide.';
      notice.className = 'form-notice error';
      emailInput.focus();
      return;
    }

    // Guard Clause 3: Message validation
    if (message.length < 10) {
      notice.textContent = 'Veuillez décrire votre besoin avec un peu plus de détails (au moins 10 caractères).';
      notice.className = 'form-notice error';
      messageInput.focus();
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
    submitBtn.innerHTML = `<span>Enregistrement...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
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
    submitBtn.innerHTML = `<span>Envoyer ma demande</span> <i class="fa-solid fa-arrow-right"></i>`;
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

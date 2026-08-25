/**
 * devsurmesure - Core Runtime Engine
 * Single-page controller: Adaptive navigation observer, form validation guard clauses,
 * Supabase BaaS persistence, and direct communication bridges.
 */

// Supabase Configuration
const SUPABASE_URL = 'https://kruvhmwqolckwyoetmfq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydXZobXdxb2xja3d5b2V0bWZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNzg2NjAsImV4cCI6MjA1NTc1NDY2MH0.U8k8zK8sT_U8o59x-s6i_T8eZkE8d7f8d6s_d8s7f8s';
const WHATSAPP_PHONE_NUMBER = '33758018720';
const CONTACT_EMAIL = 'contact98hicham@gmail.com';

// 1. Safe Supabase Initialization with Guard Clauses
let supabaseClient = null;
if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
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

// 4. Main Event Controller
document.addEventListener('DOMContentLoaded', () => {
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

    // UI Feedback: Submission in progress
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Enregistrement...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
    notice.textContent = 'Enregistrement de votre demande en cours...';
    notice.className = 'form-notice';

    // Step 1: Remote Persistence via Supabase BaaS
    let persistenceSuccessful = false;
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient.from('contact_submissions').insert([
          {
            name: name,
            email: email,
            phone: phone.length > 0 ? phone : null,
            need: type,
            message: message,
            created_at: new Date().toISOString()
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

    // Step 2: Build URL-encoded WhatsApp Dispatch Payload
    const waText = encodeURIComponent(
      `Bonjour Hicham,\n\n` +
      `Je vous contacte depuis votre portfolio :\n` +
      `• Nom : ${name}\n` +
      `• Email : ${email}\n` +
      `• Téléphone : ${phone.length > 0 ? phone : 'Non renseigné'}\n` +
      `• Besoin : ${type}\n\n` +
      `Détails de ma demande :\n${message}`
    );

    notice.textContent = persistenceSuccessful 
      ? 'Demande enregistrée avec succès ! Redirection WhatsApp...' 
      : 'Redirection vers WhatsApp pour envoyer votre message...';
    notice.className = 'form-notice success';

    // Step 3: Dispatch WhatsApp Intent & Reset Form
    setTimeout(() => {
      window.open(`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${waText}`, '_blank');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Envoyer ma demande</span> <i class="fa-solid fa-arrow-right"></i>`;
      notice.textContent = `Message transmis ! Vous pouvez également me joindre directement à ${CONTACT_EMAIL}.`;
    }, 600);
  });
});

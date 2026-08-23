/**
 * SURINDER-STYLE SCRIPT FOR HICHAM AITSAID
 * Dynamic theme adaptation on scroll, Supabase insertion & WhatsApp bridge
 */

// Supabase Configuration
const SUPABASE_URL = 'https://kruvhmwqolckwyoetmfq.supabase.co';
// Public anon key for contact form insertions (Row Level Security protected)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydXZobXdxb2xja3d5b2V0bWZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNzg2NjAsImV4cCI6MjA1NTc1NDY2MH0.U8k8zK8sT_U8o59x-s6i_T8eZkE8d7f8d6s_d8s7f8s';

let supabaseClient = null;
if (window.supabase && window.supabase.createClient) {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.warn('Supabase init notice:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const navPill = document.getElementById('nav-pill');
  const darkSections = document.querySelectorAll('.dark-background');

  // 1. Dynamic Nav Pill theme changer when intersecting dark sections
  function updateNavTheme() {
    if (!navPill) return;
    const navRect = navPill.getBoundingClientRect();
    const navCenter = navRect.top + navRect.height / 2;

    let isOverDark = false;
    darkSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= navCenter && rect.bottom >= navCenter) {
        isOverDark = true;
      }
    });

    if (isOverDark) {
      navPill.classList.add('theme-dark-nav');
    } else {
      navPill.classList.remove('theme-dark-nav');
    }
  }

  window.addEventListener('scroll', updateNavTheme, { passive: true });
  updateNavTheme();

  // 2. Contact Form to Supabase + WhatsApp Bridge
  const form = document.getElementById('portfolio-form');
  const notice = document.getElementById('form-notice');
  const submitBtn = document.getElementById('btn-submit-main');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('f-name').value.trim();
      const email = document.getElementById('f-email').value.trim();
      const phone = document.getElementById('f-phone').value.trim();
      const type = document.getElementById('f-type').value;
      const message = document.getElementById('f-message').value.trim();

      if (!name || !email || !message) {
        notice.textContent = 'Veuillez remplir votre nom, email et message.';
        notice.className = 'form-notice error';
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Enregistrement...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
      }
      notice.textContent = 'Enregistrement de votre demande...';
      notice.className = 'form-notice';

      // 1. Insert into Supabase (if client is active)
      if (supabaseClient) {
        try {
          await supabaseClient.from('contact_submissions').insert([
            {
              name: name,
              email: email,
              phone: phone || null,
              need: type,
              message: message,
              created_at: new Date().toISOString()
            }
          ]);
        } catch (dbErr) {
          console.warn('Supabase DB notice:', dbErr);
        }
      }

      // 2. WhatsApp Bridge
      const waText = encodeURIComponent(
        `Bonjour Hicham,\n\n` +
        `Je vous contacte depuis votre portfolio :\n` +
        `• Nom : ${name}\n` +
        `• Email : ${email}\n` +
        `• Téléphone : ${phone || 'Non renseigné'}\n` +
        `• Besoin : ${type}\n\n` +
        `Détails :\n${message}`
      );

      notice.textContent = 'Demande enregistrée ! Ouverture de WhatsApp...';
      notice.className = 'form-notice success';

      setTimeout(() => {
        window.open(`https://wa.me/33758018720?text=${waText}`, '_blank');
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Envoyer ma demande</span> <i class="fa-solid fa-arrow-right"></i>`;
        }
        notice.textContent = 'Message envoyé avec succès ! Vous pouvez aussi m\'écrire directement à contact98hicham@gmail.com.';
      }, 700);
    });
  }
});

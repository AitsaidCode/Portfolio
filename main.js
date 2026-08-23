/**
 * SURINDER-STYLE SCRIPT FOR HICHAM AITSAID
 * Dynamic theme adaptation on scroll & WhatsApp bridge
 */

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

  // 2. Contact Form to WhatsApp / Email Bridge
  const form = document.getElementById('portfolio-form');
  const notice = document.getElementById('form-notice');

  if (form) {
    form.addEventListener('submit', (e) => {
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

      const waText = encodeURIComponent(
        `Bonjour Hicham,\n\n` +
        `Je vous contacte depuis votre portfolio :\n` +
        `• Nom : ${name}\n` +
        `• Email : ${email}\n` +
        `• Téléphone : ${phone || 'Non renseigné'}\n` +
        `• Besoin : ${type}\n\n` +
        `Détails :\n${message}`
      );

      notice.textContent = 'Ouverture de votre messagerie WhatsApp...';
      notice.className = 'form-notice success';

      setTimeout(() => {
        window.open(`https://wa.me/33758018720?text=${waText}`, '_blank');
        form.reset();
        notice.textContent = 'Demande envoyée ! Vous pouvez aussi me contacter directement à contact98hicham@gmail.com.';
      }, 600);
    });
  }
});

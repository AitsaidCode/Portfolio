/**
 * PORTFOLIO - HICHAM AITSAID
 * Awwwards-style Interactions & WhatsApp Bridge
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Overlay Toggle
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (menuToggleBtn && mobileOverlay) {
    menuToggleBtn.addEventListener('click', () => {
      mobileOverlay.classList.toggle('active');
      const isOpen = mobileOverlay.classList.contains('active');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // 2. Header blur enhancement on scroll
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.background = 'rgba(10, 12, 16, 0.92)';
      header.style.padding = '14px 32px';
    } else {
      header.style.background = 'rgba(10, 12, 16, 0.75)';
      header.style.padding = '20px 32px';
    }
  });

  // 3. Contact Form Submission (Direct WhatsApp Bridge)
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const type = document.getElementById('form-type').value;
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = 'Veuillez renseigner votre nom, email et message.';
        formStatus.className = 'form-status error';
        return;
      }

      const waText = encodeURIComponent(
        `Bonjour Hicham,\n\n` +
        `Je vous contacte via votre portfolio :\n` +
        `• Nom : ${name}\n` +
        `• Email : ${email}\n` +
        `• Téléphone : ${phone || 'Non renseigné'}\n` +
        `• Domaine : ${type}\n\n` +
        `Message :\n${message}`
      );

      formStatus.textContent = 'Ouverture de WhatsApp...';
      formStatus.className = 'form-status success';

      setTimeout(() => {
        window.open(`https://wa.me/33758018720?text=${waText}`, '_blank');
        contactForm.reset();
        formStatus.textContent = 'Message prêt sur WhatsApp ! Vous pouvez aussi m\'écrire à contact98hicham@gmail.com.';
      }, 700);
    });
  }
});

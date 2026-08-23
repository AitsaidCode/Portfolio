/**
 * PORTFOLIO - HICHAM AITSAID
 * Interactions & Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerItems = document.querySelectorAll('.drawer-item');

  function toggleDrawer() {
    mobileDrawer.classList.toggle('open');
    document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', toggleDrawer);

  drawerItems.forEach(item => {
    item.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // 2. Navbar Scroll Glassmorphism effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.background = 'rgba(10, 15, 29, 0.88)';
      navbar.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.7)';
    } else {
      navbar.style.background = 'rgba(15, 23, 42, 0.65)';
      navbar.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.5)';
    }
  });

  // 3. Contact Form Submission (WhatsApp & Email Direct Bridge)
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const projectType = document.getElementById('form-type').value;
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        formFeedback.textContent = 'Veuillez remplir tous les champs obligatoires (*).';
        formFeedback.className = 'form-feedback error';
        return;
      }

      // Format WhatsApp Message
      const waText = encodeURIComponent(
        `Bonjour Hicham,\n\nJe vous contacte depuis votre portfolio :\n` +
        `👤 *Nom :* ${name}\n` +
        `✉️ *Email :* ${email}\n` +
        `📞 *Tél :* ${phone || 'Non renseigné'}\n` +
        `📂 *Projet :* ${projectType}\n` +
        `📝 *Message :*\n${message}`
      );

      formFeedback.textContent = 'Redirection vers WhatsApp pour envoyer votre message...';
      formFeedback.className = 'form-feedback success';

      setTimeout(() => {
        window.open(`https://wa.me/33758018720?text=${waText}`, '_blank');
        contactForm.reset();
        formFeedback.textContent = 'Votre demande est prête ! Si WhatsApp ne s\'ouvre pas, contactez-moi directement à contact98hicham@gmail.com.';
      }, 1000);
    });
  }
});

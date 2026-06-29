// supportpage.js — Support Page

document.addEventListener('DOMContentLoaded', () => {

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      document.querySelectorAll('.faq-question').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        const a = b.nextElementSibling;
        if (a) a.classList.remove('open');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        if (answer) answer.classList.add('open');
      }
    });
  });

  // --- Contact Form ---
  const form = document.getElementById('supportForm');
  const msg  = document.getElementById('supportFormMsg');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name    = document.getElementById('supportName').value.trim();
      const email   = document.getElementById('supportEmail').value.trim();
      const subject = document.getElementById('supportSubject').value;
      const message = document.getElementById('supportMessage').value.trim();

      if (!name || !email || !subject || !message) {
        if (msg) { msg.textContent = 'Please fill in all fields.'; msg.style.color = '#dc2626'; }
        return;
      }

      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(email)) {
        if (msg) { msg.textContent = 'Please enter a valid email address.'; msg.style.color = '#dc2626'; }
        return;
      }

      if (msg) { msg.textContent = '✓ Message sent! We\'ll get back to you within 24 hours.'; msg.style.color = '#16a34a'; }
      form.reset();
    });
  }
});
// Mobile navigation
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#site-nav');

function setNav(open) {
  toggle.setAttribute('aria-expanded', String(open));
  if (open) {
    nav.setAttribute('data-open', '');
  } else {
    nav.removeAttribute('data-open');
  }
}

toggle.addEventListener('click', () => {
  setNav(toggle.getAttribute('aria-expanded') !== 'true');
});

nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) setNav(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setNav(false);
});

window.addEventListener('resize', () => {
  if (window.matchMedia('(min-width: 768px)').matches) setNav(false);
});

// Callback request
const form = document.querySelector('#callback-form');
const note = document.querySelector('#form-note');

// Callback request opens WhatsApp with the details prefilled.
// PLACEHOLDER: replace with the clinic's real WhatsApp number (international, no +).
const WHATSAPP_NUMBER = '201000000000';

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = form.querySelector('#name').value.trim();
  const phone = form.querySelector('#phone').value.trim();
  const service = form.querySelector('#service').value;
  const message =
    'Hello Bright Smile Dental. My name is ' + name +
    '. My phone is ' + phone +
    '. I need: ' + service + '.';
  const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);

  window.open(url, '_blank', 'noopener');

  form.hidden = true;
  note.textContent = 'WhatsApp should open with your details ready to send. If it did not open, ';
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'open WhatsApp here';
  note.append(link, '.');
  note.hidden = false;
  note.focus();
});

// Footer year
document.querySelector('[data-year]').textContent = new Date().getFullYear();

// Scroll reveal — hand-rolled IntersectionObserver, no animation library.
// The .motion class (set inline in <head>) is absent when JavaScript is off
// or the visitor prefers reduced motion; then everything shows at once.
const revealTargets = document.querySelectorAll('[data-reveal]');
const motionOn = document.documentElement.classList.contains('motion');

if (!motionOn || !('IntersectionObserver' in window)) {
  revealTargets.forEach((el) => el.classList.add('is-revealed'));
} else {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach((el) => observer.observe(el));
}

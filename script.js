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

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = form.querySelector('#name').value.trim();
  form.hidden = true;
  note.textContent = 'Thanks, ' + name + '. We call you back within one working day to fix a time.';
  note.hidden = false;
  note.focus();
});

// Footer year
document.querySelector('[data-year]').textContent = new Date().getFullYear();

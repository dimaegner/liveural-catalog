const slides = [...document.querySelectorAll('.slide')];
const rail = document.querySelector('#rail');
const current = document.querySelector('#current');
const progress = document.querySelector('#progress');
const chrome = document.querySelector('.chrome');
const controls = document.querySelector('.controls');
let active = 0;

rail.innerHTML = slides.map((slide, i) =>
  `<a href="#${slide.id}" aria-label="${String(i + 1).padStart(2, '0')} — ${slide.dataset.name}"${i === 0 ? ' aria-current="true"' : ''}></a>`
).join('');
const dots = [...rail.querySelectorAll('a')];

function setActive(index) {
  active = Math.max(0, Math.min(slides.length - 1, index));
  current.textContent = String(active + 1).padStart(2, '0');
  chrome.setAttribute('aria-valuenow', String(active + 1));
  progress.style.width = `${((active + 1) / slides.length) * 100}%`;
  dots.forEach((dot, i) => {
    if (i === active) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
  const dark = slides[active].classList.contains('blue') || slides[active].classList.contains('slide--cta');
  chrome.classList.toggle('is-dark', dark);
  rail.classList.toggle('is-dark', dark);
  controls.classList.toggle('is-dark', dark);
}

const observer = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) setActive(slides.indexOf(visible.target));
}, { threshold: [0.35, 0.55, 0.75] });
slides.forEach((slide) => observer.observe(slide));

function goTo(index) {
  const target = Math.max(0, Math.min(slides.length - 1, index));
  slides[target].scrollIntoView({ behavior: 'smooth', block: 'start' });
  setActive(target);
}
document.querySelector('#prev').addEventListener('click', () => goTo(active - 1));
document.querySelector('#next').addEventListener('click', () => goTo(active + 1));
document.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
  if (['ArrowDown', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); goTo(active + 1); }
  if (['ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); goTo(active - 1); }
  if (event.key === 'Home') { event.preventDefault(); goTo(0); }
  if (event.key === 'End') { event.preventDefault(); goTo(slides.length - 1); }
});

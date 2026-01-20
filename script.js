// Small, purposeful JS only.
// 1) Scroll reveal (respects reduced motion)
// 2) Contact form preview (no network request)

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupReveal(){
  const targets = document.querySelectorAll('.section, .card, .tile, .mini, .art, .intro');
  targets.forEach(el => el.classList.add('reveal'));

  if (prefersReduced){
    targets.forEach(el => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('is-in');
    });
  }, { threshold: 0.12 });

  targets.forEach(el => io.observe(el));
}

function setupForm(){
  const form = document.getElementById('contactForm');
  const hint = document.getElementById('formHint');
  if (!form || !hint) return;

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const msg = String(data.get('msg') || '').trim();

    if (!name || !msg){
      hint.textContent = '이름과 메시지를 채워주세요.';
      return;
    }
    hint.textContent = `미리보기: “${name}”님, 메시지 길이 ${msg.length}자`;
  });
}

function setupHeroParallax(){
  if (prefersReduced) return;
  const shapes = document.querySelectorAll('.shape, .checker');
  if (!shapes.length) return;

  let raf = null;
  window.addEventListener('pointermove', (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      shapes.forEach((el, i) => {
        const k = (i + 1) * 6;
        el.style.transform = `${el.dataset.base || ''} translate(${x * k}px, ${y * k}px)`;
      });
    });
  }, { passive: true });

  // save each element's base transform (defined by CSS)
  shapes.forEach(el => {
    const t = getComputedStyle(el).transform;
    // Keep rotate(...) from CSS if any, by storing in dataset as a string approximation
    // If computed matrix exists, we don't want to recompose; use a simple pattern:
    // Set a CSS variable instead for robustness.
    el.style.setProperty('--dx', '0px');
    el.style.setProperty('--dy', '0px');
  });
}

// Init
setupReveal();
setupForm();
setupHeroParallax();

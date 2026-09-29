(() => {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 20);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  document.querySelectorAll('[data-board]').forEach((board) => {
    for (let square = 0; square < 64; square += 1) {
      const cell = document.createElement('i');
      const row = Math.floor(square / 8);
      const column = square % 8;
      if ((row + column) % 2 === 0) cell.style.background = '#17243d';
      board.append(cell);
    }
  });

  const closeMenu = () => {
    if (!toggle || !mobileMenu) return;
    toggle.setAttribute('aria-expanded', 'false');
    mobileMenu.hidden = true;
    document.body.classList.remove('menu-open');
  };

  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    mobileMenu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  });
  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

  const regionButtons = document.querySelectorAll('[data-region]');
  const pricePanels = document.querySelectorAll('[data-price-panel]');
  regionButtons.forEach((button) => button.addEventListener('click', () => {
    const region = button.dataset.region;
    regionButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    pricePanels.forEach((panel) => { panel.hidden = panel.dataset.pricePanel !== region; });
  }));

  const form = document.querySelector('#lead-form');
  const status = document.querySelector('[data-form-status]');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = form.querySelector('button[type="submit"]');
    const originalText = submit.innerHTML;
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.rating ||= 'Not specified';
    submit.disabled = true;
    submit.textContent = 'Sending…';
    status.textContent = '';
    status.className = 'form-status';
    try {
      await fetch(form.dataset.leadEndpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
      form.reset();
      status.textContent = "Thanks — we’ll be in touch shortly.";
      status.classList.add('success');
    } catch {
      status.textContent = 'We could not send that just now. Please try again.';
      status.classList.add('error');
    } finally {
      submit.disabled = false;
      submit.innerHTML = originalText;
    }
  });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();


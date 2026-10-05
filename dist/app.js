(() => {
  'use strict';
  const site = window.WILSON_SITE;
  const motionAllowed = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('motion-ready');
  const whatsappUrl = message => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
  document.querySelectorAll('[data-contact]').forEach(link => { link.href = whatsappUrl(site.generalMessage); });
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  };
  const catalog = document.getElementById('catalog');
  site.products.forEach(product => {
    const article = make('article', 'product-card');
    const gallery = make('div', 'product-gallery');
    const image = make('img', 'product-image');
    image.src = product.images[0];
    image.alt = product.imageAlts?.[0] || product.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = 720;
    image.height = 960;
    gallery.append(image);
    if (product.images.length > 1) {
      let current = 0;
      const indicator = make('span', 'gallery-indicator', `1 / ${product.images.length}`);
      indicator.setAttribute('aria-live', 'polite');
      const change = offset => {
        current = (current + offset + product.images.length) % product.images.length;
        image.onload = () => {
          if (motionAllowed() && typeof image.animate === 'function') {
            image.animate([{ opacity: 0.35, transform: 'scale(1.015)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 320, easing: 'ease-out' });
          }
        };
        image.src = product.images[current];
        image.alt = `${product.imageAlts?.[current] || product.alt}. Foto ${current + 1} de ${product.images.length}.`;
        indicator.textContent = `${current + 1} / ${product.images.length}`;
      };
      for (const [direction, offset, points] of [['prev', -1, '14 5 7 12 14 19'], ['next', 1, '10 5 17 12 10 19']]) {
        const control = make('button', `gallery-button gallery-${direction}`);
        control.type = 'button';
        control.setAttribute('aria-label', `${offset < 0 ? 'Foto anterior' : 'Próxima foto'} de ${product.name}`);
        control.innerHTML = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><polyline points="${points}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        control.addEventListener('click', () => change(offset));
        gallery.append(control);
      }
      gallery.append(indicator);
    }
    const copy = make('div', 'product-copy');
    copy.append(make('h3', '', product.name), make('p', 'product-description', product.description));
    if (product.details) {
      const details = make('details');
      details.append(make('summary', '', 'Detalhes da mesa'), make('p', '', product.details));
      copy.append(details);
    }
    const contact = make('a', 'button product-cta', 'Consultar esta mesa');
    contact.href = whatsappUrl(`Olá, Wilson! Vi a mesa ${product.name} no seu site e gostaria de saber o preço e as condições.`);
    contact.target = '_blank';
    contact.rel = 'noopener noreferrer';
    contact.setAttribute('aria-label', `Consultar a mesa ${product.name} no WhatsApp`);
    copy.append(contact);
    article.append(gallery, copy);
    catalog.append(article);
  });
  if (site.hero || site.products.length) {
    const hero = document.getElementById('hero-image');
    const visual = site.hero || site.products[0];
    hero.src = visual.image || visual.heroImage || visual.images[0];
    hero.alt = visual.alt;
  }
  const header = document.querySelector('.site-header');
  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
})();

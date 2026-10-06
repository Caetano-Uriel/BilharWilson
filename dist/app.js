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
    let image = make('img', 'product-image');
    image.src = product.images[0];
    image.alt = product.imageAlts?.[0] || product.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = 720;
    image.height = 960;
    gallery.append(image);
    gallery.setAttribute('role', 'group');
    gallery.setAttribute('aria-label', `Fotos de ${product.name}`);
    const message = make('p', 'gallery-message');
    message.setAttribute('role', 'status');
    gallery.append(message);
    image.addEventListener('error', () => { message.textContent = 'Foto indisponível. Consulte os detalhes com Wilson.'; }, { once: true });
    if (product.images.length > 1) {
      let current = 0;
      let requested = 0;
      let requestId = 0;
      let incomingAnimation;
      let outgoingAnimation;
      let outgoingImage;
      const indicator = make('span', 'gallery-indicator', `1 / ${product.images.length}`);
      indicator.setAttribute('aria-live', 'polite');
      const change = offset => {
        requested = (requested + offset + product.images.length) % product.images.length;
        const target = requested;
        const id = ++requestId;
        gallery.setAttribute('aria-busy', 'true');
        message.textContent = 'Carregando foto…';
        const next = make('img', 'product-image');
        next.width = 720;
        next.height = 960;
        next.decoding = 'async';
        next.alt = `${product.imageAlts?.[target] || product.alt}. Foto ${target + 1} de ${product.images.length}.`;
        const fail = () => {
          if (id !== requestId) return;
          requested = current;
          gallery.removeAttribute('aria-busy');
          message.textContent = 'Não foi possível carregar esta foto. Tente novamente pelas setas.';
        };
        next.onerror = fail;
        next.onload = async () => {
          // Decode before replacing the visible photo, including when the next image is cached.
          try { await next.decode(); } catch { fail(); return; }
          if (id !== requestId) return;
          incomingAnimation?.cancel();
          outgoingAnimation?.cancel();
          outgoingImage?.remove();
          const previous = image;
          image = next;
          current = target;
          gallery.insertBefore(next, previous);
          previous.classList.add('gallery-outgoing');
          previous.setAttribute('aria-hidden', 'true');
          outgoingImage = previous;
          indicator.textContent = `${current + 1} / ${product.images.length}`;
          gallery.removeAttribute('aria-busy');
          message.textContent = '';
          if (typeof next.animate !== 'function') { previous.remove(); return; }
          const reduced = !motionAllowed();
          const distance = offset > 0 ? 18 : -18;
          const options = { duration: reduced ? 100 : 280, easing: 'cubic-bezier(.16,1,.3,1)' };
          const start = reduced ? { opacity: .4 } : { opacity: .4, transform: `translateX(${distance}px)` };
          const end = reduced ? { opacity: 1 } : { opacity: 1, transform: 'translateX(0)' };
          incomingAnimation = next.animate([start, end], options);
          outgoingAnimation = previous.animate([{ opacity: 1 }, { opacity: 0 }], options);
          outgoingAnimation.finished.then(() => previous.remove()).catch(() => previous.remove());
        };
        next.src = product.images[target];
      };
      gallery.addEventListener('keydown', event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          change(event.key === 'ArrowRight' ? 1 : -1);
        }
      });
      let touchStart;
      gallery.addEventListener('pointerdown', event => {
        if (event.pointerType === 'touch' && !event.target.closest('button')) {
          touchStart = { x: event.clientX, y: event.clientY };
        }
      }, { passive: true });
      gallery.addEventListener('pointerup', event => {
        if (touchStart && event.pointerType === 'touch') {
          const dx = event.clientX - touchStart.x;
          const dy = event.clientY - touchStart.y;
          if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            change(dx < 0 ? 1 : -1);
          }
        }
        touchStart = undefined;
      }, { passive: true });
      gallery.addEventListener('pointercancel', () => { touchStart = undefined; }, { passive: true });
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

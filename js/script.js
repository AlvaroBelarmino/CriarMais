/* ================================================
   CRIAR+ STUDIO — JAVASCRIPT
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar Scroll ── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile Menu ── */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* ── AOS (Scroll Animations) ── */
  const aosElements = document.querySelectorAll('[data-aos]');

  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        aosObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.07,
    // Margem negativa maior em desktop — evita animar antes do usuário chegar
    rootMargin: '0px 0px -10% 0px'
  });

  // Inicia observer após primeiro render para não capturar elementos
  // que já estão na tela no load (causaria animação imediata em bloco)
  if (document.readyState === 'complete') {
    aosElements.forEach(el => aosObserver.observe(el));
  } else {
    window.addEventListener('load', () => {
      aosElements.forEach(el => aosObserver.observe(el));
    });
  }

  /* ── Counter Animation ── */
  const counters = document.querySelectorAll('.stat-number[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 1800;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };

    requestAnimationFrame(update);
  }

  /* ── Portfolio Filter ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

        if (match) {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
          item.style.pointerEvents = '';
          item.style.display = '';
        } else {
          item.style.opacity = '0.15';
          item.style.transform = 'scale(0.96)';
          item.style.pointerEvents = 'none';
        }
      });
    });
  });

  /* ── FAQ Accordion ── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach(i => i.classList.remove('open'));

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Cursor Glow on Cards ── */
  const cards = document.querySelectorAll('.service-card, .testimonial-card, .process-step');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  /* ── WhatsApp float button tooltip ── */
  const whatsappFloat = document.querySelector('.whatsapp-float');
  if (whatsappFloat) {
    let tooltipTimeout;
    whatsappFloat.addEventListener('mouseenter', () => {
      tooltipTimeout = setTimeout(() => {
        whatsappFloat.setAttribute('title', 'Falar no WhatsApp');
      }, 200);
    });
    whatsappFloat.addEventListener('mouseleave', () => {
      clearTimeout(tooltipTimeout);
    });
  }

  /* ── Parallax hero elements on mouse move (apenas desktop) ── */
  const heroSection = document.querySelector('.hero');
  if (heroSection && window.innerWidth > 768) {
    let rafPending = false;
    let mouseX = 0, mouseY = 0;

    heroSection.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        const xRatio = (mouseX / window.innerWidth - 0.5) * 2;
        const yRatio = (mouseY / window.innerHeight - 0.5) * 2;
        const medal = heroSection.querySelector('.hero-medal');
        if (medal) {
          medal.style.transform = `translateY(var(--float-offset, 0px)) translate(${xRatio * -8}px, ${yRatio * -5}px)`;
        }
        rafPending = false;
      });
    });
  }

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ── Add active nav link style ── */
  const style = document.createElement('style');
  style.textContent = `.nav-link.active { color: var(--white) !important; }`;
  document.head.appendChild(style);

  /* ── Portfolio Slideshow ── */
  document.querySelectorAll('.pf-slideshow').forEach(item => {
    const slides = JSON.parse(item.dataset.slides || '[]');
    if (slides.length < 2) return;

    const imgEl   = item.querySelector('.slide-img');
    const dotsWrap = item.querySelector('.slide-dots');
    let current = 0;
    let timer;

    // Pré-carrega todas as imagens
    const images = slides.map((src, i) => {
      const img = i === 0 ? imgEl : document.createElement('img');
      img.src = src;
      img.alt = imgEl.alt;
      img.className = 'slide-img' + (i === 0 ? ' active' : '');
      img.loading = 'lazy';
      if (i > 0) imgEl.parentElement.insertBefore(img, dotsWrap);
      return img;
    });

    // Cria dots
    const counter = document.createElement('span');
    counter.className = 'slide-counter';
    counter.textContent = `1 / ${slides.length}`;
    imgEl.parentElement.appendChild(counter);

    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', (e) => { e.stopPropagation(); goTo(i); });
      dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll('.slide-dot');

    const goTo = (idx) => {
      images[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (idx + slides.length) % slides.length;
      images[current].classList.add('active');
      dots[current].classList.add('active');
      counter.textContent = `${current + 1} / ${slides.length}`;
    };

    const next = () => goTo(current + 1);

    const startTimer = () => { timer = setInterval(next, 2800); };
    const stopTimer  = () => clearInterval(timer);

    startTimer();
    item.addEventListener('mouseenter', stopTimer);
    item.addEventListener('mouseleave', startTimer);

    // Clique abre lightbox com as fotos deste cliente
    item.querySelector('.portfolio-image').addEventListener('click', () => {
      openGroupLightbox(slides, current, item.dataset.title || '');
    });
  });

  /* ── Lightbox ── */
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxCap   = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBack  = document.getElementById('lightboxBackdrop');
  const lightboxPrev  = document.getElementById('lightboxPrev');
  const lightboxNext  = document.getElementById('lightboxNext');

  // Coletar todas as imagens do portfólio (exceto vídeo)
  let portfolioImages = [];
  let currentIndex = 0;

  const buildImageList = () => {
    portfolioImages = [];
    document.querySelectorAll('.portfolio-item .portfolio-image img').forEach(img => {
      portfolioImages.push({ src: img.src, alt: img.alt });
    });
  };

  const openLightbox = (index) => {
    buildImageList();
    currentIndex = index;
    const item = portfolioImages[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lightboxCap.textContent = item.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateNavButtons();
  };

  // Lightbox para grupos de slideshow
  const openGroupLightbox = (srcs, startIdx, title) => {
    portfolioImages = srcs.map(src => ({ src, alt: title }));
    currentIndex = startIdx;
    lightboxImg.src = srcs[startIdx];
    lightboxImg.alt = title;
    lightboxCap.textContent = `${title} — ${startIdx + 1} / ${srcs.length}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateNavButtons();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  };

  const navigateLightbox = (dir) => {
    currentIndex = (currentIndex + dir + portfolioImages.length) % portfolioImages.length;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = portfolioImages[currentIndex].src;
      lightboxImg.alt = portfolioImages[currentIndex].alt;
      const cap = portfolioImages[currentIndex].alt;
      lightboxCap.textContent = portfolioImages.length > 1
        ? `${cap} — ${currentIndex + 1} / ${portfolioImages.length}`
        : cap;
      lightboxImg.style.opacity = '1';
    }, 150);
    updateNavButtons();
  };

  const showPrev = () => navigateLightbox(-1);
  const showNext = () => navigateLightbox(1);

  const updateNavButtons = () => {
    lightboxImg.style.transition = 'opacity 0.15s ease';
    lightboxImg.style.opacity = '1';
  };

  // Clique nas imagens do portfólio — ignora vídeo E slideshows (têm handler próprio)
  document.querySelectorAll('.portfolio-item .portfolio-image').forEach((wrap) => {
    const item = wrap.closest('.portfolio-item');
    if (wrap.classList.contains('portfolio-video-wrap')) return;
    if (item && item.classList.contains('pf-slideshow')) return; // já tem handler
    wrap.style.cursor = 'zoom-in';
    wrap.addEventListener('click', () => {
      buildImageList();
      const imgs = document.querySelectorAll(
        '.portfolio-item:not(.pf-slideshow):not([data-category="video"]) .portfolio-image img'
      );
      const thisImg = wrap.querySelector('img');
      let idx = 0;
      imgs.forEach((img, j) => { if (img === thisImg) idx = j; });
      openLightbox(idx);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBack.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  // Teclado
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  /* ── Vídeo do portfólio ── */
  const videoWrap = document.querySelector('.portfolio-video-wrap');
  if (videoWrap) {
    const video = videoWrap.querySelector('.portfolio-video');
    const playBtn = videoWrap.querySelector('.video-play-btn-real');

    playBtn.addEventListener('click', () => {
      videoWrap.classList.add('playing');
      video.muted = false;
      video.play();
    });

    video.addEventListener('click', () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
        videoWrap.classList.remove('playing');
      }
    });
  }

  /* ── Ticker pause on hover ── */
  const ticker = document.querySelector('.ticker-track');
  if (ticker) {
    const wrap = ticker.parentElement;
    wrap.addEventListener('mouseenter', () => {
      ticker.style.animationPlayState = 'paused';
    });
    wrap.addEventListener('mouseleave', () => {
      ticker.style.animationPlayState = 'running';
    });
  }

  /* ── Hero image lazy reveal ── */
  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    heroImage.addEventListener('load', () => {
      heroImage.style.opacity = '1';
    });
    if (heroImage.complete) {
      heroImage.style.opacity = '1';
    }
  }


});

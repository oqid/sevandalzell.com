/* ============================================================
   SEVAN DALZELL — vii
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     0. EDIT YOUR CONTENT HERE
     ---------------------------------------------------------- */

  // Flip to true, push, and the site shows only the loader + a
  // "under construction" tag — no nav, no panels reachable.
  // Flip back to false and push to bring the full site back.
  const UNDER_CONSTRUCTION = true;

  // Portfolio projects — rendered as alternating left-third/right-third
  // "landmarks" you scroll past. Set feature:true on any project to make
  // it a full-width image break instead (good for a hero shot of a build).
  const PROJECTS = [
    {
      title: 'Autonomous fire-fighting robot',
      desc: 'Mecanum-wheeled platform built for MECHENG 706 — phototransistor flame sensing, IMU-stabilised heading, and an Arduino Mega driving the full control stack. I led system integration: pinouts, FSM design, and power architecture.',
      tags: 'Arduino · Mecanum drive · FSM · IMU',
      media: 'assets/projects/firefighter.jpg',
      type: 'image'
    },
    {
      title: 'Total artificial heart — capstone',
      desc: 'CFD modelling and a physical mock circulatory loop, built to validate flow behaviour for a total artificial heart concept as part of the engineering capstone.',
      tags: 'CFD · Mock circulatory loop · Capstone',
      media: 'assets/projects/heart.jpg',
      type: 'image',
      feature: true
    },
    {
      title: 'Digital control systems — IFT',
      desc: 'Implemented Iterative Feedback Tuning with Gauss-Newton optimisation in MATLAB for MECHENG 705, tuning a closed-loop controller directly from measured data rather than a model.',
      tags: 'MATLAB · IFT · Gauss-Newton',
      media: 'assets/projects/ift.jpg',
      type: 'image'
    },
    {
      title: 'GMP renewal automation',
      desc: 'VBA scripting built during industry experience at Elitepac NZ to automate GMP renewal documentation — replacing a manual paperwork process with a repeatable script.',
      tags: 'VBA · Process automation · Elitepac NZ',
      media: 'assets/projects/elitepac.jpg',
      type: 'image'
    }
  ];

  // Photography mosaic — just list filenames + a caption. Layout/size is
  // assigned automatically (cycles through a tile pattern), no manual
  // positioning needed. NOTE: a static site can't read folder contents
  // directly, so this list IS how you "add" photos — there's no way to
  // make it literally auto-detect new files without a backend.
  const PHOTOS = [
    { src: 'assets/photography/01.jpg', title: 'Untitled 01', tech: 'Fujifilm X-T30 · 35mm f1.4' },
    { src: 'assets/photography/02.jpg', title: 'Untitled 02', tech: 'Fujifilm X-T30 · 23mm f2' },
    { src: 'assets/photography/03.jpg', title: 'Untitled 03', tech: 'Fujifilm X-T30 · 56mm f1.2' },
    { src: 'assets/photography/04.jpg', title: 'Untitled 04', tech: 'Fujifilm X-T30 · 35mm f1.4' },
    { src: 'assets/photography/05.jpg', title: 'Untitled 05', tech: 'Fujifilm X-T30 · 23mm f2' },
    { src: 'assets/photography/06.jpg', title: 'Untitled 06', tech: 'Fujifilm X-T30 · 56mm f1.2' },
    { src: 'assets/photography/07.jpg', title: 'Untitled 07', tech: 'Fujifilm X-T30 · 35mm f1.4' },
    { src: 'assets/photography/08.jpg', title: 'Untitled 08', tech: 'Fujifilm X-T30 · 23mm f2' }
  ];

  /* ----------------------------------------------------------
     1. LOADER
     ---------------------------------------------------------- */
  const loader = document.getElementById('loader');
  const loaderMark = document.getElementById('loaderMark');
  const loaderDate = document.getElementById('loaderDate');
  const loaderSub = document.getElementById('loaderSub');

  loaderDate.textContent = 'Sevan Dalzell ' + new Date().getFullYear();

  const flickerFrames = ['!ii', 'v!i', 'vi!', 'v!i', '!ii', 'v!i', 'vi!'];
  const FLICKER_INTERVAL_MS = 110;
  let frame = 0;

  const flickerInterval = setInterval(() => {
    frame++;
    if (frame >= flickerFrames.length) {
      clearInterval(flickerInterval);
      loaderMark.textContent = 'vii';
      loaderMark.classList.remove('flicker');

      if (UNDER_CONSTRUCTION) {
        loaderSub.classList.add('is-visible');
      } else {
        setTimeout(() => loader.classList.add('is-hidden'), 380);
      }
      return;
    }
    loaderMark.textContent = flickerFrames[frame];
    loaderMark.classList.toggle('flicker', flickerFrames[frame].includes('!'));
  }, FLICKER_INTERVAL_MS);

  if (UNDER_CONSTRUCTION) return; // skip nav/portfolio/lightbox setup entirely

  /* ----------------------------------------------------------
     2. CARTESIAN PAN NAVIGATION
     ---------------------------------------------------------- */
  const world = document.getElementById('world');
  const traceLine = document.getElementById('traceLine');
  const returnArrow = document.getElementById('arrowReturn');
  const returnGlyph = returnArrow.querySelector('.arrow-glyph');
  const photoHomeBtn = document.getElementById('photoHomeBtn');
  const workHomeBtn = document.getElementById('workHomeBtn');

  // pos: 0,0 home | -1,0 photography | 1,0 portfolio | 0,1 about
  let pos = { x: 0, y: 0 };

  const outboundArrows = {
    left:  { el: document.querySelector('.arrow-left'),  target: { x: -1, y: 0 } },
    right: { el: document.querySelector('.arrow-right'), target: { x: 1,  y: 0 } },
    down:  { el: document.querySelector('.arrow-down'),  target: { x: 0,  y: 1 } }
  };

  // Navigation graph keyed by panel coordinates. Add new panels/routes here.
  const NAV_GRAPH = {
    '0,0':  { left: { x: -1, y: 0 }, right: { x: 1, y: 0 }, down: { x: 0, y: 1 } },
    '-1,0': { right: { x: 0, y: 0 } },
    '1,0':  { left: { x: 0, y: 0 } },
    '0,1':  { up: { x: 0, y: 0 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } }
  };

  let holdHomeNavUntilCentered = false;
  let homeNavReleaseToken = 0;
  let panningUiReleaseToken = 0;
  let wheelNavLocked = false;

  function setPanningUiState(isPanning) {
    document.body.classList.toggle('is-panning', isPanning);
  }

  function getTransitionMs(el) {
    const raw = getComputedStyle(el).transitionDuration.split(',')[0].trim();
    if (raw.endsWith('ms')) return Number.parseFloat(raw) || 0;
    if (raw.endsWith('s')) return (Number.parseFloat(raw) || 0) * 1000;
    return 0;
  }

  function releaseHomeNavAfterPan() {
    const token = ++homeNavReleaseToken;
    const finish = () => {
      if (token !== homeNavReleaseToken) return;
      holdHomeNavUntilCentered = false;
      updateNav();
    };

    const transitionMs = getTransitionMs(world);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || transitionMs === 0) {
      requestAnimationFrame(finish);
      return;
    }

    const onEnd = (e) => {
      if (e.target !== world || e.propertyName !== 'transform') return;
      world.removeEventListener('transitionend', onEnd);
      finish();
    };

    world.addEventListener('transitionend', onEnd);
    window.setTimeout(() => {
      world.removeEventListener('transitionend', onEnd);
      finish();
    }, transitionMs + 80);
  }

  function releasePanningUiAfterPan() {
    const token = ++panningUiReleaseToken;
    const finish = () => {
      if (token !== panningUiReleaseToken) return;
      setPanningUiState(false);
    };

    const transitionMs = getTransitionMs(world);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || transitionMs === 0) {
      requestAnimationFrame(finish);
      return;
    }

    const onEnd = (e) => {
      if (e.target !== world || e.propertyName !== 'transform') return;
      world.removeEventListener('transitionend', onEnd);
      finish();
    };

    world.addEventListener('transitionend', onEnd);
    window.setTimeout(() => {
      world.removeEventListener('transitionend', onEnd);
      finish();
    }, transitionMs + 80);
  }

  function lockWheelNav() {
    wheelNavLocked = true;
    window.setTimeout(() => { wheelNavLocked = false; }, 380);
  }

  function posKey(p = pos) {
    return `${p.x},${p.y}`;
  }

  function getTargetForDirection(direction, fromPos = pos) {
    const routes = NAV_GRAPH[posKey(fromPos)];
    return routes && routes[direction] ? routes[direction] : null;
  }

  function navigateTo(target, pulseEl) {
    if (!target) return false;

    const willMove = pos.x !== target.x || pos.y !== target.y;
    if (willMove) {
      setPanningUiState(true);
      releasePanningUiAfterPan();
    }

    pos = target;
    applyTransform();
    updateNav();
    if (pulseEl) pulse(pulseEl);
    return true;
  }

  function navigateDirection(direction, pulseEl) {
    return navigateTo(getTargetForDirection(direction), pulseEl);
  }

  function getActivePanel() {
    return document.querySelector(`.panel[data-pos="${pos.x},${pos.y}"]`);
  }

  function atVerticalEdge(panel, direction) {
    if (!panel || !panel.classList.contains('panel-scrollable')) return true;

    const epsilon = 2;
    const maxScroll = panel.scrollHeight - panel.clientHeight;
    if (maxScroll <= 0) return true;
    if (direction === 'up') return panel.scrollTop <= epsilon;
    if (direction === 'down') return panel.scrollTop >= (maxScroll - epsilon);
    return true;
  }

  function applyTransform() {
    const tx = -(1 + pos.x) * 100;
    const ty = -(pos.y) * 100;
    world.style.transform = `translate(${tx}vw, ${ty}vh)`;

    // trace line: a thin line from centre toward current node, in viewBox units (0-100)
    const lx = 50 + pos.x * 38;
    const ly = 50 + pos.y * 38;
    if (traceLine) {
      traceLine.setAttribute('x2', lx);
      traceLine.setAttribute('y2', ly);
    }
  }

  // The return control always sits on the edge that matches where it
  // points — never stuck on the side you originally clicked from.
  function updateNav() {
    const atHome = pos.x === 0 && pos.y === 0;

    Object.values(outboundArrows).forEach((a) => {
      a.el.dataset.state = (atHome && !holdHomeNavUntilCentered) ? 'visible' : 'hidden';
    });

    if (atHome || pos.y !== 1) {
      returnArrow.dataset.state = 'hidden';
      return;
    }

    returnArrow.dataset.state = 'visible';
    returnArrow.classList.remove('pos-top');

    if (pos.y === 1) {      // at about → home is up
      returnArrow.classList.add('pos-top');
      returnGlyph.innerHTML = '&uarr;';
    }
  }

  function navigate(direction) {
    navigateDirection(direction, outboundArrows[direction].el);
  }

  function goHome() {
    const wasAwayFromHome = !(pos.x === 0 && pos.y === 0);
    pos = { x: 0, y: 0 };

    if (wasAwayFromHome) {
      setPanningUiState(true);
      releasePanningUiAfterPan();
      holdHomeNavUntilCentered = true;
      releaseHomeNavAfterPan();
    }

    applyTransform();
    updateNav();
  }

  function pulse(el) {
    if (!el) return;
    el.classList.remove('is-pulsing');
    void el.offsetWidth; // restart animation
    el.classList.add('is-pulsing');
  }

  Object.values(outboundArrows).forEach((arrow) => {
    arrow.el.addEventListener('click', () => {
      const key = Object.keys(outboundArrows).find((k) => outboundArrows[k] === arrow);
      navigate(key);
    });
  });

  returnArrow.addEventListener('click', () => {
    pulse(returnArrow);
    goHome();
  });

  if (photoHomeBtn) {
    photoHomeBtn.addEventListener('click', () => {
      pulse(photoHomeBtn);
      goHome();
    });
  }

  if (workHomeBtn) {
    workHomeBtn.addEventListener('click', () => {
      pulse(workHomeBtn);
      goHome();
    });
  }

  window.addEventListener('keydown', (e) => {
    const keyToDirection = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowDown: 'down',
      ArrowUp: 'up'
    };

    const direction = keyToDirection[e.key];
    if (!direction) return;
    e.preventDefault();

    const target = getTargetForDirection(direction);
    if (!target) return;
    navigateTo(target);
  });

  window.addEventListener('wheel', (e) => {
    if (wheelNavLocked) return;

    const direction = e.deltaY > 26 ? 'down' : (e.deltaY < -26 ? 'up' : null);
    if (!direction) return;

    const target = getTargetForDirection(direction);
    if (!target) return;

    const panel = getActivePanel();
    if (!atVerticalEdge(panel, direction)) return;

    e.preventDefault();
    navigateTo(target);
    lockWheelNav();
  }, { passive: false });

  // init
  applyTransform();
  updateNav();

  /* ----------------------------------------------------------
     3. HELPER — graceful fallback when media file is missing
     ---------------------------------------------------------- */
  function attachMissingFallback(container, mediaEl, label) {
    mediaEl.addEventListener('error', () => {
      mediaEl.remove();
      const note = document.createElement('div');
      note.className = 'media-missing';
      note.textContent = `add file: ${label}`;
      container.appendChild(note);
    });
  }

  /* ----------------------------------------------------------
     4. PORTFOLIO — landmarks, scroll-revealed
     ---------------------------------------------------------- */
  const landmarksEl = document.getElementById('landmarks');

  PROJECTS.forEach((p, i) => {
    const item = document.createElement('article');
    const side = p.feature ? 'feature' : (i % 2 === 0 ? 'left' : 'right');
    item.className = `landmark landmark--${side}`;

    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'landmark-media';

    const mediaEl = p.type === 'video'
      ? Object.assign(document.createElement('video'), { src: p.media, autoplay: true, loop: true, muted: true, playsInline: true })
      : Object.assign(document.createElement('img'), { src: p.media, alt: p.title, loading: 'lazy' });

    mediaWrap.dataset.media = p.media;
    mediaWrap.dataset.type = p.type;
    mediaWrap.appendChild(mediaEl);
    attachMissingFallback(mediaWrap, mediaEl, p.media);

    const cap = document.createElement('div');
    cap.className = 'landmark-cap';
    cap.innerHTML = `
      <p class="landmark-index">${String(i + 1).padStart(2, '0')}</p>
      <h3 class="landmark-title">${p.title}</h3>
      <p class="landmark-desc">${p.desc}</p>
      <p class="landmark-tags">${p.tags}</p>
    `;

    item.appendChild(mediaWrap);
    item.appendChild(cap);
    landmarksEl.appendChild(item);
  });

  /* ----------------------------------------------------------
     5. PHOTOGRAPHY — mosaic
     ---------------------------------------------------------- */
  const mosaicEl = document.getElementById('mosaic');
  const TILE_PATTERN = ['a', 'd', 'c', 'b', 'd', 'd', 'c', 'a', 'b', 'd'];

  PHOTOS.forEach((photo, i) => {
    const item = document.createElement('figure');
    const size = TILE_PATTERN[i % TILE_PATTERN.length];
    item.className = `mosaic-item mosaic-item--${size}`;

    const img = new Image();
    img.src = photo.src;
    img.alt = photo.title || '';
    img.loading = 'lazy';
    attachMissingFallback(item, img, photo.src);

    const caption = document.createElement('div');
    caption.className = 'mosaic-caption';
    caption.innerHTML = `
      <p class="mc-title">${photo.title || ''}</p>
      <p class="mc-tech">${photo.tech || ''}</p>
    `;

    item.appendChild(img);
    item.appendChild(caption);
    mosaicEl.appendChild(item);
  });

  /* ----------------------------------------------------------
     6. SCROLL REVEAL — landmarks fade in within their own panel
     ---------------------------------------------------------- */
  const workPanel = document.querySelector('.panel-work');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.15, root: workPanel });

  document.querySelectorAll('.landmark').forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------
     7. LIGHTBOX — click any landmark or mosaic image to expand
     ---------------------------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, type) {
    lightboxContent.innerHTML = type === 'video'
      ? `<video src="${src}" autoplay loop muted playsinline controls></video>`
      : `<img src="${src}" alt="">`;
    lightbox.classList.add('is-open');
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightboxContent.innerHTML = '';
  }

  document.addEventListener('click', (e) => {
    const landmarkMedia = e.target.closest('.landmark-media');
    if (landmarkMedia && !landmarkMedia.querySelector('.media-missing')) {
      openLightbox(landmarkMedia.dataset.media, landmarkMedia.dataset.type);
      return;
    }
    const mosaicItem = e.target.closest('.mosaic-item');
    if (mosaicItem) {
      const img = mosaicItem.querySelector('img');
      if (img) openLightbox(img.currentSrc || img.src, 'image');
    }
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

});

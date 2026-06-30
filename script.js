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
  const UNDER_CONSTRUCTION = false;

  // Portfolio projects — rendered as alternating left-third/right-third
  // "landmarks" you scroll past. media can be:
  // 1) a string path, e.g. 'assets/projects/firefighter.jpg'
  // 2) an array of paths for a simple media carousel
  // 3) an array of { src, type } objects for mixed image/video media
  // Set feature:true on any project to make it a full-width image break.
  const PROJECTS = [
    {
      title: 'Autonomous fire-fighting robot',
      desc: 'Mecanum-wheeled platform built for MECHENG 706 — phototransistor flame sensing, IMU-stabilised heading, and an Arduino Mega driving the full control stack. I led system integration: pinouts, FSM design, and power architecture.',
      tags: 'Arduino · Mecanum drive · FSM · IMU',
      media: [
        {
          src: 'assets/projects/firefighter.jpg',
          type: 'image',
          desc: 'Bench test run: flame sensor array and drivetrain tuning on the first integrated prototype.'
        },
        {
          src: 'assets/projects/ift.jpg',
          type: 'image',
          desc: 'Slideshow verification frame: controller sweep comparison during tuning pass.'
        }
      ],
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

  // Optional image-only expansion entries rendered directly under a project.
  // attachTo: project title string
  // entryType: only matters for the explicit value 'feature', which renders
  //   a full-bleed image break (like the capstone one below). Anything else
  //   is ignored — left/right entries automatically attach as a small
  //   two-image row tucked under that project's own image, mirrored to
  //   whichever side the parent project is actually on (so it can never
  //   end up misaligned).
  // images: up to 2 for left/right entries, up to 3 for feature entries
  const PORTFOLIO_IMAGE_EXPANSIONS = [
    {
      attachTo: 'GMP renewal automation',
      entryType: 'right',
      images: [
        { src: 'assets/projects/elitepac.jpg', desc: 'Document automation workflow snapshot.' },
        { src: 'assets/projects/firefighter.jpg' }
      ]
    },
    {
      attachTo: 'Total artificial heart — capstone',
      entryType: 'feature',
      images: [
        { src: 'assets/projects/heart.jpg', desc: 'Flow loop bench setup.' },
        { src: 'assets/projects/ift.jpg' },
        { src: 'assets/projects/elitepac.jpg' }
      ]
    }
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
     3b. HELPER — preserve each photo's real aspect ratio instead
     of cropping it to a fixed box. We size the container off the
     PRIMARY (first) image only, so a slideshow's box stays stable
     while it cycles — later slides letterbox via object-fit:contain
     rather than cropping or distorting.
     ---------------------------------------------------------- */
  const ASPECT_MIN = 0.62; // tallest box we'll allow (portrait-ish)
  const ASPECT_MAX = 2.2;  // widest box we'll allow (ultra-wide)

  function applyNaturalAspectRatio(mediaWrap, imgEl) {
    if (!imgEl || imgEl.tagName !== 'IMG') return;

    const setRatio = () => {
      const w = imgEl.naturalWidth;
      const h = imgEl.naturalHeight;
      if (!w || !h) return;
      const ratio = Math.min(ASPECT_MAX, Math.max(ASPECT_MIN, w / h));
      mediaWrap.style.aspectRatio = String(ratio);
    };

    if (imgEl.complete && imgEl.naturalWidth) {
      setRatio();
    } else {
      imgEl.addEventListener('load', setRatio, { once: true });
    }
  }

  /* ----------------------------------------------------------
     4. PORTFOLIO — landmarks, scroll-revealed
     ---------------------------------------------------------- */
  const landmarksEl = document.getElementById('landmarks');
  const PROJECT_SLIDESHOW_MS = 3600;
  const PROJECT_SLIDESHOW_FIRST_DELAY_MS = 6500;

  function normalizeProjectMediaItems(project) {
    const raw = Array.isArray(project.media) ? project.media : [project.media];
    const fallbackType = project.type || 'image';

    return normalizeMediaEntries(raw, fallbackType);
  }

  function normalizeMediaEntries(rawEntries, fallbackType = 'image') {
    const raw = Array.isArray(rawEntries) ? rawEntries : [rawEntries];

    return raw
      .filter(Boolean)
      .map((entry) => {
        if (typeof entry === 'string') {
          return { src: entry, type: fallbackType, description: '' };
        }
        return {
          src: entry.src,
          type: entry.type || fallbackType,
          description: entry.desc || entry.description || ''
        };
      })
      .filter((entry) => Boolean(entry.src));
  }

  function createMediaTile(media, fallbackAlt = '') {
    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'landmark-media';

    const mediaTrack = document.createElement('div');
    mediaTrack.className = 'landmark-media-track';

    const mediaEl = media.type === 'video'
      ? Object.assign(document.createElement('video'), {
          src: media.src,
          autoplay: true,
          loop: true,
          muted: true,
          playsInline: true
        })
      : Object.assign(document.createElement('img'), {
          src: media.src,
          alt: fallbackAlt,
          loading: 'lazy'
        });

    mediaEl.classList.add('landmark-media-item', 'is-active');
    mediaEl.dataset.src = media.src;
    mediaEl.dataset.type = media.type;
    mediaEl.dataset.description = media.description || '';
    mediaTrack.appendChild(mediaEl);
    mediaWrap.appendChild(mediaTrack);
    attachMissingFallback(mediaWrap, mediaEl, media.src);
    applyNaturalAspectRatio(mediaWrap, mediaEl);

    const mediaCaption = document.createElement('div');
    mediaCaption.className = 'landmark-media-caption';
    mediaCaption.innerHTML = '<p class="landmark-media-caption-body"></p>';
    mediaWrap.dataset.hasDescription = 'false';
    mediaWrap.appendChild(mediaCaption);
    updateProjectMediaDescription(mediaWrap, mediaEl);

    return mediaWrap;
  }

  // Full-width image break, used when an expansion is attached to a
  // feature-style project (or explicitly marked entryType:'feature').
  function renderPortfolioFeatureExpansion(expansion) {
    const maxImages = 3;
    const mediaItems = normalizeMediaEntries(expansion.images, 'image').slice(0, maxImages);
    if (!mediaItems.length) return null;

    const item = document.createElement('article');
    item.className = 'landmark landmark-expansion landmark-expansion--feature';

    const grid = document.createElement('div');
    grid.className = 'landmark-expansion-grid';

    mediaItems.forEach((media, index) => {
      const tile = createMediaTile(media, `${expansion.attachTo || 'project'} media ${index + 1}`);
      tile.classList.add('landmark-expansion-media', `landmark-expansion-media-${index + 1}`);
      grid.appendChild(tile);
    });

    item.appendChild(grid);
    return item;
  }

  // Small two-image row tucked directly under a left/right entry's
  // main image, forming an L shape (mirrored automatically for the
  // right side since it lives inside that landmark's own CSS grid).
  function renderPortfolioExpansionRow(expansion) {
    const mediaItems = normalizeMediaEntries(expansion.images, 'image').slice(0, 2);
    if (!mediaItems.length) return null;

    const row = document.createElement('div');
    row.className = 'landmark-expansion-row';

    mediaItems.forEach((media, index) => {
      const tile = createMediaTile(media, `${expansion.attachTo || 'project'} extra ${index + 1}`);
      tile.classList.add('landmark-expansion-media', `landmark-expansion-media-${index + 1}`);
      row.appendChild(tile);
    });

    return row;
  }

  function updateProjectMediaDescription(mediaWrap, mediaEl) {
    const captionBody = mediaWrap.querySelector('.landmark-media-caption-body');
    if (!captionBody || !mediaEl) return;

    const description = mediaEl.dataset.description || '';
    if (description) {
      mediaWrap.dataset.hasDescription = 'true';
      captionBody.textContent = description;
    } else {
      mediaWrap.dataset.hasDescription = 'false';
      captionBody.textContent = '';
    }
  }

  function setActiveProjectMedia(mediaWrap, index) {
  const mediaEls = Array.from(mediaWrap.querySelectorAll('.landmark-media-item'));
  if (!mediaEls.length) return;

  const nextIndex = ((index % mediaEls.length) + mediaEls.length) % mediaEls.length;
  
  // Remove active from ALL items
  mediaEls.forEach((el, i) => {
    el.classList.remove('is-active');
    if (el.tagName === 'VIDEO') {
      el.pause();
    }
  });
  
  // Add active to the new item
  const newActive = mediaEls[nextIndex];
  newActive.classList.add('is-active');
  
  if (newActive.tagName === 'VIDEO') {
    const playPromise = newActive.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  }

  mediaWrap.dataset.activeIndex = String(nextIndex);
  const counter = mediaWrap.querySelector('.landmark-media-counter');
  if (counter) counter.textContent = `${nextIndex + 1}/${mediaEls.length}`;
  updateProjectMediaDescription(mediaWrap, mediaEls[nextIndex]);
}

  function getActiveProjectMedia(mediaWrap) {
    const mediaEls = Array.from(mediaWrap.querySelectorAll('.landmark-media-item'));
    if (!mediaEls.length) return null;
    const active = mediaWrap.querySelector('.landmark-media-item.is-active');
    return active || mediaEls[0];
  }

  function startProjectSlideshow(mediaWrap, intervalMs = PROJECT_SLIDESHOW_MS) {
  const mediaEls = mediaWrap.querySelectorAll('.landmark-media-item');
  if (mediaEls.length <= 1) return null;

  let timer = null;
  let isPaused = false;
  let hasAdvancedOnce = false;

  const next = () => {
    if (isPaused) return;
    const currentIndex = Number.parseInt(mediaWrap.dataset.activeIndex || '0', 10);
    const nextIndex = (currentIndex + 1) % mediaEls.length;
    setActiveProjectMedia(mediaWrap, nextIndex);
  };

  const stop = () => {
    if (timer) {
      clearTimeout(timer);
      clearInterval(timer);
      timer = null;
    }
  };

  const start = () => {
    stop();
    // First run gets a longer buffer so arriving at the panel doesn't
    // immediately show a crossfade; subsequent restarts (e.g. after a
    // hover pause) resume at the normal interval.
    const firstDelay = hasAdvancedOnce ? 100 : PROJECT_SLIDESHOW_FIRST_DELAY_MS;
    timer = setTimeout(() => {
      hasAdvancedOnce = true;
      next();
      timer = setInterval(next, intervalMs);
    }, firstDelay);
  };

  // Pause on hover
  mediaWrap.addEventListener('mouseenter', () => {
    isPaused = true;
    stop();
  });
  
  mediaWrap.addEventListener('mouseleave', () => {
    isPaused = false;
    start();
  });

  // Start the slideshow
  start();
  
  return { start, stop, restart: start };
}


  PROJECTS.forEach((p, i) => {
    const item = document.createElement('article');
    const side = p.feature ? 'feature' : (i % 2 === 0 ? 'left' : 'right');
    item.className = `landmark landmark--${side}`;

    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'landmark-media';

    const mediaTrack = document.createElement('div');
    mediaTrack.className = 'landmark-media-track';

    const mediaItems = normalizeProjectMediaItems(p);
    mediaItems.forEach((media, mediaIndex) => {
      const mediaEl = media.type === 'video'
        ? Object.assign(document.createElement('video'), {
            src: media.src,
            autoplay: true,
            loop: true,
            muted: true,
            playsInline: true
          })
        : Object.assign(document.createElement('img'), {
            src: media.src,
            alt: p.title,
            loading: 'lazy'
          });

      mediaEl.classList.add('landmark-media-item');
      if (mediaIndex === 0) {
        mediaEl.classList.add('is-active');
        applyNaturalAspectRatio(mediaWrap, mediaEl);
      }
      mediaEl.dataset.src = media.src;
      mediaEl.dataset.type = media.type;
      mediaEl.dataset.description = media.description || '';
      mediaTrack.appendChild(mediaEl);
      attachMissingFallback(mediaWrap, mediaEl, media.src);
    });

    mediaWrap.appendChild(mediaTrack);

    const mediaCaption = document.createElement('div');
    mediaCaption.className = 'landmark-media-caption';
    mediaCaption.innerHTML = '<p class="landmark-media-caption-body"></p>';
    mediaWrap.dataset.hasDescription = 'false';
    mediaWrap.appendChild(mediaCaption);

    let slideshow = null;

    if (mediaItems.length > 1) {
      mediaWrap.classList.add('has-multi');
      mediaWrap.dataset.activeIndex = '0';

      const controls = document.createElement('div');
      mediaWrap.appendChild(controls);
      slideshow = startProjectSlideshow(mediaWrap);
    }

    setActiveProjectMedia(mediaWrap, 0);

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

    PORTFOLIO_IMAGE_EXPANSIONS
      .filter((entry) => entry.attachTo === p.title)
      .forEach((entry) => {
        // 'feature' is only honoured explicitly — everything else
        // auto-mirrors the parent project's actual side, so an
        // expansion can never end up misaligned from its parent.
        const isFeature = side === 'feature' || entry.entryType === 'feature';

        if (isFeature) {
          const expansionEl = renderPortfolioFeatureExpansion(entry);
          if (expansionEl) landmarksEl.appendChild(expansionEl);
        } else {
          const row = renderPortfolioExpansionRow(entry);
          if (row) item.appendChild(row);
        }
      });
  });

  /* ----------------------------------------------------------
     5. PHOTOGRAPHY — mosaic
     ---------------------------------------------------------- */
  const mosaicEl = document.getElementById('mosaic');

  PHOTOS.forEach((photo) => {
    const item = document.createElement('figure');
    item.className = 'mosaic-item';

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
    if (e.target.closest('.landmark-media-controls')) return;

    const landmarkMedia = e.target.closest('.landmark-media');
    if (landmarkMedia && !landmarkMedia.querySelector('.media-missing')) {
      const activeMedia = getActiveProjectMedia(landmarkMedia);
      if (activeMedia) openLightbox(activeMedia.dataset.src, activeMedia.dataset.type);
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
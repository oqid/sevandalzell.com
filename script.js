/* ============================================================
   SEVAN DALZELL — vii
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     0. EDIT YOUR CONTENT HERE
     ---------------------------------------------------------- */

  // Portfolio projects — alternates image/text, text/image automatically.
  // type: 'image' | 'video'  (use 'video' for autoplaying muted clips/gifs-as-mp4)
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
      type: 'image'
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

  /* ----------------------------------------------------------
     1. LOADER
     ---------------------------------------------------------- */
  const loader = document.getElementById('loader');
  const loaderMark = document.getElementById('loaderMark');
  const loaderDate = document.getElementById('loaderDate');

  loaderDate.textContent = '© ' + new Date().getFullYear();

  const flickerFrames = ['vii', 'v!i', 'vi!', '!ii', 'vii', 'vi!', 'vii'];
  let frame = 0;
  const flickerInterval = setInterval(() => {
    frame++;
    if (frame >= flickerFrames.length) {
      clearInterval(flickerInterval);
      loaderMark.textContent = 'vii';
      loaderMark.classList.remove('flicker');
      setTimeout(() => loader.classList.add('is-hidden'), 380);
      return;
    }
    loaderMark.textContent = flickerFrames[frame];
    loaderMark.classList.toggle('flicker', flickerFrames[frame].includes('!'));
  }, 130);

  /* ----------------------------------------------------------
     2. CARTESIAN PAN NAVIGATION
     ---------------------------------------------------------- */
  const world = document.getElementById('world');
  const coordReadout = document.getElementById('coordReadout');
  const traceLine = document.getElementById('traceLine');
  const markHome = document.getElementById('markHome');

  // pos: 0,0 home | -1,0 photography | 1,0 portfolio | 0,1 about
  let pos = { x: 0, y: 0 };

  const arrows = {
    left:  { el: document.querySelector('.arrow-left'),  defaultTarget: { x: -1, y: 0 } },
    right: { el: document.querySelector('.arrow-right'), defaultTarget: { x: 1,  y: 0 } },
    down:  { el: document.querySelector('.arrow-down'),  defaultTarget: { x: 0,  y: 1 } }
  };

  function applyTransform() {
    const tx = -(1 + pos.x) * 100;
    const ty = -(pos.y) * 100;
    world.style.transform = `translate(${tx}vw, ${ty}vh)`;

    // trace line: a thin line from centre toward current node, in viewBox units (0-100)
    const lx = 50 + pos.x * 38;
    const ly = 50 + pos.y * 38;
    traceLine.setAttribute('x2', lx);
    traceLine.setAttribute('y2', ly);

    const fmt = (n) => (n < 0 ? '-' : ' ') + String(Math.abs(n)).padStart(2, '0');
    coordReadout.textContent = `${fmt(pos.x)} · ${fmt(pos.y)}`;
  }

  function updateArrows() {
    Object.entries(arrows).forEach(([key, arrow]) => {
      const t = arrow.defaultTarget;
      const atHome = pos.x === 0 && pos.y === 0;
      const isAtTarget = pos.x === t.x && pos.y === t.y;

      const glyphEl = arrow.el.querySelector('.arrow-glyph');
      const labelEl = arrow.el.querySelector('.arrow-label');

      if (atHome) {
        arrow.el.dataset.state = 'default';
        glyphEl.innerHTML = key === 'left' ? '&larr;' : key === 'right' ? '&rarr;' : '&darr;';
        labelEl.textContent = key === 'left' ? 'photography' : key === 'right' ? 'portfolio' : 'about';
        arrow.el.dataset.action = 'goto';
      } else if (isAtTarget) {
        arrow.el.dataset.state = 'home';
        glyphEl.innerHTML = key === 'left' ? '&rarr;' : key === 'right' ? '&larr;' : '&uarr;';
        labelEl.textContent = 'home';
        arrow.el.dataset.action = 'home';
      } else {
        arrow.el.dataset.state = 'hidden';
        arrow.el.dataset.action = 'none';
      }
    });
  }

  function navigate(direction) {
    const atHome = pos.x === 0 && pos.y === 0;
    let target = null;

    if (atHome) {
      target = arrows[direction].defaultTarget;
    } else {
      // any press while away from home returns home
      target = { x: 0, y: 0 };
    }

    pos = target;
    applyTransform();
    updateArrows();
    pulse(direction);
  }

  function goHome() {
    pos = { x: 0, y: 0 };
    applyTransform();
    updateArrows();
  }

  function pulse(direction) {
    const arrow = arrows[direction] && arrows[direction].el;
    if (!arrow) return;
    arrow.classList.remove('is-pulsing');
    // restart animation
    void arrow.offsetWidth;
    arrow.classList.add('is-pulsing');
  }

  Object.entries(arrows).forEach(([key, arrow]) => {
    arrow.el.addEventListener('click', () => {
      if (arrow.el.dataset.action === 'home') {
        goHome();
        pulse(key);
      } else if (arrow.el.dataset.action === 'goto') {
        navigate(key);
      }
    });
  });

  markHome.addEventListener('click', goHome);

  window.addEventListener('keydown', (e) => {
    const key = e.key;
    if (!['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(key)) return;
    e.preventDefault();

    const atHome = pos.x === 0 && pos.y === 0;

    if (key === 'ArrowLeft') {
      if (atHome) navigate('left');
      else if (pos.x === 1) goHome(); // from portfolio, left returns home
    } else if (key === 'ArrowRight') {
      if (atHome) navigate('right');
      else if (pos.x === -1) goHome(); // from photography, right returns home
    } else if (key === 'ArrowDown') {
      if (atHome) navigate('down');
    } else if (key === 'ArrowUp') {
      if (pos.y === 1) goHome(); // from about, up returns home
    }
  });

  // init
  applyTransform();
  updateArrows();

  /* ----------------------------------------------------------
     3. PORTFOLIO — render + scroll reveal
     ---------------------------------------------------------- */
  const workScroll = document.getElementById('workScroll');

  PROJECTS.forEach((p, i) => {
    const item = document.createElement('article');
    item.className = 'work-item' + (i % 2 === 1 ? ' flip' : '');

    const mediaTag = p.type === 'video'
      ? `<video src="${p.media}" autoplay loop muted playsinline></video>`
      : `<img src="${p.media}" alt="${p.title}" loading="lazy">`;

    item.innerHTML = `
      <div class="work-media" data-media="${p.media}" data-type="${p.type}">
        ${mediaTag}
      </div>
      <div class="work-text">
        <p class="work-index">${String(i + 1).padStart(2, '0')}</p>
        <h3 class="work-title">${p.title}</h3>
        <p class="work-desc">${p.desc}</p>
        <p class="work-tags">${p.tags}</p>
      </div>
    `;
    workScroll.appendChild(item);
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.2, root: workScroll });

  document.querySelectorAll('.work-item').forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------
     4. LIGHTBOX — click any work or photo media to expand
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
    const media = e.target.closest('.work-media');
    if (media) {
      openLightbox(media.dataset.media, media.dataset.type);
      return;
    }
    const photo = e.target.closest('.photo-item:not(.placeholder)');
    if (photo) {
      const img = photo.querySelector('img, video');
      if (img) openLightbox(img.currentSrc || img.src, img.tagName === 'VIDEO' ? 'video' : 'image');
    }
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

});

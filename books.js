/* ============================================================
   bookshelf.js
   Loads book data from booksdata.json, builds the bold-style
   interactive bookshelf inside .bs-wrap on the about page.

   Requires a local server to run (fetch won't work on file://).
   Use VS Code Live Server or: python3 -m http.server
   ============================================================ */

const DEFAULT_SPINE_W = 38;
const DEFAULT_COVER_W = 168;
const DEFAULT_H = 225;

/* ── Organic lean: deterministic trig mix ───────────────────── */
function getLean(idx) {
  return Math.sin(idx * 2.4 + 0.8) * 2.6 + Math.cos(idx * 1.1 + 0.3) * 1.4;
}

/* ── Bold flat SVG cover art ────────────────────────────────── */
function coverSVG(b) {
  const { c0, c1, accent, id } = b;
  const W = b.coverW || DEFAULT_COVER_W;
  const H = b.h || DEFAULT_H;

  /* Generic fallback for books without a hand-crafted design */
  function fallback() {
    return `
      <rect width="${W}" height="${H}" fill="${c0}"/>
      <line x1="0"    y1="${H * 0.3}" x2="${W}" y2="${H * 0.3}"
        stroke="${accent}" stroke-width="2" opacity="0.35"/>
      <line x1="0"    y1="${H * 0.7}" x2="${W}" y2="${H * 0.7}"
        stroke="${accent}" stroke-width="2" opacity="0.35"/>
      <text x="${W / 2}" y="${H * 0.56}" text-anchor="middle"
        font-size="56" font-weight="900" fill="${accent}"
        font-family="sans-serif" opacity="0.15">${b.title.charAt(0)}</text>
      <rect x="0" y="${H - 38}" width="${W}" height="38" fill="${c1}"/>
      <text x="12" y="${H - 14}" font-size="7" font-weight="700"
        fill="${accent}" letter-spacing="2"
        font-family="sans-serif" opacity="0.6">
        ${b.author.toUpperCase().slice(0, 22)}
      </text>`;
  }

  const arts = {
    /* ── Psalm for the Wild-Built ── coral, concentric circles, big P */
    1: `
      <rect width="${W}" height="${H}" fill="${c0}"/>
      ${Array.from(
        { length: 16 },
        (_, i) =>
          `<line x1="0" y1="${14 + i * 13}" x2="${W}" y2="${14 + i * 13}"
          stroke="rgba(255,255,255,0.1)" stroke-width="0.7"/>`,
      ).join("")}
      <circle cx="${W / 2}" cy="${H * 0.46}" r="58"
        fill="none" stroke="${accent}" stroke-width="2.5"/>
      <circle cx="${W / 2}" cy="${H * 0.46}" r="40"
        fill="none" stroke="${accent}" stroke-width="1" opacity="0.35"/>
      <text x="${W / 2}" y="${H * 0.52}" text-anchor="middle"
        font-size="62" font-weight="900" fill="${accent}"
        font-family="sans-serif" opacity="0.93">P</text>
      <rect x="0" y="${H - 42}" width="${W}" height="42" fill="${c1}"/>
      <text x="13" y="${H - 14}" font-size="7.5" font-weight="700"
        fill="rgba(255,255,255,0.55)" letter-spacing="2"
        font-family="sans-serif">BECKY CHAMBERS</text>`,

    /* ── Whole Numbers and Half Truths ── cobalt, dot grid, big ½ */
    2: `
      <rect width="${W}" height="${H}" fill="${c0}"/>
      ${Array.from({ length: 6 }, (_, col) =>
        Array.from({ length: 7 }, (_, row) => {
          const op = (0.07 + ((col + row) % 3) * 0.06).toFixed(2);
          return `<rect x="${16 + col * 26}" y="${12 + row * 26}"
            width="6" height="6" fill="${accent}" opacity="${op}"/>`;
        }).join(""),
      ).join("")}
      <text x="${W / 2}" y="${H * 0.63}" text-anchor="middle"
        font-size="84" font-weight="900" fill="${accent}"
        font-family="sans-serif" opacity="0.9">½</text>
      <rect x="0" y="0" width="${W}" height="34" fill="${c1}"/>
      <text x="13" y="22" font-size="8.5" font-weight="700"
        fill="rgba(255,255,255,0.6)" letter-spacing="2.5"
        font-family="sans-serif">RUKMINI S</text>
      <line x1="13" y1="${H - 22}" x2="${W - 13}" y2="${H - 22}"
        stroke="${accent}" stroke-width="1.5" opacity="0.35"/>`,

    /* ── On Writing ── black, two rules, big ON */
    3: `
      <rect width="${W}" height="${H}" fill="${c0}"/>
      <line x1="0" y1="${H * 0.28}" x2="${W}" y2="${H * 0.28}"
        stroke="${accent}" stroke-width="2"/>
      <line x1="0" y1="${H - 56}" x2="${W}" y2="${H - 56}"
        stroke="${accent}" stroke-width="2"/>
      <text x="13" y="${H * 0.73}"
        font-size="78" font-weight="900" fill="${accent}"
        font-family="sans-serif">ON</text>
      <text x="15" y="${H * 0.86}"
        font-size="20" font-weight="300" fill="${accent}"
        font-family="sans-serif" letter-spacing="7" opacity="0.65">WRITING</text>
      <text x="13" y="${H * 0.22}"
        font-size="8" font-weight="700" fill="rgba(255,255,255,0.4)"
        letter-spacing="3" font-family="sans-serif">STEPHEN KING</text>
      <text x="13" y="${H - 18}"
        font-size="7.5" font-weight="700" fill="rgba(255,255,255,0.28)"
        letter-spacing="2" font-family="sans-serif">ON THE CRAFT</text>`,

    /* ── Build ── yellow, square + circle + midline, ghost B */
    4: `
      <rect width="${W}" height="${H}" fill="${c0}"/>
      <rect x="14" y="22" width="70" height="70" fill="${accent}"/>
      <circle cx="${W * 0.75}" cy="${H * 0.26}" r="36"
        fill="none" stroke="${accent}" stroke-width="3"/>
      <line x1="${W * 0.75}" y1="${H * 0.1}"  x2="${W * 0.75}" y2="${H * 0.42}"
        stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
      <line x1="${W * 0.56}" y1="${H * 0.26}" x2="${W * 0.94}" y2="${H * 0.26}"
        stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
      <line x1="0" y1="${H * 0.48}" x2="${W}" y2="${H * 0.48}"
        stroke="${accent}" stroke-width="2"/>
      <text x="${W / 2}" y="${H * 0.84}" text-anchor="middle"
        font-size="88" font-weight="900" fill="${accent}"
        font-family="sans-serif" opacity="0.1">B</text>
      <text x="14" y="${H * 0.58}"
        font-size="8.5" font-weight="700" fill="${accent}"
        letter-spacing="3" font-family="sans-serif" opacity="0.5">TONY FADELL</text>
      <rect x="0" y="${H - 34}" width="${W}" height="34" fill="${c1}"/>
      <text x="14" y="${H - 12}"
        font-size="8" font-weight="700" fill="${accent}"
        letter-spacing="2" font-family="sans-serif" opacity="0.65">BUILD · 2022</text>`,
  };

  const inner = id in arts ? arts[id] : fallback();
  return `<svg xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 ${W} ${H}"
    preserveAspectRatio="xMidYMid slice">${inner}</svg>`;
}

/* ============================================================
   Init — called once booksdata.json has loaded
   ============================================================ */
function initBookshelf(BOOKS) {
  const booksRow = document.getElementById("bsBooksRow");
  const viewport = document.getElementById("bsViewport");
  const arrowLeft = document.getElementById("bsArrowLeft");
  const arrowRight = document.getElementById("bsArrowRight");
  const dotsEl = document.getElementById("bsDots");
  const reviewEl = document.getElementById("bsReview");

  if (!booksRow) return;

  let activeIdx = -1;

  /* ── Build shelf DOM ──────────────────────────────────────── */
  BOOKS.forEach((b, i) => {
    const sw = b.spineW || DEFAULT_SPINE_W;
    const cw = b.coverW || DEFAULT_COVER_W;
    const bh = b.h || DEFAULT_H;
    const deg = getLean(i);

    /* Outer wrap: carries organic lean */
    const wrap = document.createElement("div");
    wrap.className = "bs-book-wrap";
    wrap.dataset.idx = i;
    wrap.style.transform = `rotateZ(${deg}deg)`;

    /* Perspective container / button */
    const btn = document.createElement("button");
    btn.className = "bs-book-btn";
    btn.dataset.idx = i;
    btn.dataset.spineW = sw;
    btn.dataset.openW = sw + cw;
    btn.style.cssText = `width:${sw}px; perspective:1000px; -webkit-perspective:1000px;`;
    btn.setAttribute("aria-label", b.title);

    /* Spine */
    const spineEl = document.createElement("div");
    spineEl.className = "bs-spine";
    spineEl.style.cssText = `background:${b.spine}; color:${b.spineText}; width:${sw}px; height:${bh}px;`;
    spineEl.innerHTML = b.spineImage
      ? `<img src="${b.spineImage}"
           style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" alt="">
         <span class="bs-paper-tex"></span>`
      : `<span class="bs-paper-tex"></span>
         <span class="bs-spine-title" style="max-height:${bh - 24}px">${b.title}</span>`;

    /* Cover */
    const coverEl = document.createElement("div");
    coverEl.className = "bs-cover";
    coverEl.style.cssText = `width:${cw}px; height:${bh}px;`;
    const art = b.coverImage
      ? `<img src="${b.coverImage}" alt="${b.title}">`
      : coverSVG(b);
    coverEl.innerHTML = `${art}<span class="bs-paper-tex"></span><span class="bs-binding"></span>`;

    btn.appendChild(spineEl);
    btn.appendChild(coverEl);
    btn.addEventListener("click", () => handleClick(i));
    wrap.appendChild(btn);
    booksRow.appendChild(wrap);
  });

  /* ── Dots ─────────────────────────────────────────────────── */
  BOOKS.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "bs-dot";
    d.addEventListener("click", () => handleClick(i));
    dotsEl.appendChild(d);
  });

  function updateDots() {
    dotsEl
      .querySelectorAll(".bs-dot")
      .forEach((d, i) => d.classList.toggle("active", i === activeIdx));
  }

  /* ── Review cards ─────────────────────────────────────────── */
  BOOKS.forEach((b, i) => {
    const card = document.createElement("div");
    card.className = "bs-card hidden";
    card.dataset.idx = i;
    card.innerHTML = `
      <div class="bs-card-title">${b.title}</div>
      <div class="bs-card-byline">
        ${b.author}
        <div class="bs-stars">
        </div>
      </div>
      <p class="bs-card-thoughts">&ldquo;${b.thoughts}&rdquo;</p>`;
    reviewEl.appendChild(card);
  });

  function getCard(idx) {
    return reviewEl.querySelector(`.bs-card[data-idx="${idx}"]`);
  }

  /* ── Lerp scroll ──────────────────────────────────────────── */
  let targetScrollX = 0,
    currentScrollX = 0,
    rafId = null;

  function getMaxScroll() {
    return Math.max(0, booksRow.scrollWidth - viewport.clientWidth);
  }

  function updateArrows() {
    arrowLeft.classList.toggle("visible", currentScrollX > 2);
    arrowRight.classList.toggle("visible", currentScrollX < getMaxScroll() - 2);
  }

  function animateScroll() {
    const diff = targetScrollX - currentScrollX;
    if (Math.abs(diff) < 0.3) {
      currentScrollX = targetScrollX;
      booksRow.style.transform = `translateX(${-currentScrollX}px)`;
      updateArrows();
      return;
    }
    currentScrollX += diff * 0.13;
    booksRow.style.transform = `translateX(${-currentScrollX}px)`;
    updateArrows();
    rafId = requestAnimationFrame(animateScroll);
  }

  function scrollTo(x) {
    targetScrollX = Math.max(0, Math.min(getMaxScroll(), x));
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(animateScroll);
  }

  arrowLeft.addEventListener("click", () => scrollTo(targetScrollX - 160));
  arrowRight.addEventListener("click", () => scrollTo(targetScrollX + 160));

  /* Wheel */
  viewport.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      scrollTo(targetScrollX + e.deltaY * 0.8);
    },
    { passive: false },
  );

  /* Mouse drag */
  let dragActive = false,
    dragStartX = 0,
    dragStartScroll = 0;
  viewport.addEventListener("mousedown", (e) => {
    dragActive = true;
    dragStartX = e.clientX;
    dragStartScroll = targetScrollX;
    viewport.style.cursor = "grabbing";
  });
  window.addEventListener("mousemove", (e) => {
    if (!dragActive) return;
    scrollTo(dragStartScroll - (e.clientX - dragStartX));
  });
  window.addEventListener("mouseup", () => {
    dragActive = false;
    viewport.style.cursor = "";
  });

  /* Touch */
  let touchStartX = 0,
    touchStartScroll = 0;
  viewport.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartScroll = targetScrollX;
    },
    { passive: true },
  );
  viewport.addEventListener(
    "touchmove",
    (e) => {
      scrollTo(touchStartScroll - (e.touches[0].clientX - touchStartX));
    },
    { passive: true },
  );

  updateArrows();

  /* ── Open / close ─────────────────────────────────────────── */
  function getWrap(idx) {
    return booksRow.querySelectorAll(".bs-book-wrap")[idx];
  }
  function getBtn(idx) {
    return booksRow.querySelectorAll(".bs-book-btn")[idx];
  }

  function openBook(idx) {
    const wrap = getWrap(idx);
    const btn = getBtn(idx);
    wrap.classList.add("open");
    btn.classList.add("open");
    btn.style.width = btn.dataset.openW + "px";

    requestAnimationFrame(() => {
      const viewW = viewport.clientWidth;
      const openW = parseInt(btn.dataset.openW);
      const bookLeft = wrap.offsetLeft - currentScrollX; // position within visible area
      const idealScroll = currentScrollX + bookLeft - (viewW - openW) / 2;
      scrollTo(idealScroll);
    });
  }

  function closeBook(idx) {
    const wrap = getWrap(idx);
    const btn = getBtn(idx);
    wrap.classList.remove("open");
    btn.classList.remove("open");
    btn.style.width = btn.dataset.spineW + "px";
  }

  /* ── Review transitions ───────────────────────────────────── */
  function showReview(idx, dir) {
    const emptyEl = document.getElementById("bsEmpty");
    if (activeIdx !== -1 && activeIdx !== idx) {
      const old = getCard(activeIdx);
      old.classList.remove("visible");
      old.classList.add(dir > 0 ? "exit-l" : "exit-r");
      setTimeout(() => {
        old.classList.add("hidden");
        old.classList.remove("exit-l", "exit-r");
      }, 360);
    }
    emptyEl.style.opacity = "0";
    const card = getCard(idx);
    card.classList.remove("hidden", "exit-l", "exit-r");
    card.classList.add(dir > 0 ? "enter-l" : "enter-r");
    card.getBoundingClientRect();
    requestAnimationFrame(() => {
      card.classList.remove("enter-l", "enter-r");
      card.classList.add("visible");
    });
  }

  function hideReview(idx) {
    const card = getCard(idx);
    const emptyEl = document.getElementById("bsEmpty");
    card.classList.remove("visible");
    card.classList.add("exit-l");
    setTimeout(() => {
      card.classList.add("hidden");
      card.classList.remove("exit-l");
    }, 360);
    emptyEl.style.opacity = "1";
  }

  /* ── Click handler ────────────────────────────────────────── */
  function handleClick(idx) {
    if (activeIdx === idx) {
      closeBook(idx);
      hideReview(idx);
      activeIdx = -1;
      updateDots();
      return;
    }
    const dir = idx > activeIdx ? 1 : -1;
    if (activeIdx !== -1) closeBook(activeIdx);
    openBook(idx);
    showReview(idx, dir);
    activeIdx = idx;
    updateDots();
  }

  /* ── Keyboard ─────────────────────────────────────────────── */
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeIdx !== -1) {
      closeBook(activeIdx);
      hideReview(activeIdx);
      activeIdx = -1;
      updateDots();
    }
    if (e.key === "ArrowRight") {
      if (activeIdx === -1) scrollTo(targetScrollX + 160);
      else {
        const n = Math.min(activeIdx + 1, BOOKS.length - 1);
        if (n !== activeIdx) handleClick(n);
      }
    }
    if (e.key === "ArrowLeft") {
      if (activeIdx === -1) scrollTo(targetScrollX - 160);
      else if (activeIdx > 0) handleClick(activeIdx - 1);
    }
  });
}

/* ============================================================
   Bootstrap — fetch data then init
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  fetch("booksdata.json")
    .then((r) => {
      if (!r.ok) throw new Error(`Could not load booksdata.json (${r.status})`);
      return r.json();
    })
    .then((books) => initBookshelf(books))
    .catch((err) => {
      console.error("[bookshelf]", err);
      const empty = document.getElementById("bsEmpty");
      if (empty)
        empty.textContent = "Could not load books — run via a local server.";
    });
});

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

/* ── Botanical SVG cover art ────────────────────────────────── */
function coverSVG(b) {
  const { c0, c1, accent, id } = b;
  const W = b.coverW || DEFAULT_COVER_W;
  const H = b.h || DEFAULT_H;

  /* Fallback for any book without a dedicated design */
  function fallback() {
    return `
      <rect width="${W}" height="${H}" fill="${c0}"/>
      ${Array.from(
        { length: 6 },
        (_, p) =>
          `<ellipse cx="${W / 2}" cy="${H * 0.38 - 20}" rx="5" ry="15"
          fill="rgba(255,255,255,0.55)" stroke="${accent}" stroke-width="0.6" opacity="0.65"
          transform="rotate(${p * 60} ${W / 2} ${H * 0.38})" />`,
      ).join("")}
      <circle cx="${W / 2}" cy="${H * 0.38}" r="9" fill="${accent}" opacity="0.2"/>
      <line x1="${W / 2}" y1="${H * 0.38 + 9}" x2="${W / 2}" y2="${H * 0.7}"
        stroke="${accent}" stroke-width="1.2" opacity="0.3"/>
      <text x="${W / 2}" y="18" text-anchor="middle" font-size="6.5" font-weight="600"
        fill="${accent}" letter-spacing="2" font-family="sans-serif" opacity="0.4">
        ${b.author.toUpperCase().slice(0, 20)}</text>
      <text x="${W / 2}" y="${H - 18}" text-anchor="middle" font-size="7.5" font-weight="700"
        fill="${accent}" letter-spacing="1.5" font-family="sans-serif" opacity="0.55">
        ${b.title.toUpperCase().slice(0, 18)}</text>`;
  }

  const arts = {
    /* ── Book 1: Chamomile daisy — soft rose pink ─────────────────
       10 slender white petals, golden pollen dots in centre,
       thin stem, one side leaf                                    */
    1: `
      <rect width="${W}" height="${H}" fill="${c0}"/>

      <!-- author -->
      <text x="${W / 2}" y="20" text-anchor="middle"
        font-size="6.5" font-weight="600" fill="${accent}"
        letter-spacing="2" font-family="sans-serif" opacity="0.4">BECKY CHAMBERS</text>

      <!-- 10 petals -->
      ${Array.from(
        { length: 10 },
        (_, p) =>
          `<ellipse cx="${W / 2}" cy="${H * 0.38 - 24}" rx="4.5" ry="16"
          fill="rgba(255,255,255,0.65)" stroke="${accent}" stroke-width="0.5" opacity="0.75"
          transform="rotate(${p * 36} ${W / 2} ${H * 0.38})" />`,
      ).join("")}

      <!-- flower centre -->
      <circle cx="${W / 2}" cy="${H * 0.38}" r="11" fill="${accent}" opacity="0.18"/>
      <circle cx="${W / 2}" cy="${H * 0.38}" r="7"  fill="${accent}" opacity="0.14"/>

      <!-- pollen dots -->
      ${Array.from({ length: 9 }, (_, d) => {
        const a = (d * 40 * Math.PI) / 180;
        return `<circle cx="${W / 2 + Math.cos(a) * 4.5}" cy="${H * 0.38 + Math.sin(a) * 4.5}"
          r="1" fill="${accent}" opacity="0.35"/>`;
      }).join("")}
      <circle cx="${W / 2}" cy="${H * 0.38}" r="2" fill="${accent}" opacity="0.3"/>

      <!-- stem -->
      <line x1="${W / 2}" y1="${H * 0.38 + 11}" x2="${W / 2}" y2="${H * 0.72}"
        stroke="${accent}" stroke-width="1.2" opacity="0.28"/>

      <!-- leaf -->
      <path d="M ${W / 2} ${H * 0.58} Q ${W / 2 + 20} ${H * 0.51} ${W / 2 + 17} ${H * 0.43}"
        fill="${accent}" opacity="0.1" stroke="${accent}" stroke-width="0.8"/>

      <!-- divider + title -->
      <line x1="18" y1="${H - 54}" x2="${W - 18}" y2="${H - 54}"
        stroke="${accent}" stroke-width="0.5" opacity="0.18"/>
      <text x="${W / 2}" y="${H - 36}" text-anchor="middle"
        font-size="7.5" font-weight="700" fill="${accent}"
        letter-spacing="1.5" font-family="sans-serif" opacity="0.55">PSALM FOR THE</text>
      <text x="${W / 2}" y="${H - 20}" text-anchor="middle"
        font-size="7.5" font-weight="700" fill="${accent}"
        letter-spacing="1.5" font-family="sans-serif" opacity="0.55">WILD-BUILT</text>`,

    /* ── Book 2: Anemone — soft periwinkle ────────────────────────
       6 rounded overlapping petals, dark centre with stamen ring  */
    2: `
      <rect width="${W}" height="${H}" fill="${c0}"/>

      <!-- author -->
      <text x="${W / 2}" y="20" text-anchor="middle"
        font-size="6.5" font-weight="600" fill="${accent}"
        letter-spacing="2" font-family="sans-serif" opacity="0.4">RUKMINI S</text>

      <!-- 6 petals -->
      ${Array.from(
        { length: 6 },
        (_, p) =>
          `<ellipse cx="${W / 2}" cy="${H * 0.4 - 27}" rx="13" ry="23"
          fill="rgba(255,255,255,0.45)" stroke="${accent}" stroke-width="0.6" opacity="0.6"
          transform="rotate(${p * 60} ${W / 2} ${H * 0.4})" />`,
      ).join("")}

      <!-- petal vein hints -->
      ${Array.from({ length: 6 }, (_, p) => {
        const a = ((p * 60 - 90) * Math.PI) / 180;
        const x1 = W / 2 + Math.cos(a) * 12,
          y1 = H * 0.4 + Math.sin(a) * 12;
        const x2 = W / 2 + Math.cos(a) * 30,
          y2 = H * 0.4 + Math.sin(a) * 30;
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
          stroke="${accent}" stroke-width="0.5" opacity="0.15"/>`;
      }).join("")}

      <!-- dark centre -->
      <circle cx="${W / 2}" cy="${H * 0.4}" r="14" fill="${accent}" opacity="0.22"/>
      <circle cx="${W / 2}" cy="${H * 0.4}" r="9"  fill="${accent}" opacity="0.18"/>

      <!-- stamen ring -->
      ${Array.from({ length: 14 }, (_, d) => {
        const a = (d * (360 / 14) * Math.PI) / 180;
        return `<circle cx="${W / 2 + Math.cos(a) * 6}" cy="${H * 0.4 + Math.sin(a) * 6}"
          r="1.2" fill="${accent}" opacity="0.38"/>`;
      }).join("")}
      <circle cx="${W / 2}" cy="${H * 0.4}" r="3" fill="${accent}" opacity="0.3"/>

      <!-- divider + title -->
      <line x1="18" y1="${H - 54}" x2="${W - 18}" y2="${H - 54}"
        stroke="${accent}" stroke-width="0.5" opacity="0.18"/>
      <text x="${W / 2}" y="${H - 36}" text-anchor="middle"
        font-size="6.5" font-weight="700" fill="${accent}"
        letter-spacing="1" font-family="sans-serif" opacity="0.55">WHOLE NUMBERS</text>
      <text x="${W / 2}" y="${H - 20}" text-anchor="middle"
        font-size="6.5" font-weight="700" fill="${accent}"
        letter-spacing="1" font-family="sans-serif" opacity="0.55">AND HALF TRUTHS</text>`,

    /* ── Book 3: Wild rose — soft sage ────────────────────────────
       5 petals with slight organic variation, two side leaves,
       ring of stamens                                             */
    3: `
      <rect width="${W}" height="${H}" fill="${c0}"/>

      <!-- author -->
      <text x="${W / 2}" y="20" text-anchor="middle"
        font-size="6.5" font-weight="600" fill="${accent}"
        letter-spacing="2" font-family="sans-serif" opacity="0.4">STEPHEN KING</text>

      <!-- 5 petals, slightly irregular sizes -->
      ${Array.from({ length: 5 }, (_, p) => {
        const rx = 11 + (p % 2) * 1.5;
        const ry = 20 + (p % 3) * 1.5;
        return `<ellipse cx="${W / 2}" cy="${H * 0.38 - 24}" rx="${rx}" ry="${ry}"
          fill="rgba(255,255,255,0.5)" stroke="${accent}" stroke-width="0.6" opacity="0.68"
          transform="rotate(${p * 72} ${W / 2} ${H * 0.38})" />`;
      }).join("")}

      <!-- centre -->
      <circle cx="${W / 2}" cy="${H * 0.38}" r="10" fill="${accent}" opacity="0.2"/>

      <!-- stamen dots -->
      ${Array.from({ length: 10 }, (_, d) => {
        const a = (d * 36 * Math.PI) / 180;
        return `<circle cx="${W / 2 + Math.cos(a) * 5.5}" cy="${H * 0.38 + Math.sin(a) * 5.5}"
          r="1" fill="${accent}" opacity="0.35"/>`;
      }).join("")}
      <circle cx="${W / 2}" cy="${H * 0.38}" r="2.5" fill="${accent}" opacity="0.28"/>

      <!-- stem -->
      <line x1="${W / 2}" y1="${H * 0.38 + 10}" x2="${W / 2}" y2="${H * 0.72}"
        stroke="${accent}" stroke-width="1.2" opacity="0.28"/>

      <!-- two leaves -->
      <path d="M ${W / 2} ${H * 0.53} Q ${W / 2 - 22} ${H * 0.47} ${W / 2 - 18} ${H * 0.39}"
        fill="${accent}" opacity="0.1" stroke="${accent}" stroke-width="0.8"/>
      <path d="M ${W / 2} ${H * 0.64} Q ${W / 2 + 21} ${H * 0.58} ${W / 2 + 17} ${H * 0.5}"
        fill="${accent}" opacity="0.1" stroke="${accent}" stroke-width="0.8"/>

      <!-- divider + title -->
      <line x1="18" y1="${H - 54}" x2="${W - 18}" y2="${H - 54}"
        stroke="${accent}" stroke-width="0.5" opacity="0.18"/>
      <text x="${W / 2}" y="${H - 32}" text-anchor="middle"
        font-size="11" font-weight="700" fill="${accent}"
        letter-spacing="2" font-family="sans-serif" opacity="0.55">ON</text>
      <text x="${W / 2}" y="${H - 16}" text-anchor="middle"
        font-size="11" font-weight="700" fill="${accent}"
        letter-spacing="2" font-family="sans-serif" opacity="0.55">WRITING</text>`,

    /* ── Book 4: Sunflower — soft butter ──────────────────────────
       14 pointed petals, large centre with Fibonacci seed spiral  */
    4: `
      <rect width="${W}" height="${H}" fill="${c0}"/>

      <!-- author -->
      <text x="${W / 2}" y="20" text-anchor="middle"
        font-size="6.5" font-weight="600" fill="${accent}"
        letter-spacing="2" font-family="sans-serif" opacity="0.4">TONY FADELL</text>

      <!-- 14 petals -->
      ${Array.from(
        { length: 14 },
        (_, p) =>
          `<ellipse cx="${W / 2}" cy="${H * 0.38 - 31}" rx="5" ry="21"
          fill="rgba(255,255,255,0.55)" stroke="${accent}" stroke-width="0.5" opacity="0.65"
          transform="rotate(${p * (360 / 14)} ${W / 2} ${H * 0.38})" />`,
      ).join("")}

      <!-- centre rings -->
      <circle cx="${W / 2}" cy="${H * 0.38}" r="19" fill="${accent}" opacity="0.22"/>
      <circle cx="${W / 2}" cy="${H * 0.38}" r="14" fill="${accent}" opacity="0.16"/>

      <!-- Fibonacci seed spiral -->
      ${Array.from({ length: 22 }, (_, d) => {
        const a = (d * 137.508 * Math.PI) / 180;
        const r = Math.sqrt(d + 1) * 2.8;
        if (r > 13) return "";
        return `<circle cx="${W / 2 + Math.cos(a) * r}" cy="${H * 0.38 + Math.sin(a) * r}"
          r="1.3" fill="${accent}" opacity="0.32"/>`;
      }).join("")}

      <!-- stem -->
      <line x1="${W / 2}" y1="${H * 0.38 + 19}" x2="${W / 2}" y2="${H * 0.72}"
        stroke="${accent}" stroke-width="1.5" opacity="0.28"/>

      <!-- leaf -->
      <path d="M ${W / 2} ${H * 0.57} Q ${W / 2 + 26} ${H * 0.49} ${W / 2 + 20} ${H * 0.41}"
        fill="${accent}" opacity="0.1" stroke="${accent}" stroke-width="0.9"/>

      <!-- divider + title -->
      <line x1="18" y1="${H - 54}" x2="${W - 18}" y2="${H - 54}"
        stroke="${accent}" stroke-width="0.5" opacity="0.18"/>
      <text x="${W / 2}" y="${H - 30}" text-anchor="middle"
        font-size="18" font-weight="900" fill="${accent}"
        letter-spacing="4" font-family="sans-serif" opacity="0.55">BUILD</text>
      <text x="${W / 2}" y="${H - 14}" text-anchor="middle"
        font-size="6" font-weight="600" fill="${accent}"
        letter-spacing="1.5" font-family="sans-serif" opacity="0.35">TONY FADELL · 2022</text>`,
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

    const wrap = document.createElement("div");
    wrap.className = "bs-book-wrap";
    wrap.dataset.idx = i;
    wrap.style.transform = `rotateZ(${deg}deg)`;

    const btn = document.createElement("button");
    btn.className = "bs-book-btn";
    btn.dataset.idx = i;
    btn.dataset.spineW = sw;
    btn.dataset.openW = sw + cw;
    btn.style.cssText = `width:${sw}px; perspective:1000px; -webkit-perspective:1000px;`;
    btn.setAttribute("aria-label", b.title);

    const spineEl = document.createElement("div");
    spineEl.className = "bs-spine";
    spineEl.style.cssText = `background:${b.spine}; color:${b.spineText}; width:${sw}px; height:${bh}px;`;
    spineEl.innerHTML = b.spineImage
      ? `<img src="${b.spineImage}"
           style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" alt="">
         <span class="bs-paper-tex"></span>`
      : `<span class="bs-paper-tex"></span>
         <span class="bs-spine-title" style="max-height:${bh - 24}px">${b.title}</span>`;

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
        <div class="bs-stars"></div>
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

  viewport.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      scrollTo(targetScrollX + e.deltaY * 0.8);
    },
    { passive: false },
  );

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
      const bookLeft = wrap.offsetLeft - currentScrollX;
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

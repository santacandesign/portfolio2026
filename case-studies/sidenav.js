/**
 * sidenav.js — auto-builds a scroll-map side nav from headings.
 * Include at the bottom of any case study page.
 *
 * Levels:
 *   1 = .cs-section-label (widest tick)
 *   2 = h2               (medium tick)
 *   3 = h3               (short tick)
 */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const wrap = document.querySelector(".cs-wrap");
    if (!wrap) return;

    // Collect section labels + h2 + h3, in DOM order
    const nodes = Array.from(
      wrap.querySelectorAll(".cs-section-label, h2, h3")
    );
    if (nodes.length < 2) return;

    // Give each node a stable ID for scrolling
    nodes.forEach(function (el, i) {
      if (!el.id) el.id = "sn-" + i;
    });

    // Build nav
    const nav = document.createElement("nav");
    nav.className = "cs-sidenav";
    nav.setAttribute("aria-label", "Page sections");

    const itemEls = [];

    nodes.forEach(function (el) {
      let level;
      if (el.classList.contains("cs-section-label")) {
        level = 1;
      } else if (el.tagName === "H2") {
        level = 2;
      } else {
        level = 3;
      }

      const text = el.textContent.trim().replace(/\s+/g, " ");

      const item = document.createElement("div");
      item.className = "cs-sidenav-item";
      item.dataset.level = level;

      const label = document.createElement("span");
      label.className = "cs-sidenav-label";
      label.textContent = text;

      const tick = document.createElement("span");
      tick.className = "cs-sidenav-tick";

      item.appendChild(label);
      item.appendChild(tick);

      item.addEventListener("click", function () {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      nav.appendChild(item);
      itemEls.push({ item: item, heading: el });
    });

    document.body.appendChild(nav);

    // Active tracking via scroll
    function getActiveIndex() {
      const threshold = window.innerHeight * 0.3;
      let active = 0;
      nodes.forEach(function (el, i) {
        if (el.getBoundingClientRect().top < threshold) active = i;
      });
      return active;
    }

    function updateActive() {
      const idx = getActiveIndex();
      itemEls.forEach(function (obj, i) {
        obj.item.classList.toggle("active", i === idx);
      });
    }

    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
  });
})();

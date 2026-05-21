"use strict";

// ── Scroll restoration ──────────────────────────────────────────────────────
// Prevent the browser restoring a mid-page scroll position on reload, which
// would drop the user into the case studies instead of the hero sketch.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

// ── Nav: mobile hamburger ───────────────────────────────────────────────────
function toggleMobileNav() {
  var menu      = document.getElementById("navMobileMenu");
  var hamburger = document.getElementById("navHamburger");
  var popup     = document.getElementById("navContactPopup");
  var btn       = document.getElementById("navContactBtn");
  var isOpening = !menu.classList.contains("open");
  menu.classList.toggle("open");
  hamburger.classList.toggle("is-open");
  popup.classList.toggle("menu-open", menu.classList.contains("open"));
  if (isOpening && popup.classList.contains("open")) {
    popup.classList.remove("open");
    btn.classList.remove("btn-open");
  }
}

// ── Nav: contact popup ──────────────────────────────────────────────────────
var _contactDocListener = null;

function _closeContactNav() {
  var popup = document.getElementById("navContactPopup");
  var btn   = document.getElementById("navContactBtn");
  popup.classList.remove("open");
  btn.classList.remove("btn-open");
  if (_contactDocListener) {
    document.removeEventListener("click", _contactDocListener);
    _contactDocListener = null;
  }
}

function toggleContactNav() {
  var popup     = document.getElementById("navContactPopup");
  var btn       = document.getElementById("navContactBtn");
  var menu      = document.getElementById("navMobileMenu");
  var hamburger = document.getElementById("navHamburger");
  var isOpen    = popup.classList.contains("open");

  if (isOpen) {
    _closeContactNav();
    return;
  }

  popup.classList.add("open");
  btn.classList.add("btn-open");
  if (menu.classList.contains("open")) {
    menu.classList.remove("open");
    hamburger.classList.remove("is-open");
    popup.classList.remove("menu-open");
  }

  if (_contactDocListener) document.removeEventListener("click", _contactDocListener);
  _contactDocListener = function (e) {
    if (!btn.contains(e.target)) _closeContactNav();
  };
  setTimeout(function () {
    document.addEventListener("click", _contactDocListener);
  }, 0);
}

// ── DOM-ready ───────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

  // p5 canvas scroll exit animation
  const p5holder  = document.getElementById("p5jsholder");
  const paragraph = document.querySelector("p");
  const vectorLine = document.querySelector(".vector-line");
  let lastScrollPosition = 0;

  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;
    const scrollingDown  = scrollPosition > lastScrollPosition;

    if (scrollPosition > viewportHeight * 0.2 && scrollingDown) {
      p5holder && p5holder.classList.add("p5js-exit");
      setTimeout(() => {
        paragraph  && paragraph.classList.add("paragraph-enter");
        vectorLine && vectorLine.classList.add("vector-line-enter");
      }, 300);
    } else if (scrollPosition <= viewportHeight * 0.2) {
      p5holder   && p5holder.classList.remove("p5js-exit");
      paragraph  && paragraph.classList.remove("paragraph-enter");
      vectorLine && vectorLine.classList.remove("vector-line-enter");
    }

    lastScrollPosition = scrollPosition;
  });

  // Intersection observers (null-guarded so missing elements don't crash)
  const navbar = document.querySelector(".navbar");

  const projectBeginning = document.querySelector(".projectbeginning");
  if (navbar && projectBeginning) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) navbar.classList.add("white-text");
      });
    }, { threshold: 0.5 }).observe(projectBeginning);
  }

  if (navbar) {
    const obs2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) navbar.classList.remove("white-text");
      });
    }, { threshold: 0.5 });
    const aboutMe   = document.querySelector(".aboutme");
    const herotext  = document.querySelector(".scrollContainer");
    if (aboutMe)  obs2.observe(aboutMe);
    if (herotext) obs2.observe(herotext);
  }

  // Smooth-scroll nav links (null-guarded)
  function bindScrollLink(linkId, targetSelector) {
    var link   = document.getElementById(linkId);
    var target = document.querySelector(targetSelector);
    if (link && target) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  bindScrollLink("herolink",    ".scrollContainer");
  bindScrollLink("worklink",    ".projectbeginning");
  bindScrollLink("resumelink",  ".resume");
  bindScrollLink("playlink",    ".play");
  bindScrollLink("contactlink", ".aboutme-text");

  // Email copy-to-clipboard
  const emailLink = document.getElementById("emailLink");
  if (emailLink) {
    emailLink.addEventListener("click", function (e) {
      e.preventDefault();
      navigator.clipboard.writeText("santrupti.danagaud@gmail.com").then(() => {
        emailLink.textContent = "Copied!";
        setTimeout(() => { emailLink.textContent = "Copy Email"; }, 3000);
      });
    });
  }
});

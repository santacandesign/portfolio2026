/* ============================================================
   BULB LOADER — About page
   Lit room → cord pulls the bulb down → click, lights out → cord
   springs back → fireflies come up in the dark → page reveals.
   No input needed; plays once per browser session.
   ============================================================ */

(function () {
  var SEEN_KEY = "aboutNightSeen";

  var loader = document.getElementById("bulbLoader");
  var rig = document.getElementById("bulbRig");
  if (!loader) return;

  // ─────────── TIMELINE (ms from start) ───────────
  var T = {
    pull: 900, // cord starts stretching
    off: 1290, // bottom of the tug → lights out
    fireflies: 1450, // fireflies fade up in the dark
    reveal: 4600, // loader starts fading (also waits for window load)
    done: 5500, // loader removed from the page
    // ↑ reveal - off ≈ 3.3s of held darkness: long enough to read the line
    // and watch the fireflies arrive before the page takes over.
  };
  // ────────────────────────────────────────────────

  function seen() {
    try {
      return sessionStorage.getItem(SEEN_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function markSeen() {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch (e) {}
  }

  function gutters() {
    return document.querySelectorAll(".firefly-gutter");
  }

  function lightFireflies(inFront) {
    if (window.startFireflies) window.startFireflies();
    if (!inFront) return;
    // Lift them over the overlay so the arrival is actually visible
    var g = gutters();
    for (var i = 0; i < g.length; i++) g[i].classList.add("is-front");
  }

  function finish() {
    loader.style.display = "none";
    var g = gutters();
    for (var i = 0; i < g.length; i++) g[i].classList.remove("is-front");
    markSeen();
  }

  // Already watched it this session, or they asked for less motion:
  // land straight on the dark page.
  var reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (seen() || reduced) {
    loader.classList.add("is-off");
    loader.style.display = "none";
    window.addEventListener("load", function () {
      lightFireflies(false);
    });
    markSeen();
    return;
  }

  var start = Date.now();
  var pageLoaded = false;
  var readyToReveal = false;

  function tryReveal() {
    if (!pageLoaded || !readyToReveal) return;
    loader.classList.add("is-gone");
    setTimeout(finish, T.done - T.reveal);
  }

  window.addEventListener("load", function () {
    pageLoaded = true;
    tryReveal();
  });

  setTimeout(function () {
    if (rig) rig.classList.add("is-pulling");
  }, T.pull);

  setTimeout(function () {
    loader.classList.add("is-off"); // the click — background snaps to night
  }, T.off);

  setTimeout(function () {
    lightFireflies(true);
  }, T.fireflies);

  setTimeout(function () {
    readyToReveal = true;
    tryReveal();
  }, T.reveal);

  // Safety net: never trap anyone behind the overlay if load never fires
  setTimeout(function () {
    if (loader.style.display !== "none") {
      loader.classList.add("is-gone");
      setTimeout(finish, 900);
    }
  }, 8000);
})();

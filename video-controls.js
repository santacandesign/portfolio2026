/* ============================================================
   VIDEO PLAY/PAUSE CONTROLS
   WCAG 2.2.2 (Pause, Stop, Hide).

   Finds every autoplaying video on the page, wraps it, and adds an
   always-visible corner button. Videos still autoplay exactly as
   before — this only adds the ability to stop them.

   One deliberate exception: if the visitor has asked their OS for
   reduced motion, the video starts PAUSED instead of playing. That
   setting exists precisely to stop unrequested movement, and a
   looping video is the thing it is meant to catch. Everyone else
   sees no behavioural change at all.
   To autoplay for everyone regardless, set HONOR_REDUCED_MOTION
   to false below.
   ============================================================ */

(function () {
  "use strict";

  var HONOR_REDUCED_MOTION = true;

  var ICONS =
    '<svg class="vc-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<rect x="6" y="5" width="4" height="14" rx="1"/>' +
    '<rect x="14" y="5" width="4" height="14" rx="1"/></svg>' +
    '<svg class="vc-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.3-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14z"/></svg>';

  function clean(s) {
    return s.replace(/\s+/g, " ").trim().slice(0, 70);
  }

  function describe(video) {
    // Give the button a name tied to what the video actually shows, so a
    // screen-reader user hears "Pause Two clicks to a better table" rather
    // than nine identical "Pause video" controls.

    // 1. A real caption, if there is one.
    var fig = video.closest("figure");
    var cap = fig && fig.querySelector("figcaption");
    if (cap && clean(cap.textContent)) return clean(cap.textContent);

    var near =
      video.parentElement &&
      video.parentElement.querySelector(".cs-img-caption, .sideproject-caption");
    if (near && clean(near.textContent)) return clean(near.textContent);

    // 2. A heading inside the block this video belongs to. Checked before
    //    the sibling walk because a card's own title sits *after* its
    //    media, and is a far better name than the intro paragraph above it.
    var block = video.closest(".sideproject, figure, .cs-section, .project");
    if (block) {
      var own = block.querySelector("h1,h2,h3,h4,h5,h6");
      if (own && clean(own.textContent)) return clean(own.textContent);
    }

    // 3. Otherwise the nearest heading above the video, walking back up
    //    through previous siblings and then out to ancestors.
    var node = video;
    while (node && node !== document.body) {
      var prev = node.previousElementSibling;
      while (prev) {
        if (/^H[1-6]$/.test(prev.tagName) && clean(prev.textContent)) {
          return clean(prev.textContent);
        }
        var h = prev.querySelector && prev.querySelector("h1,h2,h3,h4,h5,h6");
        if (h && clean(h.textContent)) return clean(h.textContent);
        prev = prev.previousElementSibling;
      }
      node = node.parentElement;
    }

    return "this video";
  }

  function setState(btn, playing, label) {
    btn.setAttribute("data-playing", playing ? "true" : "false");
    btn.setAttribute(
      "aria-label",
      (playing ? "Pause " : "Play ") + label
    );
  }

  /* Decide where the button should live, and what "the media" is for
     positioning purposes.

     Wrapping every video breaks two cases, so both are handled here:

     1. A video that is itself position:absolute (the phone mockups) is laid
        out against an ancestor's box. A relatively-positioned wrapper would
        become its new containing block and collapse it to zero width, so
        those videos are left untouched and the button is hung on the
        ancestor they were already positioned against.

     2. A video inside a link (the phone mockups again — the whole thumbnail
        is a link) must not get a button nested inside that <a>: a control
        inside a control is invalid and untabbable in a sensible order. In
        that case the button attaches as a sibling of the link instead —
        but that sibling can be a tall card (thumbnail + tags + heading +
        caption), so the button is NOT positioned by the wrap-relative CSS
        in that case. It's placed with inline coordinates pinned to the
        actual media frame (mediaBox), recalculated on resize so it tracks
        the responsive layout instead of drifting down over the caption. */
  function mountPoint(video) {
    var isAbs = getComputedStyle(video).position === "absolute";

    var host, mediaBox;
    if (isAbs) {
      // A known frame wrapper (e.g. the phone mockup's card) is a tighter,
      // more correct target than the video's raw offsetParent.
      mediaBox = video.closest(".phone-mockup-thumb") || video.offsetParent || video.parentElement;
      host = mediaBox;
    } else {
      var wrap = document.createElement("div");
      wrap.className = "vc-wrap";
      video.parentNode.insertBefore(wrap, video);
      wrap.appendChild(video);
      host = wrap;
      mediaBox = wrap;
    }

    // Never place the button inside an anchor or another button.
    var interactive = host.closest("a, button");
    var escaped = false;
    if (interactive && interactive.parentElement) {
      host = interactive.parentElement;
      escaped = true;
    }

    if (getComputedStyle(host).position === "static") {
      host.style.position = "relative";
    }
    return { host: host, mediaBox: mediaBox, escaped: escaped };
  }

  // Pins the button to the bottom-left corner of mediaBox, in coordinates
  // relative to host — used only when the button had to move outside its
  // natural wrapper (see mountPoint) and so can no longer rely on the
  // wrap-relative bottom/left in video-controls.css.
  function pinToMedia(btn, mediaBox, host) {
    var m = mediaBox.getBoundingClientRect();
    var h = host.getBoundingClientRect();
    var inset = 12;
    btn.style.top = Math.round(m.bottom - h.top - inset - btn.offsetHeight) + "px";
    btn.style.left = Math.round(m.left - h.left + inset) + "px";
    btn.style.bottom = "auto";
  }

  function enhance(video) {
    if (video.dataset.vcReady) return;
    video.dataset.vcReady = "1";

    var label = describe(video);
    var mp = mountPoint(video);
    var host = mp.host;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "vc-btn";
    btn.innerHTML = ICONS;
    host.appendChild(btn);

    if (mp.escaped) {
      var reposition = function () {
        pinToMedia(btn, mp.mediaBox, host);
      };
      reposition();
      window.addEventListener("resize", reposition);
      if (window.ResizeObserver) {
        new ResizeObserver(reposition).observe(mp.mediaBox);
      }
    }

    var reduce =
      HONOR_REDUCED_MOTION &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      video.removeAttribute("autoplay");
      video.pause();
    }

    setState(btn, !reduce, label);

    btn.addEventListener("click", function () {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });

    // Drive the button from the video's real state, so it stays correct
    // even when something else (the browser, reduced data mode) pauses it.
    video.addEventListener("play", function () {
      setState(btn, true, label);
    });
    video.addEventListener("pause", function () {
      setState(btn, false, label);
    });
  }

  function init() {
    var vids = document.querySelectorAll("video[autoplay], video.cs-video, video.sideproject-video");
    Array.prototype.forEach.call(vids, enhance);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

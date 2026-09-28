// "brain chaos" slider for the hero, read by sketch.js as
// window.chaosSlider.hour: morning = chaotic type, evening = calm type,
// 9 P.M. = night.
//  - mobile (≤ 900px): full-height vertical scale, 9 A.M. at the top; drag it.
//  - desktop: a ruler across the top, 9 A.M. at the left; it follows the
//    cursor anywhere over the hero (and can be dragged or keyed too).
// sketch.js calls show() once it's ready.
(function () {
  const root = document.getElementById("chaosSlider");
  if (!root) return;

  const body = root.querySelector(".chaos-body");
  const ticks = root.querySelector(".chaos-ticks");
  const track = root.querySelector(".chaos-track");
  const mood = root.querySelector(".chaos-mood");
  const thumb = root.querySelector(".chaos-thumb");
  const horizontal = window.innerWidth > 900;
  root.classList.toggle("is-horizontal", horizontal);
  if (horizontal) track.setAttribute("aria-orientation", "horizontal");
  const MIN = 9;
  const MAX = 21;

  // The thumb carries the mood. "settling" is the sunset hour (6–7 P.M.,
  // matching the sky in sketch.js); after that it's calm.
  const moodLabel = (h) => (h < 18 ? "chaos" : h < 19 ? "settling" : "calm");

  const fmt = (h) => {
    const hr = Math.floor(h);
    const suffix = hr >= 12 ? "pm" : "am";
    return (hr > 12 ? hr - 12 : hr) + " " + suffix;
  };

  // one tick per hour; every third hour carries a permanent label
  const tickEls = [];
  for (let h = MIN; h <= MAX; h++) {
    const li = document.createElement("li");
    li.className = "chaos-tick" + ((h - MIN) % 3 === 0 ? " is-major" : "");
    li.style[horizontal ? "left" : "top"] = ((h - MIN) / (MAX - MIN)) * 100 + "%";
    li.innerHTML = '<span class="chaos-tick-label">' + fmt(h) + "</span>";
    ticks.appendChild(li);
    tickEls.push(li);
  }

  // start at the visitor's actual time of day, clamped to the scale
  const now = new Date();
  const state = {
    hour: Math.min(MAX, Math.max(MIN, now.getHours() + now.getMinutes() / 60)),
  };

  function render() {
    const t = (state.hour - MIN) / (MAX - MIN);
    root.style.setProperty("--chaos-pos", t * 100 + "%");
    const active = Math.round(state.hour);
    tickEls.forEach((li, i) => li.classList.toggle("is-active", MIN + i === active));
    track.setAttribute("aria-valuenow", active);
    const word = moodLabel(state.hour);
    track.setAttribute("aria-valuetext", fmt(active) + ", " + word);
    if (mood.textContent !== word) mood.textContent = word;
  }

  function setFromPointer(e) {
    const rect = track.getBoundingClientRect();
    const t = horizontal
      ? (e.clientX - rect.left) / rect.width
      : (e.clientY - rect.top) / rect.height;
    state.hour = MIN + Math.min(1, Math.max(0, t)) * (MAX - MIN);
    render();
  }

  // Nudge the pill back and forth once the slider is visible, so a first
  // visitor sees it move and understands it can be dragged. Any real
  // interaction cancels it early.
  const dismissIntro = () => root.classList.remove("chaos-intro");
  thumb.addEventListener("animationend", dismissIntro);

  body.addEventListener("pointerdown", (e) => {
    dismissIntro();
    body.setPointerCapture(e.pointerId);
    root.classList.add("is-dragging");
    setFromPointer(e);
  });
  body.addEventListener("pointermove", (e) => {
    if (body.hasPointerCapture(e.pointerId)) setFromPointer(e);
  });
  const release = () => root.classList.remove("is-dragging");
  body.addEventListener("pointerup", release);
  body.addEventListener("pointercancel", release);

  // desktop: the cursor is the seeker, as before — anywhere over the hero
  if (horizontal) {
    const hero = root.closest(".hero") || document.body;
    hero.addEventListener("pointermove", (e) => {
      if (e.pointerType === "mouse") setFromPointer(e);
    });
  }

  track.addEventListener("keydown", (e) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    let next = null;
    if (step) next = Math.round(state.hour) + step;
    if (e.key === "Home") next = MIN;
    if (e.key === "End") next = MAX;
    if (next === null) return;
    e.preventDefault();
    dismissIntro();
    state.hour = Math.min(MAX, Math.max(MIN, next));
    render();
  });

  window.chaosSlider = {
    get hour() {
      return state.hour;
    },
    show() {
      root.hidden = false;
      // Desktop's cursor-follow already makes the ruler read as
      // interactive, so the nudge is mobile-only.
      if (horizontal) return;
      // Nudge toward whichever side of the track has room, so it never
      // shoves the pill past the end it's already resting near.
      const t = (state.hour - MIN) / (MAX - MIN);
      root.classList.toggle("chaos-intro-reverse", t > 0.5);
      // one frame so the browser registers the un-hidden state before the
      // animation class lands, otherwise it can skip straight to the end
      requestAnimationFrame(() => root.classList.add("chaos-intro"));
    },
    // track ends + ruler bottom, in hero (= canvas) coordinates
    geom() {
      if (root.hidden) return null;
      const hero = root.offsetParent.getBoundingClientRect();
      const t = track.getBoundingClientRect();
      const r = root.getBoundingClientRect();
      return { left: t.left - hero.left, right: t.right - hero.left, bottom: r.bottom - hero.top };
    },
  };

  render();
})();

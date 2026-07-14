/**
 * koi-pond.js — the animated koi pond footer, extracted into its own
 * component so it can be dropped into any page with a single mount point:
 *   <div id="koi-pond-mount"></div>
 *   <script src="koi-pond.js" defer></script>
 * Styles live in koi-pond.css.
 */
(function () {
  var KOI_POND_HTML = [
    '<footer class="koi-footer">',
    '<svg class="koi-scene" viewBox="0 0 1440 380" preserveAspectRatio="xMidYMid slice" aria-hidden="true">',
    "<defs>",
    '<filter id="koiNoise" x="0" y="0" width="100%" height="100%">',
    '<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7"/>',
    '<feColorMatrix type="matrix" values="0 0 0 0 0.85  0 0 0 0 0.95  0 0 0 0 0.88  0 0 0 0.5 0"/>',
    "</filter>",
    '<filter id="koiStreaks" x="0" y="0" width="100%" height="100%">',
    '<feTurbulence type="turbulence" baseFrequency="0.004 0.045" numOctaves="2" seed="3"/>',
    '<feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0"/>',
    "</filter>",
    '<filter id="koiRough" x="-20%" y="-40%" width="140%" height="180%">',
    '<feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="5" result="n"/>',
    '<feDisplacementMap in="SourceGraphic" in2="n" scale="20" xChannelSelector="R" yChannelSelector="G"/>',
    "</filter>",
    '<filter id="koiRippleNoise" x="-80%" y="-80%" width="260%" height="260%">',
    '<feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="11" result="n"/>',
    '<feDisplacementMap in="SourceGraphic" in2="n" scale="18" xChannelSelector="R" yChannelSelector="G"/>',
    "</filter>",
    '<filter id="koiCausticNoise" x="-60%" y="-60%" width="220%" height="220%">',
    '<feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="4" result="n">',
    '<animate attributeName="baseFrequency" values="0.01;0.02;0.01" dur="11s" repeatCount="indefinite"/>',
    "</feTurbulence>",
    '<feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G"/>',
    '<feGaussianBlur stdDeviation="14"/>',
    "</filter>",
    '<filter id="koiHaloNoise" x="-60%" y="-60%" width="220%" height="220%">',
    '<feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="2" seed="6" result="n"/>',
    '<feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/>',
    "</filter>",

    '<path id="koiBodyShape" d="M0 -1.0 C6 -2.6 16 -4.6 26 -5.4 C34.5 -6.1 43 -4.2 45.2 -1.6 C46.3 -0.5 46.3 0.5 45.2 1.6 C43 4.2 34.5 6.1 26 5.4 C16 4.6 6 2.6 0 1.0 Z"/>',
    '<path id="koiFinLobe" d="M0 0 Q-3.5 -6 -2.8 -11.5 A2.8 2.3 0 0 1 2.8 -11.5 Q3.5 -6 0 0 Z"/>',
    '<path id="koiTailShape" d="M1.5 0 Q-5.5 -5 -11 -0.6 Q-12.5 0 -11 0.6 Q-5.5 5 1.5 0 Z"/>',

    '<radialGradient id="padGrad" cx="38%" cy="35%" r="85%">',
    '<stop offset="0%" stop-color="#66b34c"/>',
    '<stop offset="100%" stop-color="#2f7a2a"/>',
    "</radialGradient>",
    '<radialGradient id="lotusGrad" cx="40%" cy="38%" r="85%">',
    '<stop offset="0%" stop-color="#4f9a3d"/>',
    '<stop offset="100%" stop-color="#1f5c1d"/>',
    "</radialGradient>",
    '<radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">',
    '<stop offset="0%" stop-color="#eafff2" stop-opacity="0.7"/>',
    '<stop offset="100%" stop-color="#eafff2" stop-opacity="0"/>',
    "</radialGradient>",
    "</defs>",

    '<g filter="url(#koiRough)">',
    '<g fill="#bfe8d2" opacity="0.3">',
    '<ellipse cx="200" cy="115" rx="90" ry="17"/>',
    '<ellipse cx="500" cy="85" rx="70" ry="14"/>',
    '<ellipse cx="850" cy="125" rx="100" ry="19"/>',
    '<ellipse cx="1150" cy="85" rx="80" ry="15"/>',
    '<ellipse cx="650" cy="165" rx="60" ry="12"/>',
    '<ellipse cx="1310" cy="160" rx="70" ry="13"/>',
    "</g>",
    '<g fill="#124a37" opacity="0.5">',
    '<ellipse cx="150" cy="315" rx="70" ry="15"/>',
    '<ellipse cx="330" cy="285" rx="55" ry="12"/>',
    '<ellipse cx="520" cy="335" rx="80" ry="17"/>',
    '<ellipse cx="700" cy="295" rx="60" ry="13"/>',
    '<ellipse cx="880" cy="330" rx="90" ry="19"/>',
    '<ellipse cx="1060" cy="285" rx="65" ry="14"/>',
    '<ellipse cx="1240" cy="325" rx="75" ry="16"/>',
    '<ellipse cx="420" cy="248" rx="45" ry="10"/>',
    '<ellipse cx="960" cy="245" rx="50" ry="10"/>',
    '<ellipse cx="1355" cy="278" rx="55" ry="11"/>',
    '<ellipse cx="240" cy="358" rx="60" ry="13"/>',
    '<ellipse cx="620" cy="262" rx="40" ry="9"/>',
    "</g>",
    '<g fill="#0a3324" opacity="0.5">',
    '<ellipse cx="450" cy="308" rx="50" ry="11"/>',
    '<ellipse cx="800" cy="350" rx="70" ry="14"/>',
    '<ellipse cx="1150" cy="358" rx="80" ry="15"/>',
    '<ellipse cx="90" cy="268" rx="40" ry="9"/>',
    "</g>",
    "</g>",

    '<ellipse class="koi-glow" cx="720" cy="170" rx="260" ry="150" fill="url(#sunGlow)"/>',
    '<ellipse cx="1340" cy="30" rx="300" ry="150" fill="url(#sunGlow)"/>',

    '<g class="koi-caustics" filter="url(#koiCausticNoise)">',
    '<ellipse class="koi-caustic kc-1" cx="300" cy="120" rx="170" ry="60" fill="#eafff2"/>',
    '<ellipse class="koi-caustic kc-2" cx="920" cy="270" rx="210" ry="70" fill="#eafff2"/>',
    '<ellipse class="koi-caustic kc-3" cx="1250" cy="110" rx="150" ry="55" fill="#eafff2"/>',
    "</g>",

    '<g fill="#ffffff">',
    '<circle class="kd-a" cx="120" cy="180" r="2.5"/>',
    '<circle class="kd-b" cx="210" cy="80" r="1.8"/>',
    '<circle class="kd-a" cx="340" cy="220" r="3"/>',
    '<circle class="kd-b" cx="460" cy="120" r="2"/>',
    '<circle class="kd-a" cx="560" cy="200" r="1.6"/>',
    '<circle class="kd-b" cx="640" cy="90" r="2.4"/>',
    '<circle class="kd-a" cx="760" cy="240" r="2"/>',
    '<circle class="kd-b" cx="830" cy="150" r="3.2"/>',
    '<circle class="kd-a" cx="940" cy="100" r="1.8"/>',
    '<circle class="kd-b" cx="1020" cy="210" r="2.6"/>',
    '<circle class="kd-a" cx="1120" cy="160" r="2"/>',
    '<circle class="kd-b" cx="1230" cy="230" r="3"/>',
    '<circle class="kd-a" cx="1310" cy="120" r="2.2"/>',
    '<circle class="kd-b" cx="390" cy="320" r="2"/>',
    '<circle class="kd-a" cx="720" cy="340" r="2.4"/>',
    '<circle class="kd-b" cx="1010" cy="320" r="1.8"/>',
    '<circle class="kd-a" cx="180" cy="300" r="2.2"/>',
    '<circle class="kd-b" cx="1390" cy="250" r="2"/>',
    "</g>",

    '<g class="koi-ripple" transform="translate(380,150)" filter="url(#koiRippleNoise)">',
    '<circle class="ripple-ring" style="animation-delay:0s" r="42"/>',
    '<circle class="ripple-ring" style="animation-delay:2.2s" r="42"/>',
    "</g>",
    '<g class="koi-ripple" transform="translate(1060,120)" filter="url(#koiRippleNoise)">',
    '<circle class="ripple-ring" style="animation-delay:3.4s" r="42"/>',
    '<circle class="ripple-ring" style="animation-delay:5.6s" r="42"/>',
    "</g>",
    '<g class="koi-ripple" transform="translate(720,305)" filter="url(#koiRippleNoise)">',
    '<circle class="ripple-ring" style="animation-delay:6.9s" r="42"/>',
    '<circle class="ripple-ring" style="animation-delay:9.1s" r="42"/>',
    "</g>",

    // noise sits above the background/caustics/ripples so those pick up
    // visible grain, but below the fish + lily pads so those stay crisp
    '<rect class="koi-streaks" x="0" y="0" width="1440" height="380" filter="url(#koiStreaks)"/>',
    '<rect class="koi-grain" x="0" y="0" width="1440" height="380" filter="url(#koiNoise)"/>',

    // each fish patrols its own elliptical loop — the loops are sized and
    // spaced so they never overlap, which means the fish can never touch as
    // they swim, and the pure-ellipse path has no corners at all so
    // rotate="auto" turns them smoothly the whole way round instead of
    // snapping at a sharp bend
    koiFish({
      cls: "koi-1",
      scale: 1.5,
      dur: "52s",
      path: "M 230 150 A 190 75 6 1 0 610 150 A 190 75 6 1 0 230 150 Z",
    }),
    koiFish({
      cls: "koi-2",
      scale: 1.15,
      dur: "38s",
      path: "M 910 140 A 170 70 -5 1 0 1250 140 A 170 70 -5 1 0 910 140 Z",
    }),
    koiFish({
      cls: "koi-3",
      scale: 0.9,
      dur: "30s",
      path: "M 610 290 A 130 55 -8 1 0 870 290 A 130 55 -8 1 0 610 290 Z",
    }),
    koiFish({
      cls: "koi-4",
      scale: 0.62,
      dur: "24s",
      path: "M 100 300 A 100 45 4 1 0 300 300 A 100 45 4 1 0 100 300 Z",
    }),
    koiFish({
      cls: "koi-5",
      scale: 0.72,
      dur: "28s",
      path: "M 1140 300 A 110 50 7 1 0 1360 300 A 110 50 7 1 0 1140 300 Z",
    }),
    koiFish({
      cls: "koi-6",
      scale: 0.48,
      dur: "20s",
      path: "M 635 70 A 75 32 -6 1 0 785 70 A 75 32 -6 1 0 635 70 Z",
    }),

    '<g transform="translate(1090,125)"><g class="koi-lily lily-1">',
    '<g filter="url(#koiHaloNoise)">',
    '<ellipse class="koi-lily-halo" rx="49" ry="45" stroke-width="2"/>',
    '<ellipse class="koi-lily-halo halo-b" rx="49" ry="45" stroke-width="2"/>',
    "</g>",
    '<path d="M-56 12 A54 50 0 0 1 -20 -52" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="1.5"/>',
    '<path d="M0 0 L38 -14 A40 40 0 1 0 38 14 Z" fill="url(#padGrad)"/>',
    '<path d="M0 0 L-33 -8 M0 0 L-28 -20 M0 0 L-15 -30 M0 0 L5 -33 M0 0 L-34 6 M0 0 L-24 24 M0 0 L-8 32 M0 0 L12 30" stroke="#245c1d" stroke-width="1.2" stroke-opacity="0.65" fill="none"/>',
    '<circle cx="-14" cy="-12" r="2.6" fill="#ffffff" opacity="0.85"/>',
    "</g></g>",
    '<g transform="translate(1160,170)"><g class="koi-lily lily-2">',
    '<g filter="url(#koiHaloNoise)">',
    '<ellipse class="koi-lily-halo" rx="32" ry="29" stroke-width="1.8"/>',
    '<ellipse class="koi-lily-halo halo-b" rx="32" ry="29" stroke-width="1.8"/>',
    "</g>",
    '<path d="M0 0 L24 -9 A26 26 0 1 0 24 9 Z" fill="url(#padGrad)"/>',
    '<path d="M0 0 L-21 -6 M0 0 L-14 -16 M0 0 L-2 -21 M0 0 L-20 10 M0 0 L-7 20" stroke="#245c1d" stroke-width="1" stroke-opacity="0.65" fill="none"/>',
    "</g></g>",
    '<g transform="translate(255,150)"><g class="koi-lily lily-3">',
    '<g filter="url(#koiHaloNoise)">',
    '<ellipse class="koi-lily-halo" rx="39" ry="36" stroke-width="2"/>',
    '<ellipse class="koi-lily-halo halo-b" rx="39" ry="36" stroke-width="2"/>',
    "</g>",
    '<path d="M44 -14 A42 38 0 0 1 18 40" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="1.5"/>',
    '<path d="M0 0 L30 -11 A32 32 0 1 0 30 11 Z" fill="url(#padGrad)"/>',
    '<path d="M0 0 L-26 -8 M0 0 L-18 -20 M0 0 L-4 -26 M0 0 L-27 8 M0 0 L-16 22 M0 0 L0 26" stroke="#245c1d" stroke-width="1.2" stroke-opacity="0.65" fill="none"/>',
    '<circle cx="10" cy="14" r="2.2" fill="#ffffff" opacity="0.85"/>',
    "</g></g>",
    '<g transform="translate(300,115)"><g class="koi-lily lily-4">',
    '<g filter="url(#koiHaloNoise)">',
    '<ellipse class="koi-lily-halo" rx="17" ry="15" stroke-width="1.5"/>',
    '<ellipse class="koi-lily-halo halo-b" rx="17" ry="15" stroke-width="1.5"/>',
    "</g>",
    '<g fill="#fffced">',
    '<ellipse rx="4.5" ry="12" transform="rotate(0)"/>',
    '<ellipse rx="4.5" ry="12" transform="rotate(45)"/>',
    '<ellipse rx="4.5" ry="12" transform="rotate(90)"/>',
    '<ellipse rx="4.5" ry="12" transform="rotate(135)"/>',
    "</g>",
    '<circle r="3.5" fill="#ff4545" opacity="0.85"/>',
    "</g></g>",

    '<g transform="translate(660,100) rotate(80)"><g class="koi-lily lotus-3">',
    '<g filter="url(#koiHaloNoise)">',
    '<ellipse class="koi-lily-halo" rx="54" ry="50" stroke-width="1.8"/>',
    '<ellipse class="koi-lily-halo halo-b" rx="54" ry="50" stroke-width="1.8"/>',
    "</g>",
    '<path d="M0 0 L42 -16 A46 46 0 1 0 42 16 Z" fill="url(#lotusGrad)" stroke="#1c4a16" stroke-width="1.8" stroke-opacity="0.45"/>',
    '<path d="M0 0 L-38 -9 M0 0 L-30 -24 M0 0 L-16 -35 M0 0 L-38 8 M0 0 L-26 27 M0 0 L-10 36 M0 0 L30 -28" stroke="#1c4a16" stroke-width="1.2" stroke-opacity="0.55" fill="none"/>',
    '<circle cx="-14" cy="12" r="2.4" fill="#ffffff" opacity="0.8"/>',
    "</g></g>",
    "</svg>",

    // textured outline lives in its own overlay <svg> with
    // preserveAspectRatio="none" so it stretches to exactly match the
    // rendered footer box on every side. The main scene above uses
    // "slice" to crop-to-fill without distorting fish/lily pads, but that
    // crops the left/right edges of its viewBox on wide/short containers —
    // which was hiding the left/right portions of the frame when it lived
    // inside that SVG. A separate non-scaling-stroke-free stretch overlay
    // guarantees all four sides of the border are always visible.
    '<svg class="koi-frame-scene" viewBox="0 0 1440 380" preserveAspectRatio="none" aria-hidden="true">',
    '<g class="koi-frame" filter="url(#koiRough)">',
    '<rect x="26" y="26" width="1388" height="328" rx="30" ry="30" fill="none" stroke="#eafff2" stroke-width="5" stroke-opacity="0.4"/>',
    '<rect x="36" y="36" width="1368" height="308" rx="22" ry="22" fill="none" stroke="#eafff2" stroke-width="1.5" stroke-opacity="0.28"/>',
    "</g>",
    "</svg>",

    "</footer>",
  ].join("\n");

  // builds one animated koi fish (slender top-view body + pectoral fin pair
  // + forked flowing tail) as an HTML string
  function koiFish(opts) {
    return [
      '<g class="koi ' + opts.cls + '">',
      '<animateMotion dur="' +
        opts.dur +
        '" repeatCount="indefinite" rotate="auto" path="' +
        opts.path +
        '"/>',
      '<g transform="scale(' + opts.scale + ')">',
      '<ellipse class="koi-shadow" cx="18" cy="5" rx="26" ry="4.5"/>',
      '<g class="koi-tail"><use href="#koiTailShape" class="koi-tail-fill"/></g>',
      // both fins use the identical ray layout (no swapping based on the
      // mirror flip) so the long ray consistently sweeps toward the tail
      // on both the top and bottom fin, instead of one reading "longer on
      // top" and the other "longer on bottom"
      '<g transform="translate(35,-4.5) scale(1,-1)">',
      finFan(),
      "</g>",
      '<g transform="translate(35,4.5)">',
      finFan(),
      "</g>",
      '<use href="#koiBodyShape" class="koi-body-fill"/>',
      "</g>",
      "</g>",
    ].join("\n");
  }

  // a pectoral fin as a flowing 3-lobe fan (a short, a long and a medium
  // ray splaying out from the same point), instead of one solid paddle.
  // the same fixed ray-length layout is used for both the top and bottom
  // fin (no swap based on the mirror flip), so the long ray sweeps toward
  // the tail consistently on both fins rather than one being longer on
  // its top edge and the other longer on its bottom edge.
  function finFan() {
    return [
      '<g class="koi-fin">',
      '<g transform="rotate(-124) scale(0.55)"><use href="#koiFinLobe" class="koi-fin-fill"/></g>',
      '<g transform="rotate(-146) scale(0.85)"><use href="#koiFinLobe" class="koi-fin-fill"/></g>',
      '<g transform="rotate(-168) scale(0.95)"><use href="#koiFinLobe" class="koi-fin-fill"/></g>',
      "</g>",
    ].join("\n");
  }

  function mount() {
    var target = document.getElementById("koi-pond-mount");
    if (!target) return;
    target.outerHTML = KOI_POND_HTML;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();

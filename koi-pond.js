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

    '<path id="koiBodyShape" d="M0 -1.0 C6 -2.6 16 -4.6 26 -5.4 C34.5 -6.1 43 -4.2 45.2 -1.6 C46.3 -0.5 46.3 0.5 45.2 1.6 C43 4.2 34.5 6.1 26 5.4 C16 4.6 6 2.6 0 1.0 Z"/>',
    '<path id="koiFinShape" d="M0 0 C-5 1.2 -11 4.2 -14 8.5 C-16 11.5 -14.5 14.5 -10.5 13.7 C-6.5 12.9 -2.5 8.7 0 0 Z"/>',
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

    '<g class="koi-caustics">',
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
    '<circle class="ripple-ring" style="animation-delay:1.4s" r="42"/>',
    "</g>",
    '<g class="koi-ripple" transform="translate(1060,120)" filter="url(#koiRippleNoise)">',
    '<circle class="ripple-ring" style="animation-delay:2.2s" r="42"/>',
    '<circle class="ripple-ring" style="animation-delay:3.6s" r="42"/>',
    "</g>",
    '<g class="koi-ripple" transform="translate(720,305)" filter="url(#koiRippleNoise)">',
    '<circle class="ripple-ring" style="animation-delay:4.4s" r="42"/>',
    '<circle class="ripple-ring" style="animation-delay:5.8s" r="42"/>',
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

    '<g transform="translate(1180,105)"><g class="koi-lily lily-1">',
    '<ellipse rx="49" ry="45" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2"/>',
    '<path d="M-56 12 A54 50 0 0 1 -20 -52" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="1.5"/>',
    '<path d="M0 0 L38 -14 A40 40 0 1 0 38 14 Z" fill="url(#padGrad)"/>',
    '<path d="M0 0 L-33 -8 M0 0 L-28 -20 M0 0 L-15 -30 M0 0 L5 -33 M0 0 L-34 6 M0 0 L-24 24 M0 0 L-8 32 M0 0 L12 30" stroke="#245c1d" stroke-width="1.2" stroke-opacity="0.65" fill="none"/>',
    '<circle cx="-14" cy="-12" r="2.6" fill="#ffffff" opacity="0.85"/>',
    "</g></g>",
    '<g transform="translate(1252,150)"><g class="koi-lily lily-2">',
    '<ellipse rx="32" ry="29" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="1.8"/>',
    '<path d="M0 0 L24 -9 A26 26 0 1 0 24 9 Z" fill="url(#padGrad)"/>',
    '<path d="M0 0 L-21 -6 M0 0 L-14 -16 M0 0 L-2 -21 M0 0 L-20 10 M0 0 L-7 20" stroke="#245c1d" stroke-width="1" stroke-opacity="0.65" fill="none"/>',
    "</g></g>",
    '<g transform="translate(165,120)"><g class="koi-lily lily-3">',
    '<ellipse rx="39" ry="36" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2"/>',
    '<path d="M44 -14 A42 38 0 0 1 18 40" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="1.5"/>',
    '<path d="M0 0 L30 -11 A32 32 0 1 0 30 11 Z" fill="url(#padGrad)"/>',
    '<path d="M0 0 L-26 -8 M0 0 L-18 -20 M0 0 L-4 -26 M0 0 L-27 8 M0 0 L-16 22 M0 0 L0 26" stroke="#245c1d" stroke-width="1.2" stroke-opacity="0.65" fill="none"/>',
    '<circle cx="10" cy="14" r="2.2" fill="#ffffff" opacity="0.85"/>',
    "</g></g>",
    '<g transform="translate(215,85)"><g class="koi-lily lily-4">',
    '<ellipse rx="17" ry="15" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1.5"/>',
    '<g fill="#fffced" stroke="#e8e6da" stroke-width="0.8">',
    '<ellipse rx="4.5" ry="12" transform="rotate(0)"/>',
    '<ellipse rx="4.5" ry="12" transform="rotate(45)"/>',
    '<ellipse rx="4.5" ry="12" transform="rotate(90)"/>',
    '<ellipse rx="4.5" ry="12" transform="rotate(135)"/>',
    "</g>",
    '<circle r="3.5" fill="#ff4545" opacity="0.85"/>',
    "</g></g>",

    '<g transform="translate(1400,355) rotate(-30)"><g class="koi-lily lotus-1">',
    '<ellipse rx="92" ry="86" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="2"/>',
    '<path d="M0 0 L74 -28 A80 80 0 1 0 74 28 Z" fill="url(#lotusGrad)" stroke="#1c4a16" stroke-width="2" stroke-opacity="0.45"/>',
    '<path d="M0 0 L-66 -16 M0 0 L-56 -40 M0 0 L-34 -60 M0 0 L-6 -66 M0 0 L-68 12 M0 0 L-52 44 M0 0 L-28 62 M0 0 L0 66 M0 0 L28 58 M0 0 L52 -48" stroke="#1c4a16" stroke-width="1.6" stroke-opacity="0.55" fill="none"/>',
    '<path d="M2 -22 L10 -8 L26 -14 L16 0 L26 14 L8 10 L-4 24 L-8 8 L-26 8 L-12 -4 L-20 -18 L-6 -10 Z" fill="#7cbf5a" opacity="0.4"/>',
    '<circle cx="-30" cy="-24" r="3" fill="#ffffff" opacity="0.8"/>',
    "</g></g>",
    '<g transform="translate(45,330) rotate(150)"><g class="koi-lily lotus-2">',
    '<ellipse rx="72" ry="67" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="2"/>',
    '<path d="M0 0 L56 -21 A62 62 0 1 0 56 21 Z" fill="url(#lotusGrad)" stroke="#1c4a16" stroke-width="2" stroke-opacity="0.45"/>',
    '<path d="M0 0 L-52 -12 M0 0 L-42 -32 M0 0 L-24 -48 M0 0 L-2 -52 M0 0 L-52 10 M0 0 L-38 36 M0 0 L-18 48 M0 0 L4 50 M0 0 L40 -38" stroke="#1c4a16" stroke-width="1.4" stroke-opacity="0.55" fill="none"/>',
    '<path d="M0 -16 L8 -6 L20 -10 L12 2 L18 12 L4 8 L-4 18 L-6 6 L-20 6 L-8 -4 L-14 -14 L-4 -8 Z" fill="#7cbf5a" opacity="0.4"/>',
    "</g></g>",
    '<g transform="translate(660,60) rotate(80)"><g class="koi-lily lotus-3">',
    '<path d="M0 0 L42 -16 A46 46 0 1 0 42 16 Z" fill="url(#lotusGrad)" stroke="#1c4a16" stroke-width="1.8" stroke-opacity="0.45"/>',
    '<path d="M0 0 L-38 -9 M0 0 L-30 -24 M0 0 L-16 -35 M0 0 L-38 8 M0 0 L-26 27 M0 0 L-10 36 M0 0 L30 -28" stroke="#1c4a16" stroke-width="1.2" stroke-opacity="0.55" fill="none"/>',
    '<circle cx="-14" cy="12" r="2.4" fill="#ffffff" opacity="0.8"/>',
    "</g></g>",
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
      '<g transform="translate(35,-4.5) scale(1,-1)"><use href="#koiFinShape" class="koi-fin-fill"/></g>',
      '<g transform="translate(35,4.5)"><use href="#koiFinShape" class="koi-fin-fill"/></g>',
      '<use href="#koiBodyShape" class="koi-body-fill"/>',
      "</g>",
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

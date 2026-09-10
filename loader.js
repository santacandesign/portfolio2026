(function () {
  var DISMISS_TIMEOUT_MS = 6000; // matches the `load` path's own timing feel

  var dismissed = false;
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    var overlay = document.getElementById('loadingOverlay');
    if (!overlay) return;
    overlay.classList.add('loader-fade-out');
    setTimeout(function () {
      overlay.style.display = 'none';
    }, 900);
  }

  window.addEventListener('load', dismiss);

  // Fallback: if a slow or blocked CDN keeps `load` from ever firing, don't
  // leave the visitor staring at an opaque, unclickable cream screen forever.
  setTimeout(dismiss, DISMISS_TIMEOUT_MS);
})();

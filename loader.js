(function () {
  window.addEventListener('load', function () {
    var overlay = document.getElementById('loadingOverlay');
    if (!overlay) return;
    overlay.classList.add('loader-fade-out');
    setTimeout(function () {
      overlay.style.display = 'none';
    }, 900);
  });
})();

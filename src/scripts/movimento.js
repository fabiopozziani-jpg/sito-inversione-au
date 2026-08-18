/* Movimento — attivazione additiva.
   La classe .js viene aggiunta subito: tutte le regole che nascondono contenuto
   sono vincolate a .js, quindi senza JavaScript la pagina resta interamente visibile. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  if (!('IntersectionObserver' in window)) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  var visti = new WeakSet();

  function scan() {
    var els = document.querySelectorAll('.reveal, .reveal-wipe');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (visti.has(el)) continue;
      visti.add(el);
      // Niente si rivela sopra la piega: il primo schermo e' completo subito.
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) { el.classList.add('is-in'); continue; }
      io.observe(el);
    }
  }

  // Rete di sicurezza attiva: a ogni scorrimento (una volta per frame) rivela cio' che e' entrato in vista.
  // Se l'IntersectionObserver non dovesse scattare, il contenuto compare comunque.
  var pending = false;
  function revealVisible() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () {
      pending = false;
      var els = document.querySelectorAll('.reveal:not(.is-in), .reveal-wipe:not(.is-in)');
      for (var i = 0; i < els.length; i++) {
        if (els[i].getBoundingClientRect().top < window.innerHeight * 0.95) els[i].classList.add('is-in');
      }
    });
  }

  function boot() {
    scan();
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', revealVisible, { passive: true });
    window.addEventListener('resize', revealVisible);
    // Rete di sicurezza: se qualcosa non viene mai osservato, resta comunque visibile.
    setTimeout(function () {
      document.querySelectorAll('.reveal:not(.is-in), .reveal-wipe:not(.is-in)').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add('is-in');
      });
    }, 2500);
  }

  if (document.body) boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();

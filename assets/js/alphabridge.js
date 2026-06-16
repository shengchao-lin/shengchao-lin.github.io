// Progressive enhancement for the AlphaBridge showcase (alphabridge.html).
// The page is fully readable without this file; everything here is motion
// and live-data polish, gated behind prefers-reduced-motion.
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Scroll reveals ------------------------------------------------------
  // The `ab-js` class arms the CSS that hides .ab-reveal elements; without JS
  // (or with reduced motion) nothing is ever hidden.
  if (!reduceMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("ab-js");
    var revealed = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("ab-in");
          revealed.unobserve(entry.target);
          if (entry.target.querySelector("[data-count-to]")) startCounters(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    document.querySelectorAll(".ab-reveal").forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      revealed.observe(el);
    });
  }

  // ---- Stat counters -------------------------------------------------------
  function startCounters(scope) {
    scope.querySelectorAll("[data-count-to]").forEach(function (el) {
      if (el.dataset.bbCounted) return;
      el.dataset.bbCounted = "1";
      var target = parseFloat(el.dataset.countTo);
      var decimals = parseInt(el.dataset.decimals || "0", 10);
      var start = null;
      var duration = 1200;
      function tick(ts) {
        if (start === null) start = ts;
        var t = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  // ---- Live champion stats -------------------------------------------------
  // The deploy workflow rebuilds /AlphaBridge/data/ from the latest evolution
  // artifacts; refresh the baked numbers from there when reachable.
  fetch("AlphaBridge/data/evolution_latest.json")
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (data) {
      if (!data || !data.evolution || !data.evolution.best_candidate) return;
      var best = data.evolution.best_candidate;
      var phenotype = best.phenotype || {};
      setStat("fitness", best.fitness, 1);
      setStat("genome", (best.genome || []).length, 0);
      setStat("rules", phenotype.rule_count_active, 0);
      updateMeter(phenotype.rule_count_active, phenotype.rule_capacity);
    })
    .catch(function () { /* baked fallback values stay in place */ });

  function updateMeter(active, capacity) {
    if (typeof active !== "number" || typeof capacity !== "number" || capacity <= 0) return;
    document.querySelectorAll("[data-stat-capacity]").forEach(function (el) {
      el.textContent = String(capacity);
    });
    var label = document.querySelector("[data-ab-meter]");
    if (label) label.textContent = String(active);
    var bar = document.querySelector(".ab-meter-bar");
    var fill = document.querySelector("[data-ab-meter-fill]");
    var meter = document.querySelector(".ab-meter");
    if (bar) bar.style.setProperty("--ab-seg", String(capacity));
    if (fill) fill.style.setProperty("--fill", (active / capacity) * 100 + "%");
    if (meter) meter.setAttribute("aria-label", active + " of " + capacity + " rule slots in use");
  }

  function setStat(name, value, decimals) {
    if (typeof value !== "number" || !isFinite(value)) return;
    var el = document.querySelector('[data-stat="' + name + '"]');
    if (!el) return;
    el.dataset.countTo = String(value);
    el.dataset.decimals = String(decimals);
    if (el.dataset.bbCounted) el.textContent = value.toFixed(decimals);
  }

  // ---- Demo video ----------------------------------------------------------
  // Autoplay the muted demo while it is on screen, pause when it leaves.
  var video = document.querySelector("[data-ab-autoplay]");
  if (video && !reduceMotion && "IntersectionObserver" in window) {
    video.removeAttribute("controls");
    var watcher = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            video.play().catch(function () { video.setAttribute("controls", ""); });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.35 }
    );
    watcher.observe(video);
  }
})();

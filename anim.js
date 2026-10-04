
(function () {
  "use strict";

  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  function tag(el, dir, delay) {
    el.classList.add("reveal", "r-" + dir);
    if (delay) el.style.transitionDelay = delay.toFixed(2) + "s";
  }

  var upGroups = [
    ".sec-head", ".why-card", ".band-inner", ".stat",
    ".qa", ".fcard", ".tcard", ".menu-shots figure"
  ];
  upGroups.forEach(function (sel) {
    var els = document.querySelectorAll(sel);
    els.forEach(function (el, i) {
      tag(el, "up", (i % 6) * 0.08);
    });
  });

  document
    .querySelectorAll(".games-grid > .game-card, .grid > .card")
    .forEach(function (el, i) {
      tag(el, i % 2 ? "right" : "left", Math.floor(i / 2) * 0.08);
    });

  document.querySelectorAll(".gallery").forEach(function (el) { tag(el, "left"); });
  document.querySelectorAll(".buybox").forEach(function (el) { tag(el, "right"); });

  var revealEls = document.querySelectorAll(".reveal");

  if (reduce || !hasIO) {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  function fmt(n) {

    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  }

  document.querySelectorAll(".stat .n").forEach(function (el) {
    var raw = el.textContent.trim();

    var m = raw.match(/^([\d\s'’  ]+)(\+?)$/);
    if (!m) return;
    var target = parseInt(m[1].replace(/[\s'’  ]/g, ""), 10);
    if (isNaN(target)) return;
    var suffix = m[2] || "";

    el.textContent = "0" + suffix;
    var started = false;

    function run() {
      if (started) return;
      started = true;
      if (reduce) { el.textContent = fmt(target) + suffix; return; }
      var dur = 1500, t0 = null;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(target * eased)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!hasIO) { run(); return; }
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(); io2.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    io2.observe(el);
  });

  var pick = document.getElementById("hero-pick");
  if (pick) {
    var GAMES = {
      wz: {
        img: "https://hackgaming.ch/unreal.webp", alt: "cheat warzone",
        count: "3 packs au choix",
        name: "Call of Duty : Black Ops 7 / Warzone",
        desc: "Aimbot, ESP, spoofer ranked & triggerbot. 100 % invisible en streaming.",
        price: "389 €", consoles: "🖥️ PC · 🎮 Xbox · 🎮 PS5",
        cta: "Découvrir les packs Warzone →", href: "https://hackgaming.ch/cheat-warzone.html",
        glow: "59,130,246"
      },
      arc: {
        img: "https://hackgaming.ch/arc-ghost.webp", alt: "cheat arc rider pc",
        count: "3 packs au choix",
        name: "ARC Raiders",
        desc: "Aimbot, ESP joueurs & robots, ESP loot & extraction, triggerbot et spoofer HWID.",
        price: "389 €", consoles: "🖥️ PC · 🎮 Xbox · 🎮 PS5",
        cta: "Découvrir les packs ARC Raiders →", href: "https://hackgaming.ch/cheat-arc-rider.html",
        glow: "245,158,11"
      },
      fn: {
        img: "https://hackgaming.ch/fn-delta.webp", alt: "cheat fortnite",
        count: "2 packs au choix",
        name: "Fortnite",
        desc: "Aimbot sur mesure, ESP joueurs, ESP loot & coffres, spoofer HWID + cleaner.",
        price: "389 €", consoles: "🖥️ PC · 🎮 Xbox · 🎮 PS5",
        cta: "Découvrir les packs Fortnite →", href: "https://hackgaming.ch/cheat-fortnite.html",
        glow: "139,92,246"
      },
      val: {
        img: "https://hackgaming.ch/valorant-maxim.webp", alt: "cheat valorant pc",
        count: "1 pack proposé",
        name: "Valorant",
        desc: "Aimbot, ESP, triggerbot et spoofer HWID. Indétectable, 100 % stream proof.",
        price: "389 €", consoles: "🖥️ PC · 🎮 Xbox · 🎮 PS5",
        cta: "Découvrir le pack Valorant →", href: "https://hackgaming.ch/cheat-valorant.html",
        glow: "255,70,85"
      },
      tk: {
        img: "https://hackgaming.ch/tarkov-reaper.webp", alt: "cheat tarkov pc",
        count: "1 pack proposé",
        name: "Escape from Tarkov",
        desc: "Aimbot, ESP joueurs & scavs, ESP loot et extraction, spoofer HWID. Opérationnel immédiatement.",
        price: "389 €", consoles: "🖥️ PC",
        cta: "Découvrir le pack Tarkov →", href: "https://hackgaming.ch/cheat-tarkov.html",
        glow: "166,154,70"
      }
    };

    var tabs = pick.querySelectorAll(".pick-tab");
    var stage = pick.querySelector(".pick-stage");
    var elGlow = pick.querySelector(".pick-glow");
    var elImg = pick.querySelector(".pick-img");
    var elCount = pick.querySelector(".pick-count");
    var elName = pick.querySelector(".pick-name");
    var elDesc = pick.querySelector(".pick-desc");
    var elPrice = pick.querySelector(".pick-price");
    var elCons = pick.querySelector(".pick-consoles");
    var elCta = pick.querySelector(".pick-cta");

    function apply(key) {
      var g = GAMES[key];
      if (!g) return;
      pick.style.setProperty("--game", "rgb(" + g.glow + ")");
      elGlow.style.background =
        "radial-gradient(closest-side,rgba(" + g.glow + ",.55),transparent)";
      elImg.src = g.img;
      elImg.alt = g.alt;
      elImg.title = g.alt;
      elCount.textContent = g.count;
      elName.textContent = g.name;
      elDesc.textContent = g.desc;
      elPrice.innerHTML = "à partir de <b>" + g.price + "</b>";
      elCons.textContent = g.consoles;
      elCta.textContent = g.cta;
      elCta.href = g.href;
      elCta.title = g.alt;
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        if (tab.classList.contains("is-active")) return;
        tabs.forEach(function (t) { t.classList.remove("is-active"); });
        tab.classList.add("is-active");
        var key = tab.getAttribute("data-game");
        if (reduce) { apply(key); return; }
        stage.classList.add("fade");
        setTimeout(function () {
          apply(key);
          stage.classList.remove("fade");
        }, 180);
      });
    });

    apply("wz");
  }
})();

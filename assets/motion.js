(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reduce) return;

  /* ---------- floating dust (canvas particle field) ---------- */
  var canvas = document.createElement("canvas");
  canvas.id = "dust";
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");

  var W = 0, H = 0, dpr = 1;
  var motes = [];
  var mx = 0, my = 0, tmx = 0, tmy = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  /* 每个粒子：在一条看不见的"地面"上做阻尼弹跳，能量耗尽后停顿一下再起跳 */
  function make(y) {
    var z = 0.35 + Math.random() * 0.65;
    return {
      x: Math.random() * W,
      y: y,
      floor: y,
      r: 0.5 + Math.random() * 1.7,
      z: z,
      a: 0.12 + Math.random() * 0.45,
      vy: -(0.5 + Math.random() * 1.1),
      g: 0.018 + Math.random() * 0.022,
      bounce: 0.5 + Math.random() * 0.24,
      jx: (Math.random() - 0.5) * 0.5,
      ph: Math.random() * Math.PI * 2,
      rest: Math.random() * 70,
      pop: 0,
      gold: Math.random() < 0.28
    };
  }

  function build() {
    var target = Math.round(Math.min(110, Math.max(38, (W * H) / 15000)));
    motes = [];
    for (var i = 0; i < target; i++) motes.push(make(Math.random() * H));
  }

  function palette() {
    return root.getAttribute("data-theme") === "light"
      ? { a: "125, 115, 100", b: "118, 126, 138" }
      : { a: "216, 198, 161", b: "235, 235, 240" };
  }

  var tick = 0;
  function drawDust() {
    ctx.clearRect(0, 0, W, H);
    var p = palette();
    mx += (tmx - mx) * 0.045;
    my += (tmy - my) * 0.045;
    tick += 0.01;

    for (var i = 0; i < motes.length; i++) {
      var m = motes[i];

      if (m.rest > 0) {
        m.rest -= 1;
      } else {
        var k = 0.6 + m.z * 0.6;
        m.vy += m.g * k;
        m.y += m.vy * k;
        m.x += m.jx * m.z;

        if (m.y >= m.floor) {
          m.y = m.floor;
          m.vy = -m.vy * m.bounce;
          m.jx *= 0.55;
          m.pop = 1;
          if (Math.abs(m.vy) < 0.22) {
            m.rest = 12 + Math.random() * 74;
            m.vy = -(0.7 + Math.random() * 1.3);
            m.jx = (Math.random() - 0.5) * 0.6;
          }
        }
      }

      m.pop *= 0.86;
      m.floor -= 0.05 * m.z;

      if (m.floor < -14) {
        motes[i] = make(H + 10 + Math.random() * 60);
        m = motes[i];
      }
      if (m.x < -12) m.x = W + 12;
      if (m.x > W + 12) m.x = -12;

      var px = m.x + mx * 26 * m.z;
      var py = m.y + my * 26 * m.z;
      var twinkle = 0.65 + 0.35 * Math.sin(tick * 2.2 + m.ph);
      var alpha = m.a * twinkle * (1 + m.pop * 0.7);
      var col = m.gold ? p.a : p.b;

      /* 起跳拉伸 / 落地压扁 */
      var sp = Math.min(0.4, Math.abs(m.vy) * 0.18);
      var rx = Math.max(0.2, m.r * (1 + m.pop * 0.6 - sp * 0.45));
      var ry = Math.max(0.2, m.r * (1 - m.pop * 0.25 + sp * 0.5));

      ctx.beginPath();
      ctx.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + col + "," + Math.min(0.95, alpha).toFixed(3) + ")";
      ctx.fill();

      if (m.r > 1.5 || m.pop > 0.35) {
        ctx.beginPath();
        ctx.ellipse(px, py, rx * 4.2, ry * 4.2, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + col + "," + (m.a * (0.05 + m.pop * 0.06)).toFixed(3) + ")";
        ctx.fill();
      }
    }
  }

  resize();
  window.addEventListener("resize", resize);

  /* ---------- cursor glow ---------- */
  var glow = null;
  if (fine) {
    glow = document.createElement("div");
    glow.id = "glow";
    document.body.appendChild(glow);
  }
  var gx = 0, gy = 0;

  function drawGlow() {
    if (!glow) return;
    gx += (mouseX - gx) * 0.09;
    gy += (mouseY - gy) * 0.09;
    glow.style.transform = "translate3d(" + gx + "px," + gy + "px,0)";
  }

  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;

  window.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    tmx = (e.clientX / window.innerWidth - 0.5) * 2;
    tmy = (e.clientY / window.innerHeight - 0.5) * 2;
    if (glow && glow.style.opacity !== "1") glow.style.opacity = "1";
  }, { passive: true });

  window.addEventListener("mouseout", function () {
    if (glow) glow.style.opacity = "0";
  });

  /* ---------- scroll progress ---------- */
  var bar = document.createElement("i");
  bar.id = "progress";
  document.body.appendChild(bar);

  function paintProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.pageYOffset / max)) : 0;
    bar.style.transform = "scaleX(" + p + ")";
  }
  window.addEventListener("scroll", paintProgress, { passive: true });
  window.addEventListener("resize", paintProgress);
  paintProgress();

  /* ---------- hero extras ---------- */
  var hero = document.querySelector(".hero");
  if (hero) {
    var mist = document.createElement("div");
    mist.className = "hero-mist";
    hero.insertBefore(mist, hero.firstChild);

    var actions = hero.querySelector(".hero-actions");
    if (actions && !hero.querySelector(".scroll-hint")) {
      var hint = document.createElement("div");
      hint.className = "scroll-hint";
      actions.parentNode.insertBefore(hint, actions.nextSibling);
    }
  }

  /* ---------- pointer spotlight on surfaces ---------- */
  Array.prototype.forEach.call(document.querySelectorAll(".card, .tile, .cap"), function (el) {
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      el.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    }, { passive: true });
  });

  /* ---------- magnetic buttons ---------- */
  if (fine) {
    Array.prototype.forEach.call(document.querySelectorAll(".btn"), function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.transform = "translate3d(" + (dx * 10).toFixed(2) + "px," + (dy * 6).toFixed(2) + "px,0)";
      }, { passive: true });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "translate3d(0,0,0)";
      });
    });
  }

  /* ---------- stagger reveal ---------- */
  Array.prototype.forEach.call(document.querySelectorAll(".gallery, .tiles, .caps"), function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty("--d", (i % 3) * 90 + "ms");
    });
  });

  /* ---------- theme switch transition ---------- */
  var themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      document.body.classList.add("switching");
      setTimeout(function () { document.body.classList.remove("switching"); }, 600);
    });
  }

  /* ---------- loop ---------- */
  var hidden = false;
  document.addEventListener("visibilitychange", function () { hidden = document.hidden; });

  (function loop() {
    if (!hidden) {
      drawDust();
      drawGlow();
    }
    requestAnimationFrame(loop);
  })();
})();

(function () {
  var root = document.documentElement;
  var STORE_THEME = "jsc-theme";
  var STORE_LANG = "jsc-lang";

  /* ---------- theme ---------- */
  var themeToggle = document.getElementById("themeToggle");
  var themeIcon = document.getElementById("themeIcon");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeIcon) themeIcon.textContent = theme === "dark" ? "\u25d1" : "\u25d0";
  }

  var savedTheme = localStorage.getItem(STORE_THEME);
  applyTheme(savedTheme === "light" ? "light" : "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(STORE_THEME, next);
    });
  }

  /* ---------- language ---------- */
  var langToggle = document.getElementById("langToggle");
  var nodes = document.querySelectorAll("[data-en]");
  var titleEl = document.querySelector("title[data-en]");

  Array.prototype.forEach.call(nodes, function (el) {
    if (!el.hasAttribute("data-zh")) el.setAttribute("data-zh", el.textContent.trim());
  });

  function applyLang(lang) {
    Array.prototype.forEach.call(nodes, function (el) {
      var target = lang === "en" ? el.getAttribute("data-en") : el.getAttribute("data-zh");
      if (target) el.textContent = target;
    });
    root.setAttribute("lang", lang === "en" ? "en" : "zh-CN");
    if (langToggle) langToggle.textContent = lang === "en" ? "中文" : "EN";
    if (titleEl && titleEl.hasAttribute("data-en")) {
      if (!titleEl.hasAttribute("data-zh")) titleEl.setAttribute("data-zh", titleEl.textContent.trim());
      titleEl.textContent = lang === "en" ? titleEl.getAttribute("data-en") : titleEl.getAttribute("data-zh");
    }
  }

  applyLang(localStorage.getItem(STORE_LANG) === "en" ? "en" : "zh");

  if (langToggle) {
    langToggle.addEventListener("click", function () {
      var next = root.getAttribute("lang") === "zh-CN" ? "en" : "zh";
      applyLang(next);
      localStorage.setItem(STORE_LANG, next);
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    Array.prototype.forEach.call(revealEls, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add("in"); });
  }

  /* ---------- lightbox (gallery pages) ---------- */
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lightboxImg = document.getElementById("lightboxImg");
    var closeBtn = document.getElementById("lightboxClose");

    function openLightbox(src) {
      lightboxImg.src = src;
      lightbox.classList.add("open");
    }
    function closeLightbox() { lightbox.classList.remove("open"); }

    Array.prototype.forEach.call(document.querySelectorAll(".masonry-item img"), function (img) {
      img.addEventListener("click", function () { openLightbox(img.getAttribute("src")); });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLightbox(); });
  }
})();

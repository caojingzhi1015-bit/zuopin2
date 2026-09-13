(function () {
  var sets = window.__SETS__ || [];
  sets.forEach(function (set) {
    var container = document.getElementById(set[0]);
    if (!container) return;
    var base = set[1];
    set[2].forEach(function (name) {
      var src = base + name;
      var item = document.createElement("div");
      item.className = "masonry-item";
      var img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.loading = "lazy";
      item.appendChild(img);
      container.appendChild(item);
    });
  });
})();

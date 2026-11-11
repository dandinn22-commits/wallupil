/* WallUp catalog + wall calculator.
   To add real products: fill pieceW / pieceH (in meters) for each item,
   and the calculator will also show how many pieces are needed. */
(function () {
  var WA = "972536196048";
  var PRODUCTS = [
    { id: "slats", name: "סרגלים מחורצים", img: "../img/p13.jpg",
      desc: "קווים אנכיים עם עומק וצל. מתאים לקיר טלוויזיה, קיר מיטה ועמודים.",
      colors: "חול, אלון, אגוז, טאופ, שחור", pieceW: null, pieceH: null },
    { id: "panels", name: "פלטות עם פסי ניתוק", img: "../img/p12.jpg",
      desc: "משטח גדול ושקט עם קו שחור דק. מתאים לקירות ארוכים בסלון ובמסדרון.",
      colors: "חול, שמנת, אפור, דמוי שיש ובטון", pieceW: null, pieceH: null },
    { id: "mix", name: "שילוב פלטות וסרגלים", img: "../img/p02.jpg",
      desc: "קיר אדריכלי עם קצב, אפשר עם תאורת לד בין הסרגלים.",
      colors: "לפי בחירה", pieceW: null, pieceH: null },
    { id: "molding", name: "קיר קרניזים", img: "../img/p21.jpg",
      desc: "מסגרות קלאסיות בולטות, בלבן או צבועות בגוון אחד עם הקיר.",
      colors: "לבן או כל גוון", pieceW: null, pieceH: null, link: "kir-karnizim.html" }
  ];

  function fmt(n) { return (Math.round(n * 10) / 10).toLocaleString("he-IL"); }

  /* catalog cards */
  var cat = document.getElementById("cat");
  if (cat) {
    PRODUCTS.forEach(function (p) {
      var a = document.createElement("article");
      a.className = "cat-card";
      var msg = "היי WallUp, אני מתעניין ב" + p.name + ". אשמח להדמיה חינם והצעת מחיר. מצרף תמונה של הקיר:";
      a.innerHTML =
        '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
        '<div class="cat-body"><h3>' + p.name + '</h3><p>' + p.desc + '</p>' +
        '<p class="cat-colors"><b>גוונים:</b> ' + p.colors + '</p>' +
        '<div class="cat-actions"><a class="btn btn-wa" target="_blank" rel="noopener" href="https://wa.me/' + WA + '?text=' + encodeURIComponent(msg) + '">שאלו בוואטסאפ</a>' +
        (p.link ? '<a class="link" href="' + p.link + '">עוד על ' + p.name + '</a>' : '') + '</div></div>';
      cat.appendChild(a);
    });
  }

  /* calculator */
  var form = document.getElementById("calc");
  if (!form) return;
  var types = document.getElementById("types");
  PRODUCTS.forEach(function (p, i) {
    var l = document.createElement("label");
    l.className = "type";
    l.innerHTML = '<input type="radio" name="type" value="' + p.id + '"' + (i === 0 ? " checked" : "") + '>' +
      '<img src="' + p.img + '" alt="" loading="lazy"><span>' + p.name + '</span>';
    types.appendChild(l);
  });

  var res = document.getElementById("result"), msgEl = document.getElementById("cMsg");
  var send = document.getElementById("sendWa");

  function num(id) { var v = parseFloat(String(document.getElementById(id).value).replace(",", ".")); return isFinite(v) ? v : 0; }

  function calc() {
    var w = num("cw"), h = num("ch"), d = Math.max(0, Math.round(num("cd"))), n = Math.max(0, Math.round(num("cn")));
    var sel = form.querySelector('input[name="type"]:checked');
    var p = PRODUCTS.filter(function (x) { return sel && x.id === sel.value; })[0] || PRODUCTS[0];
    if (w < 0.5 || h < 0.5) { res.hidden = true; return; }
    msgEl.textContent = "";
    var gross = w * h, net = Math.max(0, gross - d * 1.9 - n * 1.2), total = net * 1.1;
    document.getElementById("rArea").textContent = fmt(total) + ' מ"ר';
    document.getElementById("rSub").textContent = "קיר " + fmt(w) + " × " + fmt(h) + " מטר · " + p.name +
      (d || n ? " · בניכוי " + [d ? (d === 1 ? "דלת אחת" : d + " דלתות") : "", n ? (n === 1 ? "חלון אחד" : n + " חלונות") : ""].filter(Boolean).join(" ו") : "");
    var pieces = document.getElementById("rPieces"), pc = 0;
    if (p.pieceW && p.pieceH) {
      pc = Math.ceil(total / (p.pieceW * p.pieceH));
      pieces.textContent = "בערך " + pc + " יחידות";
      pieces.hidden = false;
    } else { pieces.hidden = true; }
    var city = String(document.getElementById("cc").value || "").trim();
    var lines = [
      "היי WallUp, חישבתי במחשבון באתר:",
      "סוג חיפוי: " + p.name,
      "מידות הקיר: " + fmt(w) + " × " + fmt(h) + " מטר",
      (d || n) ? "דלתות: " + d + ", חלונות: " + n : null,
      'שטח לחיפוי כולל פחת: ' + fmt(total) + ' מ"ר',
      pc ? "כמות משוערת: " + pc + " יחידות" : null,
      city ? "עיר: " + city : null,
      "אשמח להדמיה חינם והצעת מחיר. מצרף תמונה של הקיר:"
    ].filter(Boolean);
    send.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(lines.join("\n"));
    res.hidden = false;
  }

  form.addEventListener("input", calc);
  form.addEventListener("change", calc);
  form.addEventListener("submit", function (e) { e.preventDefault(); calc(); });
  send.addEventListener("click", function (e) {
    if (res.hidden) { e.preventDefault(); msgEl.textContent = "הזינו רוחב וגובה של הקיר כדי לחשב."; msgEl.classList.add("err"); }
  });
})();

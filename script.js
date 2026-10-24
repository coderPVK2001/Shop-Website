/* =========================================================
   Preeti Ladies Tailor - interactive features
   EASY EDIT SECTION (top of file): photos, festival date, ticker.
   ========================================================= */

/* ---------------------------------------------------------
   1) YOUR COLLECTION PHOTOS
   To add a new dress photo:
     - put the picture in the "images" folder (e.g. images/dress3.jpg)
     - add one line below:  { src: "images/dress3.jpg", title: "Name", cat: "dresses" },
   cat can be:  dresses | gowns | materials | tops
   Newest photos should be added at the TOP of the list.
   --------------------------------------------------------- */
var GALLERY = [
    { src: "https://lh3.googleusercontent.com/p/AF1QipMqpEtj2TXH0FcUZHhU4Hb8YLmhsjs64-PKlywI=s1360-w1360-h1020-rw", title: "Casual Wear", cat: "dresses" },
    { src: "https://lh3.googleusercontent.com/p/AF1QipMM50NsNIrv69XCV2cINPX9Q9qzjawFogoxFZUC=s1360-w1360-h1020-rw", title: "Party Dresses", cat: "dresses" },
    { src: "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9R6hOEPAYBFJzbj6a3on8zee8V-aSoJlfYUBeYBoGwLRmtUXmi_95CpBl82LBv4pSIfEXda4BpTOgtXq7h5UCVRoNo6UALRRy1BOtYOr1WWo0bcbUC1YJWWzB7BTyjfggHAuRA1ktKYf1hd=w229-h286-n-k-no-nu", title: "Casual Wear", cat: "dresses" }
    // Add more like this (remove the // at the start):
    // { src: "images/dress3.jpg", title: "Diwali Special Dress", cat: "dresses" },
    // { src: "images/gown1.jpg",  title: "Gown stitched from saree", cat: "gowns" },
    // { src: "images/material1.jpg", title: "New Dress Material", cat: "materials" },
    // { src: "images/top1.jpg", title: "Stylish Top", cat: "tops" },
];

var FILTERS = [
    { key: "all", label: "All" },
    { key: "dresses", label: "Dresses" },
    { key: "gowns", label: "Gowns" },
    { key: "materials", label: "Dress Materials" },
    { key: "tops", label: "Tops" }
];

/* 2) Festival countdown target (Diwali 2026 = 8 November 2026, 6 PM IST) */
var FESTIVAL_NAME = "Diwali";
var FESTIVAL_DATE = "2026-11-08T18:00:00+05:30";

/* 3) Scrolling messages at the very top of the website */
var TICKER_MESSAGES = [
    "🪔 New Diwali collection has arrived - visit our shop!",
    "👗 Gowns stitched from your old or new saree",
    "🧵 Expert stitching for blouses, suits, dresses & more",
    "🎓 Stitching classes - beginner to professional",
    "💰 Very affordable prices - visit the shop to see",
    "📍 J-156, Sector 3, Airoli, Navi Mumbai"
];

/* 4) Shop timing used for the live "Open now / Closed" badge (IST) */
var SHOP_OPEN_HOUR = 9;      // 9 AM
var SHOP_CLOSE_HOUR = 21;    // 9 PM
var SHOP_CLOSED_DAY = 0;     // 0 = Sunday closed (Mon-Sat open)
var WHATSAPP_NUMBER = "919768483839";

/* =========================================================
   Code below - no need to edit
   ========================================================= */
(function () {
    "use strict";

    function $(s, r) { return (r || document).querySelector(s); }
    function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

    /* ---------- Mobile menu ---------- */
    var menu = $("#navMenu"), toggle = $("#menuToggle");
    function closeMenu() { menu.classList.remove("active"); toggle.classList.remove("open"); }
    toggle.addEventListener("click", function () {
        menu.classList.toggle("active");
        toggle.classList.toggle("open");
    });
    $$("#navMenu a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("click", function (e) {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) closeMenu();
    });

    /* ---------- Ticker ---------- */
    (function () {
        var t = $("#ticker");
        if (!t) return;
        var html = TICKER_MESSAGES.map(function (m) { return "<span>" + m + "</span>"; }).join("");
        t.innerHTML = html + html;
    })();

    /* ---------- Hero sparkles ---------- */
    (function () {
        var hero = $(".hero");
        for (var i = 0; i < 22; i++) {
            var s = document.createElement("span");
            s.className = "sparkle";
            s.style.left = Math.random() * 100 + "%";
            s.style.top = Math.random() * 100 + "%";
            s.style.animationDelay = (Math.random() * 4) + "s";
            s.style.animationDuration = (3 + Math.random() * 3) + "s";
            hero.appendChild(s);
        }
    })();

    /* ---------- Live open / closed (India time) ---------- */
    function istNow() {
        var parts = new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Kolkata", weekday: "short", hour: "numeric", minute: "numeric", hour12: false
        }).formatToParts(new Date());
        var o = {};
        parts.forEach(function (p) { o[p.type] = p.value; });
        var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
        return { day: days[o.weekday], hour: parseInt(o.hour, 10) % 24, min: parseInt(o.minute, 10) };
    }
    function updateStatus() {
        var n = istNow();
        var open = n.day !== SHOP_CLOSED_DAY && n.hour >= SHOP_OPEN_HOUR && n.hour < SHOP_CLOSE_HOUR;
        $$(".js-status").forEach(function (el) {
            el.innerHTML = '<span class="dot ' + (open ? "open" : "closed") + '"></span> ' +
                (open ? "We are open now - visit us today!" : "Shop is closed now - open Mon-Sat, 9 AM to 9 PM");
        });
    }
    updateStatus();
    setInterval(updateStatus, 60000);

    /* ---------- Festival countdown ---------- */
    (function () {
        var wrap = $("#countdownWrap");
        if (!wrap) return;
        var target = new Date(FESTIVAL_DATE).getTime();
        var title = $("#countdownTitle");
        var d = $("#cdDays"), h = $("#cdHours"), m = $("#cdMins"), s = $("#cdSecs");
        function pad(n) { return n < 10 ? "0" + n : "" + n; }
        function tick() {
            var diff = target - Date.now();
            if (diff <= 0) {
                wrap.style.display = "none";
                return false;
            }
            var days = Math.floor(diff / 76400000);
            d.textContent = pad(days);
            h.textContent = pad(Math.floor(diff % 86400000 / 3600000));
            m.textContent = pad(Math.floor(diff % 3600000 / 60000));
            s.textContent = pad(Math.floor(diff % 60000 / 1000));
            title.textContent = "🪔 " + FESTIVAL_NAME + " is in " + days + " days - order your stitching early!";
            return true;
        }
        if (tick()) setInterval(tick, 1000);
    })();

    /* ---------- Diya lighting ---------- */
    (function () {
        var diyas = $$(".diya"), msg = $("#diyaMsg");
        if (!diyas.length) return;
        var msgs = [
            "Tap the diyas to light them 🪔",
            "Beautiful! Keep going ✨",
            "Wonderful glow 🌟",
            "Almost there 🪔",
            "Shubh Deepavali! 🎆 Wishing you light, joy & prosperity!"
        ];
        diyas.forEach(function (d) {
            d.addEventListener("click", function () {
                d.classList.toggle("lit");
                var lit = $$(".diya.lit").length;
                msg.textContent = msgs[Math.min(lit, msgs.length - 1)];
            });
        });
    })();

    /* ---------- Gallery + filters + lightbox ---------- */
    var currentFilter = "all";
    var visible = [];

    function renderFilters() {
        var box = $("#filters");
        box.innerHTML = "";
        FILTERS.forEach(function (f) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "filter-btn" + (f.key === currentFilter ? " active" : "");
            b.textContent = f.label;
            b.setAttribute("data-key", f.key);
            b.addEventListener("click", function () { setFilter(f.key); });
            box.appendChild(b);
        });
    }

    function renderGallery() {
        var g = $("#gallery");
        g.innerHTML = "";
        visible = GALLERY.filter(function (p) { return currentFilter === "all" || p.cat === currentFilter; });
        if (!visible.length) {
            var e = document.createElement("div");
            e.className = "empty-note";
            e.innerHTML = "<strong>New photos coming very soon!</strong><br>Message us on WhatsApp to see the latest designs in this category.";
            g.appendChild(e);
            return;
        }
        visible.forEach(function (p, i) {
            var item = document.createElement("div");
            item.className = "gallery-item";
            item.style.animationDelay = (i * 0.05) + "s";
            item.setAttribute("tabindex", "0");
            item.innerHTML =
                '<img loading="lazy" alt="' + p.title.replace(/"/g, "") + '" src="' + p.src + '">' +
                '<div class="zoom">🔍</div><div class="cap">' + p.title + "</div>";
            var img = item.querySelector("img");
            img.addEventListener("error", function () { item.style.display = "none"; });
            item.addEventListener("click", function () { openLightbox(i); });
            item.addEventListener("keydown", function (ev) { if (ev.key === "Enter") openLightbox(i); });
            g.appendChild(item);
        });
    }

    function setFilter(key) {
        currentFilter = key;
        renderFilters();
        renderGallery();
    }

    renderFilters();
    renderGallery();

    /* Diwali cards -> open Collection with right filter */
    $$("[data-filter]").forEach(function (el) {
        el.addEventListener("click", function (e) {
            e.preventDefault();
            setFilter(el.getAttribute("data-filter"));
            $("#collection").scrollIntoView({ behavior: "smooth" });
        });
    });

    /* Lightbox */
    var lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap"), idx = 0;
    function showLb() {
        var p = visible[idx];
        lbImg.src = p.src;
        lbImg.alt = p.title;
        lbCap.textContent = p.title + "  (" + (idx + 1) + " / " + visible.length + ")";
    }
    function openLightbox(i) { idx = i; showLb(); lb.classList.add("show"); document.body.style.overflow = "hidden"; }
    function closeLightbox() { lb.classList.remove("show"); document.body.style.overflow = ""; }
    function step(n) { if (!visible.length) return; idx = (idx + n + visible.length) % visible.length; showLb(); }
    $("#lbClose").addEventListener("click", closeLightbox);
    $("#lbPrev").addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
    $("#lbNext").addEventListener("click", function (e) { e.stopPropagation(); step(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener("keydown", function (e) {
        if (!lb.classList.contains("show")) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") step(-1);
        if (e.key === "ArrowRight") step(1);
    });
    var sx = 0;
    lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
        var dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    }, { passive: true });

    /* ---------- Before / After slider (saree -> gown) ---------- */
    (function () {
        var range = $("#baRange"), after = $("#baAfter"), line = $("#baLine");
        if (!range) return;
        function set(v) {
            after.style.clipPath = "inset(0 " + (100 - v) + "% 0 0)";
            line.style.left = v + "%";
        }
        range.addEventListener("input", function () { set(range.value); });
        set(range.value);
        /* small hint animation on first view */
        var played = false;
        var io = "IntersectionObserver" in window ? new IntersectionObserver(function (en) {
            if (en[0].isIntersecting && !played) {
                played = true;
                var v = 50, dir = 1, n = 0;
                var t = setInterval(function () {
                    v += dir * 2; n++;
                    if (v >= 70) dir = -1;
                    if (v <= 30) dir = 1;
                    range.value = v; set(v);
                    if (n > 40) { clearInterval(t); range.value = 50; set(50); }
                }, 25);
            }
        }, { threshold: 0.5 }) : null;
        if (io) io.observe($(".ba"));
    })();

    /* ---------- Quick WhatsApp enquiry ---------- */
    (function () {
        var chips = $$(".chip"), name = $("#enqName"), btn = $("#enqSend");
        if (!btn) return;
        var chosen = [];
        chips.forEach(function (c) {
            c.addEventListener("click", function () {
                c.classList.toggle("sel");
                var v = c.getAttribute("data-v");
                var i = chosen.indexOf(v);
                if (i > -1) chosen.splice(i, 1); else chosen.push(v);
            });
        });
        btn.addEventListener("click", function () {
            var who = name.value.trim();
            var text = "Hi, ";
            if (who) text += "I am " + who + ". ";
            text += chosen.length
                ? "I am interested in: " + chosen.join(", ") + ". Please share details."
                : "I want to know more about your services.";
            window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text), "_blank");
        });
    })();

    /* ---------- Progress bar, back-to-top, active nav ---------- */
    var bar = $("#progress"), top = $("#toTop");
    var navLinks = $$("#navMenu a[href^='#']");
    var sections = navLinks.map(function (a) { return $(a.getAttribute("href")); });
    function onScroll() {
        var h = document.documentElement;
        var pct = (h.scrollTop || document.body.scrollTop) / ((h.scrollHeight - h.clientHeight) || 1) * 100;
        bar.style.width = pct + "%";
        top.classList.toggle("show", h.scrollTop > 600);
        var pos = h.scrollTop + 120, current = -1;
        sections.forEach(function (s, i) { if (s && s.offsetTop <= pos) current = i; });
        navLinks.forEach(function (a, i) { a.classList.toggle("active", i === current); });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

    /* ---------- Scroll reveal ---------- */
    (function () {
        var items = $$(".reveal");
        if (!("IntersectionObserver" in window)) {
            items.forEach(function (el) { el.classList.add("show"); });
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { en.target.classList.add("show"); io.unobserve(en.target); }
            });
        }, { threshold: 0.1 });
        items.forEach(function (el) { io.observe(el); });
    })();
})();

/* ========== CONFIG (change ici) ========== */
const CONFIG = {
  whatsapp: "33600000000",              // ton numéro, format international sans + (ex: 33612345678)
  start: "2027-07-15T10:30:00",
  end:   "2027-07-15T11:30:00",
  place: "Valasaravakkam, Chennai, India"
};
/* ========================================= */

const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const rand = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

/* ---------- Toast ---------- */
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

/* ---------- Images manquantes => fallback joli ---------- */
function markBroken(img) {
  img.classList.add("broken");
  const box = img.closest(".shiva-frame, .couple-photo, .person-photo");
  if (box) box.classList.add("noimg");
}
$$("img").forEach(img => {
  img.addEventListener("error", () => markBroken(img));
  if (img.complete && img.naturalWidth === 0) markBroken(img);
});

/* ---------- Particules (canvas) ---------- */
const fx = $("#fx"), ctx = fx.getContext("2d");
let W, H, P = [];
function resize() { W = fx.width = innerWidth; H = fx.height = innerHeight; }
addEventListener("resize", resize); resize();

const COLORS = ["#f3cf85", "#ffe9a8", "#ffb3c7", "#ff7fa3", "#ffd27a", "#ffffff"];
function spawn(x, y, o = {}) {
  P.push({
    x, y,
    vx: o.vx ?? rand(-.4, .4), vy: o.vy ?? -rand(.3, 1),
    s: o.s ?? rand(1, 3), l: 1, d: o.d ?? rand(.004, .01),
    t: o.t || "dot", c: o.c || "#f3cf85", g: o.g || 0,
    r: rand(0, 6.28), vr: rand(-.08, .08)
  });
}
function burst(x, y, n = 30) {
  for (let i = 0; i < n; i++) {
    const a = rand(0, 6.28), sp = rand(1.5, 6);
    spawn(x, y, {
      vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.5,
      s: rand(7, 14), d: rand(.008, .018), g: .06,
      t: pick(["heart", "petal", "petal", "dot"]), c: pick(COLORS)
    });
  }
}
function loop() {
  ctx.clearRect(0, 0, W, H);
  if (P.length < 60 && Math.random() < .35) spawn(rand(0, W), H + 10, { vy: -rand(.4, 1.1), s: rand(1, 2.8) });
  P = P.filter(p => p.l > 0 && p.y < H + 40);
  for (const p of P) {
    p.vy += p.g; p.x += p.vx + Math.sin(p.y / 35) * .3; p.y += p.vy; p.r += p.vr; p.l -= p.d;
    ctx.save();
    ctx.globalAlpha = Math.max(p.l, 0);
    ctx.translate(p.x, p.y); ctx.rotate(p.r);
    ctx.fillStyle = p.c;
    if (p.t === "heart") { ctx.font = p.s * 1.8 + "px serif"; ctx.textAlign = "center"; ctx.fillText("♥", 0, 0); }
    else if (p.t === "petal") { ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s / 2, 0, 0, 6.28); ctx.fill(); }
    else { ctx.shadowColor = p.c; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(0, 0, p.s, 0, 6.28); ctx.fill(); }
    ctx.restore();
  }
  requestAnimationFrame(loop);
}
loop();

// traînée d'étincelles + explosion au clic
let lastTrail = 0;
addEventListener("pointermove", e => {
  const now = performance.now();
  if (now - lastTrail < 40) return;
  lastTrail = now;
  spawn(e.clientX, e.clientY, { vx: rand(-.6, .6), vy: rand(-.8, .2), s: rand(1.5, 3.2), d: .02, c: pick(COLORS) });
});
addEventListener("pointerdown", e => burst(e.clientX, e.clientY, 18));

/* ---------- Ouverture ---------- */
const opening = $("#opening");
const music = $("#weddingMusic");
const musicBtn = $("#musicBtn");

function playMusic() {
  music.volume = .4;
  music.play().then(() => {
    musicBtn.classList.add("playing");
    musicBtn.textContent = "❚❚";
  }).catch(() => {});
}
$("#openBtn").addEventListener("click", () => {
  burst(innerWidth / 2, innerHeight / 2, 90);
  opening.classList.add("open");
  playMusic();
  setTimeout(() => {
    document.body.classList.remove("locked");
    document.body.classList.add("go");
    burst(innerWidth / 2, innerHeight * .4, 60);
  }, 1300);
  setTimeout(() => opening.remove(), 2200);
});

musicBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play().then(() => { musicBtn.classList.add("playing"); musicBtn.textContent = "❚❚"; }).catch(() => {});
  } else {
    music.pause(); musicBtn.classList.remove("playing"); musicBtn.textContent = "♫";
  }
});

/* ---------- Nom anglais lettre par lettre ---------- */
let li = 0;
$$(".split").forEach(el => {
  const txt = el.textContent;
  el.textContent = "";
  [...txt].forEach(ch => {
    const s = document.createElement("span");
    s.className = "l"; s.style.setProperty("--i", li++); s.textContent = ch;
    el.appendChild(s);
  });
});

/* ---------- Parallaxe souris (hero) ---------- */
addEventListener("pointermove", e => {
  const x = (e.clientX / innerWidth - .5), y = (e.clientY / innerHeight - .5);
  $$("[data-depth]").forEach(el => {
    const d = +el.dataset.depth;
    el.style.transform = `translate(${x * d}px, ${y * d}px)`;
  });
});

/* ---------- Barre de progression ---------- */
addEventListener("scroll", () => {
  const h = document.documentElement;
  $("#progress").style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
}, { passive: true });

/* ---------- Reveal au scroll ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      el.classList.add("visible");
      io.unobserve(el);
      // enlève le délai après l'animation (pour que l'effet 3D reste fluide)
      setTimeout(() => { el.style.transitionDelay = ""; }, 1600);
    }
  });
}, { threshold: .15 });
$$(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * .12 + "s";
  io.observe(el);
});

/* ---------- Compte à rebours ---------- */
const target = new Date(CONFIG.start).getTime();
function setNum(id, val) {
  const el = document.getElementById(id);
  const v = String(val).padStart(2, "0");
  if (el.textContent !== v) {
    el.textContent = v;
    el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick");
  }
}
function countdown() {
  const d = Math.max(target - Date.now(), 0);
  setNum("days", Math.floor(d / 864e5));
  setNum("hours", Math.floor(d / 36e5) % 24);
  setNum("minutes", Math.floor(d / 6e4) % 60);
  setNum("seconds", Math.floor(d / 1e3) % 60);
}
countdown(); setInterval(countdown, 1000);

/* ---------- Cartes 3D (tilt) ---------- */
$$("[data-tilt]").forEach(card => {
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-8px) scale(1.03)`;
  });
  card.addEventListener("pointerleave", () => card.style.transform = "");
});

/* ---------- Diyas ---------- */
const diyas = $$(".diya");
diyas.forEach(d => d.addEventListener("click", e => {
  e.stopPropagation();
  d.classList.toggle("lit");
  const r = d.getBoundingClientRect();
  if (d.classList.contains("lit")) {
    for (let i = 0; i < 14; i++)
      spawn(r.left + r.width / 2, r.top + 10, { vx: rand(-1, 1), vy: -rand(1, 3), s: rand(1.5, 3), d: .018, c: "#ffb347" });
  }
  const all = diyas.every(x => x.classList.contains("lit"));
  $("#diyaMsg").classList.toggle("show", all);
  if (all) { burst(innerWidth / 2, innerHeight / 2, 120); toast("🪔 ஒளி பிறந்தது! ✨"); }
}));

/* ---------- Ajouter au calendrier (.ics) ---------- */
$("#calBtn").addEventListener("click", () => {
  const f = s => s.replace(/[-:]/g, "");
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding//EN", "BEGIN:VEVENT",
    "UID:wedding-v-m-2027@invitation",
    "DTSTAMP:" + f(new Date().toISOString().split(".")[0]) + "Z",
    "DTSTART:" + f(CONFIG.start), "DTEND:" + f(CONFIG.end),
    "SUMMARY:Vijayaruban & Mathuyalini - Wedding / திருமணம்",
    "LOCATION:" + CONFIG.place,
    "END:VEVENT", "END:VCALENDAR"
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = "wedding-invitation.ics";
  a.click();
  toast("📅 Calendar event ready!");
});

/* ---------- RSVP WhatsApp ---------- */
let guests = 1;
$("#plus").addEventListener("click", () => { guests = Math.min(guests + 1, 10); $("#guestNum").textContent = guests; });
$("#minus").addEventListener("click", () => { guests = Math.max(guests - 1, 1); $("#guestNum").textContent = guests; });
$("#rsvpBtn").addEventListener("click", () => {
  const name = $("#guestName").value.trim();
  if (!name) { toast("உங்கள் பெயரை உள்ளிடவும் · Please enter your name"); return; }
  const msg = `வணக்கம்! 🙏 நான் ${name}, ${guests} பேர் திருமணத்திற்கு வருவோம்.\nHello! This is ${name}, we will be ${guests} guest(s) at the wedding on 15 July 2027. 💛`;
  burst(innerWidth / 2, innerHeight / 2, 80);
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
});

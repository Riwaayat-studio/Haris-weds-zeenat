// ── INTERACTIVE CURSOR TRACKING
const cur = document.getElementById('cur'), cr = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = mx + 'px'; cur.style.top = my + 'px' });
setInterval(() => { rx += (mx - rx) * .12; ry += (my - ry) * .12; cr.style.left = rx + 'px'; cr.style.top = ry + 'px' }, 16);

// ── AMBIENT STARFIELD RENDERER
const sf = document.getElementById('stars');
for (let i = 0; i < 130; i++) {
    const s = document.createElement('div'); s.className = 'star';
    const sz = Math.random() * 2.5 + .4;
    s.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;--d:${Math.random() * 4 + 2}s;--dl:-${Math.random() * 5}s`;
    sf.appendChild(s);
}
for (let i = 0; i < 6; i++) {
    const s = document.createElement('div'); s.className = 'shoot';
    s.style.cssText = `left:${Math.random() * 50}%;top:${Math.random() * 45}%;--sd:${Math.random() * 4 + 5}s;--sdl:-${Math.random() * 9}s`;
    sf.appendChild(s);
}

// ── FLUID PETAL GENERATOR
const pc = document.getElementById('petals');
const PE = ['🌸', '🌺', '✨', '💮', '🌹'];
for (let i = 0; i < 14; i++) {
    const p = document.createElement('div'); p.className = 'petal';
    const px = (Math.random() * 180 - 90) + 'px';
    p.style.cssText = `left:${Math.random() * 100}%;font-size:${Math.random() * .7 + .6}rem;--pd:${Math.random() * 9 + 7}s;--pdl:-${Math.random() * 12}s;--px:${px}`;
    p.textContent = PE[Math.floor(Math.random() * PE.length)];
    pc.appendChild(p);
}

//── GATEWAY ENVELOPE CONTROLLER
let opened = false;
window.openEnvelope = function() {
    if (opened) return; opened = true;
    document.getElementById('envWrap').classList.add('opening');
    setTimeout(() => {
        document.getElementById('env-screen').classList.add('gone');
        document.getElementById('main').classList.add('visible');
        initAudio();
    }, 1500);
}

// ── CANVAS SCRATCH ENGINE
const sc = document.getElementById('scratchC');
const sx = sc.getContext('2d');
const grd = sx.createLinearGradient(0, 0, 300, 170);
grd.addColorStop(0, '#5a3800'); grd.addColorStop(.3, '#a06820'); grd.addColorStop(.55, '#c8940a'); grd.addColorStop(.8, '#a06820'); grd.addColorStop(1, '#5a3800');
sx.fillStyle = grd; sx.fillRect(0, 0, 300, 170);

for (let x = 0; x < 300; x += 6) for (let y = 0; y < 170; y += 6) {
    if (Math.random() > .6) { sx.fillStyle = 'rgba(0,0,0,.12)'; sx.beginPath(); sx.arc(x, y, 1, 0, Math.PI * 2); sx.fill(); }
    if (Math.random() > .85) { sx.fillStyle = 'rgba(255,255,255,.08)'; sx.beginPath(); sx.arc(x, y, 1.5, 0, Math.PI * 2); sx.fill(); }
}
sx.fillStyle = 'rgba(0,0,0,.3)';
sx.font = 'bold 13px Cinzel,serif'; sx.textAlign = 'center';
sx.fillText('✦  SCRATCH TO REVEAL  ✦', 150, 78);
sx.font = '11px Raleway,sans-serif'; sx.fillText('Rub your finger here', 150, 100);

let scratching = false, done = false;
const total = 300 * 170;

function gPos(e, c) {
    const r = c.getBoundingClientRect();
    if (e.touches) return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
    return { x: e.clientX - r.left, y: e.clientY - r.top };
}

function doScratch(x, y) {
    sx.globalCompositeOperation = 'destination-out';
    sx.beginPath(); sx.arc(x, y, 24, 0, Math.PI * 2); sx.fill();
    if (done) return;
    const d = sx.getImageData(0, 0, 300, 170).data;
    let cl = 0; for (let i = 3; i < d.length; i += 4) if (d[i] < 128) cl++;
    if (cl / total > .5) { done = true; sx.clearRect(0, 0, 300, 170); document.getElementById('scratchDone').classList.add('show'); }
}

sc.addEventListener('mousedown', e => { scratching = true; const p = gPos(e, sc); doScratch(p.x, p.y) });
sc.addEventListener('mousemove', e => { if (!scratching) return; const p = gPos(e, sc); doScratch(p.x, p.y) });
sc.addEventListener('mouseup', () => scratching = false);
sc.addEventListener('touchstart', e => { e.preventDefault(); scratching = true; const p = gPos(e, sc); doScratch(p.x, p.y) }, { passive: false });
sc.addEventListener('touchmove', e => { e.preventDefault(); if (!scratching) return; const p = gPos(e, sc); doScratch(p.x, p.y) }, { passive: false });
sc.addEventListener('touchend', () => scratching = false);

// ── SYNTHETIC AUDIO SYNTHESIZER
let actx = null;
function initAudio() {
    if (actx) return;
    try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { }
}

function playTick() {
    if (!actx) return;
    try {
        const o = actx.createOscillator(), g = actx.createGain(), f = actx.createBiquadFilter();
        f.type = 'bandpass'; f.frequency.value = 1600; f.Q.value = 4;
        o.type = 'square';
        o.frequency.setValueAtTime(800, actx.currentTime);
        o.frequency.exponentialRampToValueAtTime(350, actx.currentTime + .05);
        g.gain.setValueAtTime(.16, actx.currentTime);
        g.gain.exponentialRampToValueAtTime(.001, actx.currentTime + .08);
        o.connect(f); f.connect(g); g.connect(actx.destination);
        o.start(actx.currentTime); o.stop(actx.currentTime + .09);
    } catch (e) { }
}
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('touchstart', initAudio, { once: true });

// ── SYNCHRONIZED MINARET COUNTDOWN ENGINE (Targeting 15 Dec 2026 at 10:00 PM)
let prevSec = -1;
function tickAnim(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('tick');
    void el.offsetWidth;
    el.classList.add('tick');
}

function updateCD() {
    const target = new Date('2026-12-15T22:00:00');
    const now = new Date();
    let diff = target - now;
    if (diff <= 0) {
        ['cd-d', 'cd-h', 'cd-m', 'cd-s'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.style.fontSize = '1.2rem'; el.style.webkitTextFillColor = 'var(--g2)'; el.textContent = '00'; }
        });
        return;
    }
    const d = Math.floor(diff / 86400000); diff -= d * 86400000;
    const h = Math.floor(diff / 3600000); diff -= h * 3600000;
    const m = Math.floor(diff / 60000); diff -= m * 60000;
    const s = Math.floor(diff / 1000);
    
    document.getElementById('cd-d').textContent = String(d).padStart(2, '0');
    document.getElementById('cd-h').textContent = String(h).padStart(2, '0');
    document.getElementById('cd-m').textContent = String(m).padStart(2, '0');
    document.getElementById('cd-s').textContent = String(s).padStart(2, '0');
    
    if (s !== prevSec) {
        prevSec = s;
        tickAnim('cd-s'); playTick();
        if (s === 59) { setTimeout(() => { tickAnim('cd-m'); playTick(); }, 900); }
        if (s === 59 && m === 59) { setTimeout(() => { tickAnim('cd-h'); playTick(); }, 1800); }
        if (s === 59 && m === 59 && h === 23) { setTimeout(() => { tickAnim('cd-d'); playTick(); }, 2700); }
    }
}
setInterval(updateCD, 1000); updateCD();

// ── SCROLL INTERSECTION OBSERVER
const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .1 });
document.querySelectorAll('.rev,.ev-item').forEach(el => ro.observe(el));
document.querySelectorAll('.ev-item').forEach((el, i) => { el.style.transitionDelay = `${i * .14}s`; });

// ── RSVP DATA HANDLER
let attChoice = '';
function setAtt(v) {
    attChoice = v;
    document.getElementById('btn-a').classList.toggle('on', v === 'a');
    document.getElementById('btn-d').classList.toggle('on', v === 'd');
}

function submitRSVP() {
    const n = document.getElementById('r-name').value.trim();
    if (!n) { document.getElementById('r-name').style.borderColor = 'rgba(196,82,122,.8)'; document.getElementById('r-name').focus(); return; }
    document.getElementById('ty-name').textContent = n;
    document.getElementById('rsvp-inner').style.display = 'none';
    document.getElementById('rsvp-thanks').style.display = 'block';
}

// ── ASYNCHRONOUS BLESSINGS INJECTION
function addBlessing() {
    const n = document.getElementById('blessName').value.trim();
    const t = document.getElementById('blessText').value.trim();
    if (!n || !t) return;
    const wall = document.getElementById('blessWall');
    const card = document.createElement('div'); card.className = 'bless-card';
    card.style.opacity = '0'; card.style.transition = 'opacity .5s ease';
    card.innerHTML = `<p class="bless-txt">"${t}"</p><p class="bless-from">— ${n}</p>`;
    wall.insertBefore(card, document.getElementById('addCard'));
    setTimeout(() => card.style.opacity = '1', 50);
    document.getElementById('blessName').value = '';
    document.getElementById('blessText').value = '';
                                      }
  

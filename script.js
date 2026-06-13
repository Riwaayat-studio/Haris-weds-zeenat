// ── MASTER EVENT CONTROLLER (NATIVE AND INLINE HYBRID EXECUTION)
let opened = false;

function openEnvelope() {
    if (opened) return; 
    opened = true;
    
    const envScreen = document.getElementById('env-screen');
    const mainContent = document.getElementById('main');
    const envWrap = document.getElementById('envWrap');
    
    if (envWrap) envWrap.classList.add('opening');
    
    setTimeout(() => {
        if (envScreen) {
            envScreen.style.opacity = '0';
            envScreen.style.visibility = 'hidden';
            envScreen.style.pointerEvents = 'none';
        }
        if (mainContent) {
            mainContent.classList.add('visible');
        }
        initAudio();
        
        // Local path wedding-music.mp3 loop triggers immediately
        const track = document.getElementById('bgMusic');
        if (track) {
            track.play().catch(err => console.log("Audio pipeline active."));
        }
    }, 1200);
}

// Global scope window reinforcement
window.openEnvelope = openEnvelope;

// Native listener configuration
document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.getElementById('envWrap');
    if (envelope) {
        envelope.addEventListener('click', openEnvelope);
        envelope.addEventListener('touchstart', openEnvelope, { passive: true });
    }
});

// ── DESKTOP ONLY CURSOR TRACKING MATRIX
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const cur = document.getElementById('cur'), cr = document.getElementById('cur-ring');

if (!isMobile && cur && cr) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = mx+'px'; cur.style.top = my+'px' });
    setInterval(() => { rx += (mx - rx) * .12; ry += (my - ry) * .12; cr.style.left = rx+'px'; cr.style.top = ry+'px' }, 16);
} else {
    if (cur) cur.style.display = 'none';
    if (cr) cr.style.display = 'none';
}

// ── STARFIELD FLUID MATRIX
const sf = document.getElementById('stars');
if (sf) {
    for (let i = 0; i < 110; i++) {
        const s = document.createElement('div'); s.className = 'star';
        const sz = Math.random() * 2 + .4;
        s.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;--d:${Math.random() * 4 + 2}s;--dl:-${Math.random() * 5}s`;
        sf.appendChild(s);
    }
}

// ── PETAL INJECTION
const pc = document.getElementById('petals');
const PE = ['🌸', '🌺', '✨', '💮', '🌹'];
if (pc) {
    for (let i = 0; i < 14; i++) {
        const p = document.createElement('div'); p.className = 'petal';
        const px = (Math.random() * 180 - 90) + 'px';
        p.style.cssText = `left:${Math.random() * 100}%;font-size:${Math.random() * .7 + .6}rem;--pd:${Math.random() * 9 + 7}s;--pdl:-${Math.random() * 12}s;--px:${px}`;
        p.textContent = PE[Math.floor(Math.random() * PE.length)];
        pc.appendChild(p);
    }
}

// ── CANVAS SCRATCH MATRIX
const sc = document.getElementById('scratchC');
if (sc) {
    const sx = sc.getContext('2d');
    const grd = sx.createLinearGradient(0, 0, 300, 170);
    grd.addColorStop(0, '#5a3800'); grd.addColorStop(.3, '#a06820'); grd.addColorStop(.55, '#c8940a'); grd.addColorStop(.8, '#a06820'); grd.addColorStop(1, '#5a3800');
    sx.fillStyle = grd; sx.fillRect(0, 0, 300, 170);

    sx.fillStyle = 'rgba(0,0,0,.3)';
    sx.font = 'bold 13px Cinzel,serif'; sx.textAlign = 'center';
    sx.fillText('✦  SCRATCH TO REVEAL  ✦', 150, 78);

    let scratching = false, done = false;
    function gPos(e, c) {
        const r = c.getBoundingClientRect();
        if (e.touches && e.touches.length > 0) return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
        return { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    function doScratch(x, y) {
        sx.globalCompositeOperation = 'destination-out';
        sx.beginPath(); sx.arc(x, y, 24, 0, Math.PI * 2); sx.fill();
        if (done) return;
        const d = sx.getImageData(0, 0, 300, 170).data;
        let cl = 0; for (let i = 3; i < d.length; i += 4) if (d[i] < 128) cl++;
        if (cl / (300*170) > .45) { done = true; sx.clearRect(0, 0, 300, 170); document.getElementById('scratchDone').classList.add('show'); }
    }
    sc.addEventListener('mousedown', e => { scratching = true; const p = gPos(e, sc); doScratch(p.x, p.y) });
    sc.addEventListener('mousemove', e => { if (!scratching) return; const p = gPos(e, sc); doScratch(p.x, p.y) });
    sc.addEventListener('mouseup', () => scratching = false);
    sc.addEventListener('touchstart', e => { e.preventDefault(); scratching = true; const p = gPos(e, sc); doScratch(p.x, p.y) }, { passive: false });
    sc.addEventListener('touchmove', e => { e.preventDefault(); if (!scratching) return; const p = gPos(e, sc); doScratch(p.x, p.y) }, { passive: false });
    sc.addEventListener('touchend', () => scratching = false);
}

// ── SYNTHETIC AUDIO SYNTHESIZER
let actx = null;
function initAudio() {
    if (actx) return;
    try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { }
}
function playTick() {
    if (!actx) return;
    try {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(600, actx.currentTime);
        g.gain.setValueAtTime(.05, actx.currentTime); g.gain.exponentialRampToValueAtTime(.001, actx.currentTime+.04);
        o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime+.05);
    } catch (e) { }
}

// ── HIGH-FIDELITY COUNTDOWN TRACK
let prevSec = -1;
function tickAnim(id) {
    const el = document.getElementById(id); if (!el) return;
    el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick');
}
function updateCD() {
    const target = new Date('2026-12-15T22:00:00');
    const now = new Date(); let diff = target - now;
    if (diff <= 0) {
        ['cd-d', 'cd-h', 'cd-m', 'cd-s'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '00'; });
        return;
    }
    const d = Math.floor(diff / 86400000); diff -= d * 86400000;
    const h = Math.floor(diff / 3600000); diff -= h * 3600000;
    const m = Math.floor(diff / 60000); diff -= m * 60000;
    const s = Math.floor(diff / 1000);
    
    const dEl = document.getElementById('cd-d'), hEl = document.getElementById('cd-h'), mEl = document.getElementById('cd-m'), sEl = document.getElementById('cd-s');
    if (dEl) dEl.textContent = String(d).padStart(2, '0');
    if (hEl) hEl.textContent = String(h).padStart(2, '0');
    if (mEl) mEl.textContent = String(m).padStart(2, '0');
    if (sEl) sEl.textContent = String(s).padStart(2, '0');
    
    if (s !== prevSec) {
        prevSec = s; tickAnim('cd-s'); playTick();
        if (s === 59) { setTimeout(() => { tickAnim('cd-m'); }, 900); }
        if (s === 59 && m === 59) { setTimeout(() => { tickAnim('cd-h'); }, 1800); }
        if (s === 59 && m === 59 && h === 23) { setTimeout(() => { tickAnim('cd-d'); }, 2700); }
    }
}
setInterval(updateCD, 1000); updateCD();

// ── SCROLL DETECTOR OBSERVER
const ro = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }); }, { threshold: .05 });
document.querySelectorAll('.rev,.ev-item').forEach(el => ro.observe(el));

// ── RSVP ROUTING PIPELINE
let attChoice = '';
function setAtt(v) {
    attChoice = v;
    const btnA = document.getElementById('btn-a'), btnD = document.getElementById('btn-d');
    if (btnA) btnA.classList.toggle('on', v === 'a'); if (btnD) btnD.classList.toggle('on', v === 'd');
}
function submitRSVP() {
    const name = document.getElementById('r-name').value.trim();
    const side = document.getElementById('r-side').value;
    const guests = document.getElementById('r-guests').value;
    const events = document.getElementById('r-events').value;
    const msg = document.getElementById('r-msg').value.trim();
    if (!name) { document.getElementById('r-name').style.borderColor = 'rgba(196,82,122,.8)'; document.getElementById('r-name').focus(); return; }

    const groomSheetURL = "YOUR_GROOM_APPS_SCRIPT_WEB_APP_URL";
    const brideSheetURL = "YOUR_BRIDE_APPS_SCRIPT_WEB_APP_URL";
    const targetURL = (side === "groom") ? groomSheetURL : brideSheetURL;

    if(targetURL.indexOf("YOUR_") === -1) {
        const urlWithParams = `${targetURL}?Name=${encodeURIComponent(name)}&Attendance=${encodeURIComponent(attChoice==='a'?'Joyfully Accept':'Decline')}&Guests=${encodeURIComponent(guests)}&Events=${encodeURIComponent(events)}&Message=${encodeURIComponent(msg)}`;
        fetch(urlWithParams, { method: "GET", mode: "no-cors" }).catch(err => console.log("Cross-Origin pipeline clear."));
    }

    document.getElementById('ty-name').textContent = name;
    document.getElementById('rsvp-inner').style.display = 'none';
    document.getElementById('rsvp-thanks').style.display = 'block';
}

// ── REAL-TIME LOCAL BLESSINGS
function addBlessing() {
    const n = document.getElementById('blessName').value.trim();
    const t = document.getElementById('blessText').value.trim();
    if (!n || !t) return;
    const wall = document.getElementById('blessWall'), card = document.createElement('div'); card.className = 'bless-card';
    card.innerHTML = `<p class="bless-txt">"${t}"</p><p class="bless-from">— ${n}</p>`;
    const addCard = document.getElementById('addCard');
    if (wall && addCard) { wall.insertBefore(card, addCard); }
    document.getElementById('blessName').value = ''; document.getElementById('blessText').value = '';
}

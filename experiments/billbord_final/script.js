const DESIGNERS = [
    { name: 'Ann Demeulemeester', first: 'Ann', angle: 0, keywords: ['Dark', 'Poetic', 'Raw'] },
    { name: 'Walter Van Beirendonck', first: 'Walter', angle: -59.3, keywords: ['Loud', 'Free', 'Playful'] },
    { name: 'Dirk Bikkembergs', first: 'Dirk', angle: -119.1, keywords: ['Athletic', 'Urban', 'Utilitarian'] },
    { name: 'Marina Yee', first: 'Marina', angle: -180.2, keywords: ['Elusive', 'Rare', 'Quiet'] },
    { name: 'Dirk Van Saene', first: 'Dirk', angle: 120, keywords: ['Artistic', 'Painted', 'Local'] },
    { name: 'Dries Van Noten', first: 'Dries', angle: 60.94, keywords: ['Global', 'Maximalist', 'Textured'] },
];

let screen = 1, currentDesigner = 1, wheelDeg = 0, isAnimating = false;
let TRIGGER = 2000, aboveThreshold = false, lastPull = 0;
const COOLDOWN = 2200;
let autoTimer = null;
let s3SecTimer = null;
let wheelInnerDeg = DESIGNERS[1].angle;

// Element refs
const layers = {
    1: document.querySelector('#s1'),
    2: document.querySelector('#s2'),
    3: document.querySelector('#s3'),
};
const wheelImgS2 = document.querySelector('#wheel-img-s2');
const wheelImgInner = document.querySelector('#wheel-img-s3');

const shutterT = document.querySelector('#shutter-t');
const shutterB = document.querySelector('#shutter-b');
const caR = document.querySelector('#ca-r');
const caB = document.querySelector('#ca-b');
const flashEl = document.querySelector('#flash');

const s1PullText = document.querySelector('#s1 .pull-to-discover');

const s2Hero = document.querySelector('#s2 .s2-hero');
const s2Label = document.querySelector('#s2 .s2-antwerp-label');
const s2WheelEl = document.querySelector('#s2 .s2-wheel');
const s2Desc = document.querySelector('#s2 .s2-desc');

const s3Header = document.querySelector('#s3 .s3-header');
const s3NameEl = document.querySelector('#s3-name');
const s3Phone = document.querySelector('#s3 .s3-phone');
const s3Info = document.querySelector('#s3 .s3-info');
const keywords = document.querySelectorAll('#s3 .keyword-floating');
const s3WheelWrap = document.querySelector('#s3-wheel');
const s3Secondary = document.querySelector('#s3-secondary');
const s3WheelCta = document.querySelector('#s3-wheel-cta');
const billboard = document.querySelector('#billboard');

// GSAP boot states 
gsap.set(layers[2], { autoAlpha: 0 });
gsap.set(layers[3], { autoAlpha: 0 });
gsap.set(wheelImgInner, { rotation: wheelInnerDeg, x: -1, y: -29 });
gsap.set(s3Phone, { x: '-110%', autoAlpha: 0 });
gsap.set(s3Info, { x: '110%', autoAlpha: 0 });
gsap.set(keywords, { autoAlpha: 0 });
gsap.set(s3Secondary, { autoAlpha: 0 });
gsap.set(s3WheelCta, { autoAlpha: 0 });
gsap.set(shutterT, { yPercent: -100 });
gsap.set(shutterB, { yPercent: 100 });

// Pull-to-discover idle pulse
gsap.to(s1PullText, { y: -12, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });

//  Effect helpers

function impactFlash(intensity = 0.45) {
    gsap.fromTo(flashEl,
        { opacity: intensity },
        { opacity: 0, duration: 0.5, ease: 'power2.out' }
    );
}


function rouletteWheelTo(targetDeg, delta) {
    const overshoot = targetDeg + delta * 0.3;
    gsap.timeline()
        .to(wheelImgInner, { rotation: overshoot, x: -1, y: -29, duration: 0.9, ease: 'power3.out' })
        .to(wheelImgInner, { rotation: targetDeg + 14, duration: 0.11, ease: 'power2.in' })
        .to(wheelImgInner, { rotation: targetDeg - 7, duration: 0.09, ease: 'power2.inOut' })
        .to(wheelImgInner, { rotation: targetDeg + 3, duration: 0.08, ease: 'power1.inOut' })
        .to(wheelImgInner, { rotation: targetDeg, duration: 0.09, ease: 'power2.out' });
}

// Content helpers 
function applyDesigner(d) {
    const des = DESIGNERS[d];
    s3NameEl.textContent = des.name;
    s3NameEl.style.fontSize = des.name.length > 20 ? '3.9cqh' : '';
    document.querySelector('#s3-explore-title').innerHTML =
        'Explore Antwerp<br>Through ' + des.first + "'s Eyes";
    document.querySelectorAll('.s3-first-name').forEach(el => el.textContent = des.first);
    document.querySelectorAll('#s3 .keyword-floating .keyword-tag').forEach((el, i) => {
        el.textContent = des.keywords[i];
    });
}

function showKeywordsGSAP(onDone) {
    if (screen !== 3) return;
    keywords.forEach((el, i) => {
        const tag = el.querySelector('.keyword-tag');
        const rot = parseFloat(el.style.getPropertyValue('--rot')) || 0;
        const tumble = (i % 2 === 0 ? 1 : -1) * (52 + i * 20);
        const delay = i * 0.3;
        gsap.set(tag, { fontSize: '87px' });
        gsap.timeline({ delay })
            .fromTo(el,
                { autoAlpha: 0, x: 0, y: -800, rotation: rot + tumble, scale: 1.4, skewX: tumble * 0.2 },
                {
                    autoAlpha: 1, y: 22, rotation: rot + tumble * 0.1, scale: 1, skewX: rot * 0.08,
                    duration: 0.65, ease: 'power4.in'
                }
            )
            .to(el, { y: -28, rotation: rot * 1.5, skewX: 0, scale: 0.9, duration: 0.14, ease: 'power2.out' })
            .to(el, { y: 9, rotation: rot * 0.9, scale: 1.04, duration: 0.10, ease: 'power2.in' })
            .to(el, { y: -4, scale: 0.98, duration: 0.07, ease: 'power1' })
            .to(el, { y: 0, rotation: rot, scale: 1, duration: 0.10, ease: 'power2.out' })
            .to(tag, { fontSize: '70px', duration: 0.15, ease: 'power2.out' }, '<')
            .add(() => impactFlash(0.1), '-=0.3');
    });
    // lastLands = delay of last keyword + its drop duration (0.65) + bounce steps (0.41) + settle (0.1)
    const lastLands = (keywords.length - 1) * 0.3 + 0.65 + 0.41 + 0.1;
    setTimeout(() => {
        // Screen guard: reset may have fired while animations were still in flight.
        if (screen !== 3) return;
        gsap.fromTo(s3Phone, { x: '-110%', autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.0, ease: 'expo.out' });
        gsap.fromTo(s3Info, { x: '110%', autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.0, ease: 'expo.out', delay: 0.12 });
        const floatAmps = [14, 10, 18];
        const floatTimes = [2.1, 2.7, 1.85];
        keywords.forEach((el, i) => {
            gsap.to(el, {
                y: `+=${floatAmps[i]}`, duration: floatTimes[i],
                ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.45
            });
        });
        if (onDone) setTimeout(onDone, 1000);
        s3SecTimer = setTimeout(showS3Secondary, 10000);
    }, lastLands * 1000);
}

// S3 secondary reveal (10s idle)
function showS3Secondary() {
    if (screen !== 3) return;
    s3SecTimer = null;
    keywords.forEach((el, i) => {
        gsap.killTweensOf(el);
        gsap.to(el, { autoAlpha: 0, y: '+=10', duration: 0.35, ease: 'power2.in', delay: i * 0.06 });
    });
    gsap.to(s3Phone, { x: '-110%', autoAlpha: 0, duration: 0.55, ease: 'power3.in' });
    gsap.to(s3Info, { x: '110%', autoAlpha: 0, duration: 0.55, ease: 'power3.in', delay: 0.07 });
    gsap.to(s3WheelWrap, { y: 428.5, duration: 0.7, ease: 'power3.out', delay: 0.35 });
    gsap.fromTo(s3Secondary,
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.75, ease: 'power3.out', delay: 0.5 }
    );
    gsap.fromTo(s3WheelCta,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', delay: 0.85 }
    );
}

// Main interaction
function onPullFixed() {
    if (isAnimating) return;
    const now = Date.now();
    if (now - lastPull < COOLDOWN) return;
    lastPull = now;
    isAnimating = true;
    clearTimeout(autoTimer); autoTimer = null;
    clearTimeout(s3SecTimer); s3SecTimer = null;

    // S1 → S2  "ViewMaster Click" 
    if (screen === 1) {
        applyDesigner(currentDesigner);
        screen = 2;

        gsap.set(s2Hero, { y: -50, autoAlpha: 0 });
        gsap.set(s2Label, { y: -35, autoAlpha: 0 });
        gsap.set(s2Desc, { y: 40, autoAlpha: 0 });
        gsap.set(s2WheelEl, { scale: 0.88, autoAlpha: 0 });

        gsap.timeline()
            .to(flashEl, { autoAlpha: 1, duration: 0.17, ease: 'power3.in' })
            .call(() => {
                gsap.set(layers[1], { autoAlpha: 0 });
                gsap.set(layers[2], { autoAlpha: 1, scale: 1.06 });
            })
            .to(flashEl, { autoAlpha: 0, duration: 0.3, ease: 'power2.out' })
            .to(layers[2], { scale: 1, duration: 0.4, ease: 'power2.out' }, '<');

        gsap.to(s2Hero, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'back.out(2)', delay: 0.3 });
        gsap.to(s2Label, { y: 0, autoAlpha: 1, duration: 0.55, ease: 'back.out(1.8)', delay: 0.4 });
        gsap.to(s2Desc, { y: 0, autoAlpha: 1, duration: 0.55, ease: 'expo.out', delay: 0.5 });
        gsap.to(s2WheelEl, { scale: 1, autoAlpha: 1, duration: 0.7, ease: 'back.out(2.2)', delay: 0.22 });

        // Accumulate absolute rotation so GSAP never snaps back to 0 on repeated calls.
        // power2.out over 8s: blazing fast start that gradually decelerates to a stop.
        wheelDeg += 360 * 5;
        gsap.to(wheelImgS2, {
            rotation: wheelDeg, duration: 8, ease: 'power2.out', delay: 0.5,
            onComplete: () => {
                // user may have already manually pulled to S3 before the 8s ended.
                if (screen === 2) { isAnimating = false; onPullFixed(); }
            }
        });
        // Allow a manual pull after the fast phase (~1.2s) without waiting the full 8s.
        setTimeout(() => { isAnimating = false; }, 1200);

    // S2 → S3  "ViewMaster Click" 
    } else if (screen === 2) {
        screen = 3;

        gsap.set(s3Header, { y: -70, autoAlpha: 0, scale: 0.9 });

        gsap.timeline()
            .to(flashEl, { autoAlpha: 1, duration: 0.17, ease: 'power3.in' })
            .call(() => {
                gsap.set(layers[2], { autoAlpha: 0 });
                gsap.set(layers[3], { autoAlpha: 1, scale: 1.06 });
            })
            .to(flashEl, { autoAlpha: 0, duration: 0.3, ease: 'power2.out' })
            .to(layers[3], { scale: 1, duration: 0.4, ease: 'power2.out' }, '<')
            .to(s3Header, { y: 0, autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(2.2)' }, '-=0.18')
            .call(() => showKeywordsGSAP(() => { isAnimating = false; }));

    // S3 → S3  "Wheel Rise" 
    } else if (screen === 3) {
        gsap.killTweensOf(s3Secondary);
        gsap.set(s3Secondary, { autoAlpha: 0 });
        gsap.killTweensOf(s3WheelCta);
        gsap.set(s3WheelCta, { autoAlpha: 0 });
        keywords.forEach(el => gsap.killTweensOf(el));
        const kickDirs = [
            { x: -1000, y: -280, rotation: '-=210' },
            { x: 80, y: -950, rotation: '+=55' },
            { x: 950, y: -200, rotation: '+=230' },
        ];
        Array.from(keywords).forEach((el, i) => {
            const d = kickDirs[i];
            gsap.to(el, {
                x: d.x, y: d.y, rotation: d.rotation,
                autoAlpha: 0, scale: 1.15,
                duration: 0.48, ease: 'power3.out', delay: 0.18 + i * 0.07
            });
        });
        gsap.to(s3Phone, { x: '-110%', autoAlpha: 0, duration: 0.3, ease: 'power3.in' });
        gsap.to(s3Info, { x: '110%', autoAlpha: 0, duration: 0.3, ease: 'power3.in', delay: 0.04 });
        gsap.to(s3NameEl, { y: -80, autoAlpha: 0, duration: 0.28, ease: 'power3.in' });

        gsap.to(s3WheelWrap, { y: -300, duration: 0.7, ease: 'power3.out', delay: 0.15 });

        setTimeout(() => {
            if (screen !== 3) return;
            const fromAngle = DESIGNERS[currentDesigner].angle;
            currentDesigner = (currentDesigner + 1) % DESIGNERS.length;
            applyDesigner(currentDesigner);
            // Shortest-path delta: wrap to [-180, 180] so the wheel always turns
            // the short way round instead of spinning 300° when -10° would do.
            // wheelInnerDeg accumulates so GSAP never jumps back to the raw angle.
            let delta = DESIGNERS[currentDesigner].angle - fromAngle;
            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;
            wheelInnerDeg += delta;
            gsap.to(wheelImgInner, { rotation: wheelInnerDeg, x: -1, y: -29, duration: 0.9, ease: 'power2.inOut' });
            gsap.fromTo(s3NameEl,
                { y: 50, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.65, ease: 'back.out(2.2)' }
            );
        }, 850);

        setTimeout(() => {
            if (screen !== 3) return;
            gsap.to(s3WheelWrap, { y: 588.5, duration: 0.75, ease: 'power3.in' });
        }, 1850);

        setTimeout(() => {
            if (screen !== 3) { isAnimating = false; return; }
            showKeywordsGSAP(() => { isAnimating = false; });
        }, 2200);
    }
}

// Reset to screen 1 
function resetToScreen1() {
    location.reload();
}

//  Idle reset (1 minute of no interaction → back to screen 1) 
let idleTimer = null;
function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { if (screen !== 1) resetToScreen1(); }, 60000);
}
['keydown', 'pointerdown', 'touchstart'].forEach(ev =>
    document.addEventListener(ev, resetIdleTimer, { passive: true })
);
resetIdleTimer();

// Keyboard controls
document.addEventListener('keydown', e => {
    if (e.code === 'Space') { e.preventDefault(); onPullFixed(); }
    if (e.key === 'a' || e.key === 'A') resetToScreen1();
    if (e.key === 'e' || e.key === 'E') {
        document.querySelector('#esp-panel').classList.toggle('visible');
    }
});

// ESP32 serial connection 
const connectBtn = document.querySelector('#connect-btn');
const rawValEl = document.querySelector('#raw-val');
const espStateEl = document.querySelector('#esp-state');

connectBtn.addEventListener('click', async () => {
    try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });
        connectBtn.disabled = true;
        connectBtn.textContent = 'Connected';
        const decoder = new TextDecoderStream();
        port.readable.pipeTo(decoder.writable);
        const reader = decoder.readable.getReader();
        let buffer = '';
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += value;
            const msgs = buffer.split('\n');
            buffer = msgs.pop();
            for (const msg of msgs) {
                const val = parseInt(msg.trim(), 10);
                if (!isNaN(val)) processSerial(val);
            }
        }
    } catch (err) { console.error('Serial error:', err); }
});

function processSerial(raw) {
    rawValEl.textContent = raw;
    espStateEl.textContent = raw <= TRIGGER ? 'TRIGGER' : 'IDLE';
    if (isAnimating) return;
    if (raw <= TRIGGER) {
        if (!aboveThreshold) { aboveThreshold = true; onPullFixed(); }
    } else { aboveThreshold = false; }
}

// Boot
applyDesigner(currentDesigner);

// Scale the 1080×1920 billboard to fit any screen while keeping it centered.
// use CSS transform (not width/height) so container query units (cqh/cqw)
// stay anchored to the fixed 1080×1920 container — resizing the element itself
// would break all the cq-relative values in the CSS.
function scaleBillboard() {
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const scale = Math.min(vw / 1080, vh / 1920);
    const x = (vw - 1080 * scale) / 2;
    const y = (vh - 1920 * scale) / 2;
    document.querySelector('#billboard').style.transform =
        `translate(${x}px, ${y}px) scale(${scale})`;
}
window.addEventListener('resize', scaleBillboard);
scaleBillboard();

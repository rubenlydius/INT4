const DESIGNERS = [
    { name: 'Ann Demeulemeester', first: 'Ann', angle: 0, keywords: ['Dark Romantic', 'Poetic', 'Rebellious'] },
    { name: 'Walter Van Beirendonck', first: 'Walter', angle: -59.3, keywords: ['Fantastical', 'Political', 'Vivid'] },
    { name: 'Dirk Bikkembergs', first: 'Dirk', angle: -119.1, keywords: ['Athletic', 'Raw', 'Masculine'] },
    { name: 'Marina Yee', first: 'Marina', angle: -180.2, keywords: ['Deconstructed', 'Minimal', 'Quiet'] },
    { name: 'Dirk Van Saene', first: 'Dirk', angle: 120, keywords: ['Poetic', 'Experimental', 'Rule-breaker'] },
    { name: 'Dries Van Noten', first: 'Dries', angle: 60.94, keywords: ['Eclectic', 'Colorful', 'Refined'] },
];

let screen = 1, currentDesigner = 1, wheelDeg = 0, isAnimating = false;
let TRIGGER = 2000, aboveThreshold = false, lastPull = 0;
const COOLDOWN = 2200;
let autoTimer = null;
let s2IdleTween = null;
let s3SecTimer = null;
let wheelInnerDeg = DESIGNERS[1].angle;

// ── Element refs ────────────────────────────────────────────────
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

const s1Viewmaster = document.querySelector('#s1 .viewmaster-center');
const s1HeroText = document.querySelector('#s1 .hero-text');
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

// ── GSAP boot states ────────────────────────────────────────────
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

// ── Effect helpers ──────────────────────────────────────────────

function impactFlash(intensity = 0.45) {
    gsap.fromTo(flashEl,
        { opacity: intensity },
        { opacity: 0, duration: 0.5, ease: 'power2.out' }
    );
}

function chromaticAberration() {
    gsap.timeline()
        .set(caR, { xPercent: 0 })
        .set(caB, { xPercent: 0 })
        .to([caR, caB], { opacity: 1, duration: 0.04 })
        .to(caR, { xPercent: -5, duration: 0.06 }, '<')
        .to(caB, { xPercent: 5, duration: 0.06 }, '<')
        .to(caR, { xPercent: 3, opacity: 0.7, duration: 0.06 })
        .to(caB, { xPercent: -3, opacity: 0.7, duration: 0.06 }, '<')
        .to([caR, caB], { xPercent: 0, opacity: 0, duration: 0.28, ease: 'power3.out' });
}

function shutterSlam(onBlackout) {
    const tl = gsap.timeline();
    tl.to(shutterT, { yPercent: 0, duration: 0.13, ease: 'power4.in' }, 0);
    tl.to(shutterB, { yPercent: 0, duration: 0.13, ease: 'power4.in' }, 0);
    tl.add(() => { if (onBlackout) onBlackout(); }, 0.15);
    tl.to(shutterT, { yPercent: -100, duration: 0.22, ease: 'power4.out' }, 0.17);
    tl.to(shutterB, { yPercent: 100, duration: 0.22, ease: 'power4.out' }, 0.17);
    return tl;
}

function screenShake(el) {
    gsap.fromTo(el, { x: 0, y: 0 }, {
        keyframes: [
            { x: -9, y: 5, duration: 0.04 },
            { x: 8, y: -6, duration: 0.04 },
            { x: -5, y: 4, duration: 0.04 },
            { x: 4, y: -3, duration: 0.04 },
            { x: 0, y: 0, duration: 0.05 },
        ]
    });
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

// ── Content helpers ─────────────────────────────────────────────
function applyDesigner(d) {
    const des = DESIGNERS[d];
    const nameEl = document.querySelector('#s3-name');
    nameEl.textContent = des.name;
    nameEl.style.fontSize = des.name.length > 20 ? '3.9cqh' : '';
    document.querySelector('#s3-explore-title').innerHTML =
        'Explore Antwerp<br>Through ' + des.first + "'s Eyes";
    document.querySelectorAll('.s3-first-name').forEach(el => el.textContent = des.first);
    document.querySelectorAll('#s3 .keyword-floating .keyword-tag').forEach((el, i) => {
        el.textContent = des.keywords[i];
    });
}

function showKeywordsGSAP(onDone) {
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
    const lastLands = (keywords.length - 1) * 0.3 + 0.65 + 0.41 + 0.1;
    setTimeout(() => {
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

// ── S3 secondary reveal (10s idle) ──────────────────────────────
function showS3Secondary() {
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

// ── Main interaction ────────────────────────────────────────────
function onPullFixed() {
    if (isAnimating) return;
    const now = Date.now();
    if (now - lastPull < COOLDOWN) return;
    lastPull = now;
    isAnimating = true;
    clearTimeout(autoTimer); autoTimer = null;
    clearTimeout(s3SecTimer); s3SecTimer = null;
    if (s2IdleTween) { s2IdleTween.kill(); s2IdleTween = null; }

    // ════════ S1 → S2  "ViewMaster Click" ════════
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

        // spins in fast, decelerates gradually over 8s, then auto-advances on complete
        wheelDeg += 360 * 5;
        gsap.to(wheelImgS2, {
            rotation: wheelDeg, duration: 8, ease: 'power2.out', delay: 0.5,
            onComplete: () => {
                isAnimating = false;
                if (screen === 2) onPullFixed();
            }
        });
        setTimeout(() => { isAnimating = false; }, 1200); // unblock manual pull after initial fast phase

    // ════════ S2 → S3  "ViewMaster Click" ════════
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

    // ════════ S3 → S3  "Wheel Rise" ════════
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
            const fromAngle = DESIGNERS[currentDesigner].angle;
            currentDesigner = (currentDesigner + 1) % DESIGNERS.length;
            applyDesigner(currentDesigner);
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
            gsap.to(s3WheelWrap, { y: 588.5, duration: 0.75, ease: 'power3.in' });
        }, 1850);

        setTimeout(() => {
            showKeywordsGSAP(() => { isAnimating = false; });
        }, 2200);
    }
}

// ── Keyboard controls ────────────────────────────────────────────
document.addEventListener('keydown', e => {
    if (e.code === 'Space') { e.preventDefault(); onPullFixed(); }
    if (e.key === 'e' || e.key === 'E') {
        document.querySelector('#esp-panel').classList.toggle('visible');
    }
});

// ── ESP32 serial connection ──────────────────────────────────────
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

// ── Boot ────────────────────────────────────────────────────────
applyDesigner(currentDesigner);

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

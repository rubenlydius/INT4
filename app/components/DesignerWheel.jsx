import { useRef, useState, useCallback, useEffect } from "react";
import { Link } from "react-router";
import { createPortal } from "react-dom";
import styles from "./designerwheel.module.css";

// Sprite order, clockwise from 12 o'clock at 0deg rotation.
const WHEEL_ORDER = ["walter", "dirk_b", "marina", "dirk_vs", "dries", "ann"];
const COUNT = WHEEL_ORDER.length;
const DEG_STEP = 360 / COUNT;

// Designer key -> wheel index
const indexOf = (key) => WHEEL_ORDER.indexOf(key);

// Shortest-path target angle that puts `index` at 12 o'clock,
// staying as close as possible to `currentAngle`.
function targetAngleForIndex(index, currentAngle) {
  const base = -index * DEG_STEP;
  const diff = (((base - currentAngle) % 360) + 540) % 360 - 180;
  return currentAngle + diff;
}

// Given a wheel rotation angle, which designer index sits at 12 o'clock.
function indexAtTop(angle) {
  const raw = -angle / DEG_STEP;
  return ((Math.round(raw) % COUNT) + COUNT) % COUNT;
}

/**
 * DesignerWheel
 * Renders the viewmaster disc (static) with the designer sprite ring (draggable/clickable)
 * layered on top. Fixed to the viewport bottom. Acts as the primary navigation
 * for the lens page.
 *
 * IMPORTANT: rendered via a portal directly into document.body. `position: fixed`
 * only positions relative to the viewport if NO ancestor has a transform, filter,
 * perspective, contain, or will-change:transform set — any of those makes that
 * ancestor the containing block instead, and "fixed" silently behaves like
 * "absolute" relative to it (looks exactly like "stuck to the bottom of the
 * page" / scrolls away). Portaling to document.body sidesteps that entirely,
 * regardless of what the app shell/router/page-transition wrapper does upstream.
 *
 * Collapse behavior: any click/tap on the lens page content (outside this
 * component) collapses the wheel down out of the way. Clicking the wheel
 * again while collapsed brings it back up without changing the selection;
 * clicking it while expanded navigates as normal.
 *
 * Props:
 *  - activeKey: current designer key (e.g. "dries"), controlled from the route
 *  - onSelect: (key) => void, called when the wheel settles on a new designer
 *  - viewmasterSrc, wheelSrc: image sources
 */
export default function DesignerWheel({ activeKey, onSelect, viewmasterSrc, wheelSrc, introMode = false }) {
  const wheelRef = useRef(null);
  const trackRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  // intro: start off-screen, slide up after mount
  const [introHidden, setIntroHidden] = useState(introMode);
  useEffect(() => {
    if (!introMode) return;
    // start rising at 600ms so it's already moving as the overlay fades at 700ms
    const t = setTimeout(() => setIntroHidden(false), 600);
    return () => clearTimeout(t);
  }, [introMode]);


  // Angle lives in a ref for the drag loop (avoids re-render thrash);
  // forceRender just triggers the inline style update during drag.
  const angleRef = useRef(targetAngleForIndex(indexOf(activeKey) ?? 0, 0));
  const [, forceRender] = useState(0);

  const [collapsed, setCollapsed] = useState(false);
  const collapsedRef = useRef(false); // mirror for use inside listeners

  const draggingRef = useRef(false);
  const movedDuringDragRef = useRef(false);
  const dragStartPointerAngle = useRef(0);
  const dragStartWheelAngle = useRef(0);
  const lastPointerAngle = useRef(0);
  const lastT = useRef(0);
  const angularVelocity = useRef(0);
  const settleTween = useRef(null);

  useEffect(() => {
    collapsedRef.current = collapsed;
  }, [collapsed]);

  const applyTransform = useCallback((angle) => {
    if (wheelRef.current) {
      wheelRef.current.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    }
  }, []);

  // Keep the wheel in sync if activeKey changes from outside (e.g. browser back/forward)
  useEffect(() => {
    const targetIndex = indexOf(activeKey);
    if (targetIndex === -1) return;
    const current = angleRef.current;
    const alreadyThere = indexAtTop(current) === targetIndex;
    if (alreadyThere || draggingRef.current) return;
    animateTo(targetIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Collapse whenever the user interacts with the rest of the page.
  // Keep track of the activeKey during renders to catch route changes
const lastKeyRef = useRef(activeKey);

useEffect(() => {
  let isNavigating = false;

  // If the activeKey changed, we know a swap just happened.
  if (lastKeyRef.current !== activeKey) {
    isNavigating = true;
    lastKeyRef.current = activeKey;
    
    // Briefly ignore scroll events while the page resets its layout/scroll position
    setTimeout(() => {
      isNavigating = false;
    }, 100); // 100ms is plenty of time for the browser to execute its scrollToTop
  }

  function handleOutsideInteraction(e) {
    // 1. If it's a scroll event triggered by page navigation, do nothing.
    if (e && e.type === "scroll" && isNavigating) return;

    // 2. If it's a click inside the wheel track, ignore it.
    if (e && trackRef.current && trackRef.current.contains(e.target)) return;
    
    if (!collapsedRef.current) setCollapsed(true);
  }

  document.addEventListener("click", handleOutsideInteraction, true);
  window.addEventListener("scroll", handleOutsideInteraction, { passive: true });

  return () => {
    document.removeEventListener("click", handleOutsideInteraction, true);
    window.removeEventListener("scroll", handleOutsideInteraction);
  };
}, [activeKey]); // Re-run this effect when activeKey changes to capture the swap

  function cancelSettle() {
    if (settleTween.current) {
      cancelAnimationFrame(settleTween.current.frame);
      settleTween.current = null;
    }
  }

  function animateTo(index) {
    cancelSettle();
    const start = angleRef.current;
    const end = targetAngleForIndex(index, start);
    const duration = 420;
    const startTime = performance.now();

    function step(now) {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // power3 ease-out
      const angle = start + (end - start) * eased;
      angleRef.current = angle;
      applyTransform(angle);
      if (t < 1) {
        settleTween.current = { frame: requestAnimationFrame(step) };
      } else {
        angleRef.current = end;
        applyTransform(end);
        settleTween.current = null;
        const settledKey = WHEEL_ORDER[index];
        if (settledKey !== activeKey) onSelect(settledKey);
      }
    }
    settleTween.current = { frame: requestAnimationFrame(step) };
  }

  function pointerAngleFromCenter(clientX, clientY) {
    // The disc images are top-aligned and 2x the stage width/height, so their
    // true rotational center sits one full stage-height below the stage's
    // top edge (i.e. at the stage's bottom edge), centered horizontally.
    // This holds regardless of the wheel's internal padding/inset, since
    // padding is symmetric and doesn't move the center (see CSS module).
    const el = trackRef.current;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.width / 2; // width/2 == one stage-height (disc radius)
    return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI;
  }

  function handlePointerDown(e) {
    // While collapsed, the wheel is just a "tap to expand" target — no drag.
    if (collapsedRef.current) return;
    cancelSettle();
    draggingRef.current = true;
    movedDuringDragRef.current = false;
    const point = e.touches ? e.touches[0] : e;
    const a = pointerAngleFromCenter(point.clientX, point.clientY);
    dragStartPointerAngle.current = a;
    dragStartWheelAngle.current = angleRef.current;
    lastPointerAngle.current = a;
    lastT.current = Date.now();
    angularVelocity.current = 0;
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("touchend", handlePointerUp);
  }

  function handlePointerMove(e) {
    if (!draggingRef.current) return;
    if (e.cancelable) e.preventDefault();
    const point = e.touches ? e.touches[0] : e;
    const a = pointerAngleFromCenter(point.clientX, point.clientY);
    const now = Date.now();
    const dt = now - lastT.current;
    if (dt > 0) angularVelocity.current = (a - lastPointerAngle.current) / dt;
    lastPointerAngle.current = a;
    lastT.current = now;

    const moved = Math.abs(a - dragStartPointerAngle.current) > 1;
    if (moved) movedDuringDragRef.current = true;

    const newAngle = dragStartWheelAngle.current + (a - dragStartPointerAngle.current);
    angleRef.current = newAngle;
    applyTransform(newAngle);
    forceRender((n) => n + 1);
  }

  function handlePointerUp() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    window.removeEventListener("mousemove", handlePointerMove);
    window.removeEventListener("mouseup", handlePointerUp);
    window.removeEventListener("touchmove", handlePointerMove);
    window.removeEventListener("touchend", handlePointerUp);

    const momentum = angularVelocity.current * 120;
    const projected = angleRef.current + momentum;
    const nearest = indexAtTop(projected);
    animateTo(nearest);
  }

  // Tap-to-select: compute the angle of the tap relative to wheel center,
  // find the nearest designer slice given current rotation, snap to it.
  function handleClick(e) {
    // Collapsed: a tap just brings the wheel back up. Don't navigate yet —
    // the user couldn't aim precisely at a half-hidden, shrunk wheel.
    if (collapsedRef.current) {
      setCollapsed(false);
      return;
    }
    if (movedDuringDragRef.current) return; // that was a drag, not a tap

    const tapAngle = pointerAngleFromCenter(e.clientX, e.clientY);
    const current = angleRef.current;
    let bestIndex = 0;
    let bestDiff = Infinity;
    for (let i = 0; i < COUNT; i++) {
      const designerScreenAngle = i * DEG_STEP - 90 + current;
      const diff = Math.abs(
        (((tapAngle - designerScreenAngle) % 360) + 540) % 360 - 180
      );
      if (diff < bestDiff) {
        bestDiff = diff;
        bestIndex = i;
      }
    }
    animateTo(bestIndex);
  }

  const wheel = (
    <div className={`${styles.wheelStage} ${collapsed ? styles.collapsed : ""} ${introHidden ? styles.wheelStageIntro : ""}`}>
      {/* Handlers moved to the track container */}
      <div 
        className={styles.track} 
        ref={trackRef}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onClick={handleClick}
      >
        <div className={styles.wheelBackdropCircle} />
        <img
          src={viewmasterSrc}
          alt=""
          className={styles.viewmaster}
          draggable={false}
        />
        
        <img
          src={wheelSrc}
          alt="Select a designer"
          ref={wheelRef}
          className={styles.designerWheel}
          draggable={false}
          style={{ transform: `translateX(-50%) rotate(${angleRef.current}deg)` }}
        />
        <div className={styles.designerOverlayBox}>
            <Link to="/map" className={styles.exploreButton}>
                Start exploring
            </Link>
        </div>
      </div>
      <div className={styles.pointerMark} aria-hidden="true" />
    </div>
  );

  if (!mounted) return null;

  // DESKTOP — portal into .wheel_portal (overlays the phone frame) so the wheel
  // stays clipped inside the 390px frame instead of covering the whole screen.
  const portalTarget =
    window.innerWidth >= 768
      ? (document.querySelector('[data-wheel-portal]') || document.body)
      : document.body;
  return createPortal(wheel, portalTarget);
}
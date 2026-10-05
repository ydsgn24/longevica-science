import React, { useCallback, useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Becomes true once the element first enters the viewport (on load if it is already there). */
export function useInViewOnce<T extends Element>(watchParent = false) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    // A fully masked element (clip-path) has no visible area, so it never counts
    // as intersecting — watch its container instead.
    const el = watchParent ? ref.current?.parentElement : ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [watchParent]);
  return [ref, inView] as const;
}

/** Fades content in from a blur when it scrolls into view. `variant="image"` adds a slow zoom-out. */
export function BlurIn({
  as: Tag = "div",
  delay = 0,
  variant = "text",
  show,
  className = "",
  children,
  ...rest
}: {
  as?: ElementType;
  delay?: number;
  variant?: "text" | "image" | "blind" | "wipe";
  /** Controls the reveal directly instead of waiting for the element to scroll into view. */
  show?: boolean;
  className?: string;
  children?: ReactNode;
  [key: string]: unknown;
}) {
  const [ref, inView] = useInViewOnce<HTMLElement>(variant === "wipe" || variant === "blind");
  const style: CSSProperties = { transitionDelay: `${delay}ms` };
  return (
    <Tag
      ref={ref}
      className={`blur-in blur-in--${variant} ${(show ?? inView) ? "is-in" : ""} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * One line of text in a clipping box: the text slides down and out while an
 * identical copy slides in from above. Runs once when `play` turns true (after
 * `delay`) and again on hover. With `enter`, the line starts empty and the
 * first roll brings the text in.
 */
export function RollText({
  text,
  delay = 0,
  play = true,
  enter = false,
}: {
  text: string;
  delay?: number;
  play?: boolean;
  enter?: boolean;
}) {
  const track = useRef<HTMLSpanElement>(null);
  const running = useRef(false);
  const [shown, setShown] = useState(!enter);

  const roll = useCallback(() => {
    const el = track.current;
    if (!el || running.current) return;
    if (reducedMotion()) return setShown(true);
    running.current = true;
    // Both copies are identical, so snapping back to 0 at the end is invisible.
    const anim = el.animate([{ transform: "translateY(0)" }, { transform: "translateY(100%)" }], {
      duration: 700,
      easing: "cubic-bezier(0.7, 0, 0.2, 1)",
      fill: "forwards",
    });
    anim.onfinish = () => {
      // Make the base copy visible in the same frame the track jumps back to 0,
      // otherwise there is one empty frame (the "blink").
      const base = el.firstElementChild as HTMLElement | null;
      if (base) base.style.visibility = "visible";
      anim.cancel();
      running.current = false;
      setShown(true);
    };
    anim.oncancel = () => {
      running.current = false;
    };
  }, []);

  useEffect(() => {
    // In enter mode, going back (play → false) hides the line so it can roll in again.
    if (!play) {
      if (enter) {
        track.current?.getAnimations().forEach((an) => an.cancel());
        const base = track.current?.firstElementChild as HTMLElement | null;
        if (base) base.style.visibility = "";
        setShown(false);
      }
      return;
    }
    const t = window.setTimeout(roll, delay);
    return () => window.clearTimeout(t);
  }, [roll, delay, play, enter]);

  return (
    <span className="relative inline-block overflow-hidden align-top" onMouseEnter={shown ? roll : undefined}>
      <span ref={track} className="relative block">
        <span className={`block ${shown ? "" : "invisible"}`}>{text}</span>
        <span aria-hidden className="absolute inset-x-0 bottom-full block">
          {text}
        </span>
      </span>
    </span>
  );
}

/**
 * Progress (0→1) of scrolling through a tall element: 0 when its top reaches
 * the top of the viewport, 1 when its bottom reaches the bottom.
 */
export function useScrollProgress(ref: React.RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const range = height - window.innerHeight;
      setProgress(range > 0 ? Math.min(1, Math.max(0, -top / range)) : 1);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ref]);
  return progress;
}


/**
 * `top` for a sticky block that should scroll until fully visible and then stay
 * put while the next block slides over it (works when it is taller than the screen).
 */
export function useStickyFit(ref: React.RefObject<HTMLElement>) {
  const [top, setTop] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setTop(Math.min(0, window.innerHeight - el.offsetHeight));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [ref]);
  return top;
}

/**
 * Desktop: once the pinned block reaches its resting position, scrolling further
 * down is held until its reveal sequence (`durationMs` from when it came into
 * view) has finished — so the next block only slides over it after that.
 */
export function useHoldUntilRevealed(ref: React.RefObject<HTMLElement>, durationMs: number) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let doneAt = Infinity;
    // same trigger as BlurIn, so the clock starts with the reveal itself
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          doneAt = performance.now() + durationMs;
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY <= 0 || window.innerWidth < 768 || reducedMotion()) return;
      if (performance.now() >= doneAt) return window.removeEventListener("wheel", onWheel);
      const pinnedTop = parseFloat(getComputedStyle(el).top) || 0;
      // only while the block sits at its sticky position
      if (Math.abs(el.getBoundingClientRect().top - pinnedTop) < 2) e.preventDefault();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      io.disconnect();
      window.removeEventListener("wheel", onWheel);
    };
  }, [ref, durationMs]);
}

/**
 * Progress (0→1) of an element travelling through the viewport: 0 when its top
 * enters at the bottom of the screen, 1 once its top has risen `span` of the
 * screen height. For scroll-driven reveals of blocks that are not pinned.
 */
export function useViewProgress(ref: React.RefObject<HTMLElement>, span = 0.75) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const vh = window.innerHeight;
      const t = (vh - el.getBoundingClientRect().top) / (vh * span);
      setProgress(Math.min(1, Math.max(0, t)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ref, span]);
  return progress;
}

/**
 * `top` that pins a sticky block with its bottom edge on the bottom of the screen
 * (positive when the block is shorter than the screen), so whatever follows it
 * appears right under it once it is released.
 */
export function useStickyBottom(ref: React.RefObject<HTMLElement>) {
  const [top, setTop] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setTop(window.innerHeight - el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [ref]);
  return top;
}

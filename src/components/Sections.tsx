import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { legalDocs } from "../legal";
import * as c from "../content";
import { BlurIn, RollText, useHoldUntilRevealed, useInViewOnce, useScrollProgress, useStickyBottom, useStickyFit, useViewProgress } from "./motion";
import { Arrow, InstagramIcon, Lines, Logo, SectionLabel } from "./ui";

export function Header() {
  return (
    // Fixed so the logo stays on screen; white + difference blend keeps it
    // dark on light backgrounds and light over dark photos.
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
      <div className="container-x pt-6 md:pt-8">
        <Logo className="pointer-events-auto" />
      </div>
    </header>
  );
}

// Lists roll in from empty once the heading (150ms) and text (450ms) have started to appear.
const HERO_LIST_START = 900;

export function Hero() {
  const h = c.hero;
  return (
    <section id="top" className="sticky top-0 h-[100svh] overflow-hidden md:h-screen">
      {/* photo + its fades + the darkening reveal as one layer, so no overlay shows
          on its own while the photo is still blurred in */}
      <BlurIn variant="image" aria-hidden className="absolute inset-0">
        {/* mobile: photo fills the first screen, raised 50px (the freed strip at the bottom
            sits under the opaque paper fade); desktop: right 62% */}
        <img
          src={h.image}
          alt=""
          className="absolute inset-x-0 -top-[50px] h-full w-full object-cover object-[calc(65%_+_20px)_center] md:left-auto md:top-0 md:h-full md:w-[62%] md:object-[72%_center]"
        />
        {/* mobile: paper-coloured fades keep the text readable over the photo */}
        <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-paper via-paper/70 to-transparent md:hidden" />
        {/* one layer, fully opaque over the bottom 60px so the raised photo's edge never shows */}
        <div className="absolute inset-x-0 bottom-0 h-[65%] bg-[linear-gradient(to_top,#F4F2EE_60px,rgb(244_242_238/0.8)_50%,transparent)] md:hidden" />
        <div className="absolute inset-y-0 left-[38%] hidden w-[18%] bg-gradient-to-r from-paper to-transparent md:block" />
        {/* desktop: soft, wide darkening from the right edge behind the white column */}
        <div className="absolute inset-y-0 right-0 hidden w-[45%] bg-[radial-gradient(ellipse_100%_60%_at_right,rgba(0,0,0,0.3),rgba(0,0,0,0.1)_50%,transparent_80%)] md:block" />
      </BlurIn>
      <div className="container-x relative flex h-full flex-col justify-between gap-12 pb-14 pt-36">
        <div>
          <ul className="side-list text-ink">
            {h.tags.map((t, i) => (
              <li key={t}>
                <RollText text={t} enter delay={HERO_LIST_START + i * 160} />
              </li>
            ))}
          </ul>
          {/* mobile: the desktop right-hand column moves here, under a short rule */}
          <div className="md:hidden">
            <span aria-hidden className="my-4 block h-px w-12 bg-ink/50" />
            <ul className="side-list text-ink">
              {h.sideList.map((t, i) => (
                <li key={t}>
                  <RollText text={t} enter delay={HERO_LIST_START + (h.tags.length + i) * 160} />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-[560px]">
          <BlurIn as="h1" delay={150} className="h-display text-[54px] md:text-[96px]">
            <Lines lines={h.title} />
          </BlurIn>
          <BlurIn as="p" delay={450} className="mt-8 max-w-[420px] text-[15px] leading-relaxed text-ink/80">
            {h.text}
          </BlurIn>
        </div>
      </div>
      {/* right column: centred on the screen height */}
      <ul className="side-list absolute right-4 top-1/2 hidden -translate-y-1/2 text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.25)] md:right-10 md:block">
        {h.sideList.map((t, i) => (
          <li key={t}>
            <RollText text={t} enter delay={HERO_LIST_START + i * 160} />
          </li>
        ))}
      </ul>
    </section>
  );
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function useDesktop() {
  const [desktop, setDesktop] = useState(() => window.matchMedia("(min-width: 768px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return desktop;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Pinned photo reveal shared by the approach and expertise blocks. Desktop: while
 * the (220vh) section is pinned, the photo opens from a small frame to its full
 * half, then `revealed` turns true for the list. Mobile shows the end state.
 */
function usePhotoReveal(ref: React.RefObject<HTMLElement>, { onMobile = false } = {}) {
  const progress = useScrollProgress(ref);
  const desktop = useDesktop();
  const active = desktop || onMobile;
  const t = active ? Math.min(1, progress / 0.7) : 1;
  return {
    desktop,
    progress: active ? progress : 1,
    mask: easeInOut(t),
    photo: easeOut(t),
    revealed: !active || progress > 0.72,
  };
}

// Height of the small starting frame. The frame keeps the half's proportions,
// so the whole photo reads in it, just smaller.
const SMALL_FRAME = 300;

/**
 * Parallax reveal: the mask (frame) and the photo inside grow on different curves
 * and from different scales, so the image drifts inside the opening frame.
 */
function RevealPhoto({
  src,
  mask,
  photo,
  start = Math.min(1, SMALL_FRAME / window.innerHeight),
  imgClassName = "",
  children,
}: {
  src: string;
  mask: number;
  photo: number;
  /** starting frame size as a share of the full frame */
  start?: number;
  imgClassName?: string;
  children?: React.ReactNode;
}) {
  // frame inset, as a share of the half on each side
  const inset = ((1 - start) / 2) * (1 - mask) * 100;
  // photo starts slightly larger than the frame and settles at its own pace
  const photoStart = start * 1.15;
  const photoScale = photoStart + (1 - photoStart) * photo;
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(${inset}% ${inset}%)` }}>
      <img
        src={src}
        alt=""
        className={`h-full w-full object-cover will-change-transform ${imgClassName}`}
        style={{ transform: `scale(${photoScale})` }}
      />
      {children}
    </div>
  );
}

/** Mobile: square photo revealed with the same parallax as it scrolls into view. */
function ScrollRevealPhoto({ src, imgClassName, alt = "" }: { src: string; imgClassName?: string; alt?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const t = useViewProgress(ref);
  return (
    <div ref={ref} className="relative aspect-square w-full" role={alt ? "img" : undefined} aria-label={alt || undefined}>
      <RevealPhoto src={src} mask={easeInOut(t)} photo={easeOut(t)} start={0.45} imgClassName={imgClassName} />
    </div>
  );
}

export function Approach() {
  const a = c.approach;
  const ref = useRef<HTMLElement>(null);
  // Mobile too: pinned, with a square photo that opens up while scrolling.
  const { desktop, mask, photo, revealed } = usePhotoReveal(ref, { onMobile: true });
  // mobile: the pinned part is only as tall as its content and sits on the bottom
  // of the screen, so the next block follows straight under the square photo
  const pinned = useRef<HTMLDivElement>(null);
  const pinTop = useStickyBottom(pinned);

  return (
    <section id="approach" ref={ref} className="relative z-10 h-[200svh] bg-paper md:h-[220vh]">
      <div
        ref={pinned}
        style={{ top: desktop ? 0 : pinTop }}
        className="sticky flex flex-col md:grid md:h-screen md:grid-cols-2"
      >
        <div className="flex flex-col justify-center px-4 pb-8 pt-24 md:px-10 md:py-16">
          <SectionLabel num={a.num} label={a.label} />
          <BlurIn as="h2" className="h-section mt-6 text-[40px] md:mt-8 md:text-[60px]">
            <Lines lines={a.title} />
          </BlurIn>
          <BlurIn as="p" delay={150} className="mt-5 max-w-[420px] text-[15px] leading-relaxed text-ink/80 md:mt-6">{a.text}</BlurIn>
        </div>
        <div className="relative aspect-square w-full md:aspect-auto md:h-full">
          <RevealPhoto src={a.image} mask={mask} photo={photo} start={desktop ? undefined : 0.45}>
            {/* mobile: soft darkening in the centre for the white list */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.5),rgba(0,0,0,0.15)_55%,transparent_80%)] md:hidden" />
          </RevealPhoto>
          {/* mobile: white, centred on the photo; desktop: on the clean light area at the right edge */}
          <ul className="side-list absolute inset-0 flex flex-col items-center justify-center text-center text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.35)] md:inset-auto md:[text-shadow:none] md:right-10 md:top-1/2 md:block md:-translate-y-1/2 md:text-left md:text-ink">
            {a.sideList.map((t, i) => (
              <li key={t}>
                <RollText text={t} enter play={revealed} delay={i * 160} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Process() {
  const p = c.process;
  // Order: heading → text → each step in turn (number/title, photo, caption).
  const stepDelay = (i: number) => 450 + i * 220;
  const ref = useRef<HTMLElement>(null);
  const stickyTop = useStickyFit(ref);
  // the last caption finishes ~stepDelay(5) + 350ms delay + ~1.2s transition
  useHoldUntilRevealed(ref, stepDelay(p.steps.length - 1) + 350 + 1300);
  return (
    <section
      id="process"
      ref={ref}
      style={{ top: stickyTop }}
      className="sticky flex flex-col justify-center bg-[#F8F7F4] py-20 md:min-h-screen">
      <div className="container-x">
        <SectionLabel num={p.num} label={p.label} />
        <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-end">
          <BlurIn as="h2" className="h-section text-[40px] md:text-[56px]">
            <Lines lines={p.title} />
          </BlurIn>
          <div className="max-w-[440px] md:justify-self-end">
            <BlurIn as="p" delay={150} className="text-[15px] leading-relaxed text-ink/80">{p.text}</BlurIn>
          </div>
        </div>
        {/* mobile: square photos 8px apart (16px between rows), number + title on a darkened bottom edge;
            desktop: number + title above a 6:5 photo */}
        <ol className="mt-12 grid grid-cols-2 gap-x-2 gap-y-4 md:mt-20 md:grid-cols-3 md:gap-x-8 md:gap-y-14 lg:grid-cols-6 xl:gap-x-10">
          {p.steps.map((s, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <li key={s.title}>
                <BlurIn delay={stepDelay(i)} className="hidden md:block">
                  <p className="label">{num}</p>
                  <h3 className="label mt-1 min-h-[2.6em] font-semibold xl:min-h-0">{s.title}</h3>
                </BlurIn>
                <BlurIn variant="blind" delay={stepDelay(i) + 120} className="relative md:mt-3">
                  <img src={s.image} alt="" className="aspect-square w-full object-cover md:aspect-[6/5]" />
                  <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                  <div className="absolute inset-x-2 bottom-2 text-white md:hidden">
                    <p className="label">{num}</p>
                    <h3 className="label mt-0.5 font-semibold">{s.title}</h3>
                  </div>
                </BlurIn>
                <BlurIn as="p" delay={stepDelay(i) + 350} className="mt-2 text-[13px] leading-snug text-ink/75 md:mt-3">
                  {s.text}
                </BlurIn>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

type ExpertiseGroup = (typeof c.expertise.columns)[number][number];

/** One group: title, then its lines — each rolls in, `startAt` sets its place in the sequence. */
function ExpertiseGroupList({ g, play, startAt }: { g: ExpertiseGroup; play: boolean; startAt: number }) {
  return (
    <div>
      <p className="label font-semibold">
        <RollText text={g.title} enter play={play} delay={startAt * 70} />
      </p>
      <ul className="mt-2 space-y-0.5 text-[12px] text-muted">
        {g.items.map((it, i) => (
          <li key={it}>
            <RollText text={it} enter play={play} delay={(startAt + 1 + i) * 70} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Expertise() {
  const e = c.expertise;
  const scene = useRef<HTMLDivElement>(null);
  const { desktop, progress, mask, photo, revealed } = usePhotoReveal(scene, { onMobile: true });
  const pinned = useRef<HTMLDivElement>(null);
  const pinTop = useStickyBottom(pinned);
  // Desktop: heading appears while the photo opens; groups follow once it is fully open.
  const showHeading = progress > 0.3;
  // Mobile: groups sit below the pinned scene and roll in when they scroll into view.
  const [mobileGroupsRef, mobileGroupsInView] = useInViewOnce<HTMLDivElement>();
  const [longevity, wellness, performance] = e.columns[0];
  const [beauty, nutrition] = e.columns[1];

  // positions in the roll sequence (title + its lines)
  const seq = (groups: ExpertiseGroup[]) => {
    let n = 0;
    return groups.map((g) => {
      const at = n;
      n += 1 + g.items.length;
      return at;
    });
  };
  const desktopAt = seq(e.columns.flat());
  // mobile rows: Longevity | Wellness, Performance | Beauty, Functional nutrition
  const mobileOrder = [longevity, wellness, performance, beauty, nutrition];
  const mobileAt = seq(mobileOrder);

  return (
    <section id="expertise" className="relative z-10 bg-white">
      <div ref={scene} className="h-[200svh] md:h-[220vh]">
        {/* mobile: pinned part sized to its content, sitting on the bottom of the screen,
            so the groups follow straight under the photo */}
        <div
          ref={pinned}
          style={{ top: desktop ? 0 : pinTop }}
          className="sticky flex flex-col md:grid md:h-screen md:grid-cols-2"
        >
          {/* photo: left half on desktop; square under the heading on mobile
              (the white below it runs straight into the groups of this block) */}
          <div className="relative aspect-square w-full md:aspect-auto md:h-full">
            <RevealPhoto src={e.image} mask={mask} photo={photo} start={desktop ? undefined : 0.45} />
          </div>
          <div className="order-first px-4 pb-8 pt-24 md:order-none md:flex md:flex-col md:justify-center md:px-10 md:py-16">
            <BlurIn show={desktop ? showHeading : undefined}>
              <SectionLabel num={e.num} label={e.label} />
            </BlurIn>
            {/* an enumeration set inline; on desktop each area stays on one line */}
            <BlurIn
              as="h2"
              show={desktop ? showHeading : undefined}
              delay={120}
              className="h-display mt-6 text-[36px] md:mt-8 md:text-[44px]"
            >
              {e.title.map((t, i) => (
                <Fragment key={t}>
                  <span className="md:whitespace-nowrap">
                    {t}
                    {i < e.title.length - 1 && (
                      <span className="hidden pl-[0.3em] font-extralight text-ink/40 md:inline">·</span>
                    )}
                  </span>{" "}
                </Fragment>
              ))}
            </BlurIn>
            {/* desktop: row 1 three groups, row 2 two groups on the same column grid */}
            <div className="mt-12 hidden space-y-8 md:block">
              {[e.columns[0], e.columns[1]].map((row, r) => (
                <div key={r} className="grid grid-cols-3 gap-x-8">
                  {row.map((g) => (
                    <ExpertiseGroupList key={g.title} g={g} play={revealed} startAt={desktopAt[e.columns.flat().indexOf(g)]} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* mobile: groups follow the pinned scene */}
      <div ref={mobileGroupsRef} className="grid grid-cols-2 gap-x-2 gap-y-8 px-4 pb-16 pt-8 md:hidden">
        {mobileOrder.map((g, i) => (
          <div key={g.title} className={g === longevity ? "col-span-2" : undefined}>
            <ExpertiseGroupList g={g} play={mobileGroupsInView} startAt={mobileAt[i]} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function Founder() {
  const f = c.founder;
  const scene = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(scene);
  const desktop = useDesktop();
  // Desktop: the photo starts full-width and is cropped into the left half while
  // the scene is pinned; the bio on the right appears once there is room for it.
  // Parallax: the photo inside zooms out and drifts across the whole pinned
  // scroll, so it keeps moving after the frame has stopped narrowing.
  const t = desktop ? Math.min(1, progress / 0.65) : 1;
  const narrow = easeInOut(t);
  const drift = desktop ? progress : 1;
  const photoScale = 1.25 - 0.25 * drift;
  const photoShift = (1 - drift) * 6; // % to the right, settles at 0
  const showText = !desktop || progress > 0.55;

  return (
    <section id="founder" className="relative z-10 bg-paper">
      <div ref={scene} className="md:h-[240vh]">
        <div className="relative md:sticky md:top-0 md:h-screen md:overflow-hidden">
          <div className="md:hidden">
            <ScrollRevealPhoto src={f.image} imgClassName="object-[center_22%]" alt={f.name.join(" ")} />
          </div>
          <div
            className="hidden overflow-hidden md:absolute md:inset-y-0 md:left-0 md:block"
            style={desktop ? { width: `${100 - 50 * narrow}%` } : undefined}
          >
            <img
              src={f.image}
              alt={f.name.join(" ")}
              className="h-full w-full object-cover object-[center_22%] will-change-transform"
              style={desktop ? { transform: `translateX(${photoShift}%) scale(${photoScale})` } : undefined}
            />
          </div>
          <div className="flex flex-col justify-center px-4 py-14 md:absolute md:inset-y-0 md:right-0 md:w-1/2 md:px-10 md:py-0">
            <BlurIn show={showText}>
              <SectionLabel num={f.num} label={f.label} />
            </BlurIn>
            <BlurIn as="h2" show={showText} delay={80} className="h-section mt-8 text-[44px] md:text-[56px]">
              <Lines lines={f.name} />
            </BlurIn>
            <BlurIn as="p" show={showText} delay={180} className="label mt-6 font-semibold">
              {f.role}
            </BlurIn>
            <div className="mt-6 max-w-[560px] space-y-4 text-[14px] leading-relaxed text-ink/80">
              {f.text.map((t, i) => (
                <BlurIn as="p" key={t} show={showText} delay={260 + i * 90}>
                  {t}
                </BlurIn>
              ))}
            </div>
            <BlurIn show={showText} delay={750} className="mt-8">
              <a href={f.instagram} target="_blank" rel="noopener noreferrer" className="link-arrow">
                <InstagramIcon /> {f.link}
              </a>
            </BlurIn>
          </div>
        </div>
      </div>
      <div className="container-x grid grid-cols-1 gap-6 border-t border-line py-10 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {f.facts.map((x, i) => (
          <BlurIn key={x.title} delay={i * 100}>
            <p className="label font-semibold">{x.title}</p>
            <p className="mt-2 max-w-[240px] text-[13px] text-muted">{x.text}</p>
          </BlurIn>
        ))}
      </div>
    </section>
  );
}

export function Network() {
  const n = c.network;
  const ref = useRef<HTMLElement>(null);
  const stickyTop = useStickyFit(ref);
  return (
    <section
      id="network"
      ref={ref}
      style={{ top: stickyTop }}
      className="sticky flex flex-col border-t border-line bg-paper pt-[120px] md:min-h-screen md:pt-0"
    >
      {/* mobile: photo starts 50px under the fixed logo.
          desktop: the full photo at its own 3:1 proportions, flush with the top separator;
          the text sits on its empty left part */}
      <div className="relative">
        <BlurIn as="img" variant="wipe" src={n.image} alt="" className="hidden h-auto w-full md:block" />
        <div className="md:hidden">
          <ScrollRevealPhoto src={n.image} imgClassName="object-[68%_center]" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-16 bg-gradient-to-t from-paper to-transparent md:block" />
        <div className="container-x py-10 md:absolute md:inset-y-0 md:left-0 md:flex md:w-[42%] md:flex-col md:justify-center md:py-0">
          <BlurIn delay={300}>
            <SectionLabel num={n.num} label={n.label} />
          </BlurIn>
          <BlurIn as="h2" delay={400} className="h-section mt-6 text-[36px] lg:text-[52px]">
            <Lines lines={n.title} />
          </BlurIn>
          <BlurIn as="p" delay={550} className="mt-5 max-w-[420px] text-[15px] leading-relaxed text-ink/80">
            {n.text}
          </BlurIn>
        </div>
      </div>
      {/* partner strip takes the remaining height, logos centred in it */}
      <BlurIn delay={700} className="marquee flex flex-1 items-center py-10" aria-label="Partners">
        <div className="marquee-track">
          {/* the set is repeated so the track is wider than the screen; -50% shift loops seamlessly */}
          {[0, 1].map((half) => (
            // mobile: logos at 70% so about two and a half fit on screen
            <ul key={half} className="flex shrink-0 items-center [--logo-scale:0.7] md:[--logo-scale:1]" aria-hidden={half === 1}>
              {[0, 1, 2].flatMap((rep) =>
                n.partners.map((p) => (
                  <li key={`${rep}-${p.name}`} className="shrink-0 px-7 md:px-14">
                    <img
                      src={p.src}
                      alt={half === 0 && rep === 0 ? p.name : ""}
                      style={{ height: `calc(${p.height}px * var(--logo-scale))` }}
                      className="w-auto opacity-85"
                    />
                  </li>
                )),
              )}
            </ul>
          ))}
        </div>
      </BlurIn>
    </section>
  );
}

type FieldName = keyof typeof c.contact.fields;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Returns the error key for a field, or null when the value is valid. */
function validate(name: FieldName, value: string): FieldName | null {
  const v = value.trim();
  if (name === "email") return EMAIL_RE.test(v) ? null : name;
  if (name === "phone") {
    const digits = v.replace(/\D/g, "").length;
    return /^\+?[\d\s()-]+$/.test(v) && digits >= 7 && digits <= 15 ? null : name;
  }
  return v ? null : name;
}

/** Small circle with a check mark that draws itself in. */
function ValidMark() {
  return (
    <span aria-hidden className="valid-mark pointer-events-none absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border border-ink">
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M2.5 6.2 5 8.5 9.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function FormField({
  name,
  value,
  touched,
  onChange,
  onBlur,
  multiline = false,
  type = "text",
  inputMode,
}: {
  name: FieldName;
  value: string;
  touched: boolean;
  onChange: (v: string) => void;
  onBlur: () => void;
  multiline?: boolean;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const k = c.contact;
  const error = validate(name, value);
  const showError = touched && error !== null;
  const showValid = value.trim() !== "" && error === null;
  const common = {
    id: `field-${name}`,
    name,
    value,
    placeholder: k.fields[name],
    onBlur,
    "aria-invalid": showError,
    "aria-describedby": showError ? `error-${name}` : undefined,
    className: `field pr-11 transition-colors ${showError ? "!border-[#B3261E]" : ""} ${multiline ? "resize-none" : ""}`,
  };
  return (
    <div className="relative">
      {multiline ? (
        <textarea {...common} rows={4} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...common} type={type} inputMode={inputMode} onChange={(e) => onChange(e.target.value)} />
      )}
      {showValid && <ValidMark />}
      {showError && (
        <p id={`error-${name}`} className="field-error mt-1.5 text-left text-[12px] text-[#B3261E]">
          {k.errors[name]}
        </p>
      )}
    </div>
  );
}

const FIELD_ORDER: FieldName[] = ["name", "company", "email", "phone", "message"];

export function Contact() {
  const k = c.contact;
  const [sent, setSent] = useState(false);
  const [values, setValues] = useState<Record<FieldName, string>>({ name: "", company: "", email: "", phone: "", message: "" });
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});

  const field = (name: FieldName, extra: Partial<React.ComponentProps<typeof FormField>> = {}) => (
    <FormField
      name={name}
      value={values[name]}
      touched={!!touched[name]}
      onChange={(v) => setValues((s) => ({ ...s, [name]: v }))}
      onBlur={() => setTouched((t) => ({ ...t, [name]: true }))}
      {...extra}
    />
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, company: true, email: true, phone: true, message: true });
    const firstInvalid = FIELD_ORDER.find((n) => validate(n, values[n]));
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus();
      return;
    }
    setSent(true);
  };

  return (
    <section id="contact" className="relative z-10 flex flex-col justify-center bg-white py-20 md:min-h-screen">
      <div className="container-x grid gap-14 md:grid-cols-2 md:items-center">
        {/* mobile: centred; desktop: left-aligned */}
        <div className="text-center md:text-left">
          <BlurIn className="[&>p]:justify-center md:[&>p]:justify-start">
            <SectionLabel num={k.num} label={k.label} />
          </BlurIn>
          <BlurIn as="h2" delay={100} className="h-section mt-8 text-[40px] md:text-[56px]">
            <Lines lines={k.title} />
          </BlurIn>
          <BlurIn as="p" delay={250} className="mx-auto mt-6 max-w-[420px] text-[15px] leading-relaxed text-ink/80 md:mx-0">
            {k.text}
          </BlurIn>
        </div>
        <form noValidate className="grid content-start gap-3 sm:grid-cols-2" onSubmit={onSubmit}>
          <BlurIn delay={400}>{field("name")}</BlurIn>
          <BlurIn delay={490}>{field("company")}</BlurIn>
          <BlurIn delay={580}>{field("email", { type: "email", inputMode: "email" })}</BlurIn>
          <BlurIn delay={670}>
            {field("phone", {
              type: "tel",
              inputMode: "tel",
              // phone: keep only characters a number can contain
              onChange: (v: string) => setValues((s) => ({ ...s, phone: v.replace(/[^\d+\s()-]/g, "") })),
            })}
          </BlurIn>
          <BlurIn delay={760} className="sm:col-span-2">
            {field("message", { multiline: true })}
          </BlurIn>
          <BlurIn delay={850} className="sm:col-span-2">
            <FillButton type="submit" className="w-full" arrow={!sent}>
              {sent ? k.sent : k.submit}
            </FillButton>
          </BlurIn>
        </form>
      </div>
    </section>
  );
}

/** Dark button; on hover white fills it in a circle spreading out from the arrow. */
function FillButton({
  children,
  className = "",
  arrow = true,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { arrow?: boolean }) {
  return (
    <button
      {...rest}
      className={`label group relative inline-flex items-center justify-center overflow-hidden rounded-sm border border-ink bg-ink px-6 py-3.5 text-white transition-colors duration-500 hover:text-ink ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span className={`relative ml-3 inline-block ${arrow ? "" : "invisible"}`}>
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[1600px] w-[1600px] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-white transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-100"
        />
        <span className="relative z-10">
          <Arrow />
        </span>
      </span>
    </button>
  );
}

export function Footer() {
  const f = c.footer;
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-x grid gap-8 py-12 md:grid-cols-2 md:items-end">
        <div>
          <Logo />
          <a
            href={f.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-fit items-center gap-2 text-[13px] text-ink/80 hover:text-ink"
          >
            <InstagramIcon /> {f.instagram.label}
          </a>
        </div>
        <div className="text-[12px] text-muted md:text-right">
          <p>{f.copyright}</p>
          <p>{f.rights}</p>
          <p className="mt-4 flex gap-5 md:justify-end">
            {legalDocs.map((d) => (
              <Link key={d.slug} to={`/${d.slug}`} className="hover:text-ink">
                {d.title}
              </Link>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}

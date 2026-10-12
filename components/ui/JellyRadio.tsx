"use client";

import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, motionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";

export interface JellyRadioItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface ChipMotionValues {
  x: MotionValue<number>;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}

const SIZES = {
  sm: [32, 12, 12],
  md: [38, 13, 16],
  lg: [44, 14, 20],
};

const spring = (k: number, m: number, bounce: number) => ({
  type: "spring" as const,
  stiffness: k,
  damping: 2 * Math.sqrt(k * m) * (1 - bounce),
  mass: m,
});

interface ChipProps
  extends React.ComponentPropsWithoutRef<typeof motion.button> {
  mv: ChipMotionValues;
  children: React.ReactNode;
}

const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { mv, children, ...rest },
  ref
) {
  const transform = useTransform(
    () => `translateX(${mv.x.get()}px) scale(${mv.sx.get()}, ${mv.sy.get()})`
  );
  return (
    <motion.button ref={ref} style={{ transform }} {...rest}>
      {children}
    </motion.button>
  );
});

export default function JellyRadio({
  items,
  value,
  defaultValue,
  onChange,
  chipColor = "#FFFFFF",
  activeColor = "#1E3F30",
  textColor = "#44403C",
  activeTextColor = "#FFFFFF",
  size = "md",
  gap = 8,
  radius = 9999,
  swell = 0.16,
  barge = 6,
  shrink = 0.04,
  jelly = 1,
  bounce = 0.25,
  stagger = 20,
  stiffness = 580,
  disabled = false,
  ariaLabel = "Pilihan Opsi",
  className = "",
}: {
  items: (string | JellyRadioItem)[];
  value?: string;
  defaultValue?: string;
  onChange?: (val: string, index: number) => void;
  chipColor?: string;
  activeColor?: string;
  textColor?: string;
  activeTextColor?: string;
  size?: "sm" | "md" | "lg";
  gap?: number;
  radius?: number;
  swell?: number;
  barge?: number;
  shrink?: number;
  jelly?: number;
  bounce?: number;
  stagger?: number;
  stiffness?: number;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}) {
  const list: JellyRadioItem[] = items.map((it) =>
    typeof it === "string" ? { value: it, label: it } : it
  );
  const [inner, setInner] = useState(() => defaultValue ?? list[0]?.value);
  const current = value ?? inner;
  const at = Math.max(
    0,
    list.findIndex((it) => it.value === current)
  );
  const reduce = useReducedMotion();
  const groupRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const widths = useRef<number[]>([]);
  const mvs = useRef<ChipMotionValues[]>([]);
  const applied = useRef(at);
  const cfg = useRef({
    swell,
    barge,
    shrink,
    jelly,
    bounce,
    stagger,
    stiffness,
    reduce,
    count: list.length,
  });
  cfg.current = {
    swell,
    barge,
    shrink,
    jelly,
    bounce,
    stagger,
    stiffness,
    reduce,
    count: list.length,
  };
  const [h, font, px] = SIZES[size] ?? SIZES.md;
  const itemsKey = list.map((it) => it.value).join("|");

  const mvFor = (i: number) => {
    let mv = mvs.current[i];
    if (!mv) {
      mv = { x: motionValue(0), sx: motionValue(1), sy: motionValue(1) };
      mvs.current[i] = mv;
    }
    return mv;
  };

  const apply = (sel: number, instant: boolean) => {
    const C = cfg.current;
    const group = groupRef.current;
    const rtl = group ? getComputedStyle(group).direction === "rtl" : false;
    const push = ((widths.current[sel] ?? 0) * C.swell) / 2 + C.barge;
    for (let i = 0; i < C.count; i++) {
      const mv = mvFor(i);
      const on = i === sel;
      const far = Math.abs(i - sel);
      const dir = Math.sign(i - sel) * (rtl ? -1 : 1);
      const x = dir * push;
      const s = on ? 1 + C.swell : 1 - C.shrink;
      if (instant || C.reduce) {
        mv.x.jump(x);
        mv.sx.jump(s);
        mv.sy.jump(s);
        continue;
      }
      const k = C.stiffness * (1 - 0.12 * Math.min(far, 3));
      const inFlight = mv.x.isAnimating() || mv.sx.isAnimating() || mv.sy.isAnimating();
      const delay = inFlight ? 0 : (far * C.stagger) / 1000;
      animate(mv.x, x, { ...spring(k, 0.9, C.bounce), delay });
      const j = C.jelly;
      animate(mv.sx, s, {
        ...spring(k * (1 + 0.24 * j), 0.9 - 0.1 * j, Math.min(0.85, C.bounce + 0.3 * j)),
        delay,
      });
      animate(mv.sy, s, {
        ...spring(k * (1 - 0.14 * j), 0.9 + 0.05 * j, C.bounce),
        delay: delay + 0.05 * j,
      });
    }
  };

  const measure = () => {
    const group = groupRef.current;
    if (!group) return;
    widths.current = chipRefs.current.map((el) => el?.offsetWidth ?? 0);
    const chipH = chipRefs.current[0]?.offsetHeight ?? 0;
    const maxW = Math.max(0, ...widths.current);
    group.style.setProperty(
      "--jr-pad-x",
      `${Math.ceil((maxW * swell * 1.3) / 2 + barge) + 2}px`
    );
    group.style.setProperty("--jr-pad-y", `${Math.ceil((chipH * swell) / 2) + 2}px`);
  };

  useLayoutEffect(() => {
    const settle = () => {
      measure();
      apply(applied.current, true);
    };
    settle();
    const observer = new ResizeObserver(settle);
    if (groupRef.current) observer.observe(groupRef.current);
    document.fonts?.ready.then(settle);
    return () => observer.disconnect();
  }, [itemsKey, size, gap, swell, barge, shrink]);

  useEffect(() => {
    if (applied.current === at) return;
    applied.current = at;
    apply(at, true);
  }, [at]);

  useEffect(
    () => () =>
      mvs.current.forEach((mv) => {
        mv.x.destroy();
        mv.sx.destroy();
        mv.sy.destroy();
      }),
    []
  );

  const commit = (i: number, instant: boolean) => {
    if (disabled || i === at || !list[i] || list[i].disabled) return;
    applied.current = i;
    apply(i, instant);
    if (value === undefined) setInner(list[i].value);
    onChange?.(list[i].value, i);
  };

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={ariaLabel}
      data-disabled={disabled ? "" : undefined}
      className={`group inline-flex items-center select-none [-webkit-touch-callout:none] gap-[var(--jr-gap)] px-[var(--jr-pad-x)] py-[var(--jr-pad-y)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
      style={
        {
          "--jr-chip": chipColor,
          "--jr-active": activeColor,
          "--jr-text": textColor,
          "--jr-active-text": activeTextColor,
          "--jr-gap": `${gap}px`,
          "--jr-radius": `${radius}px`,
          "--jr-h": `${h}px`,
          "--jr-font": `${font}px`,
          "--jr-px": `${px}px`,
        } as React.CSSProperties
      }
    >
      {list.map((it, i) => (
        <Chip
          key={it.value}
          mv={mvFor(i)}
          ref={(el: HTMLButtonElement | null) => {
            chipRefs.current[i] = el;
          }}
          type="button"
          role="radio"
          aria-checked={i === at}
          tabIndex={i === at ? 0 : -1}
          disabled={disabled || !!it.disabled}
          className="group/chip relative m-0 cursor-pointer touch-manipulation border-0 bg-transparent p-0 text-inherit outline-none origin-center [-webkit-tap-highlight-color:transparent] data-[on=true]:cursor-default disabled:cursor-default disabled:opacity-40"
          data-on={i === at ? "true" : "false"}
          onClick={(e: React.MouseEvent) => commit(i, e.detail === 0)}
        >
          <span className="relative inline-flex items-center justify-center gap-[0.4em] overflow-hidden rounded-[var(--jr-radius)] border border-[#E5E3DC] bg-[var(--jr-chip)] leading-none font-semibold whitespace-nowrap shadow-2xs [color:var(--jr-text)] [height:var(--jr-h)] [padding:0_var(--jr-px)] [font-size:var(--jr-font)] transition-all duration-200 group-active/chip:scale-[0.97] group-data-[on=true]/chip:border-[#1E3F30] group-data-[on=true]/chip:bg-[var(--jr-active)] group-data-[on=true]/chip:[color:var(--jr-active-text)] group-data-[on=true]/chip:shadow-sm">
            {it.icon ? <span className="inline-flex">{it.icon}</span> : null}
            <span>{it.label}</span>
          </span>
        </Chip>
      ))}
    </div>
  );
}
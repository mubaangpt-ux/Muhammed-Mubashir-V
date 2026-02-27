import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  value: string;
  duration?: number;
};

type ParsedValue = {
  isNumeric: boolean;
  number: number;
  suffix: string;
};

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);

const parseValue = (value: string): ParsedValue => {
  const match = value.trim().match(/^([\d,.]+)(.*)$/);
  if (!match) {
    return { isNumeric: false, number: 0, suffix: "" };
  }
  const numeric = Number(match[1].replace(/,/g, ""));
  if (Number.isNaN(numeric)) {
    return { isNumeric: false, number: 0, suffix: "" };
  }
  return { isNumeric: true, number: numeric, suffix: match[2] ?? "" };
};

export default function AnimatedCounter({ value, duration = 1200 }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const { isNumeric, number, suffix } = useMemo(() => parseValue(value), [value]);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!isNumeric) {
      setDisplay(value);
      return;
    }

    if (prefersReducedMotion) {
      setDisplay(`${formatNumber(number)}${suffix}`);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let hasAnimated = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(number * eased);
            setDisplay(`${formatNumber(current)}${suffix}`);
            if (progress < 1) requestAnimationFrame(animate);
          };
          setDisplay(`0${suffix}`);
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.75 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [duration, isNumeric, number, prefersReducedMotion, suffix, value]);

  return <span ref={ref}>{display}</span>;
}


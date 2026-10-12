"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";

const EASE = [0.23, 1, 0.32, 1] as const;

// Muncul halus saat masuk viewport (fade + naik + blur tipis)
export function Muncul({
  children,
  delay = 0,
  y = 18,
  className = "",
  as = "div",
  ...rest
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "span" | "section" | "p";
  [key: string]: unknown;
}) {
  const reduce = useReducedMotion();
  const Komp =
    as === "span"
      ? motion.span
      : as === "section"
      ? motion.section
      : as === "p"
      ? motion.p
      : motion.div;
  return (
    <Komp
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.5, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Komp>
  );
}

// Teks per kata muncul bertahap (judul hero)
export function KataBertahap({
  teks,
  className = "",
  delay = 0,
  jeda = 0.06,
  kelasKata = () => "",
}: {
  teks: string;
  className?: string;
  delay?: number;
  jeda?: number;
  kelasKata?: (kata: string, index: number) => string;
}) {
  const reduce = useReducedMotion();
  const kata = teks.split(" ");
  return (
    <span className={className}>
      {kata.map((k, i) => (
        <motion.span
          key={`${k}-${i}`}
          className={`inline-block ${kelasKata(k, i)}`}
          initial={reduce ? false : { opacity: 0, y: "0.35em", filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: EASE, delay: delay + i * jeda }}
        >
          {k}
          {i < kata.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}

// Angka menghitung naik saat terlihat
export function AngkaHitung({
  nilai = 0,
  className = "",
  durasi = 1.4,
}: {
  nilai: number;
  className?: string;
  durasi?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const terlihat = useInView(ref, { once: true, margin: "-40px" });
  const [tampil, setTampil] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!terlihat) return undefined;
    if (reduce) {
      setTampil(nilai);
      return undefined;
    }
    const a = animate(0, nilai, {
      duration: durasi,
      ease: EASE,
      onUpdate: (v) => setTampil(Math.round(v)),
    });
    return () => a.stop();
  }, [terlihat, nilai, durasi, reduce]);

  return (
    <span ref={ref} className={className}>
      {new Intl.NumberFormat("id-ID").format(tampil)}
    </span>
  );
}

// Daftar bertahap: anak-anak muncul berurutan
export const varianInduk = {
  tersembunyi: {},
  tampil: { transition: { staggerChildren: 0.06 } },
};
export const varianAnak = {
  tersembunyi: { opacity: 0, y: 14 },
  tampil: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

import React from "react";

interface MochiWordmarkProps {
  className?: string;
  fillPrimary?: string;
  fillAccent?: string;
}

/**
 * MochiWordmark — Master Logotype MOCHI
 * Menggunakan gaya Belogo Stencil Heritage:
 * - Huruf O: potongan stencil vertikal simetris di kutub atas & bawah
 * - Huruf I: bermahkota titik intan emas (bintang 8 turats)
 * - Warna: Deep Forest Green (#1E3F30) & Amber Gold (#C9A96E)
 */
export function MochiWordmark({
  className = "h-5 w-auto",
  fillPrimary = "currentColor",
  fillAccent = "#C9A96E",
}: MochiWordmarkProps) {
  return (
    <svg
      viewBox="0 0 240 48"
      className={className}
      role="img"
      aria-label="MOCHI"
      fill="none"
    >
      {/* Huruf M */}
      <path d="M 0 0 L 8.5 0 L 8.5 48 L 0 48 Z" fill={fillPrimary} />
      <path d="M 39.5 0 L 48 0 L 48 48 L 39.5 48 Z" fill={fillPrimary} />
      <path d="M 7.5 2 L 15.5 2 L 24 37 L 17 37 Z" fill={fillPrimary} />
      <path d="M 40.5 2 L 32.5 2 L 24 37 L 31 37 Z" fill={fillPrimary} />

      {/* Huruf O (Belogo Stencil Signature) */}
      <g transform="translate(58, 0)">
        <path
          d="M 21 0 A 24 24 0 0 0 21 48 L 21 39.5 A 15.5 15.5 0 0 1 21 8.5 Z"
          fill={fillPrimary}
        />
        <path
          d="M 27 0 A 24 24 0 0 1 27 48 L 27 39.5 A 15.5 15.5 0 0 1 27 8.5 Z"
          fill={fillPrimary}
        />
      </g>

      {/* Huruf C */}
      <g transform="translate(116, 0)">
        <path
          d="M 40 10 A 24 24 0 1 0 40 38 L 33 33 A 15.5 15.5 0 1 1 33 15 Z"
          fill={fillPrimary}
        />
      </g>

      {/* Huruf H */}
      <g transform="translate(166, 0)">
        <rect x="0" y="0" width="8.5" height="48" fill={fillPrimary} />
        <rect x="31.5" y="0" width="8.5" height="48" fill={fillPrimary} />
        <rect x="8.5" y="19.75" width="23" height="8.5" fill={fillPrimary} />
      </g>

      {/* Huruf I dengan Titik Intan Emas Turats */}
      <g transform="translate(216, 0)">
        <rect x="4" y="14" width="8.5" height="34" fill={fillPrimary} />
        <polygon
          points="8.25,0 13.5,6.5 8.25,13 3,6.5"
          fill={fillAccent}
        />
      </g>
    </svg>
  );
}

export default MochiWordmark;

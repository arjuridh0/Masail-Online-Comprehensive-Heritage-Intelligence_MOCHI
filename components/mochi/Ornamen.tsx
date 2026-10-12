import React from "react";

// Ornamen Islami tipis: Bintang delapan (Rub el Hizb)
export function BintangDelapan({
  className = "",
  strokeWidth = 1,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
    >
      <rect x="5.5" y="5.5" width="13" height="13" />
      <rect
        x="5.5"
        y="5.5"
        width="13"
        height="13"
        transform="rotate(45 12 12)"
      />
      <circle cx="12" cy="12" r="2.2" />
    </svg>
  );
}

// Pemisah bergaya naskah mushaf: Garis gradasi - Bintang delapan - Garis gradasi
export function PemisahOrnamen({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-4 text-[#C9A96E] ${className}`}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C8C4BB]" />
      <BintangDelapan className="h-4 w-4" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C8C4BB]" />
    </div>
  );
}

// Bintang besar dekoratif berputar sangat pelan (latar hero & auth panel)
export function BintangLatar({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <g strokeWidth="0.35">
        <rect x="40" y="40" width="120" height="120" />
        <rect
          x="40"
          y="40"
          width="120"
          height="120"
          transform="rotate(45 100 100)"
        />
        <rect x="58" y="58" width="84" height="84" />
        <rect
          x="58"
          y="58"
          width="84"
          height="84"
          transform="rotate(45 100 100)"
        />
        <circle cx="100" cy="100" r="30" />
        <circle cx="100" cy="100" r="86" />
        <circle cx="100" cy="100" r="98" strokeDasharray="1 3" />
      </g>
    </svg>
  );
}

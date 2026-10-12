"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

export type MascotState = "idle" | "listening" | "thinking" | "answering" | "confused" | "happy";

interface MochiMascotProps {
  state?: MascotState;
  size?: number | "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
  showSpeechBubble?: boolean;
  speechText?: string;
  isInputFocused?: boolean;
}

export function MochiMascot({
  state = "idle",
  size = "md",
  className = "",
  onClick,
  showSpeechBubble = false,
  speechText,
  isInputFocused = false,
}: MochiMascotProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Koordinat mata ternormalisasi (-1 s.d. 1) menggunakan formula tanh ala Coucou
  const [lookX, setLookX] = useState(0);
  const [lookY, setLookY] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 1. Organic Blinking (Interval Acak 2.2s - 5.4s + Peluang 22% Double Blink)
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    let doubleBlinkTimeout: NodeJS.Timeout;

    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);

        // 22% kemungkinan melakukan dobel kedip cepat
        if (Math.random() < 0.22) {
          doubleBlinkTimeout = setTimeout(() => {
            setIsBlinking(true);
            setTimeout(() => {
              setIsBlinking(false);
              scheduleNext();
            }, 140);
          }, 110);
        } else {
          scheduleNext();
        }
      }, 160);
    };

    const scheduleNext = () => {
      const delay = 2200 + Math.random() * 3200;
      blinkTimeout = setTimeout(triggerBlink, delay);
    };

    scheduleNext();

    return () => {
      clearTimeout(blinkTimeout);
      clearTimeout(doubleBlinkTimeout);
    };
  }, []);

  // 2. Eye Tracking Mengikuti Kursor dengan Kurva Sigmoidal `tanh` (ala Coucou)
  useEffect(() => {
    let animId: number;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Formula Coucou: tanh((mouse - center) / konstanta_pelunak)
      targetX = Math.tanh((e.clientX - centerX) / 280);
      targetY = -Math.tanh((e.clientY - centerY) / 220);
    };

    let currentX = 0;
    let currentY = 0;

    const updateEyePosition = () => {
      // Jika user sedang mengetik atau fokus input, mata kepo melirik ke bawah (menuju kotak input)
      if (isInputFocused || state === "listening") {
        currentX += (targetX * 0.3 - currentX) * 0.15;
        currentY += (-0.72 - currentY) * 0.15; // melirik ke bawah
      } else if (state === "thinking") {
        currentX += (0.42 - currentX) * 0.12;
        currentY += (0.35 - currentY) * 0.12;
      } else {
        currentX += (targetX - currentX) * 0.18;
        currentY += (targetY - currentY) * 0.18;
      }

      setLookX(currentX);
      setLookY(currentY);

      animId = requestAnimationFrame(updateEyePosition);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animId = requestAnimationFrame(updateEyePosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [isInputFocused, state]);

  // Dimensi ukuran
  const pixelWidth =
    typeof size === "number"
      ? size * 1.25
      : size === "sm"
      ? 64
      : size === "md"
      ? 110
      : size === "lg"
      ? 160
      : 220;

  const pixelHeight = pixelWidth * 0.8;

  // Proyeksi Mata ala Coucou
  const eyeBaseLX = 79;
  const eyeBaseRX = 121;
  const eyeBaseY = 88;

  const eyeOffsetX = lookX * 12;
  const eyeOffsetY = -lookY * 9;

  const lx = eyeBaseLX + eyeOffsetX;
  const rx = eyeBaseRX + eyeOffsetX;
  const ey = eyeBaseY + eyeOffsetY;

  // Foreshortening saat toleh
  const leftScaleX = Math.max(0.4, 1 + lookX * 0.35);
  const rightScaleX = Math.max(0.4, 1 - lookX * 0.35);

  // Inersia Peci
  const peciX = 84 + lookX * 6;
  const peciY = 16 - lookY * 4;
  const peciRot = 4 + lookX * 3.5;

  const isKepo = isInputFocused || state === "listening";

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      style={{ width: pixelWidth, height: pixelHeight }}
    >
      {/* Balon Ucapan Opsional */}
      <AnimatePresence>
        {showSpeechBubble && speechText && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            className="absolute -top-10 z-20 whitespace-nowrap rounded-full border border-[#C9A96E]/50 bg-white/95 px-3 py-1 text-[11px] font-bold text-[#1E3F30] shadow-md backdrop-blur-xs pointer-events-none"
          >
            {speechText}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 border-r border-b border-[#C9A96E]/50 bg-white" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          y: state === "answering" ? [0, -4, 0] : isKepo ? 3 : [0, -2.5, 0],
          rotate: isKepo ? -2 : lookX * 2.2,
          scaleY: isKepo ? 0.95 : [1, 1.02, 1],
          scaleX: isKepo ? 1.03 : [1, 0.985, 1],
        }}
        transition={{
          y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
          scaleY: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
          scaleX: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 0.25 },
        }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.93, scaleY: 0.86, y: 4 }}
        onClick={onClick}
        className="relative w-full h-full cursor-pointer"
      >
        <svg
          viewBox="0 0 200 160"
          className="w-full h-full drop-shadow-[0_12px_24px_rgba(20,24,30,0.14)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradien Tubuh Marshmallow / Squoval Coucou Mochi */}
            <linearGradient id="coucouBodyGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#FAF9F6" />
              <stop offset="90%" stopColor="#EAE7DF" />
              <stop offset="100%" stopColor="#DDD8CD" />
            </linearGradient>

            {/* Ambient Shadow Halus di Bawah Tubuh */}
            <radialGradient id="coucouBottomShadow" cx="50%" cy="100%" r="60%">
              <stop offset="0%" stopColor="rgba(40,45,55,0.18)" />
              <stop offset="100%" stopColor="rgba(40,45,55,0)" />
            </radialGradient>

            {/* Highlight Lembut Kepala Coucou */}
            <radialGradient id="coucouHighlight" cx="35%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>

            {/* Peci Beludru Hijau NU */}
            <linearGradient id="peciGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#28503E" />
              <stop offset="60%" stopColor="#1E3F30" />
              <stop offset="100%" stopColor="#12261D" />
            </linearGradient>

            {/* Emas Rosette */}
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5E4B2" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#AA8520" />
            </linearGradient>

            {/* Kitab Turats */}
            <linearGradient id="kitabGrad" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#2A5441" />
              <stop offset="70%" stopColor="#1E3F30" />
              <stop offset="100%" stopColor="#12281E" />
            </linearGradient>
            <linearGradient id="kertasGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EFE8D6" />
              <stop offset="50%" stopColor="#FAF7EE" />
              <stop offset="100%" stopColor="#EFE8D6" />
            </linearGradient>
          </defs>

          {/* 1. Bayangan Meja di Bawah Karakter */}
          <ellipse cx="100" cy="148" rx="60" ry="8" fill="rgba(30,40,35,0.15)" />

          {/* 2. Tangan Melayang Kiri (Floating Paw ala Coucou) */}
          <motion.circle
            cx="28"
            cy="96"
            r="9.5"
            fill="url(#coucouBodyGrad)"
            stroke="#DDD8CD"
            strokeWidth="0.8"
            animate={{ y: [0, -3.5, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* 3. Tangan Melayang Kanan (Waving / Floating Paw ala Coucou) */}
          {state !== "thinking" && (
            <motion.g
              transform="translate(172, 86)"
              animate={{
                y: [0, -5, 0],
                rotate: [0, 18, -8, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Lengan Melambai Ramah */}
              <ellipse cx="0" cy="0" rx="10" ry="12" fill="url(#coucouBodyGrad)" stroke="#DDD8CD" strokeWidth="0.8" />
            </motion.g>
          )}

          {/* 4. Tubuh Superellipse Organik ala Coucou (Squoval Chubby Pillow) */}
          <g id="body">
            {/* Siluet Tubuh Coucou Mochi: Lembut, Membal di Pipi, Datar Halus di Bawah */}
            <path
              d="M 52 50 C 72 40, 128 40, 148 50 C 172 62, 172 110, 150 128 C 130 140, 70 140, 50 128 C 28 110, 28 62, 52 50 Z"
              fill="url(#coucouBodyGrad)"
            />
            {/* Bayangan halus di bawah perut */}
            <path
              d="M 52 50 C 72 40, 128 40, 148 50 C 172 62, 172 110, 150 128 C 130 140, 70 140, 50 128 C 28 110, 28 62, 52 50 Z"
              fill="url(#coucouBottomShadow)"
            />
            {/* Highlight lembut di jidat kepala */}
            <path
              d="M 52 50 C 72 40, 128 40, 148 50 C 172 62, 172 110, 150 128 C 130 140, 70 140, 50 128 C 28 110, 28 62, 52 50 Z"
              fill="url(#coucouHighlight)"
            />
          </g>

          {/* 5. Peci Santri Beludru NU Bertengger di Kepala dengan Inersia */}
          <g
            id="peci"
            transform={`translate(${peciX}, ${peciY}) rotate(${peciRot})`}
          >
            {/* Badan Peci Miring Khas Santri */}
            <path
              d="M -24 24 L -18 -4 C -18 -4, 4 -9, 32 0 L 36 32 C 36 32, 6 24, -24 24 Z"
              fill="url(#peciGrad)"
            />
            <path
              d="M -18 -4 C -18 -4, 4 -9, 32 0 C 32 0, 18 -1, -9 -2 Z"
              fill="#102219"
              opacity="0.8"
            />
            {/* Rosette Emas 8 Sudut */}
            <g transform="translate(18, 12) scale(0.65)">
              <circle cx="0" cy="0" r="3.2" fill="url(#goldGrad)" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
                <ellipse
                  key={ang}
                  cx="0"
                  cy="6"
                  rx="1.8"
                  ry="3.5"
                  transform={`rotate(${ang} 0 0)`}
                  fill="url(#goldGrad)"
                />
              ))}
            </g>
          </g>

          {/* 6. Pipi Merona Pink Halus (Blush ala Coucou) */}
          <ellipse
            cx={56 + lookX * 4}
            cy="102"
            rx="8.5"
            ry="5"
            fill="#FFA7BA"
            opacity={isHovered || state === "happy" ? 0.75 : 0.45}
          />
          <ellipse
            cx={144 + lookX * 4}
            cy="102"
            rx="8.5"
            ry="5"
            fill="#FFA7BA"
            opacity={isHovered || state === "happy" ? 0.75 : 0.45}
          />

          {/* 7. Mata Ikonik Coucou: Vertical Pill Eyes dengan Eye-Tracking `tanh` */}
          <g id="eyes">
            {isBlinking ? (
              // Blink: garis lengkung tertutup
              <>
                <path
                  d={`M ${lx - 7} ${ey} Q ${lx} ${ey + 4} ${lx + 7} ${ey}`}
                  stroke="#12161F"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d={`M ${rx - 7} ${ey} Q ${rx} ${ey + 4} ${rx + 7} ${ey}`}
                  stroke="#12161F"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            ) : state === "happy" || state === "answering" ? (
              // Happy Arc Eyes (^ ^) ala Coucou
              <>
                <path
                  d={`M ${lx - 7} ${ey + 2} Q ${lx} ${ey - 6} ${lx + 7} ${ey + 2}`}
                  stroke="#12161F"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d={`M ${rx - 7} ${ey + 2} Q ${rx} ${ey - 6} ${rx + 7} ${ey + 2}`}
                  stroke="#12161F"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            ) : state === "confused" ? (
              // Dizzy / Spiral Eyes persis Coucou dizzy.png!
              <>
                <g transform={`translate(${lx}, ${ey}) scale(0.85)`}>
                  <path
                    d="M 0 0 m -1 0 a 2 2 0 1 0 2 0 a 4 4 0 1 0 -4 0 a 6 6 0 1 0 6 0"
                    stroke="#12161F"
                    strokeWidth="2.4"
                    fill="none"
                    strokeLinecap="round"
                  />
                </g>
                <g transform={`translate(${rx}, ${ey}) scale(0.85)`}>
                  <path
                    d="M 0 0 m -1 0 a 2 2 0 1 0 2 0 a 4 4 0 1 0 -4 0 a 6 6 0 1 0 6 0"
                    stroke="#12161F"
                    strokeWidth="2.4"
                    fill="none"
                    strokeLinecap="round"
                  />
                </g>
              </>
            ) : isKepo ? (
              // Kepo / Typing: Mata Pill Sedikit Membesar & Menunduk Tajam
              <>
                <g transform={`translate(${lx}, ${ey}) scale(${leftScaleX * 1.15}, 1.12)`}>
                  <rect x="-5" y="-8.5" width="10" height="17" rx="5" fill="#10131A" />
                  <circle cx="-1.5" cy="-3.5" r="2.2" fill="#FFFFFF" />
                </g>
                <g transform={`translate(${rx}, ${ey}) scale(${rightScaleX * 1.15}, 1.12)`}>
                  <rect x="-5" y="-8.5" width="10" height="17" rx="5" fill="#10131A" />
                  <circle cx="-1.5" cy="-3.5" r="2.2" fill="#FFFFFF" />
                </g>
              </>
            ) : (
              // Normal Pill Eyes khas Coucou (Vertical Pill Capsule)
              <>
                <g transform={`translate(${lx}, ${ey}) scale(${leftScaleX}, 1)`}>
                  <rect x="-4.2" y="-7.5" width="8.4" height="15" rx="4.2" fill="#10131A" />
                  {/* Glint mungil */}
                  <circle cx="-1.2" cy="-3.2" r="1.8" fill="#FFFFFF" />
                </g>
                <g transform={`translate(${rx}, ${ey}) scale(${rightScaleX}, 1)`}>
                  <rect x="-4.2" y="-7.5" width="8.4" height="15" rx="4.2" fill="#10131A" />
                  {/* Glint mungil */}
                  <circle cx="-1.2" cy="-3.2" r="1.8" fill="#FFFFFF" />
                </g>
              </>
            )}
          </g>

          {/* 8. Atribut Kitab saat Thinking */}
          {state === "thinking" && (
            <motion.g
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transform="translate(0, 10)"
            >
              {/* Kitab Terbuka Kecil di Depan */}
              <path d="M 100 112 L 68 114 L 70 134 L 100 133 L 130 134 L 132 114 Z" fill="url(#kitabGrad)" />
              <path d="M 100 113 C 90 108, 76 109, 69 114 L 71 130 C 82 126, 92 125, 100 130 C 108 125, 118 126, 129 130 L 131 114 C 124 109, 110 108, 100 113 Z" fill="url(#kertasGrad)" />
              <line x1="100" y1="113" x2="100" y2="133" stroke="#12281E" strokeWidth="1.8" />
              {/* Tangan mungil memegang kitab */}
              <circle cx="68" cy="120" r="7.5" fill="#FAF9F6" stroke="#DDD8CD" strokeWidth="0.6" />
              <circle cx="132" cy="120" r="7.5" fill="#FAF9F6" stroke="#DDD8CD" strokeWidth="0.6" />

              {/* Sparkles Emas Melayang */}
              <motion.circle
                cx="100"
                cy="102"
                r="2.6"
                fill="url(#goldGrad)"
                animate={{ y: [-2, -12, -2], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <motion.circle
                cx="86"
                cy="105"
                r="1.8"
                fill="url(#goldGrad)"
                animate={{ y: [0, -10, 0], opacity: [0.2, 0.9, 0.2] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: 0.3 }}
              />
              <motion.circle
                cx="114"
                cy="104"
                r="1.8"
                fill="url(#goldGrad)"
                animate={{ y: [0, -10, 0], opacity: [0.2, 0.9, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
              />
            </motion.g>
          )}
        </svg>
      </motion.div>
    </div>
  );
}

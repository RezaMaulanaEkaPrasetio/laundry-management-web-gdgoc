'use client';

import { useEffect, useState, useMemo } from 'react';
import styles from './LaundryCharacter.module.css';

/* ═══════════════════════════════════════════════════
   LaundryKu Interactive Mascot Character
   ═══════════════════════════════════════════════════
   A modern 2D illustration SVG character with
   state-driven facial expressions and arm animation.

   States: idle | welcome | focus | success | error
   Brand palette: #1677FF #22C7D9 #172B4D #FFFFFF
   ═══════════════════════════════════════════════════ */

export type CharacterState = 'idle' | 'welcome' | 'focus' | 'success' | 'error';

interface LaundryCharacterProps {
  state: CharacterState;
  className?: string;
}

// ─── Brand Colors ───
const C = {
  blue:    '#1677FF',
  cyan:    '#22C7D9',
  navy:    '#172B4D',
  white:   '#FFFFFF',
  skin:    '#F5D1B3',
  skinDk:  '#E8B896',
  blush:   '#FF9B9B',
} as const;

export default function LaundryCharacter({ state, className = '' }: LaundryCharacterProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Compute arm animation class
  const armClass = useMemo(() => {
    if (reducedMotion) return styles.rightArm;
    switch (state) {
      case 'welcome': return `${styles.rightArm} ${styles.wave}`;
      case 'success': return `${styles.rightArm} ${styles.successWave}`;
      default:        return styles.rightArm;
    }
  }, [state, reducedMotion]);

  // Compute head animation class
  const headClass = useMemo(() => {
    if (reducedMotion) return styles.headGroup;
    if (state === 'error') return `${styles.headGroup} ${styles.headTilt}`;
    return styles.headGroup;
  }, [state, reducedMotion]);

  // ─── Face Rendering Helpers ───

  const renderEyes = () => {
    // Happy squint for success
    if (state === 'success') {
      return (
        <g>
          <path d="M88 83 Q95 77 102 83" stroke={C.navy} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M118 83 Q125 77 132 83" stroke={C.navy} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
      );
    }

    // Slightly wider eyes for error
    if (state === 'error') {
      return (
        <g>
          <ellipse cx="95" cy="82" rx="4" ry="5" fill={C.navy} />
          <ellipse cx="125" cy="82" rx="4" ry="5" fill={C.navy} />
          <circle cx="96.5" cy="80" r="1.5" fill={C.white} />
          <circle cx="126.5" cy="80" r="1.5" fill={C.white} />
        </g>
      );
    }

    // Focus — pupils shift slightly right (toward form)
    const pupilOffsetX = state === 'focus' ? 2 : 0;

    return (
      <g className={!reducedMotion && state === 'idle' ? styles.blinkEye : undefined}>
        <ellipse cx={95 + pupilOffsetX} cy="83" rx="3.5" ry="4" fill={C.navy} />
        <ellipse cx={125 + pupilOffsetX} cy="83" rx="3.5" ry="4" fill={C.navy} />
        <circle cx={96.5 + pupilOffsetX} cy="81" r="1.5" fill={C.white} />
        <circle cx={126.5 + pupilOffsetX} cy="81" r="1.5" fill={C.white} />
      </g>
    );
  };

  const renderEyebrows = () => {
    // Raised eyebrows for error (concern)
    if (state === 'error') {
      return (
        <g>
          <path d="M86 72 Q95 66 104 71" stroke={C.navy} strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M116 71 Q125 66 134 72" stroke={C.navy} strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      );
    }

    // Normal friendly eyebrows
    return (
      <g>
        <path d="M86 74 Q95 70 104 74" stroke={C.navy} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M116 74 Q125 70 134 74" stroke={C.navy} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </g>
    );
  };

  const renderMouth = () => {
    // Big smile for success
    if (state === 'success') {
      return <path d="M92 98 Q110 115 128 98" stroke={C.navy} strokeWidth="2.5" strokeLinecap="round" fill="none" />;
    }

    // Neutral / slight straight for error
    if (state === 'error') {
      return <path d="M96 102 Q110 105 124 102" stroke={C.navy} strokeWidth="2" strokeLinecap="round" fill="none" />;
    }

    // Default friendly smile
    return <path d="M93 98 Q110 112 127 98" stroke={C.navy} strokeWidth="2.2" strokeLinecap="round" fill="none" />;
  };

  return (
    <div
      className={`${styles.container} ${className}`}
      role="presentation"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 220 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto' }}
      >
        {/* ═══ DECORATIVE BUBBLES (back layer) ═══ */}
        <circle cx="28" cy="155" r="6" fill={C.cyan} opacity="0.12" className={styles.bubble3} />
        <circle cx="18" cy="120" r="3.5" fill={C.blue} opacity="0.10" className={styles.bubble4} />
        <circle cx="192" cy="200" r="5" fill={C.cyan} opacity="0.10" className={styles.bubble2} />

        {/* ═══ GROUND SHADOW ═══ */}
        <ellipse cx="110" cy="333" rx="48" ry="7" fill={C.navy} opacity="0.06" />

        {/* ═══ LEGS ═══ */}
        <rect x="89" y="262" width="15" height="58" rx="7.5" fill={C.navy} />
        <rect x="116" y="262" width="15" height="58" rx="7.5" fill={C.navy} />

        {/* ═══ SHOES ═══ */}
        <ellipse cx="96" cy="320" rx="13" ry="5.5" fill={C.navy} />
        <ellipse cx="124" cy="320" rx="13" ry="5.5" fill={C.navy} />

        {/* ═══ BODY / TORSO ═══ */}
        <path
          d="M72 152 Q72 142 82 142 L138 142 Q148 142 148 152 L146 256 Q146 266 136 266 L84 266 Q74 266 74 256 Z"
          fill={C.blue}
        />

        {/* ═══ LEFT ARM (static, hanging down) ═══ */}
        <g>
          <rect x="52" y="150" width="14" height="52" rx="7" fill={C.blue} transform="rotate(12, 59, 150)" />
          <circle cx="54" cy="206" r="8.5" fill={C.skin} />
        </g>

        {/* ═══ APRON ═══ */}
        <rect x="84" y="188" width="52" height="58" rx="6" fill={C.white} opacity="0.12" />
        <rect x="84" y="183" width="52" height="9" rx="4.5" fill={C.cyan} />
        {/* Apron straps */}
        <line x1="97" y1="183" x2="92" y2="168" stroke={C.cyan} strokeWidth="2.2" strokeLinecap="round" />
        <line x1="123" y1="183" x2="128" y2="168" stroke={C.cyan} strokeWidth="2.2" strokeLinecap="round" />
        {/* Apron pocket */}
        <rect x="98" y="206" width="24" height="16" rx="3" fill={C.white} opacity="0.08" />
        <path d="M102 206 L102 212" stroke={C.white} strokeWidth="1" opacity="0.15" strokeLinecap="round" />

        {/* ═══ COLLAR / NECKLINE ═══ */}
        <path
          d="M92 144 L110 160 L128 144"
          stroke={C.cyan}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* ═══ NECK ═══ */}
        <rect x="100" y="126" width="20" height="20" rx="6" fill={C.skin} />

        {/* ═══ HEAD GROUP (tilts on error) ═══ */}
        <g className={headClass}>
          {/* Hair — back volume */}
          <path
            d="M63 78 Q63 30 110 28 Q157 30 157 78 L157 118 Q157 130 147 130 L73 130 Q63 130 63 118 Z"
            fill={C.navy}
          />

          {/* Face */}
          <circle cx="110" cy="86" r="42" fill={C.skin} />

          {/* Hair — front bangs */}
          <path
            d="M63 73 Q63 36 110 33 Q157 36 157 73 L154 58 Q150 44 110 39 Q70 44 66 58 Z"
            fill={C.navy}
          />

          {/* Hair — side strands */}
          <path d="M63 78 Q58 98 61 116 Q63 122 67 113 L67 86 Z" fill={C.navy} />
          <path d="M157 78 Q162 98 159 116 Q157 122 153 113 L153 86 Z" fill={C.navy} />

          {/* Hair highlight (subtle) */}
          <path
            d="M80 45 Q90 40 100 42"
            stroke={C.white}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.12"
            fill="none"
          />

          {/* ─── Facial Features (state-driven) ─── */}
          {renderEyebrows()}
          {renderEyes()}
          {renderMouth()}

          {/* Blush marks */}
          <ellipse cx="78" cy="95" rx="7" ry="4" fill={C.blush} opacity="0.3" />
          <ellipse cx="142" cy="95" rx="7" ry="4" fill={C.blush} opacity="0.3" />

          {/* Nose (very subtle) */}
          <ellipse cx="110" cy="92" rx="2" ry="1.5" fill={C.skinDk} opacity="0.3" />
        </g>

        {/* ═══ RIGHT ARM GROUP (animated — waving) ═══ */}
        <g className={armClass}>
          <rect x="148" y="146" width="14" height="52" rx="7" fill={C.blue} />
          <circle cx="155" cy="202" r="8.5" fill={C.skin} />
          {/* Sleeve cuff detail */}
          <rect x="148" y="146" width="14" height="6" rx="3" fill={C.cyan} opacity="0.3" />
        </g>

        {/* ═══ DECORATIVE BUBBLES (front layer) ═══ */}
        <circle cx="178" cy="68" r="7" fill={C.cyan} opacity="0.15" className={styles.bubble1} />
        <circle cx="190" cy="95" r="4.5" fill={C.blue} opacity="0.12" className={styles.bubble2} />
        <circle cx="185" cy="50" r="3" fill={C.white} opacity="0.15" className={styles.bubble1} />

        {/* Small sparkle near character */}
        <g opacity="0.2" className={styles.bubble3}>
          <line x1="36" y1="182" x2="36" y2="192" stroke={C.cyan} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="31" y1="187" x2="41" y2="187" stroke={C.cyan} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

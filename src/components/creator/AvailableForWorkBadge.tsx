'use client';

import React from 'react';

interface Props {
  size?: number;
  className?: string;
}

const LIME = '#a3e635';

export default function AvailableForWorkBadge({ size = 96, className }: Props) {
  const r     = size / 2;
  const inner = r * 0.68;
  const stroke = size * 0.065;

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      {/* Neon glow ring via SVG */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <defs>
          <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Bottom arc  ≈ 210° to 330° (the "AVAILABLE FOR WORK" crescent) */}
        <circle
          cx={r}
          cy={r}
          r={r - stroke / 2}
          fill="none"
          stroke={LIME}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(r - stroke / 2) * Math.PI * 1.27} ${(r - stroke / 2) * Math.PI * 2}`}
          strokeDashoffset={`${-(r - stroke / 2) * Math.PI * 0.37}`}
          opacity={0.95}
          filter="url(#neon-glow)"
        />
        {/* Curved text path */}
        <defs>
          <path
            id="arc-text"
            d={`M ${r - inner},${r} A ${inner},${inner} 0 1,1 ${r + inner},${r}`}
          />
        </defs>
        <text
          fill={LIME}
          fontSize={size * 0.098}
          fontWeight="900"
          fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
          letterSpacing="0.06em"
          textAnchor="middle"
        >
          <textPath href="#arc-text" startOffset="50%">
            AVAILABLE FOR WORK
          </textPath>
        </text>
      </svg>
    </div>
  );
}

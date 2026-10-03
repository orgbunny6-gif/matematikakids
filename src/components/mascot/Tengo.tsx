/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TengoMood } from '../../types.ts';

interface TengoProps {
  mood?: TengoMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  accessory?: string;
}

export function Tengo({ mood = 'idle', size = 'md', className = '', accessory }: TengoProps) {
  const sizePixels = {
    sm: 56,
    md: 88,
    lg: 130,
    xl: 180,
  }[size];

  // Antenna wobble & glow
  const antennaColor = mood === 'celebrating' || mood === 'cheering' ? '#F59E0B' : '#6366F1';
  const cheekColor = mood === 'happy' || mood === 'celebrating' ? '#F472B6' : '#FB7185';

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: sizePixels, height: sizePixels }}
      aria-label={`Robot Tengo (${mood})`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md transition-transform duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EEF2FF" />
            <stop offset="1" stopColor="#C7D2FE" />
          </linearGradient>
          <linearGradient id="earGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#818CF8" />
            <stop offset="1" stopColor="#4F46E5" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ears / Side antennas */}
        <rect x="14" y="44" width="8" height="16" rx="4" fill="url(#earGrad)" />
        <rect x="78" y="44" width="8" height="16" rx="4" fill="url(#earGrad)" />

        {/* Head/Body Capsule */}
        <rect
          x="20"
          y="25"
          width="60"
          height="54"
          rx="22"
          fill="url(#bodyGrad)"
          stroke="#818CF8"
          strokeWidth="3.5"
        />

        {/* Top Antenna */}
        <path d="M50 25 V12" stroke="#6366F1" strokeWidth="4" strokeLinecap="round" />
        <circle
          cx="50"
          cy="9"
          r="6"
          fill={antennaColor}
          stroke="#FFFFFF"
          strokeWidth="2"
          filter="url(#softGlow)"
        />

        {/* Face Screen Visor */}
        <rect x="27" y="33" width="46" height="36" rx="14" fill="#0F172A" />

        {/* Eyes according to Mood */}
        {mood === 'sleepy' ? (
          <>
            <path d="M36 50 Q41 55 46 50" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M54 50 Q59 55 64 50" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </>
        ) : mood === 'thinking' ? (
          <>
            <circle cx="41" cy="46" r="4.5" fill="#38BDF8" />
            <circle cx="59" cy="42" r="5.5" fill="#38BDF8" />
            <circle cx="61" cy="40" r="1.8" fill="#FFFFFF" />
          </>
        ) : mood === 'celebrating' || mood === 'cheering' ? (
          <>
            {/* Happy Arch Eyes */}
            <path d="M35 48 Q41 39 47 48" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M53 48 Q59 39 65 48" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            {/* Big friendly round eyes with twinkle */}
            <circle cx="41" cy="47" r="5" fill="#38BDF8" />
            <circle cx="59" cy="47" r="5" fill="#38BDF8" />
            <circle cx="42.5" cy="45.5" r="1.8" fill="#FFFFFF" />
            <circle cx="60.5" cy="45.5" r="1.8" fill="#FFFFFF" />
          </>
        )}

        {/* Cheeks */}
        <circle cx="33" cy="56" r="3" fill={cheekColor} opacity="0.8" />
        <circle cx="67" cy="56" r="3" fill={cheekColor} opacity="0.8" />

        {/* Mouth */}
        {mood === 'celebrating' || mood === 'happy' || mood === 'cheering' ? (
          <path
            d="M43 56 Q50 64 57 56"
            stroke="#F8FAFC"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="#F43F5E"
          />
        ) : mood === 'encouraging' ? (
          <path d="M44 58 Q50 63 56 58" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M45 58 Q50 61 55 58" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}

        {/* Little Math Emblem on forehead */}
        <text
          x="50"
          y="22"
          textAnchor="middle"
          fill="#4F46E5"
          fontWeight="900"
          fontSize="9"
          fontFamily="system-ui, sans-serif"
        >
          x
        </text>

        {/* Optional Accessory Overlay */}
        {accessory === 'acc_cap' && (
          <path d="M30 25 C35 12, 65 12, 70 25 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
        )}
        {accessory === 'acc_crown' && (
          <path d="M32 24 L40 14 L50 20 L60 14 L68 24 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
        )}
        {accessory === 'acc_glasses' && (
          <>
            <circle cx="41" cy="47" r="8" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
            <circle cx="59" cy="47" r="8" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
            <line x1="49" y1="47" x2="51" y2="47" stroke="#F59E0B" strokeWidth="2.5" />
          </>
        )}
      </svg>
    </div>
  );
}

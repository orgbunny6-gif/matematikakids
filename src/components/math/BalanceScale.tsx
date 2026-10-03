/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useT } from '../../i18n/I18nContext.tsx';
import { CheckCircle2 } from 'lucide-react';

interface BalanceScaleProps {
  leftUnknownSymbol?: string;
  leftUnknownValue?: number; // what value is currently inside x
  leftKnownBlocks?: number;  // e.g. 3
  rightBlocks: number;       // e.g. 7
  showRemoveAnimation?: boolean;
  removeCount?: number;
  className?: string;
  interactive?: boolean;
  onUnknownChange?: (val: number) => void;
}

export function BalanceScale({
  leftUnknownSymbol = 'x',
  leftUnknownValue = 0,
  leftKnownBlocks = 0,
  rightBlocks = 0,
  showRemoveAnimation = false,
  removeCount = 0,
  className = '',
  interactive = false,
  onUnknownChange,
}: BalanceScaleProps) {
  const { t } = useT();

  const effectiveLeftKnown = showRemoveAnimation ? Math.max(0, leftKnownBlocks - removeCount) : leftKnownBlocks;
  const effectiveRight = showRemoveAnimation ? Math.max(0, rightBlocks - removeCount) : rightBlocks;

  const totalLeftWeight = leftUnknownValue + effectiveLeftKnown;
  const totalRightWeight = effectiveRight;

  const weightDiff = totalRightWeight - totalLeftWeight;
  // Tilt angle clamped between -14 and +14 degrees
  const tiltAngle = Math.max(-14, Math.min(14, weightDiff * 3));
  const isBalanced = totalLeftWeight === totalRightWeight && (leftUnknownValue > 0 || leftKnownBlocks > 0);

  // Pan heights based on tilt
  const leftPanDelta = (tiltAngle / 14) * -22;
  const rightPanDelta = (tiltAngle / 14) * 22;

  return (
    <div className={`flex flex-col items-center select-none w-full max-w-xl mx-auto ${className}`}>
      {/* Status banner */}
      <div className="flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-colors">
        {isBalanced ? (
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-100/90 dark:bg-emerald-950/60 px-3 py-1 rounded-full animate-bounce-gentle">
            <CheckCircle2 className="w-4 h-4" />
            {t('balance')} — {t('isEqual')}
          </span>
        ) : totalLeftWeight > totalRightWeight ? (
          <span className="text-amber-600 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-950/60 px-3 py-1 rounded-full">
            {t('leftSide')} {t('isNotEqual')} ({t('leftSide')} og‘irroq)
          </span>
        ) : (
          <span className="text-amber-600 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-950/60 px-3 py-1 rounded-full">
            {t('rightSide')} {t('isNotEqual')} ({t('rightSide')} og‘irroq)
          </span>
        )}
      </div>

      {/* SVG Scale visualizer */}
      <div className="relative w-full aspect-[16/9] max-h-72">
        <svg
          viewBox="0 0 400 240"
          className="w-full h-full overflow-visible drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Stand & Fulcrum */}
          <path d="M160 220 L240 220 L220 120 L180 120 Z" fill="#64748B" />
          <path d="M150 220 L250 220 L240 230 L160 230 Z" fill="#334155" />
          <circle cx="200" cy="120" r="10" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />

          {/* Tilting Beam (rotating around pivot x: 200, y: 120) */}
          <g
            style={{
              transform: `rotate(${tiltAngle}deg)`,
              transformOrigin: '200px 120px',
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Beam Bar */}
            <rect x="50" y="116" width="300" height="8" rx="4" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
            <circle cx="200" cy="120" r="4" fill="#FFFFFF" />

            {/* Left Attachment Hook */}
            <circle cx="70" cy="120" r="4" fill="#475569" />
            {/* Right Attachment Hook */}
            <circle cx="330" cy="120" r="4" fill="#475569" />
          </g>

          {/* Left Pan Group */}
          <g
            style={{
              transform: `translate(0px, ${leftPanDelta}px)`,
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Chains */}
            <line x1="70" y1="120" x2="40" y2="180" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 2" />
            <line x1="70" y1="120" x2="100" y2="180" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 2" />
            {/* Pan dish */}
            <path
              d="M30 180 Q70 200 110 180 Z"
              fill={isBalanced ? '#A7F3D0' : '#E2E8F0'}
              stroke={isBalanced ? '#10B981' : '#64748B'}
              strokeWidth="2.5"
            />

            {/* Left Pan Contents */}
            {/* Mystery Box (x) */}
            <g transform="translate(42, 142)">
              <rect
                x="0"
                y="0"
                width="28"
                height="28"
                rx="6"
                fill="#818CF8"
                stroke="#4F46E5"
                strokeWidth="2"
              />
              <text
                x="14"
                y="19"
                textAnchor="middle"
                fill="#FFFFFF"
                fontWeight="900"
                fontSize="14"
                fontFamily="system-ui"
              >
                {leftUnknownSymbol === 'box' ? '📦' : leftUnknownSymbol}
              </text>
            </g>

            {/* Left Known Blocks */}
            {effectiveLeftKnown > 0 && (
              <g transform="translate(74, 148)">
                <rect x="0" y="0" width="22" height="22" rx="4" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
                <text x="11" y="16" textAnchor="middle" fill="#78350F" fontWeight="900" fontSize="12">
                  +{effectiveLeftKnown}
                </text>
              </g>
            )}
          </g>

          {/* Right Pan Group */}
          <g
            style={{
              transform: `translate(0px, ${rightPanDelta}px)`,
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Chains */}
            <line x1="330" y1="120" x2="300" y2="180" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 2" />
            <line x1="330" y1="120" x2="360" y2="180" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 2" />
            {/* Pan dish */}
            <path
              d="M290 180 Q330 200 370 180 Z"
              fill={isBalanced ? '#A7F3D0' : '#E2E8F0'}
              stroke={isBalanced ? '#10B981' : '#64748B'}
              strokeWidth="2.5"
            />

            {/* Right Blocks */}
            <g transform="translate(312, 142)">
              <rect x="0" y="0" width="36" height="28" rx="6" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
              <text x="18" y="19" textAnchor="middle" fill="#FFFFFF" fontWeight="900" fontSize="15">
                {effectiveRight}
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Interactive Controls (if in sandbox or interactive mode) */}
      {interactive && onUnknownChange && (
        <div className="flex items-center gap-3 mt-4 bg-white/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {leftUnknownSymbol} = {leftUnknownValue}
          </span>
          <button
            type="button"
            onClick={() => onUnknownChange(Math.max(0, leftUnknownValue - 1))}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-black text-lg transition-transform active:scale-95"
            aria-label="Kamaytirish"
          >
            -
          </button>
          <input
            type="range"
            min="0"
            max="20"
            value={leftUnknownValue}
            onChange={(e) => onUnknownChange(Number(e.target.value))}
            className="w-32 accent-indigo-600 cursor-pointer"
          />
          <button
            type="button"
            onClick={() => onUnknownChange(Math.min(20, leftUnknownValue + 1))}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-black text-lg transition-transform active:scale-95"
            aria-label="Oshirish"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

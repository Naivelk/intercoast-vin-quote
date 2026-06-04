import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export type EvaMood = 'neutral' | 'thinking' | 'happy' | 'concerned';

export type EvaAvatarProps = {
  size?: number; // px
  isSpeaking?: boolean;
  className?: string;
  mood?: EvaMood;
  reducedMotion?: boolean;
};

/**
 * EvaAvatar: Lightweight animated avatar using SVG + Framer Motion
 * - Idle: subtle breathing and eye blinks
 * - Speaking: animated mouth
 * - Mood: neutral | thinking | happy | concerned
 */
const EvaAvatar: React.FC<EvaAvatarProps> = ({ size = 32, isSpeaking = false, className, mood = 'neutral', reducedMotion }) => {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s / 2;

  const prefersReduced = useMemo(() => {
    try {
      return reducedMotion === true || (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch {
      return !!reducedMotion;
    }
  }, [reducedMotion]);

  // Mouth path by mood (smaller, baby-like)
  const mouthPath = useMemo(() => {
    switch (mood) {
      case 'happy':
        return `M ${s * 0.40} ${s * 0.64} Q ${s * 0.5} ${s * 0.72}, ${s * 0.60} ${s * 0.64}`;
      case 'concerned':
        return `M ${s * 0.40} ${s * 0.66} Q ${s * 0.5} ${s * 0.60}, ${s * 0.60} ${s * 0.66}`;
      case 'thinking':
        return `M ${s * 0.46} ${s * 0.64} Q ${s * 0.5} ${s * 0.64}, ${s * 0.54} ${s * 0.64}`;
      default:
        return `M ${s * 0.42} ${s * 0.64} Q ${s * 0.5} ${s * 0.68}, ${s * 0.58} ${s * 0.64}`;
    }
  }, [mood, s]);

  // Eyebrows offset by mood
  const browTilt = useMemo(() => {
    switch (mood) {
      case 'thinking':
        return { left: -3, right: 3 };
      case 'concerned':
        return { left: 4, right: -4 };
      case 'happy':
        return { left: 0, right: 0 };
      default:
        return { left: 0, right: 0 };
    }
  }, [mood]);

  return (
    <motion.div
      className={className}
      style={{ width: s, height: s }}
      initial={{ scale: 1 }}
      animate={prefersReduced ? { scale: 1 } : { scale: [1, 1.02, 1] }}
      transition={prefersReduced ? undefined : { duration: 3, repeat: Infinity, repeatType: 'reverse' }}
    >
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        {/* Background circle */}
        <defs>
          <linearGradient id="evaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="url(#evaGrad)" />

        {/* Small curl of baby hair */}
        <path
          d={`M ${s * 0.45} ${s * 0.18} q ${s * 0.06} ${-s * 0.10}, ${s * 0.12} ${0} q ${-s * 0.04} ${s * 0.06}, ${-s * 0.12} ${s * 0.06}`}
          fill="none"
          stroke="#ef4444"
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Face (rounder, baby) */}
        <circle cx={cx} cy={cy} r={s * 0.38} fill="#fffaf0" />

        {/* Eyebrows (soft) */}
        <line x1={s * 0.34} y1={s * 0.38 + browTilt.left} x2={s * 0.44} y2={s * 0.38 - browTilt.left} stroke="#1f2937" strokeWidth={1.2} strokeLinecap="round" />
        <line x1={s * 0.56} y1={s * 0.38 - browTilt.right} x2={s * 0.66} y2={s * 0.38 + browTilt.right} stroke="#1f2937" strokeWidth={1.2} strokeLinecap="round" />

        {/* Eyes with round glasses */}
        <g>
          {/* Glasses frames */}
          <circle cx={s * 0.38} cy={s * 0.48} r={s * 0.08} fill="none" stroke="#1f2937" strokeWidth={1.5} />
          <circle cx={s * 0.62} cy={s * 0.48} r={s * 0.08} fill="none" stroke="#1f2937" strokeWidth={1.5} />
          <line x1={s * 0.46} y1={s * 0.48} x2={s * 0.54} y2={s * 0.48} stroke="#1f2937" strokeWidth={1.2} />
          {/* Pupils */}
          <motion.circle cx={s * 0.38} cy={s * 0.48} r={s * 0.02} fill="#1f2937"
            animate={prefersReduced ? undefined : { cy: [s * 0.48, s * 0.475, s * 0.48] }}
            transition={prefersReduced ? undefined : { duration: 4, repeat: Infinity }} />
          <motion.circle cx={s * 0.62} cy={s * 0.48} r={s * 0.02} fill="#1f2937"
            animate={prefersReduced ? undefined : { cy: [s * 0.48, s * 0.475, s * 0.48] }}
            transition={prefersReduced ? undefined : { duration: 4.2, repeat: Infinity }} />
        </g>

        {/* Smile / Mouth */}
        <motion.path
          d={mouthPath}
          stroke="#ef4444"
          strokeWidth={2}
          fill="transparent"
          animate={isSpeaking && !prefersReduced ? { scaleY: [1, 0.7, 1] } : { scaleY: 1 }}
          transition={isSpeaking && !prefersReduced ? { duration: 0.6, repeat: Infinity } : undefined}
          style={{ originY: s * 0.62, originX: s * 0.5 }}
        />

        {/* Two front teeth */}
        <rect x={s * 0.485} y={s * 0.64} width={s * 0.012} height={s * 0.018} fill="#fff" rx={1} />
        <rect x={s * 0.503} y={s * 0.64} width={s * 0.012} height={s * 0.018} fill="#fff" rx={1} />

        {/* Cheek blush */}
        <circle cx={s * 0.30} cy={s * 0.58} r={s * 0.04} fill="#fca5a5" opacity={mood === 'concerned' ? 0.3 : 0.6} />
        <circle cx={s * 0.70} cy={s * 0.58} r={s * 0.04} fill="#fca5a5" opacity={mood === 'concerned' ? 0.3 : 0.6} />
      </svg>
    </motion.div>
  );
};

export default EvaAvatar;

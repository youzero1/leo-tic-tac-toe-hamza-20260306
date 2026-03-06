'use client';

import { SquareValue } from '@/types';

interface SquareProps {
  value: SquareValue;
  onClick: () => void;
  isWinning: boolean;
  disabled: boolean;
  small?: boolean;
}

export default function Square({
  value,
  onClick,
  isWinning,
  disabled,
  small,
}: SquareProps) {
  const size = small ? '72px' : 'clamp(80px, 22vw, 120px)';
  const fontSize = small ? '1.8rem' : 'clamp(2rem, 8vw, 3rem)';

  return (
    <button
      onClick={onClick}
      disabled={disabled || !!value}
      style={{
        width: size,
        height: size,
        background: isWinning
          ? 'linear-gradient(135deg, rgba(108,99,255,0.3), rgba(108,99,255,0.1))'
          : 'var(--bg-card2)',
        border: isWinning
          ? '2px solid var(--primary)'
          : '2px solid var(--border)',
        borderRadius: '16px',
        fontSize,
        fontWeight: 800,
        color:
          value === 'X'
            ? 'var(--x-color)'
            : value === 'O'
              ? 'var(--o-color)'
              : 'transparent',
        cursor: disabled || !!value ? 'default' : 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: value ? 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
        boxShadow: isWinning ? '0 0 20px rgba(108,99,255,0.4), inset 0 0 20px rgba(108,99,255,0.1)' : 'none',
        transform: isWinning ? 'scale(1.05)' : 'scale(1)',
      }}
      onMouseEnter={(e) => {
        if (!disabled && !value) {
          (e.currentTarget as HTMLButtonElement).style.background =
            'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(108,99,255,0.05))';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--primary)';
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !value && !isWinning) {
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-card2)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
        }
      }}
    >
      {value}
    </button>
  );
}

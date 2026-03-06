'use client';

import { BoardState } from '@/types';
import Square from './Square';

interface BoardProps {
  board: BoardState;
  winLine: number[] | null;
  onSquareClick: (index: number) => void;
  disabled: boolean;
  small?: boolean;
}

export default function Board({
  board,
  winLine,
  onSquareClick,
  disabled,
  small,
}: BoardProps) {
  const gap = small ? '8px' : '12px';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, auto)',
        gap,
        padding: small ? '1rem' : '1.5rem',
        background: 'var(--bg-card)',
        borderRadius: '20px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      {board.map((value, index) => (
        <Square
          key={index}
          value={value}
          onClick={() => onSquareClick(index)}
          isWinning={winLine?.includes(index) ?? false}
          disabled={disabled}
          small={small}
        />
      ))}
    </div>
  );
}

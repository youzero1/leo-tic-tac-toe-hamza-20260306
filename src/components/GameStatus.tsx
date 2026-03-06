'use client';

import { PlayerType, WinInfo } from '@/types';

interface GameStatusProps {
  playerX: PlayerType;
  playerO: PlayerType;
  currentPlayer: string;
  winInfo: WinInfo | null;
  isDraw: boolean;
  winner: PlayerType | null;
}

export default function GameStatus({
  playerX,
  playerO,
  currentPlayer,
  winInfo,
  isDraw,
  winner,
}: GameStatusProps) {
  return (
    <div
      className="card"
      style={{
        width: '100%',
        animation: 'fadeIn 0.4s ease',
      }}
    >
      {/* Players Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '0.75rem',
            borderRadius: '12px',
            background:
              currentPlayer === 'X' && !winInfo && !isDraw
                ? 'rgba(255,101,132,0.1)'
                : 'transparent',
            border:
              currentPlayer === 'X' && !winInfo && !isDraw
                ? '1px solid rgba(255,101,132,0.3)'
                : '1px solid transparent',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: '1.5rem', color: 'var(--x-color)', fontWeight: 800 }}>X</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>
            {playerX.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            W:{playerX.wins} L:{playerX.losses} D:{playerX.draws}
          </div>
        </div>

        <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 700 }}>VS</div>

        <div
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '0.75rem',
            borderRadius: '12px',
            background:
              currentPlayer === 'O' && !winInfo && !isDraw
                ? 'rgba(67,233,123,0.1)'
                : 'transparent',
            border:
              currentPlayer === 'O' && !winInfo && !isDraw
                ? '1px solid rgba(67,233,123,0.3)'
                : '1px solid transparent',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: '1.5rem', color: 'var(--o-color)', fontWeight: 800 }}>O</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>
            {playerO.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            W:{playerO.wins} L:{playerO.losses} D:{playerO.draws}
          </div>
        </div>
      </div>

      {/* Status Text */}
      <div
        style={{
          textAlign: 'center',
          padding: '0.75rem',
          borderRadius: '10px',
          background: 'var(--bg-card2)',
          fontSize: '0.95rem',
          fontWeight: 600,
          color: winInfo
            ? winner?.name === playerX.name
              ? 'var(--x-color)'
              : 'var(--o-color)'
            : isDraw
              ? 'var(--text-muted)'
              : currentPlayer === 'X'
                ? 'var(--x-color)'
                : 'var(--o-color)',
          animation: (winInfo || isDraw) ? 'pulse 1s ease infinite' : 'none',
        }}
      >
        {winInfo
          ? `🎉 ${winner?.name} wins!`
          : isDraw
            ? "🤝 It's a draw!"
            : `${currentPlayer === 'X' ? playerX.name : playerO.name}'s turn (${currentPlayer})`}
      </div>
    </div>
  );
}

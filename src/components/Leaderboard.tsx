'use client';

import { PlayerType, GameType } from '@/types';

interface LeaderboardProps {
  players: PlayerType[];
  recentGames: GameType[];
}

export default function Leaderboard({ players, recentGames }: LeaderboardProps) {
  const medals = ['🥇', '🥈', '🥉'];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.4s ease' }}>
      {/* Leaderboard */}
      <div className="card">
        <h2
          style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          🏆 Leaderboard
        </h2>

        {players.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
            No players yet. Start your first game!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {players.map((player, index) => {
              const total = player.wins + player.losses + player.draws;
              const winRate = total > 0 ? Math.round((player.wins / total) * 100) : 0;

              return (
                <div
                  key={player.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background:
                      index === 0
                        ? 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,215,0,0.03))'
                        : 'var(--bg-card2)',
                    borderRadius: '12px',
                    border:
                      index === 0
                        ? '1px solid rgba(255,215,0,0.3)'
                        : '1px solid var(--border)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: '1.5rem', minWidth: '2rem', textAlign: 'center' }}>
                    {medals[index] ?? `#${index + 1}`}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
                      {player.name}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--o-color)' }}>W: {player.wins}</span>
                      <span style={{ color: 'var(--x-color)' }}>L: {player.losses}</span>
                      <span style={{ color: 'var(--text-muted)' }}>D: {player.draws}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        color:
                          winRate >= 60
                            ? 'var(--o-color)'
                            : winRate >= 40
                              ? 'var(--text)'
                              : 'var(--text-muted)',
                      }}
                    >
                      {winRate}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>win rate</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Games */}
      <div className="card">
        <h2
          style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          📜 Recent Games
        </h2>

        {recentGames.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
            No games played yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentGames.map((game) => (
              <div
                key={game.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  background: 'var(--bg-card2)',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  className={`badge ${game.isDraw ? 'badge-draw' : 'badge-x'}`}
                  style={{ flexShrink: 0 }}
                >
                  {game.isDraw ? 'DRAW' : 'WIN'}
                </div>
                <div style={{ flex: 1, fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--x-color)', fontWeight: 600 }}>
                    {game.playerX?.name}
                  </span>
                  <span style={{ color: 'var(--text-muted)', margin: '0 0.4rem' }}>vs</span>
                  <span style={{ color: 'var(--o-color)', fontWeight: 600 }}>
                    {game.playerO?.name}
                  </span>
                  {!game.isDraw && game.winner && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '0.4rem' }}>
                      → {game.winner.name} won
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                  {formatDate(game.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

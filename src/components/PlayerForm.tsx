'use client';

import { useState } from 'react';
import { PlayerType } from '@/types';

interface PlayerFormProps {
  onPlayersReady: (playerX: PlayerType, playerO: PlayerType) => void;
}

export default function PlayerForm({ onPlayersReady }: PlayerFormProps) {
  const [nameX, setNameX] = useState('');
  const [nameO, setNameO] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getOrCreatePlayer = async (name: string): Promise<PlayerType> => {
    const trimmed = name.trim();

    // Try to get existing players
    const res = await fetch('/api/players');
    const players: PlayerType[] = await res.json();
    const existing = players.find(
      (p) => p.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) return existing;

    // Create new player
    const createRes = await fetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmed }),
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      throw new Error(err.error || 'Failed to create player');
    }

    return createRes.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimX = nameX.trim();
    const trimO = nameO.trim();

    if (!trimX || !trimO) {
      setError('Both player names are required.');
      return;
    }

    if (trimX.toLowerCase() === trimO.toLowerCase()) {
      setError('Players must have different names.');
      return;
    }

    setLoading(true);
    try {
      const [px, po] = await Promise.all([
        getOrCreatePlayer(trimX),
        getOrCreatePlayer(trimO),
      ]);
      onPlayersReady(px, po);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎮</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Start a New Game
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Enter player names to begin. Returning players keep their stats!
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: 'var(--x-color)',
            }}
          >
            <span
              style={{
                width: '28px',
                height: '28px',
                background: 'rgba(255,101,132,0.15)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              X
            </span>
            Player X
          </label>
          <input
            type="text"
            value={nameX}
            onChange={(e) => setNameX(e.target.value)}
            placeholder="Enter name for X..."
            maxLength={30}
            disabled={loading}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem' }}>VS</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: 'var(--o-color)',
            }}
          >
            <span
              style={{
                width: '28px',
                height: '28px',
                background: 'rgba(67,233,123,0.15)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              O
            </span>
            Player O
          </label>
          <input
            type="text"
            value={nameO}
            onChange={(e) => setNameO(e.target.value)}
            placeholder="Enter name for O..."
            maxLength={30}
            disabled={loading}
          />
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(255,101,132,0.1)',
              border: '1px solid rgba(255,101,132,0.3)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              color: 'var(--x-color)',
              fontSize: '0.9rem',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ width: '100%', fontSize: '1.05rem', padding: '1rem' }}
        >
          {loading ? '⏳ Setting up...' : '🚀 Start Game'}
        </button>
      </form>
    </div>
  );
}

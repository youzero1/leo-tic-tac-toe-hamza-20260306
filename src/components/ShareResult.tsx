'use client';

import { useState } from 'react';
import { PlayerType } from '@/types';

interface ShareResultProps {
  playerX: PlayerType;
  playerO: PlayerType;
  winner: PlayerType | null;
  isDraw: boolean;
}

export default function ShareResult({
  playerX,
  playerO,
  winner,
  isDraw,
}: ShareResultProps) {
  const [copied, setCopied] = useState(false);

  const generateShareText = () => {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Leo Tic Tac Toe';
    if (isDraw) {
      return `🤝 ${playerX.name} and ${playerO.name} drew in ${appName}! Can you do better? 🎮`;
    }
    return `🏆 ${winner?.name} beat ${winner?.name === playerX.name ? playerO.name : playerX.name} in ${appName}! Who's next? 🎮`;
  };

  const handleCopy = async () => {
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    const text = generateShareText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: process.env.NEXT_PUBLIC_APP_NAME || 'Leo Tic Tac Toe',
          text,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const shareText = generateShareText();

  return (
    <div
      className="card"
      style={{
        width: '100%',
        animation: 'fadeIn 0.5s ease',
      }}
    >
      <h3
        style={{
          fontSize: '1rem',
          fontWeight: 700,
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--text-muted)',
        }}
      >
        📣 Share this result
      </h3>
      <div
        style={{
          background: 'var(--bg-card2)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '1rem',
          fontSize: '0.95rem',
          color: 'var(--text)',
          marginBottom: '1rem',
          lineHeight: 1.5,
          fontStyle: 'italic',
        }}
      >
        "{shareText}"
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          className="btn btn-accent"
          onClick={handleShare}
          style={{ flex: 1, minWidth: '120px' }}
        >
          {copied ? '✅ Copied!' : '📤 Share'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleCopy}
          style={{ flex: 1, minWidth: '120px' }}
        >
          {copied ? '✅ Copied!' : '📋 Copy Text'}
        </button>
      </div>
    </div>
  );
}

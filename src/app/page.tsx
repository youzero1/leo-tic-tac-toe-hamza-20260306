'use client';

import { useState, useEffect, useCallback } from 'react';
import Board from '@/components/Board';
import PlayerForm from '@/components/PlayerForm';
import GameStatus from '@/components/GameStatus';
import Leaderboard from '@/components/Leaderboard';
import ShareResult from '@/components/ShareResult';
import { PlayerType, BoardState, WinInfo } from '@/types';
import {
  calculateWinner,
  isDraw,
  makeMove,
  createEmptyBoard,
} from '@/lib/gameLogic';

type AppView = 'setup' | 'game' | 'result';

export default function Home() {
  const [view, setView] = useState<AppView>('setup');
  const [playerX, setPlayerX] = useState<PlayerType | null>(null);
  const [playerO, setPlayerO] = useState<PlayerType | null>(null);
  const [board, setBoard] = useState<BoardState>(createEmptyBoard());
  const [winInfo, setWinInfo] = useState<WinInfo | null>(null);
  const [gameIsDraw, setGameIsDraw] = useState(false);
  const [winner, setWinner] = useState<PlayerType | null>(null);
  const [leaderboard, setLeaderboard] = useState<PlayerType[]>([]);
  const [recentGames, setRecentGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'game' | 'leaderboard'>('game');

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchRecentGames = useCallback(async () => {
    try {
      const res = await fetch('/api/games');
      if (res.ok) {
        const data = await res.json();
        setRecentGames(data);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    fetchRecentGames();
  }, [fetchLeaderboard, fetchRecentGames]);

  const handlePlayersReady = (px: PlayerType, po: PlayerType) => {
    setPlayerX(px);
    setPlayerO(po);
    setBoard(createEmptyBoard());
    setWinInfo(null);
    setGameIsDraw(false);
    setWinner(null);
    setView('game');
  };

  const handleSquareClick = async (index: number) => {
    if (winInfo || gameIsDraw) return;
    const newBoard = makeMove(board, index);
    if (!newBoard) return;

    setBoard(newBoard);
    const win = calculateWinner(newBoard);
    const draw = isDraw(newBoard);

    if (win || draw) {
      setWinInfo(win);
      setGameIsDraw(draw);

      let winnerPlayer: PlayerType | null = null;
      if (win) {
        winnerPlayer = win.winner === 'X' ? playerX : playerO;
        setWinner(winnerPlayer);
      }

      await saveGame(newBoard, win ? winnerPlayer : null, draw);
      await fetchLeaderboard();
      await fetchRecentGames();

      setTimeout(() => setView('result'), 800);
    }
  };

  const saveGame = async (
    finalBoard: BoardState,
    winnerPlayer: PlayerType | null,
    isDrawResult: boolean
  ) => {
    if (!playerX || !playerO) return;
    setLoading(true);
    try {
      await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerXId: playerX.id,
          playerOId: playerO.id,
          winnerId: winnerPlayer?.id ?? null,
          boardState: JSON.stringify(finalBoard),
          isDraw: isDrawResult,
        }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAgain = () => {
    setBoard(createEmptyBoard());
    setWinInfo(null);
    setGameIsDraw(false);
    setWinner(null);
    setView('game');
  };

  const handleNewPlayers = () => {
    setPlayerX(null);
    setPlayerO(null);
    setBoard(createEmptyBoard());
    setWinInfo(null);
    setGameIsDraw(false);
    setWinner(null);
    setView('setup');
  };

  const currentPlayer =
    board.filter((s) => s !== null).length % 2 === 0 ? 'X' : 'O';

  return (
    <div style={{ minHeight: '100vh', padding: '1rem 0 3rem' }}>
      {/* Header */}
      <header
        style={{
          textAlign: 'center',
          padding: '2rem 1rem 1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.5rem',
          }}
        >
          <span style={{ fontSize: '2.5rem' }}>🎮</span>
          <h1
            style={{
              fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6c63ff, #ff6584, #43e97b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Leo Tic Tac Toe
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Play · Track · Share
        </p>
      </header>

      <div className="container">
        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '2rem',
          }}
        >
          <button
            className={`btn ${activeTab === 'game' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('game')}
            style={{ minWidth: '120px' }}
          >
            🎯 Game
          </button>
          <button
            className={`btn ${activeTab === 'leaderboard' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('leaderboard')}
            style={{ minWidth: '120px' }}
          >
            🏆 Board
          </button>
        </div>

        {activeTab === 'game' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: view === 'setup' ? '1fr' : 'minmax(0,1fr)',
              gap: '2rem',
              justifyItems: 'center',
            }}
          >
            {view === 'setup' && (
              <div style={{ width: '100%', maxWidth: '520px' }}>
                <PlayerForm onPlayersReady={handlePlayersReady} />
              </div>
            )}

            {view === 'game' && playerX && playerO && (
              <div
                style={{
                  width: '100%',
                  maxWidth: '560px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  alignItems: 'center',
                }}
              >
                <GameStatus
                  playerX={playerX}
                  playerO={playerO}
                  currentPlayer={currentPlayer}
                  winInfo={winInfo}
                  isDraw={gameIsDraw}
                  winner={winner}
                />
                <Board
                  board={board}
                  winLine={winInfo?.line ?? null}
                  onSquareClick={handleSquareClick}
                  disabled={!!winInfo || gameIsDraw}
                />
                <button
                  className="btn btn-secondary"
                  onClick={handleNewPlayers}
                  style={{ marginTop: '0.5rem' }}
                >
                  ↩ Change Players
                </button>
              </div>
            )}

            {view === 'result' && playerX && playerO && (
              <div
                style={{
                  width: '100%',
                  maxWidth: '560px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  alignItems: 'center',
                }}
              >
                <div
                  className="card"
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    animation: 'fadeIn 0.4s ease',
                  }}
                >
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                    {gameIsDraw ? '🤝' : '🏆'}
                  </div>
                  <h2
                    style={{
                      fontSize: '1.8rem',
                      fontWeight: 800,
                      marginBottom: '0.5rem',
                      color: gameIsDraw
                        ? 'var(--text-muted)'
                        : winner?.name === playerX.name
                          ? 'var(--x-color)'
                          : 'var(--o-color)',
                    }}
                  >
                    {gameIsDraw
                      ? "It's a Draw!"
                      : `${winner?.name} Wins!`}
                  </h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    {playerX.name} (X) vs {playerO.name} (O)
                  </p>
                  <Board
                    board={board}
                    winLine={winInfo?.line ?? null}
                    onSquareClick={() => {}}
                    disabled={true}
                    small
                  />
                </div>

                <ShareResult
                  playerX={playerX}
                  playerO={playerO}
                  winner={winner}
                  isDraw={gameIsDraw}
                />

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button className="btn btn-primary" onClick={handlePlayAgain}>
                    🔄 Play Again
                  </button>
                  <button className="btn btn-secondary" onClick={handleNewPlayers}>
                    👥 New Players
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
            }}
          >
            <Leaderboard players={leaderboard} recentGames={recentGames} />
          </div>
        )}
      </div>

      {loading && (
        <div
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '0.75rem 1.25rem',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            animation: 'pulse 1s infinite',
          }}
        >
          Saving game...
        </div>
      )}
    </div>
  );
}

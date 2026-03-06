export type SquareValue = 'X' | 'O' | null;

export type BoardState = SquareValue[];

export interface PlayerType {
  id: number;
  name: string;
  wins: number;
  losses: number;
  draws: number;
  createdAt: string;
}

export interface GameType {
  id: number;
  playerX: PlayerType;
  playerO: PlayerType;
  winner: PlayerType | null;
  boardState: string;
  isDraw: boolean;
  createdAt: string;
}

export interface GameResult {
  playerXId: number;
  playerOId: number;
  winnerId: number | null;
  boardState: string;
  isDraw: boolean;
}

export interface WinInfo {
  winner: SquareValue;
  line: number[];
}

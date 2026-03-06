import { BoardState, WinInfo, SquareValue } from '../types';

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function calculateWinner(board: BoardState): WinInfo | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as SquareValue, line: [a, b, c] };
    }
  }
  return null;
}

export function isBoardFull(board: BoardState): boolean {
  return board.every((square) => square !== null);
}

export function isDraw(board: BoardState): boolean {
  return isBoardFull(board) && !calculateWinner(board);
}

export function getNextPlayer(board: BoardState): SquareValue {
  const xCount = board.filter((s) => s === 'X').length;
  const oCount = board.filter((s) => s === 'O').length;
  return xCount <= oCount ? 'X' : 'O';
}

export function makeMove(board: BoardState, index: number): BoardState | null {
  if (board[index] !== null || calculateWinner(board)) {
    return null;
  }
  const newBoard = [...board] as BoardState;
  newBoard[index] = getNextPlayer(board);
  return newBoard;
}

export function createEmptyBoard(): BoardState {
  return Array(9).fill(null) as BoardState;
}

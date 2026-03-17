import { type Board, type Player, getValidMoves } from './core';

export function getBestMove(board: Board, player: Player): {row: number, col: number} | null {
  const moves = getValidMoves(board, player);
  if (moves.length === 0) return null;

  // Prioritize corners
  const corners = moves.filter(m => 
    (m.row === 0 || m.row === 7) && (m.col === 0 || m.col === 7)
  );
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  // Otherwise pick random
  return moves[Math.floor(Math.random() * moves.length)];
}

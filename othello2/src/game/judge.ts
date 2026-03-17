import { type Board, type Player, BOARD_SIZE, getValidMoves } from './core';

export function calculateScore(board: Board): {black: number, white: number} {
  let black = 0;
  let white = 0;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === 'black') black++;
      if (board[r][c] === 'white') white++;
    }
  }
  return {black, white};
}

export function isGameOver(board: Board, currentPlayer: Player): boolean {
    const currentMoves = getValidMoves(board, currentPlayer);
    const nextPlayer = currentPlayer === 'black' ? 'white' : 'black';
    const nextMoves = getValidMoves(board, nextPlayer);
    return currentMoves.length === 0 && nextMoves.length === 0;
}

export function getWinner(board: Board): Player | 'draw' | null {
    const score = calculateScore(board);
    if (score.black > score.white) return 'black';
    if (score.white > score.black) return 'white';
    return 'draw';
}

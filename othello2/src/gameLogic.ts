export type Player = 'black' | 'white' | null;
export type Board = Player[][];

export const BOARD_SIZE = 8;

export function initBoard(): Board {
  const board: Board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  board[3][3] = 'white';
  board[3][4] = 'black';
  board[4][3] = 'black';
  board[4][4] = 'white';
  return board;
}

export function isValidMove(board: Board, row: number, col: number, player: Player): boolean {
  if (board[row][col] !== null || !player) return false;

  const opponent = player === 'black' ? 'white' : 'black';
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    let flipped = false;

    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === opponent) {
      r += dr;
      c += dc;
      flipped = true;
    }

    if (flipped && r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
      return true;
    }
  }

  return false;
}

export function makeMove(board: Board, row: number, col: number, player: Player): Board {
  if (!isValidMove(board, row, col, player) || !player) return board;

  const newBoard = board.map(row => [...row]);
  newBoard[row][col] = player;

  const opponent = player === 'black' ? 'white' : 'black';
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    let flippedPos: {r: number, c: number}[] = [];

    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && newBoard[r][c] === opponent) {
      flippedPos.push({r, c});
      r += dr;
      c += dc;
    }

    if (flippedPos.length > 0 && r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && newBoard[r][c] === player) {
      for (const pos of flippedPos) {
        newBoard[pos.r][pos.c] = player;
      }
    }
  }

  return newBoard;
}

export function getValidMoves(board: Board, player: Player): {row: number, col: number}[] {
  const moves: {row: number, col: number}[] = [];
  if (!player) return moves;

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (isValidMove(board, r, c, player)) {
        moves.push({row: r, col: c});
      }
    }
  }
  return moves;
}

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
    // Note: This logic assumes game is over. In a real game, you check isGameOver first.
    const score = calculateScore(board);
    if (score.black > score.white) return 'black';
    if (score.white > score.black) return 'white';
    return 'draw';
}

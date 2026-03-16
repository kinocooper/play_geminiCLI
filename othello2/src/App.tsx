import { useState, useEffect } from 'react';
import './App.css';
import Board from './components/Board';
import { 
  type Board as BoardType, 
  type Player, 
  initBoard, 
  getValidMoves, 
  makeMove, 
  calculateScore,
  getWinner
} from './gameLogic';

function App() {
  const [board, setBoard] = useState<BoardType>(initBoard());
  const [turn, setTurn] = useState<Player>('black');
  const [validMoves, setValidMoves] = useState<{row: number, col: number}[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);

  useEffect(() => {
    if (gameOver) return;

    const moves = getValidMoves(board, turn);
    setValidMoves(moves);
    
    if (moves.length === 0) {
       const nextTurn = turn === 'black' ? 'white' : 'black';
       const nextMoves = getValidMoves(board, nextTurn);
       
       if (nextMoves.length === 0) {
         setGameOver(true);
         setWinner(getWinner(board));
       } else {
         // Pass logic
         // Use setTimeout to allow render cycle to complete before alert/state change
         setTimeout(() => {
            alert(`${turn === 'black' ? 'Black' : 'White'} cannot move. Pass.`);
            setTurn(nextTurn);
         }, 100);
       }
    }
  }, [board, turn, gameOver]);

  const handleCellClick = (row: number, col: number) => {
    if (gameOver) return;
    
    const isValid = validMoves.some(m => m.row === row && m.col === col);
    if (!isValid) return;

    const newBoard = makeMove(board, row, col, turn);
    setBoard(newBoard);
    setTurn(turn === 'black' ? 'white' : 'black');
  };
  
  const resetGame = () => {
    setBoard(initBoard());
    setTurn('black');
    setGameOver(false);
    setWinner(null);
  };

  const scores = calculateScore(board);

  return (
    <div className="App">
      <h1>Othello</h1>
      <div className="game-info">
        <div className={`score ${turn === 'black' ? 'active' : ''}`}>Black: {scores.black}</div>
        <div className={`score ${turn === 'white' ? 'active' : ''}`}>White: {scores.white}</div>
      </div>
        {gameOver && (
          <div className="game-over">
            <h2>Game Over!</h2>
            <p>Winner: {winner === 'draw' ? 'Draw' : winner === 'black' ? 'Black' : 'White'}</p>
          </div>
        )}
      <Board board={board} validMoves={validMoves} onCellClick={handleCellClick} />
      <button className="reset-btn" onClick={resetGame}>Reset Game</button>
    </div>
  );
}

export default App;

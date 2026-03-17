import { useState, useEffect } from 'react';
import Board from './components/Board';
import { 
  type Board as BoardType, 
  type Player, 
  initBoard, 
  getValidMoves, 
  makeMove
} from './game/core';
import { calculateScore, isGameOver, getWinner } from './game/judge';
import { getBestMove } from './game/ai';

function App() {
  const [board, setBoard] = useState<BoardType>(initBoard());
  const [turn, setTurn] = useState<Player>('black');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [isCpuMode, setIsCpuMode] = useState(true);

  const validMoves = getValidMoves(board, turn);

  useEffect(() => {
    if (gameOver) return;
    
    if (validMoves.length === 0) {
       const nextTurn = turn === 'black' ? 'white' : 'black';
       if (isGameOver(board, turn)) {
         setGameOver(true);
         setWinner(getWinner(board));
       } else {
         const timer = setTimeout(() => {
            setTurn(nextTurn);
         }, 1000);
         return () => clearTimeout(timer);
       }
    }
  }, [board, turn, gameOver, validMoves.length]);

  const handleMove = (row: number, col: number) => {
    const newBoard = makeMove(board, row, col, turn);
    setBoard(newBoard);
    setTurn(turn === 'black' ? 'white' : 'black');
  };

  useEffect(() => {
    if (!isCpuMode || gameOver || turn !== 'white') return;

    const timer = setTimeout(() => {
      const bestMove = getBestMove(board, 'white');
      if (bestMove) {
        handleMove(bestMove.row, bestMove.col);
      }
    }, 800);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, isCpuMode, gameOver, board]);

  const handleCellClick = (row: number, col: number) => {
    if (gameOver) return;
    if (isCpuMode && turn === 'white') return; 
    
    const isValid = validMoves.some(m => m.row === row && m.col === col);
    if (!isValid) return;

    handleMove(row, col);
  };
  
  const resetGame = () => {
    setBoard(initBoard());
    setTurn('black');
    setGameOver(false);
    setWinner(null);
  };

  const scores = calculateScore(board);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans p-4">
      <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
        Othello
      </h1>
      
      <div className="flex gap-12 mb-8 w-full max-w-md justify-center">
        <div className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 w-32 ${turn === 'black' ? 'bg-gray-800 border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-gray-800/50 opacity-60'}`}>
          <div className="w-8 h-8 rounded-full bg-black border-2 border-gray-600 mb-2 shadow-lg"></div>
          <span className="font-bold text-gray-300">Black</span>
          <span className="text-3xl font-mono font-bold text-green-400">{scores.black * 100}</span>
        </div>

        <div className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 w-32 ${turn === 'white' ? 'bg-gray-100/10 border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-gray-800/50 opacity-60'}`}>
          <div className="w-8 h-8 rounded-full bg-white mb-2 shadow-lg"></div>
          <span className="font-bold text-gray-300">White</span>
          <span className="text-3xl font-mono font-bold text-white">{scores.white * 100}</span>
        </div>
      </div>

      <div className="relative">
        <Board board={board} validMoves={validMoves} onCellClick={handleCellClick} />
        
        {gameOver && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-50 animate-in fade-in duration-300">
            <h2 className="text-4xl font-bold mb-2 text-white drop-shadow-lg">Game Over!</h2>
            <p className="text-2xl mb-6 font-semibold text-green-400">
              {winner === 'draw' ? 'Draw' : winner === 'black' ? 'Black Wins!' : 'White Wins!'}
            </p>
            <button 
              className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full shadow-lg hover:shadow-green-500/50 transition-all transform hover:scale-105 active:scale-95"
              onClick={resetGame}
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <button 
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-semibold text-gray-200 border border-gray-600" 
          onClick={resetGame}
        >
          Reset Game
        </button>
        <button 
          className={`px-6 py-2 rounded-lg transition-all font-semibold border ${isCpuMode ? 'bg-green-900/50 border-green-500 text-green-300' : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'}`}
          onClick={() => {
            setIsCpuMode(!isCpuMode);
            resetGame();
          }}
        >
          {isCpuMode ? 'CPU Mode: ON' : 'CPU Mode: OFF'}
        </button>
      </div>
      
      <div className="h-8 mt-4 flex items-center justify-center">
         {isCpuMode && turn === 'white' && !gameOver && (
            <span className="text-green-400 animate-pulse font-mono">Thinking...</span>
         )}
      </div>
    </div>
  );
}

export default App;

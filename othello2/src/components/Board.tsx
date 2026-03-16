import type { FC } from 'react';
import Cell from './Cell';
import type { Board as BoardType } from '../gameLogic';

interface BoardProps {
  board: BoardType;
  validMoves: {row: number, col: number}[];
  onCellClick: (row: number, col: number) => void;
}

const Board: FC<BoardProps> = ({ board, validMoves, onCellClick }) => {
  const isMoveValid = (r: number, c: number) => {
    return validMoves.some(move => move.row === r && move.col === c);
  };

  return (
    <div className="board">
      {board.map((row, r) => (
        <div key={r} className="row">
          {row.map((cell, c) => (
            <Cell 
              key={`${r}-${c}`} 
              value={cell} 
              isValid={isMoveValid(r, c)} 
              onClick={() => onCellClick(r, c)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;

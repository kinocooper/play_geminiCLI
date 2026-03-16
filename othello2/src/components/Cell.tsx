import type { FC } from 'react';
import type { Player } from '../gameLogic';

interface CellProps {
  value: Player;
  isValid: boolean;
  onClick: () => void;
}

const Cell: FC<CellProps> = ({ value, isValid, onClick }) => {
  return (
    <div 
      className={`cell ${isValid ? 'valid' : ''}`} 
      onClick={onClick}
    >
      {value && <div className={`piece ${value}`} />}
      {isValid && !value && <div className="valid-marker" />}
    </div>
  );
};

export default Cell;

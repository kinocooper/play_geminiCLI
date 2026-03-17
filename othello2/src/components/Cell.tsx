import type { FC } from 'react';
import type { Player } from '../game/core';

interface CellProps {
  value: Player;
  isValid: boolean;
  onClick: () => void;
}

const Cell: FC<CellProps> = ({ value, isValid, onClick }) => {
  return (
    <div 
      className={`
        w-10 h-10 sm:w-12 sm:h-12 border border-green-700 bg-green-600 
        flex items-center justify-center cursor-pointer
        hover:bg-green-500 transition-colors duration-200 relative
      `}
      onClick={onClick}
    >
      {value && (
        <div 
          className={`
            w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg transform transition-transform duration-300
            ${value === 'black' ? 'bg-gray-900' : 'bg-white'}
          `} 
        />
      )}
      {!value && isValid && (
        <div className="w-3 h-3 bg-black opacity-20 rounded-full" />
      )}
    </div>
  );
};

export default Cell;

import React from 'react';

interface TableHeaderCellProps {
  text: string; 
  hasBorder?: boolean;
}

export const TableHeaderComponent: React.FC<TableHeaderCellProps> = ({ text, hasBorder = true }) => {
  return (
    <div
      className={`flex justify-center items-center ${
        hasBorder ? 'border-r-1 border-blue-30' : ''
      }`}
    >
      <p className="font-semibold text-sm">{text}</p>
    </div>
  );
};

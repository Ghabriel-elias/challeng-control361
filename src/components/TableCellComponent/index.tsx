import React from 'react';
import Skeleton from 'react-loading-skeleton';

interface TableCellProps { 
  text?: string
  hasBorder?: boolean; 
}

export const TableCell: React.FC<TableCellProps> = ({ text, hasBorder = true }) => {
  return (
    <div
      className={`flex justify-center items-center ${
        hasBorder ? 'border-r-1 border-blue-30' : ''
      } w-full`}>
        <p className="font-normal text-grey-secondary text-sm truncate">{text}</p>
    </div>
  );
};

export const TableCellLoading: React.FC<TableCellProps> = ({ hasBorder = true }) => {
  return (
    <div data-testid="table-cell-loading" className={`flex justify-center items-center ${
        hasBorder ? 'border-r-1 border-blue-30' : ''
      } w-full`}>
      <div className='w-2/4'>
        <Skeleton 
          height={14} 
          style={{ width: '100%' }} 
          className='w-2/4'
        />
      </div>
    </div>
  );
};
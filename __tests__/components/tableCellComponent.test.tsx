import { screen } from '@testing-library/react';
import { TableCell, TableCellLoading } from '@/components/TableCellComponent';
import { render } from '../test-utils';

describe('TableCell', () => {
  it('renders the text correctly', () => {
    render(<TableCell text="Test Text" />);
    const textElement = screen.getByText('Test Text');
    expect(textElement).toBeInTheDocument();
  });

  it('applies the border class when hasBorder is true', () => {
    render(<TableCell text="Test Text" hasBorder={true} />);
    const cellElement = screen.getByText('Test Text').parentElement;
    expect(cellElement).toHaveClass('border-r-1 border-blue-30');
  });

  it('does not apply the border class when hasBorder is false', () => {
    render(<TableCell text="Test Text" hasBorder={false} />);
    const cellElement = screen.getByText('Test Text').parentElement;
    expect(cellElement).not.toHaveClass('border-r-1 border-blue-30');
  });
});

describe('TableCellLoading', () => {
  it('renders the Skeleton component', () => {
    render(<TableCellLoading />);
    const skeletonElement = screen.getByTestId('table-cell-loading');
    expect(skeletonElement).toBeInTheDocument();
  });

  it('applies the border class when hasBorder is true', () => {
    render(<TableCellLoading hasBorder={true} />);
    const cellElement = screen.getByTestId('table-cell-loading'); 
    expect(cellElement).toHaveClass('border-r-1 border-blue-30');
  });

  it('does not apply the border class when hasBorder is false', () => {
    render(<TableCellLoading hasBorder={false} />);
    const cellElement = screen.getByTestId('table-cell-loading').parentElement?.parentElement;
    expect(cellElement).not.toHaveClass('border-r-1 border-blue-30');
  });
});
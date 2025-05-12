import { screen } from '@testing-library/react';
import { TableHeaderComponent } from '@/components/TableHeaderComponent';
import { render } from '../../__mocks__/test-utils';

describe('TableHeaderComponent', () => {
  it('renders the text correctly', () => {
    render(<TableHeaderComponent text="Header Text" />);
    const textElement = screen.getByText('Header Text');
    expect(textElement).toBeInTheDocument();
  });

  it('applies the border class when hasBorder is true', () => {
    render(<TableHeaderComponent text="Header Text" hasBorder={true} />);
    const headerElement = screen.getByText('Header Text').parentElement;
    expect(headerElement).toHaveClass('border-r-1 border-blue-30');
  });

  it('does not apply the border class when hasBorder is false', () => {
    render(<TableHeaderComponent text="Header Text" hasBorder={false} />);
    const headerElement = screen.getByText('Header Text').parentElement;
    expect(headerElement).not.toHaveClass('border-r-1 border-blue-30');
  });
});
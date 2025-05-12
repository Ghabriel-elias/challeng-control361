import { ButtonComponent } from '@/components/ButtonComponent';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../test-utils';

describe('ButtonComponent', () => {
  it('renders the button with the correct text', () => {
    render(<ButtonComponent onClick={() => {}} text="Click Me" />);
    const buttonElement = screen.getByText('Click Me');
    expect(buttonElement).toBeInTheDocument();
  });

  it('calls the onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<ButtonComponent onClick={handleClick} text="Click Me" />);
    const buttonElement = screen.getByText('Click Me');
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies the provided className', () => {
    render(<ButtonComponent onClick={() => {}} text="Click Me" className="bg-blue-500" />);
    const buttonElement = screen.getByText('Click Me');
    expect(buttonElement.parentElement).toHaveClass('bg-blue-500');
  });
});
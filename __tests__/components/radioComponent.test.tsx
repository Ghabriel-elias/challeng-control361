import { screen, fireEvent } from '@testing-library/react';
import { RadioComponent } from '@/components/RadioComponent';
import { render } from '../../__mocks__/test-utils';

jest.mock('@/components/IconComponent', () => ({
  IconComponent: jest.fn(({ iconName }) => <div data-testid={`icon-${iconName}`} />),
}));

describe('RadioComponent', () => {
  const mockOnClick = jest.fn();

  it('renders the correct text', () => {
    render(<RadioComponent isSelected={false} text="Option 1" onClick={mockOnClick} />);
    const textElement = screen.getByText('Option 1');
    expect(textElement).toBeInTheDocument();
  });

  it('renders the correct icon when not selected', () => {
    render(<RadioComponent isSelected={false} text="Option 1" onClick={mockOnClick} />);
    const iconElement = screen.getByTestId('icon-IoMdRadioButtonOff');
    expect(iconElement).toBeInTheDocument();
  });

  it('renders the correct icon when selected', () => {
    render(<RadioComponent isSelected={true} text="Option 1" onClick={mockOnClick} />);
    const iconElement = screen.getByTestId('icon-IoMdRadioButtonOn');
    expect(iconElement).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<RadioComponent isSelected={false} text="Option 1" onClick={mockOnClick} />);
    const radioElement = screen.getByText('Option 1').parentElement;
    fireEvent.click(radioElement!);
    expect(mockOnClick).toHaveBeenCalled();
  });
});
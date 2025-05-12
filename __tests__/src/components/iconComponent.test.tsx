import { screen } from '@testing-library/react';
import { IconComponent } from '@/components/IconComponent';
import { render } from '../../test-utils';

describe('IconComponent', () => {
  it('renders the correct icon when a valid iconName is provided', () => {
    render(<IconComponent iconName="RiTruckLine" size={24} color="blue" />);
    const iconElement = screen.getByTestId('icon');
    expect(iconElement).toBeInTheDocument();
  });

  it('does not render anything if an invalid iconName is provided', () => {
    render(<IconComponent iconName="InvalidIconName" />);
    const iconElement = screen.queryByTestId('icon');
    expect(iconElement).not.toBeInTheDocument();
  });

  it('applies the correct size and color to the icon', () => {
    render(<IconComponent iconName="RiTruckLine" size={32} color="red" />);
    const iconElement = screen.getByTestId('icon');
    expect(iconElement).toBeInTheDocument(); 
    expect(iconElement).toHaveAttribute('color', 'red');
  });

  it('applies the correct className to the icon', () => {
    render(<IconComponent iconName="RiTruckLine" className="custom-class" />);
    const iconElement = screen.getByTestId('icon');
    expect(iconElement).toHaveClass('custom-class');
  });
});
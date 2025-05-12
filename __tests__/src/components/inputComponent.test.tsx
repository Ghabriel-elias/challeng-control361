import { screen, fireEvent } from '@testing-library/react';
import { InputComponent } from '@/components/InputComponent';
import { render } from '../../test-utils';

describe('InputComponent', () => {
  it('renders the input with the correct placeholder', () => {
    render(<InputComponent isFocused={false} handleInput={() => {}} placeholder="Enter text" />);
    const inputElement = screen.getByPlaceholderText('Enter text');
    expect(inputElement).toBeInTheDocument();
  });

  it('calls handleInput when the input value changes', () => {
    const handleInputMock = jest.fn();
    render(<InputComponent isFocused={false} handleInput={handleInputMock} />);
    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'test input' } });
    expect(handleInputMock).toHaveBeenCalledWith('test input');
  });

  it('applies the correct border color when isFocused is true', () => {
    render(<InputComponent isFocused={true} handleInput={() => {}} />);
    const containerElement = screen.getByRole('textbox').parentElement;
    expect(containerElement).toHaveClass('border-white');
  });

  it('applies the correct border color when isFocused is false', () => {
    render(<InputComponent isFocused={false} handleInput={() => {}} />);
    const containerElement = screen.getByRole('textbox').parentElement;
    expect(containerElement).toHaveClass('border-grey-border');
  });

  it('calls onFocus when the input gains focus', () => {
    const onFocusMock = jest.fn();
    render(<InputComponent isFocused={false} handleInput={() => {}} onFocus={onFocusMock} />);
    const inputElement = screen.getByRole('textbox');
    fireEvent.focus(inputElement);
    expect(onFocusMock).toHaveBeenCalled();
  });

  it('calls onBlur when the input loses focus', () => {
    const onBlurMock = jest.fn();
    render(<InputComponent isFocused={false} handleInput={() => {}} onBlur={onBlurMock} />);
    const inputElement = screen.getByRole('textbox');
    fireEvent.blur(inputElement);
    expect(onBlurMock).toHaveBeenCalled();
  });
});
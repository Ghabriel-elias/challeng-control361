import { HTMLAttributes, RefObject } from "react"

interface InputComponentProps {
  isFocused: boolean
  handleInput: (text: string) => void
  onFocus?: () => void
  onBlur?: () => void
  placeholder?: string
  className?: HTMLAttributes<HTMLDivElement>['className']
}

export const InputComponent: React.FC<InputComponentProps> = ({
  isFocused,
  handleInput,
  onFocus,
  onBlur,
  placeholder,
  className
}) => {
  return (
    <div className={`${isFocused ?  'border-white' : 'border-grey-border'} border-1 flex flex-row items-center rounded-lg h-10 ${className}`}>
      <input
        placeholder={placeholder}
        className="pl-2.5 pr-2.5 h-full w-full border-none outline-none font-light text-sm placeholder-grey bg-transparent"
        onChange={(ev) => handleInput(ev.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  )
}
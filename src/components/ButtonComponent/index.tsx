import { HTMLAttributes } from "react"

interface ButtonComponentProps {
  onClick: () => void
  text: string
  className?: HTMLAttributes<HTMLDivElement>['className']
}

export const ButtonComponent:React.FC<ButtonComponentProps> = ({
  onClick,
  text,
  className
}) => {
  return (
    <button className={`rounded-lg flex items-center justify-center cursor-pointer ${className ?? ''}`} onClick={onClick}>
      <p className="font-semibold text-sm">{text}</p>
    </button>
  )
}

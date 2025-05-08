import { IconComponent } from "../IconComponent"

interface RadioComponentProps {
  onClick: () => void
  text: string
  isSelected: boolean
}

export const RadioComponent: React.FC<RadioComponentProps> = ({
  isSelected,
  text,
  onClick
}) => {
  return (
    <div className="flex flex-row gap-2 cursor-pointer" onClick={onClick}>
      <IconComponent className="mt-0.5" iconName={isSelected ? "IoMdRadioButtonOn" : "IoMdRadioButtonOff"} color="var(--color-blue-primary)"/>
      <p className="font-normal text-sm">{text}</p>
    </div>
  )
}
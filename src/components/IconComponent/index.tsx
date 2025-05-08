import React, { HTMLAttributes } from 'react'
import * as FaIcons from 'react-icons/fa'
import * as MdIcons from 'react-icons/md'
import * as AiIcons from 'react-icons/ai'
import * as BsIcons from 'react-icons/bs'
import * as BiIcons from 'react-icons/bi'
import * as FiIcons from 'react-icons/fi'
import * as IoIcons from 'react-icons/io'
import * as GiIcons from 'react-icons/gi'
import * as RiIcons from 'react-icons/ri'
import * as Icons from 'react-icons'

type IconNameProps =
  | keyof typeof FaIcons
  | keyof typeof MdIcons
  | keyof typeof AiIcons
  | keyof typeof BsIcons
  | keyof typeof BiIcons
  | keyof typeof FiIcons
  | keyof typeof GiIcons
  | keyof typeof IoIcons
  | keyof typeof RiIcons

interface IconPropsExtended {
  iconName: IconNameProps
  size?: number
  testId?: string
  color?: string
  className?: HTMLAttributes<HTMLDivElement>['className']
}


const iconLibraries = [
  FaIcons,
  MdIcons,
  AiIcons,
  BsIcons,
  BiIcons,
  FiIcons,
  GiIcons,
  IoIcons,
  RiIcons
]
export const IconComponent: React.FC<IconPropsExtended> = ({
  iconName,
  size,
  testId,
  className,
  color
}) => {

  const findIconLibrary = (): React.ComponentType<Icons.IconBaseProps> | null => {
    for (const IconLib of iconLibraries) {
      if (IconLib && (IconLib as any)[iconName]) {
        return IconLib[iconName]
      }
    }
    return null
  }

  const IconLib = findIconLibrary()

  if (!IconLib) {
    return null
  }

  return (
    <IconLib
      size={size}
      className={className}
      color={color}
    />
  )
}

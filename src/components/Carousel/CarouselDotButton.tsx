import React, { PropsWithChildren } from 'react'

type Props = PropsWithChildren<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>>

export const DotButton: React.FC<Props> = props => {
  const { children, ...restProps } = props

  return (
    <button type='button' {...restProps}>
      {children}
    </button>
  )
}

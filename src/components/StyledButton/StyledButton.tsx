import cx from 'classnames'
import React, { ReactNode } from 'react'

import styles from './StyledButton.module.css'

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

interface ButtonsProp {
  className?: string
  children: ReactNode
  loading?: boolean
  disable?: boolean
  type?: 'button' | 'submit' | undefined
  size?: 'small' | 'medium' | 'large' | 'full-width'
  colorTheme?: 'theme-1' | 'theme-2' | 'theme-3'
  onClick?: () => void
}

export const StyledButton: React.FC<ButtonsProp> = ({ className, children, onClick, loading, disable, type, size, colorTheme }) => {
  const buttonStyle = cx(styles.button, {
    [styles.buttonSmall as any]: size === 'small',
    [styles.buttonMedium as any]: size === 'medium',
    [styles.buttonLarge as any]: size === 'large',
    [styles.buttonFullWidth as any]: size === 'full-width',
    [styles.colorTheme1 as any]: colorTheme === 'theme-1',
    [styles.colorTheme2 as any]: colorTheme === 'theme-2',
    [styles.colorTheme3 as any]: colorTheme === 'theme-3',
    [className as any]: true
  })

  return (
    <button type={type} className={buttonStyle} onClick={onClick} disabled={disable}>
      {loading ? (
        <div className='flex items-center justify-center'>
          <LoadingSpinner className={styles.loading} />
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  )
}

import cx from 'classnames'
import React from 'react'

type FontFamily = 'tektur' | 'noto'

interface Props {
  className?: string
  children: React.ReactNode
  family?: FontFamily
}

const familyClass = (family: FontFamily): string => {
  switch (family) {
    case 'tektur':
      return 'font-tektur'
    case 'noto':
      return 'font-noto'
    default:
      return 'font-noto'
  }
}

export const Hero: React.FC<Props> = ({ children, className }) => <div className={cx('text-4xl md:text-6xl mb-5', className)}>{children}</div>

export const Heading1: React.FC<Props> = ({ children, className }) => <h1 className={cx('text-2xl md:text-5xl mb-4', className)}>{children}</h1>

export const Heading1Bold: React.FC<Props> = ({ children, className }) => <h1 className={cx('text-2xl md:text-5xl mb-4 font-bold', className)}>{children}</h1>

export const Heading2: React.FC<Props> = ({ children, className }) => <h2 className={cx('mb-4', className)}>{children}</h2>

export const Heading2Bold: React.FC<Props> = ({ children, className }) => <h2 className={cx('mb-4 font-bold', className)}>{children}</h2>

export const Heading3: React.FC<Props> = ({ children, className }) => <h3 className={cx('mb-2 text-xl md:text-3xl md:mb-3', className)}>{children}</h3>

export const Heading3Bold: React.FC<Props> = ({ children, className }) => (
  <h3 className={cx('mb-2 text-xl font-bold md:text-3xl md:mb-3', className)}> {children}</h3>
)

export const Heading5Bold: React.FC<Props> = ({ children, className }) => (
  <h5 className={cx('mb-2 text-lg font-bold md:text-xl md:mb-3', className)}> {children}</h5>
)

export const Large: React.FC<Props> = ({ children, className }) => <span className={cx('text-lg-mobile md:text-xl', className)}>{children}</span>

export const LargeBold: React.FC<Props> = ({ children, className }) => (
  <span className={cx('text-lg-mobile md:text-xl', className)}>
    <strong>{children}</strong>
  </span>
)

export const Small: React.FC<Props> = ({ children, className }) => <small className={cx('text-xs md:text-sm leading-4', className)}>{children}</small>

export const SmallBold: React.FC<Props> = ({ children, className }) => (
  <small className={cx('text-xs md:text-sm', className)}>
    <strong>{children}</strong>
  </small>
)

// Font
export const Header: React.FC<Props> = ({ children, className, family = 'tektur' }) => (
  <h1 className={cx('text-[1.5rem] md:text-4xl md:mb-5 lg:text-header ', familyClass(family), className)}>{children}</h1>
)
export const HeaderBold: React.FC<Props> = ({ children, className, family = 'tektur' }) => (
  <h1 className={cx('font-[600] text-[1.5rem] md:text-4xl md:mb-5 lg:text-[40px]', familyClass(family), className)}>{children}</h1>
)

export const SubHeader: React.FC<Props> = ({ children, className, family = 'tektur' }) => (
  <h3 className={cx('mb-2 text-2xl font-defaultFont md:text-subHeader md:mb-3', familyClass(family), className)}>{children}</h3>
)
export const SubHeaderBold: React.FC<Props> = ({ children, className, family = 'tektur' }) => (
  <h3 className={cx('mb-2 text-2xl font-defaultFont font-bold md:text-subHeader md:mb-3', familyClass(family), className)}>{children}</h3>
)

export const SubTitle: React.FC<Props> = ({ children, className, family = 'tektur' }) => (
  <h3 className={cx('mb-2 text-xl font-defaultFont md:text-subTitle md:mb-3', familyClass(family), className)}>{children}</h3>
)
export const SubTitleBold: React.FC<Props> = ({ children, className, family = 'tektur' }) => (
  <h3 className={cx('mb-2 text-xl font-defaultFont font-bold md:text-subTitle md:mb-3', familyClass(family), className)}>{children}</h3>
)

export const Body: React.FC<Props> = ({ children, className, family = 'noto' }) => (
  <span className={cx('text-base font-defaultFont font-normal md:text-body md:mb-1', familyClass(family), className)}>{children}</span>
)
export const BodyBold: React.FC<Props> = ({ children, className, family = 'noto' }) => (
  <span className={cx('text-base font-bold font-defaultFont md:text-body md:mb-1', familyClass(family), className)}>{children}</span>
)

export const SubBody: React.FC<Props> = ({ children, className, family = 'noto' }) => (
  <small className={cx('text-subBody font-defaultFont', familyClass(family), className)}>{children}</small>
)
export const SubBodyBold: React.FC<Props> = ({ children, className, family = 'noto' }) => (
  <small className={cx('text-subBody font-defaultFont font-bold ', familyClass(family), className)}>{children}</small>
)

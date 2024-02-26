import cx from 'classnames'

import styles from './HeroPanel.module.css'

import * as Model from './model'
import ButtonGroupContainer from '../ButtonGroupContainer/ButtonGroupContainer'
import ResponsiveMedia from '../ResponsiveMedia/ResponsiveMedia'
import { Header, Heading1Bold, Heading5Bold, SubTitle } from '../Typography/Typography'
import { isCentreLayout, isLeftLayout, isRightLayout } from '../../helpers'

interface Props extends Model.HeroPanel {
  className?: string
  children?: React.ReactNode
}

const HeroPanel: React.FC<Props> = ({ src, alt, logoSrc, logoAlt, className, darkenGradient, heading, subheading, layout, buttonGroup, children }) => {
  const mediaClassName = cx({
    [styles.darkFilter as any]: true,
    [styles.imageWrapper as any]: true
  })

  const heroPanelTitleClassNames = cx({
    [styles.heroPanelTitle as any]: true,
    ['items-start']: isLeftLayout(layout),
    ['items-center']: isCentreLayout(layout),
    ['items-end']: isRightLayout(layout)
  })

  const subheadingClassNames = cx({
    ['text-center']: isCentreLayout(layout),
    ['text-right']: isRightLayout(layout)
  })

  if (!src) {
    return (
      <div className={styles.heroPanelTitle}>
        {heading && <Heading1Bold>{heading}</Heading1Bold>}
        {subheading && <Heading5Bold>{subheading}</Heading5Bold>}
      </div>
    )
  }

  return (
    <div className={cx(styles.heroPanel, className)}>
      <ResponsiveMedia src={src} alt={alt || ''} className={mediaClassName} screenHeight />
      {darkenGradient && <div className={styles.gradientBar} />}
      <div className={styles.titlesWrapper}>
        <div className={heroPanelTitleClassNames}>
          <div className={styles.logoWrapper}>{logoSrc && <ResponsiveMedia src={logoSrc} alt={logoAlt || ''} objectFit='contain' className='w-12' />}</div>
          {heading && <Header>{heading}</Header>}
          {subheading && <SubTitle className={subheadingClassNames}>{subheading}</SubTitle>}
          {buttonGroup && <ButtonGroupContainer button={buttonGroup} />}
          {children}
        </div>
      </div>
    </div>
  )
}

export default HeroPanel

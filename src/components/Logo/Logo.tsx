import cx from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import logo from '/public/logo/logo.svg'
import logoWithText from '/public/logo/logoWithText.svg'

interface Props {
  href?: string
  hasText?: boolean
  className?: string
}

export const Logo: React.FC<Props> = ({ className, href, hasText }) => {
  const imageWapper = cx({
    ['scale-[175%]']: true,
    [className as any]: true
  })

  return (
    <Link href={href || '/'}>
      {hasText ? (
        <Image src={logoWithText} alt='logo with text' width={100} height={100} priority className={imageWapper} />
      ) : (
        <Image src={logo} alt='logo' width={30} height={30} priority className={imageWapper} />
      )}
    </Link>
  )
}

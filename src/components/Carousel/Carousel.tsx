import cx from 'classnames'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import React, { useCallback, useEffect, useState } from 'react'

import styles from './Carousel.module.css'

import { NextButton, PrevButton } from './CarouselArrowButton'
import { DotButton } from './CarouselDotButton'
import * as Model from './model'
import ResponsiveMedia from '../ResponsiveMedia/ResponsiveMedia'
import TextRender from '../TextRender/TextRender'
import { SBAsset } from '../../storyblok/models'

interface Props extends Model.Carousel {}

export const Carousel: React.FC<Props> = ({ contents, heading }) => {
  const autoplay = Autoplay({
    delay: 5000,
    stopOnMouseEnter: true,
    stopOnInteraction: false
  }) as any

  const [viewportRef, embla] = useEmblaCarousel({ loop: true }, [autoplay])

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla])
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla])
  const scrollTo = useCallback((index: number) => embla && embla.scrollTo(index), [embla])

  const onSelect = useCallback(() => {
    if (!embla) return
    setSelectedIndex(embla.selectedScrollSnap())
    setPrevBtnEnabled(embla.canScrollPrev())
    setNextBtnEnabled(embla.canScrollNext())
  }, [embla, setSelectedIndex])

  useEffect(() => {
    if (!embla) return
    onSelect()
    setScrollSnaps(embla.scrollSnapList())
    embla.on('select', onSelect)
  }, [embla, setScrollSnaps, onSelect])

  const isSelectedIndex = (index: number): any =>
    cx({
      [styles['emblaDot--selected'] as any]: index === selectedIndex,
      [styles.emblaDot as any]: true
    })

  const renderDescriptions = (logo: SBAsset, description: string, avatar: SBAsset, avatarDescription: string, dark_gradient: boolean) => {
    return (
      <div className={styles.descriptionWrapper}>
        {logo?.filename && <ResponsiveMedia src={logo.filename} alt=' ' objectFit='contain' className='w-20 h-10' />}
        <div className={cx({ ['text-white']: dark_gradient })}>
          <TextRender type='header' content={description} layout='center' />
        </div>
        {avatar?.filename && <ResponsiveMedia src={avatar.filename} alt=' ' objectFit='contain' className='w-20 h-10' />}
        {avatarDescription && <TextRender type='body' content={avatarDescription} layout='center' />}
      </div>
    )
  }

  return (
    <div className={styles.embla}>
      {heading && <TextRender type='header' layout='center' content={heading} />}
      <div className={styles.emblaViewport} ref={viewportRef}>
        <div className={styles.emblaContainer}>
          {contents.map((item, index) => (
            <div key={index} className={styles.emblaSlide}>
              {renderDescriptions(item.logo, item.description, item.avatar, item.avatar_description, item.dark_gradient)}
              {item.dark_gradient && <div className={styles.gradientBar} />}
              {item.image.id ? (
                <ResponsiveMedia src={item.image.filename} alt='' objectFit='fill' className={styles.emblaSlideImg} />
              ) : (
                <div className={styles.emblaImagePlaceholder}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.emblaButtons}>
        <PrevButton onClick={scrollPrev} disabled={!prevBtnEnabled} />
        <NextButton onClick={scrollNext} disabled={!nextBtnEnabled} />
      </div>

      <div className={styles.emblaDots}>
        {scrollSnaps.map((_, index) => (
          <DotButton key={index} onClick={() => scrollTo(index)} className={isSelectedIndex(index)} />
        ))}
      </div>
    </div>
  )
}

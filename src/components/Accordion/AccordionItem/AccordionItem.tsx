import React from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

import styles from './AccordionItem.module.css'

import * as Model from './model'
import MarkdownRender from '../../MarkdownRender/MarkdownRender'
import TextRender from '../../TextRender/TextRender'

interface Props extends Model.AccordionItem {
  onToggle: () => void
  isOpen: boolean
}

const AccordionItem: React.FC<Props> = ({ title, markdown, onToggle, isOpen }) => {
  return (
    <div className={styles.itemContainer}>
      <div className={`${styles.titleContainer} ${isOpen && styles.noBottomBorder}`} onClick={onToggle}>
        <TextRender type='bodyBold' content={title} layout='left' />
        {isOpen ? (
          <FaChevronUp className='h-5 w-5 text-gray-500 -ml-5 cursor-pointer' />
        ) : (
          <FaChevronDown className='h-5 w-5 text-gray-500 -ml-5 cursor-pointer' />
        )}
      </div>
      {isOpen && (
        <div className={styles.markdownContainer}>
          <div className='pb-2'>
            <MarkdownRender renderedText={markdown} />
          </div>
        </div>
      )}
    </div>
  )
}

export default AccordionItem

import React, { useReducer } from 'react'

import styles from './Accordion.module.css'

import AccordionItem from './AccordionItem/AccordionItem'
import * as Model from './model'
import TextRender from '../TextRender/TextRender'
import { SBAccordionItem, WebsiteComponent } from '../../storyblok/models'

interface Props extends Model.Accordion {
  title: string
  desc: string
  accordionItems: WebsiteComponent<SBAccordionItem>[]
}

const Accordion: React.FC<Props> = ({ title, desc, accordionItems }) => {
  const initialState = accordionItems.reduce((acc, item) => {
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    acc[item._uid] = false
    return acc
  }, {})

  const accordionReducer = (state: any, action: { type: string; payload: string }) => {
    switch (action.type) {
      case 'TOGGLE_ITEM':
        // eslint-disable-next-line no-case-declarations
        const newState = { ...state }
        for (const key of Object.keys(state)) {
          newState[key] = false
        }
        newState[action.payload] = !state[action.payload]

        return newState
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(accordionReducer, initialState)

  return (
    <div className={styles.accordionOuterContainer}>
      <div className={styles.accordionContainer}>
        <div className={styles.titleContainer}>
          <TextRender type='headerBold' content={title} layout='left' theme='rainbow' />
          <TextRender type='body' content={desc} layout='left' />
        </div>
        {accordionItems && (
          <div className={styles.itemsContainer}>
            {accordionItems.map(accordionItem => (
              <AccordionItem
                key={accordionItem._uid}
                title={accordionItem.title}
                markdown={accordionItem.markdown}
                _uid={accordionItem._uid}
                isOpen={state[accordionItem._uid]}
                onToggle={() => dispatch({ type: 'TOGGLE_ITEM', payload: accordionItem._uid })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default Accordion

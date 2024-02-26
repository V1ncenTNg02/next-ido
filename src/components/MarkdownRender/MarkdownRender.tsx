import hljs from 'highlight.js'
import markdownit from 'markdown-it'
import React from 'react'

import 'highlight.js/styles/default.css'
import styles from './Markdown.module.css'

const md = markdownit({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    let result = ''
    if (lang && hljs.getLanguage(lang)) {
      try {
        result = hljs.highlight(str, { language: lang }).value
      } catch (err) {
        console.error(err)
      }
    }
    return result
  }
})

interface Props {
  renderedText: string
}

const MarkdownRender: React.FC<Props> = ({ renderedText }) => {
  const result = md.render(renderedText)
  return <article dangerouslySetInnerHTML={{ __html: result }} className={styles.markdownStyle} />
}

export default MarkdownRender

import { useEffect, useState } from 'react'

import ComponentMapper from './ComponentMapper'
import config from '../configs'
import { WebsiteComponent } from '../storyblok/models'

declare global {
  interface Window {
    storyblok: {
      init: () => void
      on: (event: string | string[], e: any) => void
    }
  }
}

function addBridge(callback: any) {
  const existingScript = document.getElementById('storyblokBridge')
  if (existingScript) return callback()

  const script = document.createElement('script')
  script.src = `https://app.storyblok.com/f/storyblok-latest.js?t=${config.storyblokApiKey}`
  script.id = 'storyblokBridge'
  document.body.appendChild(script)
  script.onload = () => {
    callback()
  }
}

const StoryblokBridge = ({ blok }: { blok: WebsiteComponent }) => {
  const [blokState, setBlokState] = useState(blok)

  useEffect(() => {
    addBridge(() => {
      if (window.storyblok) {
        window.storyblok.init()
        window.storyblok.on(['change', 'published'], () => location.reload())
        window.storyblok.on('input', (e: any) => {
          setBlokState(e?.story?.content)
        })
      }
    })
  }, [])

  return <ComponentMapper blok={blokState} />
}

export default StoryblokBridge

"use client"

import { useEffect } from 'react'

export default function AttributeCleaner() {
  useEffect(() => {
    const removeAttributes = () => {
      document.body.removeAttribute('data-new-gr-c-s-check-loaded')
      document.body.removeAttribute('data-gr-ext-installed')
    }

    removeAttributes()
    
    // Add event listener for potential dynamic changes
    window.addEventListener('load', removeAttributes)
    
    return () => {
      window.removeEventListener('load', removeAttributes)
    }
  }, [])

  return null
}
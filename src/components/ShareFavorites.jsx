
import { useState } from 'react'

export default function ShareButton({ ids = []}) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
  console.log('ids:', ids)
  const url = new URL('/shared', window.location.origin)
  url.searchParams.set('ids', ids.join(','))
  const shareUrl = url.toString()
  console.log('shareUrl:', shareUrl)
  

    try {
      if (navigator.share) {
        await navigator.share({ title: 'My favorite movies', url: shareUrl })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      // User dismissing the share sheet throws AbortError, which isn't a real failure
      if (err.name !== 'AbortError') console.error('Share failed', err)
    }
  }

  return (
    <button
      type="button"
      className="btn btn-outline"
      onClick={handleShare}
      disabled={ids.length === 0}
    >
      {copied ? 'Link copied!' : 'Share favorites'}
    </button>
  )
}



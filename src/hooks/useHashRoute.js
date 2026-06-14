import { useState, useEffect } from 'react'

// Router tối giản dựa trên hash — không cần thư viện, chạy tốt khi host tĩnh.
// #/ (trang chủ) · #/c/:categoryId · #/t/:topicId · #/search · #/mine · #/how
export function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || '#/')

  useEffect(() => {
    const onChange = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (parts[0] === 'c' && parts[1]) return { name: 'category', id: decodeURIComponent(parts[1]) }
  if (parts[0] === 't' && parts[1]) return { name: 'topic', id: decodeURIComponent(parts[1]) }
  if (parts[0] === 'search') return { name: 'search' }
  if (parts[0] === 'mine') return { name: 'mine' }
  if (parts[0] === 'cards') return { name: 'cards' }
  if (parts[0] === 'how') return { name: 'how' }
  return { name: 'home' }
}

export function go(path) {
  window.location.hash = path
  window.scrollTo(0, 0)
}

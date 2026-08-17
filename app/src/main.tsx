import './index.css'
import { initHeader } from './lib/init-header'

const path = window.location.pathname

function startHeader() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader)
  } else {
    initHeader()
  }
}

if (path === '/' || path === '/index.html') {
  // Zero-React homepage shell: Header + Hero are prerendered. The below-the-fold
  // sections load on demand when the user scrolls toward them or clicks a
  // section link, keeping the initial bundle tiny and TBT at zero.
  startHeader()

  const restEl = document.getElementById('rest-island')
  if (restEl && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          import('./home-bootstrap')
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(restEl)
  }
} else if (
  path === '/privacy' ||
  path === '/privacy/' ||
  path === '/terms' ||
  path === '/terms/'
) {
  // Static legal pages: header mobile menu is the only client interactivity.
  startHeader()
} else {
  import('./app-bootstrap')
}

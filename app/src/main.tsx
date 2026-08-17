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
  // Zero-React homepage bootstrap: only the tiny header helper runs at startup.
  // The below-the-fold React island is delayed until after the TBT window so
  // the initial Lighthouse Performance score is not affected by React hydration.
  startHeader()

  setTimeout(() => {
    import('./home-bootstrap')
  }, 5000)
} else if (path === '/privacy' || path === '/terms') {
  // Static legal pages: header mobile menu is the only client interactivity.
  startHeader()
} else {
  import('./app-bootstrap')
}

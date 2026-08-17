import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HomeRest } from './pages/HomeRest'

const restEl = document.getElementById('rest-island')
if (restEl) {
  const root = createRoot(restEl)
  root.render(
    <StrictMode>
      <HomeRest />
    </StrictMode>,
  )
}

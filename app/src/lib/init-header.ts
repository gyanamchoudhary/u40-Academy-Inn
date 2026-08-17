export function initHeader() {
  const header = document.querySelector('header[data-header]') as HTMLElement | null
  const toggle = document.querySelector(
    'button[aria-controls="mobile-menu"]'
  ) as HTMLButtonElement | null
  const menu = document.getElementById('mobile-menu')
  if (!header || !toggle || !menu) return

  let open = false
  let touched = false

  const setScrolled = () => {
    if (open) return
    header.setAttribute('data-header', window.scrollY > 12 ? 'scrolled' : 'top')
  }

  const setMenu = (nextOpen: boolean) => {
    open = nextOpen
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    if (open) {
      header.setAttribute('data-header', 'open')
      menu.classList.add('border-t', 'border-black/10')
      menu.style.gridTemplateRows = '1fr'
    } else {
      setScrolled()
      menu.classList.remove('border-t', 'border-black/10')
      menu.style.gridTemplateRows = '0fr'
    }
  }

  toggle.addEventListener('click', () => setMenu(!open))

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false))
  })

  // Close the mobile menu when tapping outside it on small screens.
  document.addEventListener('click', (event) => {
    if (!open) return
    const target = event.target as Node
    if (!menu.contains(target) && !header.contains(target)) {
      setMenu(false)
    }
  })

  // Preserve :hover interactivity without delaying taps on touch devices.
  document.addEventListener('touchstart', () => {
    if (!touched) {
      touched = true
      document.body.classList.add('touch-device')
    }
  }, { once: true, passive: true })

  window.addEventListener('scroll', setScrolled, { passive: true })
  setScrolled()
}

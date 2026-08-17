import { StrictMode } from "react"
import { renderToString } from "react-dom/server"
import Home from "./pages/Home"
import Privacy from "./pages/Privacy"
import Terms from "./pages/Terms"

const pages: Record<string, React.ReactNode> = {
  "/": <Home />,
  "/index.html": <Home />,
  "/privacy": <Privacy />,
  "/terms": <Terms />,
}

export function render(path = "/") {
  const element = pages[path] ?? pages["/"]
  return renderToString(
    <StrictMode>
      {element}
    </StrictMode>
  )
}

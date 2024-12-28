import {
  lazy,
  LocationProvider,
  ErrorBoundary,
  Router,
  Route,
} from 'preact-iso'

import { NotFound } from './components/NotFound'
import aboutUsUrl from './routes/about-us.md'
import { renderMarkdownRoute } from './utils/renderMarkdownRoute'

const AboutUs = lazy(() => renderMarkdownRoute(aboutUsUrl))

export default function App() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <Router>
          <Route path="/about-us" component={AboutUs} />
          <Route default component={NotFound} />
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  )
}

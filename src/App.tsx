import {
  lazy,
  LocationProvider,
  ErrorBoundary,
  Router,
  Route,
} from 'preact-iso'

import { NotFound } from './components/NotFound'
import aboutUsPath from './routes/about-us.md'
import codeOfConductPath from './routes/code-of-conduct.md'
import confPromoInfoPath from './routes/conf/promo-info.md'
import confSpeakerInfoPath from './routes/conf/speaker-info.md'
import joinPath from './routes/join.md'
import signupNextStepsPath from './routes/signup-next-steps.md'
import speakPath from './routes/speak.md'
import volunteerGuidePath from './routes/volunteer-guide.md'
import volunteerPath from './routes/volunteer.md'
import welcomePath from './routes/welcome.md'

import { renderMarkdownRoute } from './utils/renderMarkdownRoute'

const routes = [
  {
    url: '/about-us',
    component: lazy(() => renderMarkdownRoute(aboutUsPath)),
  },
  {
    url: './conf/promo-info',
    component: lazy(() => renderMarkdownRoute(confPromoInfoPath)),
  },
  {
    url: '/conf/speaker-info',
    component: lazy(() => renderMarkdownRoute(confSpeakerInfoPath)),
  },
  {
    url: '/code-of-conduct',
    component: lazy(() => renderMarkdownRoute(codeOfConductPath)),
  },
  {
    url: '/join',
    component: lazy(() => renderMarkdownRoute(joinPath)),
  },
  {
    url: '/signup-next-steps',
    component: lazy(() => renderMarkdownRoute(signupNextStepsPath)),
  },
  {
    url: '/speak',
    component: lazy(() => renderMarkdownRoute(speakPath)),
  },
  {
    url: '/volunteer-guide',
    component: lazy(() => renderMarkdownRoute(volunteerGuidePath)),
  },
  {
    url: '/volunteer',
    component: lazy(() => renderMarkdownRoute(volunteerPath)),
  },
  {
    url: '/welcome',
    component: lazy(() => renderMarkdownRoute(welcomePath)),
  },
]

export default function App() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <Router>
          {routes.map(({ url, component }) => (
            <Route key={url} path={url} component={component} />
          ))}
          <Route default component={NotFound} />
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  )
}

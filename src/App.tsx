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

import { createMarkdownRoute } from './utils/createMarkdownRoute'

const routes = [
  {
    url: '/about-us',
    component: lazy(() => createMarkdownRoute(aboutUsPath)),
  },
  {
    url: './conf/promo-info',
    component: lazy(() => createMarkdownRoute(confPromoInfoPath)),
  },
  {
    url: '/conf/speaker-info',
    component: lazy(() => createMarkdownRoute(confSpeakerInfoPath)),
  },
  {
    url: '/code-of-conduct',
    component: lazy(() => createMarkdownRoute(codeOfConductPath)),
  },
  {
    url: '/join',
    component: lazy(() => createMarkdownRoute(joinPath)),
  },
  {
    url: '/signup-next-steps',
    component: lazy(() => createMarkdownRoute(signupNextStepsPath)),
  },
  {
    url: '/speak',
    component: lazy(() => createMarkdownRoute(speakPath)),
  },
  {
    url: '/volunteer-guide',
    component: lazy(() => createMarkdownRoute(volunteerGuidePath)),
  },
  {
    url: '/volunteer',
    component: lazy(() => createMarkdownRoute(volunteerPath)),
  },
  {
    url: '/welcome',
    component: lazy(() => createMarkdownRoute(welcomePath)),
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

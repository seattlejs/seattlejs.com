import { useState, useCallback } from 'preact/hooks'

import { memo } from '../utils/memo'
import './Header.css'

const Header = memo(() => {
  const [expanded, setExpanded] = useState(false)
  const onClick = useCallback(() => {
    setExpanded(expanded => !expanded)
  }, [])

  return (
    <header id="site-header">
      <nav>
        <div id="logo">
          <a href="/">
            <img
              src="/_public/images/logo.png"
              alt="SeattleJS logo"
              width="32"
              height="32"
            />
          </a>
        </div>
        <button
          class="nav-toggler"
          type="button"
          aria-controls="nav-links"
          aria-expanded={expanded ? 'true' : 'false'}
          aria-label="Site navigation"
          onClick={onClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
            <path
              stroke="#fff"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="2"
              d="M4 7h22M4 15h22M4 23h22"
            />
          </svg>
        </button>
        <ul id="nav-links">
          <li>
            <a href="/about-us">About Us</a>
          </li>
          <li>
            <a href="/join">Join Our Community</a>
          </li>
          <li>
            <a href="/conf">SeattleJS Conf 2023</a>
          </li>
          <li>
            <a href="/code-of-conduct">Code of Conduct</a>
          </li>
          <li>
            <a target="_blank" href="https://lu.ma/seattlejs/">
              Tickets
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
})

export default Header

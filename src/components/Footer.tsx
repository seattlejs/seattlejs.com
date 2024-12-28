import { memo } from '../utils/memo'
import './Footer.css'

{
  /* <script
  src="https://kit.fontawesome.com/95fd764ad0.js"
  crossorigin="anonymous"
  async
></script> */
}

const Footer = memo(() => {
  return (
    <footer>
      <h2>Built with ❤️ in Seattle</h2>
      <p>
        This website is built using
        <a target="_blank" href="https://preactjs.com">
          Preact
        </a>{' '}
        and{' '}
        <a target="_blank" href="https://vite.dev/">
          Vite
        </a>{' '}
        and the code is open sourced on on
        <a target="_blank" href="https://github.com/seattlejs/seattlejs.com">
          Github
        </a>
        .
      </p>
    </footer>
  )
})

export default Footer

export default function MyHeader({ html }) {
  return html`
    <style>
      header {
        padding: 7.5px;
        background-color: rgb(140, 170, 29);
        color: #fff;
      }

      header a {
        display: inline-block;
        color: #fff;
        text-decoration: none;
        font-weight: 400;
      }

      #logo a {
        display: flex;
        margin-right: 8px;
      }

      #logo img {
        display: block;
        height: 32px;
        border: 1px solid #fff;
      }
    
      nav {
        display: grid;
        grid-template-columns: auto 1fr auto;
      }

      nav > .nav-toggler {
          grid-column: -2;
          padding: 4px 12px;
          background-color: transparent;
          border: 1px solid #fff;
          border-radius: 6px;
          cursor: pointer;
      }

      .nav-toggler > svg {
          display: block;
          height: 24px;
      }

      ul {
          grid-row: 2;
          grid-column: 1 / -1;
          display: none;
          margin-top: 8px;
      }

      .nav-toggler[aria-expanded=true] + #nav-links {
          display: block;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 8px 0 0 0;    
      }

      a {
          padding: 8px;
      }

      a:visited {
          color: #fff;
      }

      a:hover {
          text-decoration: underline;
      }

      a.special {
        display: inline-block;
        background-color: #f26c57;
        border-radius: 4px;
        padding: 8px;
      }

      #subheader {
        background-color: #FFD007;;
        padding: 7.5px;
        text-align: center;
      }

      @media only screen and (min-width: 768px) {
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 80vw;
          margin: 0 auto;
        }

        nav .nav-toggler {
          display: none;
        }

        /* Always show the nav menu on desktop */
        .nav-toggler[aria-expanded=true] + #nav-links,
        .nav-toggler[aria-expanded=false] + #nav-links,
        #nav-links {
          display: flex;
          gap: 24px;
          margin: 0;
        }
      }
    </style>
    <header>
      <nav>
        <div id="logo">
          <a href="/"
            ><img
              src="/_public/images/logo.png"
              alt="SeattleJS logo"
              width="32"
              height="32"
          /></a>
        </div>
        <button
          class="nav-toggler"
          type="button"
          aria-controls="nav-links"
          aria-expanded="false"
          aria-label="Site navigation"
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
          <li><a href="/conf">SeattleJS Conf 2023</a></li>
          <li><a class="special" href="/live">📺 Livestream</a></li>
          <li><a href="/about-us">About Us</a></li>
          <li><a href="/join">Join Our Community</a></li>
          <li><a href="/code-of-conduct">Code of Conduct</a></li>
          <li>
            <a target="_blank" href="https://ti.to/event-loop/">Tickets</a>
          </li>
        </ul>
      </nav>
    </header>
    <section id="subheader">
     Set your alarm ⏰! The livestream will kick-off here on Tuesday, August 8 at 9:00am PT
    </section>
    <script type="module">
      class MyHeader extends HTMLElement {
        constructor() {
          super()
          const mobileButton = this.querySelector('.nav-toggler')
          mobileButton.addEventListener('click', () => {
            const expanded =
              mobileButton.getAttribute('aria-expanded') === 'true'
            mobileButton.setAttribute('aria-expanded', !expanded)
          })
        }
      }

      customElements.define('my-header', MyHeader)
    </script>
  `
}

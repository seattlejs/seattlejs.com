export default function MyFooter({ html }) {
  return html`
    <style>
      footer {
        padding: 7.5px;
        background-color: rgb(140, 170, 29);
        color: #fff;
        text-align: center;
      }

      footer a {
        display: inline-block;
        color: #fff;
        text-decoration: none;
        font-weight: 600;
      }

      footer a:visited {
          color: #fff;
      }
      
      footer a:hover {
          text-decoration: underline;
      }
    </style>
    <script
      src="https://kit.fontawesome.com/95fd764ad0.js"
      crossorigin="anonymous"
      async
    ></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js" integrity="sha512-rdhY3cbXURo13l/WU9VlaRyaIYeJ/KBakckXIvJNAQde8DgpOmE+eZf7ha4vdqVjTtwQt69bD2wH2LXob/LB7Q==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script>hljs.highlightAll();</script>
    <script src="https://unpkg.com/@mux/mux-player"></script>
    <script src="/_public/scripts/app.js"></script>
    <footer>
      <h2>Built with ❤️ in Seattle</h2>
      <p>
        This website is built using
        <a target="_blank" href="https://enhance.dev">Enhance</a>, hosted on
        <a target="_blank" href="https://begin.com">Begin</a> and the code is
        open sourced on on
        <a target="_blank" href="https://github.com/seattlejs/seattlejs.com"
          >Github</a
        >.
      </p>
    </footer>
  `
}

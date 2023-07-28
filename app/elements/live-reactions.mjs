export default function LiveReactions({ html }) {
  return html`
    <style>
      .container {
        display: flex;
        gap: 4px;
      }

      .visually-hidden {
        position: absolute !important;
        clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
        clip: rect(1px, 1px, 1px, 1px);
        padding: 0 !important;
        border: 0 !important;
        height: 1px !important;
        width: 1px !important;
        overflow: hidden;
      }

      .no-interaction,
      .reactions {
        pointer-events: none;
        touch-action: none;
      }
    </style>

    <script>
      function generateRandomId() {
        return (
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15)
        )
      }

      const heartButton = document.getElementById('heart')
      const fireButton = document.getElementById('fire')
      const octopusButton = document.getElementById('octopus')
      const rocketButton = document.getElementById('rocket')
      const localReactions = []

      const onClickHandler = e => {
        localReactions.push({
          id: generateRandomId(),
          type: e.target.id,
          shown: false,
          timestamp: new Date().getTime()
        })
      }

      const buttons = [heartButton, fireButton, octopusButton, rocketButton]

      buttons.forEach(button => {
        button.addEventListener('click', onClickHandler)
      })

      function loop() {
        buttons.forEach(button => {
          const id = button.id

          const reactionsContainer = document.querySelector(
            '#' + id + ' .reactions'
          )
          const newDOMElements = document.createDocumentFragment()

          localReactions
            .filter(reaction => reaction.type === id)
            .forEach(reaction => {
              const delta = (new Date().getTime() - reaction.timestamp) / 1000
              if (reaction.shown && delta > 2) {
                const staleReaction = document.getElementById(reaction.id)
                if (staleReaction) staleReaction.remove()
              }
              if (reaction.shown === false) {
                reaction.shown = true

                let div = document.createElement('div')
                div.className = 'no-interaction'
                div.textContent = id
                div.id = reaction.id

                newDOMElements.appendChild(div)
              }
            })

          if (reactionsContainer) {
            reactionsContainer.appendChild(newDOMElements)
            const announcementContainer = document.querySelector(
              '#' + id + ' .visually-hidden'
            )
            announcementContainer.textContent =
              reactionsContainer.childElementCount + ' ' + id + ' reactions'
          }
        })

        requestAnimationFrame(loop)
      }

      loop()
    </script>

    <section class="container">
      <button aria-label="Heart reaction" id="heart">
        ❤️
        <div aria-live="polite" role="log" class="no-interaction">
          <div class="visually-hidden"></div>
          <div class="reactions"></div>
        </div>
      </button>
      <button aria-label="Fire reaction" id="fire">
        🔥
        <div aria-live="polite" role="log" class="no-interaction">
          <div class="visually-hidden"></div>
          <div class="reactions"></div>
        </div>
      </button>
      <button aria-label="Octopus reaction" id="octopus">
        🐙
        <div aria-live="polite" role="log" class="no-interaction">
          <div class="visually-hidden"></div>
          <div class="reactions"></div>
        </div>
      </button>
      <button aria-label="Rocket reaction" id="rocket">
        🚀
        <div aria-live="polite" role="log" class="no-interaction">
          <div class="visually-hidden"></div>
          <div class="reactions"></div>
        </div>
      </button>
    </section>
  `
}

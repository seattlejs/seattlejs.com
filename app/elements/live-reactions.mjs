export default function LiveReactions({ html }) {
  return html`
    <style>
      .container {
        display: flex;
        gap: 4px;
        background: #f26c57;
        padding: 8px 12px;
      }

      .container button {
        border: 0;
        background: transparent;
        font-size: 24px;
        cursor: pointer;
        transition: background 0.2s ease;
        position: relative;
        z-index: 5;
      }

      .container button:hover {
        background: rgba(0, 0, 0, 0.2);
      }

      .content {
        display: inline-block;
        transition: scale 0.1s ease;
      }

      .container button:active .content {
        scale: 0.8;
      }

      .content {
        z-index: 5;
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

      .reactions {
        position: absolute;
        top: 12px;
        z-index: -1;
      }

      .reaction {
        position: absolute;
        animation: travel var(--animation-duration, 2s) ease-in-out infinite;
        animation-iteration-count: unset;
        animation-direction: normal;
        animation-fill-mode: both;
        animation-delay: var(--animation-delay, 0s);
        pointer-events: none;
        user-select: none;
        touch-action: none;
      }

      @keyframes travel {
        0% {
          transform: translate(0, -64px);
          rotate: var(--starting-angle);
          scale: 0;
          opacity: 0;
        }
        5% {
          scale: 0.1;
          opacity: 0.2;
        }

        40% {
          opacity: 1;
          scale: 0.3;
        }

        60% {
          opacity: 1;
        }

        100% {
          transform: translate(0, var(--travel-distance));
          scale: 1.5;
          opacity: 0;
        }
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
        let emoji = ''

        switch (e.target.id) {
          case 'heart':
            emoji = '❤️'
            break

          case 'fire':
            emoji = '🔥'
            break
          case 'octopus':
            emoji = '🐙'
            break
          case 'rocket':
            emoji = '🚀'
            break
        }
        localReactions.push({
          id: generateRandomId(),
          emojiId: e.target.id,
          type: emoji,
          shown: false,
          timestamp: new Date().getTime(),
          curve: window.reactions.generateRandomCurveForReaction(),
          startingAngle: window.reactions.getStartingAngleForReaction()
        })
        window.reactions.react(e.target.id)
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
            .filter(reaction => reaction.emojiId === id)
            .forEach(reaction => {
              const delta = (new Date().getTime() - reaction.timestamp) / 1000
              if (reaction.shown && delta > 2) {
                const staleReaction = document.getElementById(reaction.id)
                if (staleReaction) staleReaction.remove()
              }
              if (reaction.shown === false) {
                reaction.shown = true

                let div = document.createElement('div')
                div.className = 'no-interaction reaction'
                div.textContent = reaction.type
                div.id = reaction.id
                div.style.animationTimingFunction = reaction.curve
                div.style.setProperty(
                  '--starting-angle',
                  reaction.startingAngle + 'deg'
                )
                div.style.setProperty('--animation-duration', '2s')
                div.style.setProperty('--travel-distance', -80 + 'px')
                div.style.animationName = 'travel'

                newDOMElements.appendChild(div)
              }
            })

          if (window.reactions !== undefined) {
            window.reactions.remoteReactions
              .filter(reaction => reaction.emojiId === id)
              .forEach(reaction => {
                const delta = (new Date().getTime() - reaction.timestamp) / 1000
                if (reaction.shown && delta > 2) {
                  const staleReaction = document.getElementById(reaction.id)
                  if (staleReaction) staleReaction.remove()
                }
                if (reaction.shown === false) {
                  reaction.shown = true

                  let div = document.createElement('div')
                  div.className = 'no-interaction reaction'
                  div.textContent = reaction.type
                  div.id = reaction.id
                  div.style.animationTimingFunction = reaction.curve
                  div.style.setProperty(
                    '--starting-angle',
                    reaction.startingAngle + 'deg'
                  )
                  div.style.setProperty('--animation-duration', '2s')
                  div.style.setProperty('--travel-distance', -80 + 'px')
                  div.style.animationName = 'travel'

                  newDOMElements.appendChild(div)
                }
              })
          }

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
        <span class="no-interaction content">❤️</span>
        <div aria-live="polite" role="log" class="no-interaction">
          <div class="visually-hidden"></div>
          <div class="reactions"></div>
        </div>
      </button>
      <button aria-label="Fire reaction" id="fire">
        <span class="no-interaction content">🔥</span>
        <div aria-live="polite" role="log" class="no-interaction">
          <div class="visually-hidden"></div>
          <div class="reactions"></div>
        </div>
      </button>
      <button aria-label="Octopus reaction" id="octopus">
        <span class="no-interaction content">🐙</span>
        <div aria-live="polite" role="log" class="no-interaction">
          <div class="visually-hidden"></div>
          <div class="reactions"></div>
        </div>
      </button>
      <button aria-label="Rocket reaction" id="rocket">
        <span class="no-interaction content">🚀</span>
        <div aria-live="polite" role="log" class="no-interaction">
          <div class="visually-hidden"></div>
          <div class="reactions"></div>
        </div>
      </button>
    </section>
  `
}

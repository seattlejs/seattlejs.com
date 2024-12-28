import { createClient } from '@liveblocks/client'

function generateRandomId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  )
}

function removeStaleReactions() {
  window.reactions.remoteReactions = window.reactions.remoteReactions.filter(
    reaction => {
      const delta = (new Date().getTime() - reaction.timestamp) / 1000

      return delta < 2 + 2
    }
  )
}

const generateRandomCurveForReaction = () => {
  const randomX1 = `100%`
  const randomY1 = `100%`
  const randomX2 = `${Math.random() * 5}%`
  const randomY2 = `${Math.random() * 50 + 50}%`

  return `cubic-bezier(${randomX1}, ${randomY1}, ${randomX2}, ${randomY2})`
}

const getStartingAngleForReaction = () => {
  // Decide on whether the reaction is facing left or right.
  const direction = Math.random() < 0.5 ? 1 : -1
  // Decide the starting angle of the reaction.
  const startingAngle = Math.floor(Math.random() * 90)

  return direction * startingAngle
}

const client = createClient({
  publicApiKey:
    'pk_prod_nQme4lxwwAyBuCvk2CQP0Tve9kBh1KxeN_FUdQQqrc24qH9qYA2anmqOToNCpFyA',
})

function run() {
  const room = client.enter('javascript-todo-app', {
    initialPresence: {},
  })

  window.reactions = {
    react: undefined,
    remoteReactions: [],
    getStartingAngleForReaction,
    generateRandomCurveForReaction,
  }

  window.reactions.react = id => {
    let emoji = ''

    switch (id) {
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

    if (emoji !== '')
      room.broadcastEvent({ type: 'reaction', emoji, emojiId: id })
  }

  room.subscribe('event', ({ event }) => {
    removeStaleReactions()
    if (event.type === 'reaction') {
      window.reactions.remoteReactions.push({
        id: generateRandomId(),
        emojiId: event.emojiId,
        type: event.emoji,
        shown: false,
        timestamp: new Date().getTime(),
        curve: generateRandomCurveForReaction(),
        startingAngle: getStartingAngleForReaction(),
      })
    }
  })
}

run()

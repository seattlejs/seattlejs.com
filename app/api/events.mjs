import data from './events.json' assert { type: 'json' }
export async function get() {
  return {
    json: { data }
  }
}

export const events = data


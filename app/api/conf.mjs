import data from '../data/conf-2023.json' assert { type: 'json' }
export async function get() {
  return {
    json: { event: data }
  }
}

export const event = data

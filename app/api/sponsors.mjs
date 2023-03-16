import data from '../data/sponsors.json' assert { type: 'json' }
export async function get() {
  return {
    json: { data }
  }
}

export const sponsors = data

import data from '../data/speakers.json' assert { type: 'json' }
export async function get() {
  return {
    json: { data }
  }
}

export const speakers = data

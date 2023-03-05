import data from './speakers.json' assert { type: 'json' }
export async function get() {
  return {
    json: { data }
  }
}

export const speakers = data

import data from './organizers.json' assert { type: 'json' }
export async function get() {
  return {
    json: { data }
  }
}

export const organizers = data

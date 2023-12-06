import data from '../data/sponsors.json' assert { type: 'json' }

export async function get() {
  return {
    json: { data }
  }
}

export const sponsors = data

export function inflateSponsors(sponsor_id) {
  return sponsors.find(s => s.id === sponsor_id)
}

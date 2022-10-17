export async function get () {
  return {
    json: { events }
  }
}

export const events = [
  {
    "id": "oct-2022",
    "title": "SeattleJS October 2022",
    "date": "2022-10-12",
    "sponsors": ["svb"],
    "speakers": ["rachel-lee-nabors"]
  }
]

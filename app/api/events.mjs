export async function get () {
  return {
    json: { events }
  }
}

export const events = [
  {
    "id": "may-2022",
    "title": "SeattleJS May 2022",
    "date": "2022-10-12",
    "sponsors": ["collective-seattle"],
    "talks": ["amber-hoak-may-2022"]
  },{
    "id": "june-2022",
    "title": "SeattleJS June 2022",
    "date": "2022-10-12",
    "sponsors": ["collective-seattle"],
    "talks": ["jamund-ferguson-june-2022"]
  },
  {
    "id": "july-2022",
    "title": "SeattleJS July 2022",
    "date": "2022-10-12",
    "sponsors": ["collective-seattle"]
  },
  {
    "id": "august-2022",
    "title": "SeattleJS August 2022",
    "date": "2022-10-12",
    "sponsors": ["collective-seattle"]
  },
  {
    "id": "september-2022",
    "title": "SeattleJS September 2022",
    "date": "2022-10-12",
    "sponsors": ["collective-seattle"],
    "talks": ["rachel-lee-nabors"]
  },
  {
    "id": "october-2022",
    "title": "SeattleJS October 2022",
    "date": "2022-10-12",
    "sponsors": ["svb"],
    "talks": ["rachel-lee-nabors-october-2022"]
  },
  {
    "id": "november-2022",
    "title": "SeattleJS November 2022",
    "date": "2022-11-9",
    "sponsors": ["collective-seattle"],
    "talks": ["matthew-bauer-november-2022", "brian-gershon-november-2022"]
  }
]

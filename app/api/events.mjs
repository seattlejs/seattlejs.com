export async function get() {
  return {
    json: { events }
  }
}

export const events = [
  {
    id: 'may-2022',
    title: 'SeattleJS May 2022',
    date: '2022-10-12',
    sponsors: ['collective-seattle'],
    talks: ['amber-hoak-may-2022']
  },
  {
    id: 'june-2022',
    title: 'SeattleJS June 2022',
    date: '2022-10-12',
    sponsors: ['collective-seattle'],
    talks: ['jamund-ferguson-june-2022']
  },
  {
    id: 'july-2022',
    title: 'SeattleJS July 2022',
    date: '2022-10-12',
    sponsors: ['collective-seattle']
  },
  {
    id: 'august-2022',
    title: 'SeattleJS August 2022',
    date: '2022-10-12',
    sponsors: ['collective-seattle']
  },
  {
    id: 'september-2022',
    title: 'SeattleJS September 2022',
    date: '2022-10-12',
    sponsors: ['collective-seattle'],
    talks: ['rachel-lee-nabors']
  },
  {
    id: 'october-2022',
    title: 'SeattleJS October 2022',
    date: '2022-10-12',
    sponsors: ['svb'],
    talks: ['rachel-lee-nabors-october-2022']
  },
  {
    id: 'november-2022',
    title: 'SeattleJS November 2022',
    date: '2022-11-09',
    sponsors: ['collective-seattle'],
    talks: ['matthew-bauer-november-2022', 'brian-gershon-november-2022']
  },
  {
    id: 'december-2022',
    title: 'SeattleJS December 2022 - Holiday Party Edition',
    date: '2022-12-14',
    sponsors: ['collective-seattle'],
    talks: []
  },
  {
    id: 'january-2023',
    title: 'SeattleJS January 2023',
    date: '2023-01-11',
    sponsors: ['aws-skills-center'],
    talks: [
      'calvin-kipperman-january-2023',
      'josh-scotland-january-2023',
      'tim-obrien-january-2023'
    ],
    description:
      "Join us and celebrate a great start to 2023 with your fellow web devs!\n\nTHANK YOU to the folks at AWS Skills Center Seattle for sponsoring this month! ❤️\n\nTickets are $5 and go up to $10 the day of, so don't delay!"
  },
  {
    id: 'february-2023',
    title: 'SeattleJS February 2023',
    date: '2023-02-08',
    sponsors: ['collective-seattle', 'remix'],
    talks: [
      'brian-tran-february-2023',
      'lupe-canaviri-maydana-februrary-2023',
      'jacob-ebey-february-2023'
    ],
    description:
      "Join us and celebrate a great start to 2023 with your fellow web devs!\n\nTickets are $5 and go up to $10 the day of, so don't delay!"
  },
  {
    id: 'march-2023',
    title: 'SeattleJS March 2023',
    date: '2023-03-08',
    sponsors: ['appwrite'],
    talks: [
      'aaroh-mankad-march-2023',
      'mason-lynass-march-2023',
      'chris-griffing-march-2023'
    ],
    description:
      "Join your fellow web devs for an evening of talks, networking and fun! Tickets are only $5 but go up to $10 the day of, so don't delay!"
  }
]

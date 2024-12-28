import EventDetailsPage from '../components/EventDetails'
import PageLayout from '../components/PageLayout'
import events from '../data/events.json'

export default function Events({ id }: { id?: string }) {
  const sortedEvents = events.sort(
    (a, b) => +new Date(b.date) - +new Date(a.date),
  )

  const display = new URLSearchParams(location.search).has('email')
    ? 'email'
    : 'page'

  if (id) {
    const event = sortedEvents.find(e => e.id === id)
    if (event) {
      return <EventDetailsPage event={event} display={display} />
    } else {
      return (
        <PageLayout title="Event Not Found">
          <p>Sorry, we couldn't find that event.</p>
        </PageLayout>
      )
    }
  } else if (sortedEvents.length > 0) {
    return (
      <PageLayout title="Our Past Events">
        <div class="event-list">
          <ul>
            {sortedEvents.map(e => (
              <li key={e.id}>
                <a href={`/events/${e.id}`}>{e.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </PageLayout>
    )
  } else {
    return (
      <PageLayout title="Our Past Events">
        <p>No events at the moment.</p>
      </PageLayout>
    )
  }
}

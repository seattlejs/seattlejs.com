import { marked } from 'marked'
import { inflateEvent, type SJSEvent } from '../utils/data'
import PageLayout from './PageLayout'

const toHTML = (markdown: string): string => marked(markdown, { async: false })

export default function EventDetails({
  event: baseEvent,
  display,
}: {
  event: SJSEvent
  display: 'email' | 'page'
}) {
  const event = inflateEvent(baseEvent)
  const {
    title,
    sponsors,
    talks,
    description,
    date,
    location: initialLocation,
    link,
  } = event

  const hasTalks = talks && talks.length > 0
  const hasSponsors = sponsors && sponsors.length > 0
  let location = initialLocation

  if (display === 'email') {
    // const eventDate = new Date(date)
    // const eventDateStr = `${eventDate.getFullYear()}-${
    //   eventDate.getMonth() + 1
    // }`
    //
    // if (!location) {
    //   if (eventDateStr < '2024-07') {
    //     location = 'The Collective Seattle, 400 Dexter Ave N, Seattle, WA 98109'
    //   } else {
    //     location =
    //       'Silicon Valley Bank, 920 5th Ave Suite 300, Seattle, WA 98104'
    //   }
    // }

    return (
      <div>
        <div class="container" style={{ display: 'block', margin: '20px' }}>
          <button
            id="copy-html-btn"
            onClick={async () => {
              const holder = document.getElementById('html-contents')
              if (!holder) throw new Error('No HTML contents to copy')
              await navigator.clipboard.writeText(holder.innerHTML)
            }}
          >
            Copy HTML to clipboard
          </button>
          <div id="html-contents">
            {description && (
              <div
                dangerouslySetInnerHTML={{ __html: toHTML(description) }}
              ></div>
            )}
            {hasSponsors &&
              sponsors.map(s => (
                <div key={s.id}>
                  <p>
                    <a href={s.url}>
                      <img
                        width="200"
                        alt={`${s.name} logo`}
                        src={`https://seattlejs.com/_public/images/sponsors/${s.image}`}
                        title={`${s.name} logo`}
                      />
                    </a>
                  </p>
                  <p>
                    Special thanks to our friends at{' '}
                    <a href={s.url}>{s.name}</a> for sponsoring snacks for this
                    month's event! 😎
                  </p>
                </div>
              ))}
            <ul>
              <li>
                🗓{' '}
                {new Date(date).toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </li>
              <li>⏰ 5:30pm - 8:30pm</li>
              {location && <li>📍 {location}</li>}
              <li>
                🎟 <a href={link}>RSVP</a>
              </li>
            </ul>
            {hasTalks &&
              talks.map(t => (
                <div key={t.id}>
                  <h4
                    style={{
                      fontFamily: 'headline-gothic-atf-round, sans-serif',
                      fontWeight: 700,
                      fontSize: '24px',
                    }}
                  >
                    {t.title} by {t.speaker.name}
                  </h4>
                  <p>
                    <img
                      width="200"
                      alt={`photo of ${t.speaker.name}`}
                      src={`https://seattlejs.com/_public/images/speakers/${t.speaker.photo}`}
                      title={`photo of ${t.speaker.name}`}
                    />
                  </p>
                  {t.abstract && (
                    <p
                      dangerouslySetInnerHTML={{ __html: toHTML(t.abstract) }}
                    ></p>
                  )}
                </div>
              ))}
            <p>
              See you all on{' '}
              {new Date(date).toLocaleDateString(undefined, {
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <PageLayout title={title}>
      {description && (
        <p dangerouslySetInnerHTML={{ __html: toHTML(description) }}></p>
      )}
      <p>{location}</p>
      {hasSponsors &&
        sponsors.map(s => (
          <div key={s.id}>
            <p>
              <a href={s.url}>
                <img
                  width="200"
                  alt={`${s.name} logo`}
                  src={`https://seattlejs.com/_public/images/sponsors/${s.image}`}
                  title={`${s.name} logo`}
                />
              </a>
            </p>
            <p>
              Special thanks to our friends at <a href={s.url}>{s.name}</a> for
              sponsoring snacks for this month's event! 😎
            </p>
          </div>
        ))}
      <ul>
        <li>
          🗓{' '}
          {new Date(date).toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </li>
        <li>⏰ 5:30pm - 8:30pm</li>
        {location && <li>📍 {location}</li>}
        <li>
          🎟 <a href={link}>RSVP</a>
        </li>
      </ul>
      {hasTalks &&
        talks.map(t => (
          <div key={t.id}>
            <h4
              style={{
                fontFamily: 'headline-gothic-atf-round, sans-serif',
                fontWeight: 700,
                fontSize: '24px',
              }}
            >
              {t.title} by {t.speaker.name}
            </h4>
            <p>
              <img
                width="200"
                alt={`photo of ${t.speaker.name}`}
                src={`https://seattlejs.com/_public/images/speakers/${t.speaker.photo}`}
                title={`photo of ${t.speaker.name}`}
              />
            </p>
            {t.abstract && (
              <p dangerouslySetInnerHTML={{ __html: toHTML(t.abstract) }}></p>
            )}
          </div>
        ))}
    </PageLayout>
  )
}

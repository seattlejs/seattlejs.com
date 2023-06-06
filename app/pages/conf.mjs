export default function ({ html, state }) {
  let { store = {} } = state
  let { event } = store
  return html`
    <my-layout>
      <div id="page">
        <!-- no title needed -->
        <div class="page-body">
          <div style="text-align:center"><img width="500" src="/_public/images/seattlejsconf-2023-logo.png" alt="logo for SeattleJS Conf 2023"/></div>
          <p class="lead-in">This is the 2nd official SeattleJS conference. We are a 1-day conference for web developers that will feature 12 amazing speakers, covering the latest in web and JS development. The last time we did this was when the CascadiaJS folks took a break in 2017. They're taking another break, so we're back!</p>
          <h2>When</h2>
          <ul>
            <li>Tuesday, August 8, 2023</li>
            <li>Doors open at 8am</li>
            <li>Talks run from 9am - 5pm</li>
            <li>Closing Party runs from 7pm - midnight</li>
          </ul>
          <h2>Where</h2>
          <div><img src="https://2022.cascadiajs.com/images/past/cjs18-sponsor.jpg" alt="Amazon Meeting Center"/></div>
          <ul>
            <li>The Amazon Meeting Center</li>
            <li><a target="_blank" href="https://goo.gl/maps/vmFir1ayC8oo4pYr7?coh=178573&entry=tt">2031 7th Ave, Seattle, WA 98121</a></li>
            <li>Please use public transportation (bus or light rail) if possible.</li>
          </ul>
          <h2>Speakers</h2>
            <div class="person-list">
            ${event.talks
              .sort(() => Math.random() - 0.5) // randomize our array of speakers!
              .map(
                t => html` <view-talk
                  id="${ t.id }"
                ></view-talk>`
              )
              .join('')}
            </div>
          <h2>Sponsors</h2>
          <p>Please email info@seattlejs.com if you are interested in learning about sponsoring this event!</p>
          <div style="display:flex; flex-wrap: wrap">
            <div class="diamond">
              <view-sponsor name="AWS" url="https://docs.amplify.aws/" image="aws.png"></view-sponsor>
            </div>
            <div class="platinum">
              <view-sponsor name="Courier" url="http://courier.com?utm_campaign=q2-fy23-conference-seattlejsconf&utm_source=conference&utm_medium=website" image="courier.png"></view-sponsor>
            </div>
          </div>
          <h2>Scholarships</h2>
          <p>We are <a target="_blank" href="https://airtable.com/shrZcxLRhznKQ1sIm">accepting applications</a> for our Scholarship Program! If you are an under-represented minority in tech or need financial aid in order to attend this event, please consider applying. We want everyone to be able to attend this event! And if you are in a position to help fund this program, please consider making a donation below when you buy your ticket ❤️</p>
          <h2>Tickets</h2>
          <tito-widget event="event-loop/seattlejs-conf-2023"></tito-widget> 
        </div>
      </div>
    </my-layout>
  `
}

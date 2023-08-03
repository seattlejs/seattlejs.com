function renderSpeaker(time, talk = { speaker: {}}) {
  return /*html*/`
  <div class="show-item">
      <div class="when">${ time }</div>
      <div class="what">
          <div class="title"><a href="/talks/${ talk.id }">${ talk.title }</a></div>
          <div class="speaker">${ talk.speaker.name }</div>
      </div>
  </div>`
}

export default function ({ html, state }) {
  let { store = {} } = state
  let { event = {}, playbackId } = store
  let talks = event.talks || []
  return html`
    <style>
      .video-container {
        display: flex;
        align-items: center;
        flex-direction: column;
      }

      .schedule {
        margin: 32px 0;
      }

      .location {
        background: rgba(255, 207, 7, 0.3);
        font-family: headline-gothic-atf-round;
        font-size: 140%;
        font-weight: 500;
        line-height: 1em;
        padding: 16px;
      }

      .track h3 {
        font-size: 160%;
        font-weight: 700;    
        margin: 0;
        padding: 16px;
      }

      .main.track h3 {
        background: #FFCF07;
      } 

      .show-item {
        display: flex;
        margin: 16px;
      }

      .when {
        min-width: 50px;
        margin-right: 16px;
      }

      .what {
        flex: 1;
      }

      .what .title {
          /*font-size: 22px;*/
          font-size: 120%;
      }

      .what .title a:hover {
          text-decoration: underline;
          color: #0033FF;
      }

      .title img {
        margin-left:4px;
        height: 20px;
        vertical-align: middle; 
      }

      @media only screen and (min-width: 768px) {

      }

    </style>
    <my-layout>
      <div id="page">
        <div class="page-body">
          ${ playbackId ? /*html*/`
          <div class="video-container">
            <mux-player
              stream-type="live"
              playback-id="${ playbackId }"
              metadata-video-title="SeattleJS Conf 2023 Livestream"
              metadata-viewer-user-id="embed"
              muted="true"
              autoplay="any"
              default-hidden-captions>
            </mux-player>
	          <live-reactions />
	        </div>`
          : ``}
          <div class="schedule">
            <h2>Schedule</h2>
            <div class="main track">   
              <h3>Main Track</h3>
              <div class="location">Talk Room</div>
              <div class="show-item">       
                  <div class="when">09:00</div>
                  <div class="what"><div class="title">Opening Remarks</div></div>
              </div>
              ${ renderSpeaker("09:30", talks.find(t => t.speaker.id === 'kevin-whinnery'))}
              ${ renderSpeaker("", talks.find(t => t.speaker.id === 'eve-porcello'))}
              ${ renderSpeaker("", talks.find(t => t.speaker.id === 'ben-ilegbodu'))}
              <div class="show-item">       
                  <div class="when">10:40</div>
                  <div class="what"><div class="title"><i class="fas fa-coffee"></i> Break</div></div>
              </div>
              ${ renderSpeaker("11:15", talks.find(t => t.speaker.id === 'adam-argyle'))}
              ${ renderSpeaker("", talks.find(t => t.speaker.id === 'erik-hanchett'))}
              ${ renderSpeaker("", talks.find(t => t.speaker.id === 'daphne-liu'))}
              <div class="location">Lunch Room</div>
              <div class="show-item">       
                  <div class="when">12:40</div>
                  <div class="what"><div class="title"><i class="fas fa-taco"></i> Lunch by <img src="/_public/images/sponsors/courier.png"></div></div>
              </div>
              <div class="location">Talk Room</div>
              ${ renderSpeaker("13:45", talks.find(t => t.speaker.id === 'lizzie-siegle'))}
              ${ renderSpeaker("", talks.find(t => t.speaker.id === 'john-pham'))}
              ${ renderSpeaker("", talks.find(t => t.speaker.id === 'luis-montes'))}
              <div class="show-item">       
                  <div class="when">15:05</div>
                  <div class="what"><div class="title"><i class="fas fa-donut"></i> Break</div></div>
              </div>
              ${ renderSpeaker("15:35", talks.find(t => t.speaker.id === 'christina-zhu'))}
              ${ renderSpeaker("", talks.find(t => t.speaker.id === 'josh-goldberg'))}
              ${ renderSpeaker("", talks.find(t => t.speaker.id === 'jason-lengstorf'))}
              <div class="show-item">       
                  <div class="when">17:00</div>
                  <div class="what"><div class="title">Closing Remarks</div></div>
              </div>
            </div>
          </div>
          <section id="sponsors">
            <h2>Thank you to our Sponsors! ❤️</h2>
            <div>
              <view-sponsor tier="platinum" name="AWS" url="https://docs.amplify.aws/" image="aws.png"></view-sponsor>
            </div>
            <div>
              <view-sponsor tier="gold" name="Courier" url="http://courier.com?utm_campaign=q2-fy23-conference-seattlejsconf&utm_source=conference&utm_medium=website" image="courier.png"></view-sponsor>
              <view-sponsor tier="gold" name="Mux" url="http://mux.com" image="mux.svg"></view-sponsor>
              <view-sponsor tier="gold" name="Mux" url="http://cloudinary.com" image="cloudinary.png"></view-sponsor>
              <view-sponsor tier="gold" name="Mux" url="http://runme.dev" image="runme.png"></view-sponsor>
              <view-sponsor tier="gold" name="Mux" url="http://appwrite.io" image="appwrite.png"></view-sponsor>
            </div>
          </section>
        </div>
      </div>
    </my-layout>
  `
}

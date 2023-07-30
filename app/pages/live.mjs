export default function ({ html, state }) {
  let { store = {} } = state
  let { event = {} } = store
  let playbackId = event.playbackId || 'v69RSHhFelSm4701snP22dYz2jICy4E4FUyk02rW4gxRM'
  return html`
    <style>
    </style>
    <my-layout>
      <div id="page">
        <div class="page-body">
          <mux-player
              stream-type="live"
              playback-id="${ playbackId }"
              metadata-video-title="SeattleJS Conf 2023 Livestream"
              metadata-viewer-user-id="embed"
              muted="true"
              autoplay="any"
              default-hidden-captions>
          </mux-player>
          <div class="container">
            <div id="who_is_here" class="who_is_here"></div>
          </div>
          <h2>Thanks to our Sponsors!</h2>
          <section id="sponsors">
            <view-sponsor tier="platinum" name="AWS" url="https://docs.amplify.aws/" image="aws.png"></view-sponsor>
            <view-sponsor tier="gold" name="Courier" url="http://courier.com?utm_campaign=q2-fy23-conference-seattlejsconf&utm_source=conference&utm_medium=website" image="courier.png"></view-sponsor>
            <view-sponsor tier="gold" name="Mux" url="http://mux.com" image="mux.png"></view-sponsor>
          </section>
        </div>
      </div>
    </my-layout>
  `
}

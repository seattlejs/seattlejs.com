const fetch = require('node-fetch')
require('dotenv').config()

/**
 * This script is used to launch the conference livestream simulcast using Mux.
 *
 * 1. Run script, this will create a Mux livestream object
 * 2. Go to https://studio.twitter.com/producer/broadcasts and "Create broadcast", make it public, tweet it out
 *
 * No action needed for Twitch or YouTube, they will automatically start streaming.
 *
 * See: https://docs.mux.com/guides/video/stream-live-to-3rd-party-platforms#2-select-a-simulcast-target-supported-by-mux
 */


async function createLivestream() {
    // create a payload for the REST API call that will initialize a livestream and simulcast it to both Twitter and Twitch
    let payload = {
        playback_policy: [
          "public"
        ],
        new_asset_settings: {
          playback_policy: [
            "public"
          ]
        },
        generated_subtitles: [
          {
            name: "English CC (auto)",
            passthrough: "English closed captions (auto-generated)",
            language_code: "en-US",
            transcription_vocabulary_ids: []    
          }
        ],
        simulcast_targets : [
          /*{
            url : "rtmps://or.pscp.tv:443/x",
            stream_key : process.env.TWITTER_STREAM_KEY,
            passthrough : "SeattleJS Conf 2023 Livestream on Twitter"
          },*/
          {
            url : "rtmp://live.twitch.tv/app/",
            stream_key : process.env.TWITCH_STREAM_KEY,
            passthrough : "SeattleJS Conf 2023 Livestream on Twitch"
          },
          {
            url : "rtmp://a.rtmp.youtube.com/live2",
            stream_key : process.env.YOUTUBE_STREAM_KEY,
            passthrough : "SeattleJS Conf 2023 Livestream on YouTube"
          }
        ]
      }

    // call MUX API
    let response = await fetch(`https://api.mux.com/video/v1/live-streams`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(`${ process.env.MUX_TOKEN_ID }:${ process.env.MUX_TOKEN_SECRET }`, 'binary').toString('base64')
        },
        body:    JSON.stringify(payload),
    })
    let result = await response.json()
    console.log(result)
}

createLivestream()

import { talks } from './talks.mjs'

// This API returns all of the talks from the Talks API
export async function get () {
  return {
    json: { talks }
  }
}
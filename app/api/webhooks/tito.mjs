//import { addToCustomerIO } from "../signup.mjs"

/* TODO: this code block (addToCustomerIO) is copied from ../signup.mjs because (for some reason) importing this function
from that module threw an error */
import fetch from 'node-fetch'
export async function addToCustomerIO(first_name, last_name, email_address) {
  // set customer.io REST API headers
  let headers = {
    Authorization: `Basic ${Buffer.from(
      process.env.CIO_SITE_ID + ':' + process.env.CIO_API_KEY
    ).toString('base64')}`,
    'Content-Type': 'application/json'
  }
  // set the payload for the create/update API call
  let created_at = Math.floor(Date.now() / 1000)
  let body = JSON.stringify({
    'list-seattlejs': created_at,
    first_name,
    last_name
  })
  // call REST API to update customer
  return await fetch(
    `https://track.customer.io/api/v1/customers/${encodeURIComponent(
      email_address
    )}`,
    {
      method: 'PUT',
      headers,
      body
    }
  )
}
/* END TODO */

// process webhook requests from Tito.io, the ticketing system for SeattleJS meetups. Add these users to our mailing list.
export async function post(req) {
  let { first_name, last_name, email } = req.body
  //console.log(first_name, last_name, email)
  await addToCustomerIO(first_name, last_name, email)
  //console.log(foo)
  return { json: { ok: true } }
}

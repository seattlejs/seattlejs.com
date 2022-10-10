import fetch from 'node-fetch'
import validator from 'email-validator'

export async function post (req) {
  let { first_name, last_name, email_address } = req.body
  if (email_address && validator.validate(email_address)) {
    // set customer.io REST API headers
    let headers = {
      'Authorization': `Basic ${ Buffer.from(process.env.CIO_SITE_ID + ':' + process.env.CIO_API_KEY).toString('base64') }`,
      'Content-Type': 'application/json'
    }
    // set the payload for the create/update API call
    let created_at = Math.floor(Date.now() / 1000)
    let body = JSON.stringify({ 'list-seattlejs': created_at, first_name, last_name })
    // call REST API to update customer
    await fetch(`https://track.customer.io/api/v1/customers/${ encodeURIComponent(email_address) }`, {
      method: 'PUT', headers, body
    })
    // if a form request, redirection to next steps
    if (req.headers['content-type'] !== 'application/json') {
      return { location: '/signup-next-steps' }
    }
    else {
      console.log("Sending OK response")
      return { json: { ok: true } }
    }
  }
  else {
    return { status: 500, text: 'You must provide an email address'}
  }
}

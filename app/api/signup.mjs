import fetch from 'node-fetch'
//import validator from 'email-validator'

export async function addToCustomerIO(first_name, last_name, email_address) {
  // set customer.io REST API header
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
  await fetch(
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

export async function get() {
  return {
    location: '/404'
  }
}

export async function post(/*req*/) {
  // For the time being, we are disabling this capability until we can protect it from bots better
  /*
  let { first_name, last_name, email_address } = req.body
  if (email_address && validator.validate(email_address)) {
    if (email_address === first_name) {
      return { status: 400, text: 'No thank you, bot' }
    } else {
      await addToCustomerIO(first_name, last_name, email_address)
      return { location: '/signup-next-steps' }
    }
  } else {
    return { status: 400, text: 'You must provide an email address' }
  }
  */
  return { status: 501, text: 'This endpoint is disabled' }
}

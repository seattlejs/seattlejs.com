import data from '@begin/data'

export async function post(req) {
  let { secret, playbackId } = req.body
  console.log(secret, playbackId)
  if (secret === process.env.ADMIN_SECRET && playbackId) {
    await data.set({ table: "admin", playbackId })
    return {
      json: { 
        "result": "ok"
      }
    }
  }
  else {
    return {
      json: { 
        "error": "not authorized"
      }
    }
  }
}


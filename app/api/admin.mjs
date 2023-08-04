import data from '@begin/data'

export async function post(req) {
  let { secret, playbackId, _destroy } = req.body
  let json
  if (secret === process.env.ADMIN_SECRET && playbackId) {
    await data.set({ table: "admin", key: "playbackId", value: playbackId })
    json = { 
      "result": "success"
    }
  }
  else if (secret === process.env.ADMIN_SECRET && _destroy != undefined){
    await data.destroy({ table: "admin", key: "playbackId" })
    json = { 
      "result": "deleted"
    }
  }
  else {
    json = {
      "error": "not authorized"
    }
  }
  return { json }
}


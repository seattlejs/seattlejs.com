// This dollar sign in $slug functions as a wildcard.
// This API route captures the path requested (i.e. /signup) and passes it back.
export async function get(req) {
  let { path } = req
  return {
    json: {
      path
    }
  }
}
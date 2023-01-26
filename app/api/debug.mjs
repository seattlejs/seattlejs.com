export async function get() {
  return {
    json: { env: process.env }
  }
}

export default function Head(req = { }) {
  const { path } = req
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- ${ path } -->
        <title>SeattleJS</title>
        <link rel="stylesheet" href="/styles/main.css">
        <link rel="icon" href="/_public/favicon.ico">
        <link rel="stylesheet" href="https://use.typekit.net/nln6hzq.css">
      </head>
    `
}
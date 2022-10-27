export default function Head(state) {
  //const { store, status, req, error } = state
  const { store } = state
  //const { path } = req
  const { title } = store 
  //console.log(path, store, status, req, error)
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>SeattleJS ${ title ? ` - ${ title }`: `` }</title>
        <link rel="stylesheet" href="/_public/styles/main.css">
        <link rel="icon" href="/_public/favicon.ico">
        <link rel="stylesheet" href="https://use.typekit.net/nln6hzq.css">
      </head>
    `
}
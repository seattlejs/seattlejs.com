function getBaseUrl() {
  let url
  if (process.env.ARC_ENV === 'testing') {
      url = 'http://localhost:3333'
  }
  else  {
      url = `https://${ process.env.ARC_ENV === 'staging' ? 'staging.' : '' }seattlejs.com`
  }
  return url
}

export default function Head(state) {
  const { store, req /*, status, error*/ } = state
  const { path } = req
  const baseUrl = getBaseUrl()
  const { title } = store
  //console.log(path, store, status, req, error)
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>SeattleJS ${title ? ` - ${title}` : ``}</title>
        <meta name="description" content="SeattleJS is the largest JavaScript and web developer meetup in Seattle. Our meetings are the 2nd Wednesday of each month. We are an inclusive community and welcome everyone, including folks who are just getting started in tech.">
        <link rel="stylesheet" href="/_public/styles/main.css">
        <link rel="icon" href="/_public/favicon.ico">
        <link rel="stylesheet" href="https://use.typekit.net/nln6hzq.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css" integrity="sha512-rO+olRTkcf304DQBxSWxln8JXCzTHlKnIdnMUwYvQa9/Jd4cQaNkItIUj6Z4nvW1dqK0SKXLbn9h4KwZTNtAyw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        ${ path === '/conf' 
          ? `
          <script src="https://js.tito.io/v2" async></script>
          <meta name="image" property="og:image" content="${ baseUrl }/_public/images/seattlejsconf-share.jpg" />
          <meta name="url" property="og:url" content="${ baseUrl }/conf" />
          <meta name="type" property="og:type" content="website" />
          <meta name="author" content="Carter Rabasa">
          <meta property="og:title" content="SeattleJS Conf- August 8, 2023" />
          <meta name="twitter:image" content="${ baseUrl }/_public/images/seattlejsconf-share.jpg">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:site" content="@seattlejs">
          <meta name="twitter:title" content="SeattleJS Conf - August 8, 2023">
        `: ''}
      </head>
    `
}

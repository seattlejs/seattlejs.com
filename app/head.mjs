export default function Head(state) {
  const { store, req /*, status, error*/ } = state
  const { path } = req
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
        ${ path === '/conf' 
          ? `
          <script src="https://js.tito.io/v2" async></script>
          <meta name="image" property="og:image" content="https://seattlejs.com/_public/images/seattlejsconf-share.jpg" />
          <meta name="url" property="og:url" content="https://seattlejs.com/conf" />
          <meta name="type" property="og:type" content="website" />
          <meta name="author" content="Carter Rabasa">
          <meta property="og:title" content="SeattleJS Conf- August 8, 2023" />
          <meta name="twitter:image" content="https://seattlejs.com/_public/images/seattlejsconf-share.jpg">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:site" content="@seattlejs">
          <meta name="twitter:title" content="SeattleJS Conf - August 8, 2023">
        `: ''}
      </head>
    `
}

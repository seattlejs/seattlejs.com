# SeattleJS Website

## Getting started

- clone this repo
- `npm i`
- `npm start` to start dev server
- `npm run build` to build production assets

## Platform and Services

This website is built on [Astro](https://astro.build/) and deploys to [GitHub Pages](https://pages.github.com/).

## Astro Structure

Astro is an HTML web framework that supports file-based routing and is statically rendered by default but can be configured to support client-side islands and server rendering and functions.

An Astro app has two top-level directories: `src` and `public`.

### The `src` Directory

The `src` directory contains all the code for our application, in addition to Markdown files that power many of the static webpages. All subdirectories (expect for `pages`) are our custom directories and not required by Astro.

Here's a brief rundown of each subdirectory and its purpose:

- `pages` - routes that Astro will generate into HTML files for us to upload to GitHub pages. Each file in this directory will be a separate page on the site. The file name will be the path of the page. For example, `pages/speakers.astro` will be the `/speakers` page on the site. Markdown files are also converted to HTML and served as is
- `components` - Resuable custom Astro components that pages will import and render
- `data` - JSON files that include data that pages can import and render
- `images` - Images that Astro components will import and render. These images are not by default served unless an Astro page/component imports it and renders it
- `layouts` - Astro components that contain the layout our of site that other pages render into
- `scripts` - Client-side JavaScript files that Astro pages will render scripts to run in the browser
- `styles` - CSS files that Astro pages will import and render to the browser
- `utils` - Server-side JavaScript files that Astro pages will invoke to render pages on the server

### The `public` Directory

This contains static files (images, css, etc) that are served as is. Astro does not modify these files. Many of these files are nested under a `_public` directory. This is done to preserve existing URLs that our previous site setup.

## Contributions

If you would like to make a contribution, please fork this repo and send us a pull request.

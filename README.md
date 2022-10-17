# SeattleJS Website

## Platform and Services

This website is built on [Enhance](https://enhance.dev) and deploys to [Begin](https://begin.com). 

It currently depends on the following external services:

- [Customer.io](https://customer.io) - Mailing list

## Enhance Structure

Enhance is an opinionated HTML web framework that renders pages on the server and supports [progressive enhancement](https://enhance.dev/docs/learn/why-enhance) on the client for SPA-like experiences. 

An Enhace app has two top-level directories: `app` and `public`. 

### The `app` Directory

The `app` directory contains all the code for our application, in addition to Markdown files that power many of the static webpages. 

Disclaimer: Enhance is a new and rapidly changing web framework. We will do our best to keep this README up to date, but please reference the Enhance docs as the source of truth.

Here's a brief rundown of each subdirectory and its purpose:

- `api` - controllers for paths in our web app, they generally call APIs and load data, which is passed to the view logic in `pages`
- `elements` - custom elements that render and expand on the server
- `md` - static Markdown files
- `pages` - views (generally in HTML) that, if needed, render data passed from their API controller

### The `public` Directory

This contains static files (images, css, etc). 

Enhance makes all of these files available via the special `/_public/` path off the root. In addition, this project has turned on fingerprinting, so when you deploy a file to the cloud (i.e. `/images/logo.png`), its filename is re-written with a unique hash attached (i.e. `/images/logo-abc123.png`) and when you reference this file in your markup (using just `/images/logo.png`), Enhance will re-write the response to the client on-the-fly to reference the filename with the attached hash.

## App Design

For the most part, file-based routing makes it pretty clear what paths are supported by our app. For instance, the existence of `pages/speakers.mjs` tells you that the app supports a `/speakers` web page. 

Pages that require data to render are paired with an identically names JS file in the `api` directory. At the moment, all of the data is being stored as static JS data in the API files, but this may change in the future.

There are two files named `$stub.mjs` that live in the `api` and `pages` directories. The dollar sign ($) functions as a wildcard and catches paths that are not defined by named files. This enables us to render Markdown files from the `md` directory based on the path requested:

- `/foo` will render `md/foo.md`
- `/foo/bar` will render `md/foo/bar.md`

If there is no Markdown file that matches the path, a 404 error will be returned.


## Install

- clone this repo
- `npm i`

## Setup

If you need to run/test the mailing list subscription action (`POST /signup`) you will need to configure the following environment variables: `CIO_SITE_ID`, `CIO_API_KEY`, `CIO_APP_KEY`

## Run dev server

`npm start`

## Making contributions

If you would like to make a contribution, please fork this repo and send us a pull request.

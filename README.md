# SeattleJS Website

## Architecture

This website is built on [Enhance](https://enhance.dev) and deploys to [Begin](https://begin.com). It currently depends on the following external services:

- [Customer.io](https://customer.io) - Mailing list

## App Design

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

## Install

- clone this repo
- `npm i`

## Setup

If you need to run/test the mailing list subscription action (`POST /signup`) you will need to configure the following environment variables: `CIO_SITE_ID`, `CIO_API_KEY`, `CIO_APP_KEY`

## Run dev server

`npm start`

## Making contributions

If you would like to make a contribution, please fork this repo and send us a pull request.
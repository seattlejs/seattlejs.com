import bryanHughes from "../src/images/speakers/bryan-hughes.jpg";
import johnDavidDalton from "../src/images/speakers/john-david-dalton.jpg";
import katMarchan from "../src/images/speakers/kat-marchan.jpg";
import marcySutton from "../src/images/speakers/marcy-sutton.jpg";
import patrickKettner from "../src/images/speakers/patrick-kettner.png";
import rebeccaMurphey from "../src/images/speakers/rebecca-murphy.jpg";

export default [
  {
    name: "Marcy Sutton",
    image: marcySutton,
    title: "JavaScript and Civil Rights",
    bio: `Marcy Sutton works on web accessibility tools at Deque Systems, a company focused on
      digital equality. In 2016, O'Reilly gave Marcy a Web Platform Award for her work in
      accessibility. She loves co-leading the Accessibility Seattle meetup and is starting a code
      and coffee club for Girl Develop It in Bellingham.`,
    synopsis: `We have an opportunity to improve the Web for people with disabilities with every
      test or commit, anywhere in the world. In the United States, accessibility guidelines have
      been established–and utilized by other countries–but compliance laws are still evolving.
      There is also increasing uncertainty surrounding civil and disability rights. Now more than
      ever, we must do more to promote access and safety, security, and privacy. It's our duty to
      design and develop digital experiences that also honor our users' rights to inclusion–no
      matter where they live, or how they access the Web. You can use your JavaScript skills for
      the good of the people, and I'll show you how.`
  },
  {
    name: "Patrick Kettner",
    image: patrickKettner,
    title: "JavaScript Without JavaScript",
    bio: `Patrick won an 8th grade talent show singing Gloria Gaynor's "I Will Survive", and things
      have been looking up ever since. Trading in the microphone to become a PM on Microsoft Edge
      and lead developer on Modernizr, he now lives with his partner Katrina, son Holden, and dog
      Baxter.`,
    synopsis: `With the help of a handful of amazing open source programs, we can now transpile
      nearly any programming language to JS, making it a sort of modern assembly language. In a fun
      and code heavy talk, I'll show how you can leverage pre existing libraries today in order to
      get amazing performance and features in your current web apps, creating possibilities you
      never dreamt possible in the web browser. To top it off, a sneak peak into what the future of
      web perf will look like.`
  },
  {
    name: "Rebecca Murphey",
    image: rebeccaMurphey,
    title: "You Can't Always Get What You Want: Leading Front-End Change",
    bio: `Rebecca Murphey leads the front-end engineering organization at Indeed. She lives in
      Austin with her partner, their son, their dog, and 10 chickens. Find her @rmurphey.`,
    synopsis: `In August, it will be a year and a half since I joined Indeed to grow our front-end
      engineering capabilities. In this talk, I'll share some hard-earned lessons – and probably a
      regret or two – about influencing developers, managers, and product owners across a large
      engineering organization; and about prioritizing a seemingly endless stream of demands and
      opportunities as I worked to grow the front-end specialization at Indeed beyond a team of
      one.`
  },
  {
    name: "Kat Marchán",
    image: katMarchan,
    title: "npm@5: Bringing JS Package Management into the Future",
    bio: `Kat Marchán is an active open source maintainer, a recovering Lisp hacker, and one of the
      core developers for the npm CLI, the JavaScript package manager.`,
    synopsis: `npm released npm@5 back in May, with a huge list of changes meant to overhaul the
      npm CLI. In this talk, Kat will go over some of the more exciting features, the secret alien
      technology behind them, and offer a peek into what more to expect in the future.`
  },
  {
    name: "John-David Dalton",
    image: johnDavidDalton,
    title: "ECMAScript Modules: Fury Road",
    bio: `JavaScript tinkerer, bug fixer, & benchmark runner • Creator of Lodash • Former Chakra
      Perf PM • Current Web Apps & Frameworks PM @Microsoft.`,
    synopsis: `Despite the rise of ES6, CommonJS rules the land forcing fans of ECMAScript modules
      to use special file extensions or cumbersome build steps. Will a code warrior emerge to save
      the day? Tune in to find out.`
  },
  {
    name: "Bryan Hughes",
    image: bryanHughes,
    title: "The Node.js Event Loop: Not So Single Threaded",
    bio: `Bryan Hughes is a technical evangelist at Microsoft, a member of the
      <a href="https://github.com/nodejs/TSC" target="_blank">Node.js Technical Steering
      Committee</a>, and chairperson of the
      <a href="https://github.com/nodejs/community-committee" target="_blank">Node.js Community
      Committee</a>. Bryan is also the creator of
      <a href="https://github.com/nebrius/raspi-io/" target="_blank">Raspi IO</a>, a Raspberry Pi
      plugin for the <a href="http://johnny-five.io" target="_blank">Johnny-Five</a> JavaScript
      robotics library. Outside of tech, Bryan is an
      <a href="http://500px.com/nebrius" target="_blank">amateur photographer</a>,
      <a target="_blank" href="https://medium.com/@nebrius">occasional writer</a>, a once upon a
      time pianist, and a wine aficionado.`,
    synopsis: `You've heard Node.js is single threaded. It's true that all JavaScript executed by
      Node.js is run in a single thread, but JS isn't all. The event loop, written in C++, is multi
      threaded! Come learn how the event loop works, how it affects performance, and how you can
      use it your advantage!`
  }
];

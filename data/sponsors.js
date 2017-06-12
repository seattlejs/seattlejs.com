import alexaLogo from "../src/images/sponsors/alexaLogo.png";
import formidableLogo from "../src/images/sponsors/formidable-logo-black.png";
import galvanizeLogo from "../src/images/sponsors/galvanize.png";
import imdbLogo from "../src/images/sponsors/imdb.png";
import npmLogo from "../src/images/sponsors/npm-logo.png";
import sitepenLogo from "../src/images/sponsors/sitepen.png";
import zillowLogo from "../src/images/sponsors/zillow.png";

export default {
  presenting: [
    {
      image: formidableLogo,
      body: `Formidable is a Seattle-based consultancy and open-source shop, with an emphasis on
        Node.js and React.js. For our clients, Formidable is the choice when big or complex software
        projects need expert help. For us, quality is paramount in everything we do. Quality
        software scales, performs better, and leads to more happiness and an improved bottom line.
        We approach each project with a long term view, with sustainability and maintainability at
        the core of our decisions. Take a look at how we've helped household names construct some of
        the most visited sites and apps on earth.`,
      url: "http://formidable.com/"
    },
  ],
  diamond: [
  ],
  platinum: [
    {
      image: alexaLogo,
      body: `Alexa is Amazon's voice service and the brain behind millions of devices, including
        Amazon Echo. We believe voice is the future of technology interaction, providing a natural
        interface to make complex things simple. Are you passionate about building the world of
        tomorrow? If so, join us!`,
      url: "https://www.amazon.jobs/en/business_categories/alexa"
    }
  ],
  gold: [
    {
      image: imdbLogo,
      body: `IMDb is the #1 movie website in the world with a combined web and mobile audience of
        more than 250 million unique monthly visitors.`,
      url: "http://www.imdb.com/"
    }
  ],
  silver: [
    {
      image: zillowLogo,
      url: "https://www.zillow.com/",
    },
    {
      image: galvanizeLogo,
      url: "https://www.galvanize.com/seattle/web-development",
    }
  ],
  community: [
    {
      image: npmLogo,
      url: "https://www.npmjs.com/"
    },
    {
      image: sitepenLogo,
      url: "https://www.sitepen.com/"
    }
  ]
};

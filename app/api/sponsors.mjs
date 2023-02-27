export async function get() {
  return {
    json: { sponsors }
  }
}

export const sponsors = [
  {
    id: 'collective-seattle',
    url: 'https://www.collectiveseattle.com',
    image: 'collective.webp'
  },
  {
    id: 'svb',
    url: 'https://www.svb.com/startup-banking',
    image: 'svb.svg'
  },
  {
    id: 'aws-skills-center-seattle',
    url: 'https://aws.amazon.com/training/skills-centers/seattle-skills-center/',
    image: 'aws-skills-center-seattle.png'
  },
  {
    id: 'formidable',
    url: 'https://formidable.com',
    image: 'formidable.svg'
  },
  {
    id: 'customer-io',
    url: 'https://customer.io/',
    image: 'customer-io.svg'
  },
  {
    id: 'remix',
    url: 'https://remix.run/',
    image: 'remix.png'
  },
  {
    id: "Appwrite",
    url: "https://appwrite.io",
    image: "Appwrite.jpg"
  }
]

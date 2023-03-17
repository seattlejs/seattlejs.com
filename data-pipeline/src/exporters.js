import fs from 'fs/promises'
import path from 'path'

const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms))

export const exportImages = async (imageObjects, type) => {
  const IMAGE_DIRS = {
    speakers: '../public/images/speakers',
    sponsors: '../public/images/sponsors'
  }

  for (let imageObj of imageObjects) {
    // need to prevent getting rate-limited
    await sleep(250)
    if (imageObj.image && imageObj.filename) {
      const imageUri = imageObj.image
      const filePath = path.join(IMAGE_DIRS[type], imageObj.filename)
      console.log('exporting', filePath)
      await downloadFile(imageUri, filePath)
    }
  }
}

export const exportData = async (jsData, type) => {
  const JSON_FILES = {
    events: '../app/data/events.json',
    speakers: '../app/data/speakers.json',
    talks: '../app/data/talks.json',
    sponsors: '../app/data/sponsors.json'
  }
  console.log('exporting', JSON_FILES[type])

  const json = JSON.stringify(jsData, null, 4)
  await fs.writeFile(JSON_FILES[type], json)
}

import Fs from 'fs'
import Https from 'https'

/**
 * Download a file from the given `url` into the `targetFile`.
 * Shamelessly stolen from https://futurestud.io/tutorials/node-js-how-to-download-a-file
 *
 * @param {String} url
 * @param {String} targetFile
 *
 * @returns {Promise<void>}
 */
async function downloadFile(url, targetFile) {
  return await new Promise((resolve, reject) => {
    Https.get(url, response => {
      const code = response.statusCode ?? 0

      if (code >= 400) {
        return reject(new Error(response.statusMessage))
      }

      // handle redirects
      if (code > 300 && code < 400 && !!response.headers.location) {
        return resolve(downloadFile(response.headers.location, targetFile))
      }

      // save the file to disk
      const fileWriter = Fs.createWriteStream(targetFile).on('finish', () => {
        resolve({})
      })

      response.pipe(fileWriter)
    }).on('error', error => {
      reject(error)
    })
  })
}

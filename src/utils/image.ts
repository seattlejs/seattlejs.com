type ImageGlobResult = Record<
  string,
  () => Promise<{
    default: ImageMetadata
  }>
>

/**
 * When using `import.meta.glob` without any options or with `{eager: false}`,
 * use this function to import a single image from the glob.
 *
 * Useful when you want to dynamically import a single image from a folder.
 * @param imageGlob The results of `import.meta.glob` without any options or with
 * `{eager: false}`
 * @param fileName The file name of the image to import
 * @returns The imported image metadata
 */
export async function importImage(
  imageGlob: ImageGlobResult,
  fileName: string,
): Promise<ImageMetadata> {
  const imageMetadata = await Object.entries(imageGlob)
    .filter(([key]) => key.endsWith(fileName))
    .map(async ([, value]) => {
      return (await value()).default
    })[0]

  if (!imageMetadata) {
    throw new Error(`Image not found with filename "${fileName}"`)
  }

  return imageMetadata
}

type ImageGlobSyncResult = Record<
  string,
  {
    default: ImageMetadata
  }
>

/**
 * When using `import.meta.glob` with `{eager: true}`, use this function to find
 * a single image from the glob.
 * @param imageGlob The results of `import.meta.glob` with the {eager: true}
 * option set
 * @param fileName The file name of the image to find
 * @param optional Whether or not to throw an error if the image is not found
 */
export function findImage<T extends boolean = false>(
  imageGlob: ImageGlobSyncResult,
  fileName: string,
  optional?: T,
): T extends true ? ImageMetadata | null : ImageMetadata {
  const imageMetadataKey = Object.keys(imageGlob).find(key =>
    key.endsWith(`/${fileName}`),
  )

  if (imageMetadataKey) {
    return imageGlob[imageMetadataKey].default
  } else if (optional) {
    return null as T extends true ? ImageMetadata | null : never
  } else {
    throw new Error(`Image not found with filename "${fileName}"`)
  }
}

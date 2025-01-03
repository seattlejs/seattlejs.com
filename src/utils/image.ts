type ImageGlobResult = Record<
  string,
  () => Promise<{
    default: ImageMetadata
  }>
>

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

import { getImages, getImageUrl, isValidImage } from "../utils/gallery"

export default async () => {
  try {
    const images = await getImages()
    const imageUrls = images
      .map(getImageUrl)
      .filter(isValidImage)
    return Response.json(imageUrls)
  } catch (error) {
    return Response.json({ error: "Failed to retrieve images." }, { status: 500 })
  }
}

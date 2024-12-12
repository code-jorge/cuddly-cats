import { getImageName, getThumbnailName, resize, upload } from '../utils/upload'

export default async (request) => {
  try {
    // Validate params
    const { imageUrl } = await request.json()
    if (!imageUrl) return Response.json({ error: "Image URL and name are required." }, { status: 400 })
    // Generate a unique image name
    const imageName = getImageName()
    // Fetch the image from the URL
    const response = await fetch(imageUrl)
    if (!response.ok) throw new Error("Failed to fetch image from URL.")
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    // Upload to S3
    await upload(buffer, imageName)
    // Generate a thumbnail
    const thumbnailBuffer = await resize(buffer)
    const thumbnailName = getThumbnailName(imageName)
    await upload(thumbnailBuffer, thumbnailName)
    // Return success response
    return Response.json({ message: "Image uploaded successfully." })
  } catch (error) {
    console.error("Error uploading to S3:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

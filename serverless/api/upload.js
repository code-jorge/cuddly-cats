import { getImageName, getThumbnailName, resize, upload } from '../utils/upload'
import { getStore } from "@netlify/blobs"

export default async (request) => {
  try {
    // Validate params
    const { id } = await request.json()
    if (!id) return Response.json({ error: "Image ID is required." }, { status: 400 })

    // Get image from blob storage
    const store = getStore("images")
    const imageData = await store.get(id)
    if (!imageData) return Response.json({ error: "Image not found" }, { status: 404 })

    const { content } = JSON.parse(imageData)
    if (!content) return Response.json({ error: "Image content not found" }, { status: 404 })

    // Convert base64 to buffer
    const buffer = Buffer.from(content, 'base64')

    // Generate a unique image name using the request ID
    const imageName = `${id}.png`

    // Upload to S3
    await upload(buffer, imageName)

    // Generate a thumbnail
    const thumbnailBuffer = await resize(buffer)
    const thumbnailName = getThumbnailName(imageName)
    await upload(thumbnailBuffer, thumbnailName)

    // Return success response
    return Response.json({ 
      message: "Image uploaded successfully.",
      imageName,
      thumbnailName
    })
  } catch (error) {
    console.error("Error uploading to S3:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

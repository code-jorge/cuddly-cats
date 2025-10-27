import { getStore } from "@netlify/blobs"
import { uploadVideo } from '../utils/upload.js'
import { downloadVideo, checkVideo } from "../utils/video.js"

export const config = {
  schedule: "*/5 * * * *" // Every 5 minutes
}

export default async () => {
  try {
    const store = getStore("videos")
    // List all videos in the blob store
    const { blobs } = await store.list()
    if (!blobs || blobs.length === 0) return Response.json({ success: true, message: "No videos to process" })
    for (const blob of blobs) {
      try {
        const { key } = blob
        const videoData = await store.get(key)
        if (!videoData) continue
        const data = JSON.parse(videoData)
        // Check video status before attempting to download
        const status = await checkVideo(data.id)
        if (status === "completed") {
          const buffer = await downloadVideo(data.id)
          const timestamp = data.created_at ? data.created_at : Date.now()
          const filename = `cat-video-${timestamp}.mp4`
          await uploadVideo(buffer, filename)
        } 
        if (status === "completed" || status === "failed") {
          await store.delete(key)
        }
      } catch (error) {
        errorCount++
      }
    }
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

import { getStore } from "@netlify/blobs"
import { uploadVideo } from '../utils/upload.js'
import { downloadVideo, checkVideo } from "../utils/video.js"
import { log } from "../utils/log.js"

export const config = {
  schedule: "*/5 * * * *" // Every 5 minutes
}

export default async () => {
  log("Starting scheduled video processing...")
  const store = getStore("videos")
  // List all videos in the blob store
  const { blobs } = await store.list()
  if (!blobs || blobs.length === 0) return Response.json({ success: true, message: "No videos to process" })
  log(`Found ${blobs.length} videos to process.`)
  for (const blob of blobs) {
    try {
      const { key } = blob
      log(`Processing video with key: ${key}`)
      const data = await store.get(key, { type: 'json' })
      if (!data) continue
      // Check video status before attempting to download
      const video = await checkVideo(data.id)
      const { status, progress } = video
      log(`Video ID: ${data.id} has status: ${status}, progress: ${progress}`)
      if (status === "completed") {
        const buffer = await downloadVideo(data.id)
        const timestamp = data.created_at ? data.created_at : Date.now()
        const filename = `cat-video-${timestamp}.mp4`
        log(`Uploading video ID: ${data.id} as ${filename}`)
        await uploadVideo(buffer, filename)
      }
      if (status === "completed" || status === "failed") {
        log(`Deleting video with key: ${key}`)
        await store.delete(key)
      }
      if (status === "queued" || status === "in_progress") {
        log(`Video ID: ${data.id} still processing, updating blob`)
        await store.setJSON(key, {
          ...data,
          status,
          progress: status === "queued" ? 0 : (progress || 0),
          last_checked: Date.now()
        })
      }
    } catch (error) {
      log(`Error processing video ${blob.key}: ${error.message}`)
    }
  }
}

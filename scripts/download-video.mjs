import { writeFile } from 'node:fs/promises'

const OPENAI_API_KEY = process.env.PROJECT_OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1'

const videoId = process.argv[2]
const outputPath = process.argv[3] || `video-${videoId}.mp4`

if (!videoId) {
  console.error('Usage: node scripts/download-video.mjs <video-id> [output-path]')
  process.exit(1)
}

if (!OPENAI_API_KEY) {
  console.error('Missing PROJECT_OPENAI_API_KEY environment variable')
  process.exit(1)
}

const response = await fetch(`${OPENAI_API_URL}/videos/${videoId}/content`, {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
})

if (!response.ok) {
  const error = await response.text()
  console.error(`Failed to download video (${response.status}):`, error)
  process.exit(1)
}

const arrayBuffer = await response.arrayBuffer()
const buffer = Buffer.from(arrayBuffer)
await writeFile(outputPath, buffer)
console.log(`Downloaded video to ${outputPath} (${buffer.length} bytes)`)

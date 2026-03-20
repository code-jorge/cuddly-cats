const OPENAI_API_KEY = process.env.PROJECT_OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1'

const videoId = process.argv[2]

if (!videoId) {
  console.error('Usage: node scripts/check-video.mjs <video-id>')
  process.exit(1)
}

if (!OPENAI_API_KEY) {
  console.error('Missing PROJECT_OPENAI_API_KEY environment variable')
  process.exit(1)
}

const response = await fetch(`${OPENAI_API_URL}/videos/${videoId}`, {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
})

if (!response.ok) {
  const error = await response.text()
  console.error(`Failed to retrieve video (${response.status}):`, error)
  process.exit(1)
}

const video = await response.json()
console.log(JSON.stringify(video, null, 2))

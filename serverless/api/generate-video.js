import { getVideo, getPrompt } from '../utils/video'
import { getWords } from '../utils/words'
import { getStore } from "@netlify/blobs"

export default async () => {
  try {
    const store = getStore("videos")
    const tags = getWords(2)
    // Generate prompt and video
    const prompt = getPrompt(tags)
    const response = await getVideo(prompt)
    // Store video data in blobs
    await store.setJSON(response.id, response)
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

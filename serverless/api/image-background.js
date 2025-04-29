import { getImage, getPrompt } from '../utils/image'
import { getStore } from "@netlify/blobs"

export const config = {
  background: true
}

export default async (request, context) => {
  try {
    const store = getStore("images")
    const { tags, id } = await request.json()
    
    if (!tags || !Array.isArray(tags)) {
      return Response.json({ error: "Tags are required as an array." }, { status: 400 })
    }
    if (!id) {
      return Response.json({ error: "ID is required." }, { status: 400 })
    }

    const prompt = getPrompt(tags)
    const response = await getImage(prompt)
    const data = await response.json()
    
    if (!response.ok) {
      return Response.json({ error: data.error.message }, { status: response.status })
    }

    const imageData = {
      content: data.data[0].b64_json,
      id,
      timestamp: new Date().toISOString(),
      tags
    }

    await store.setJSON(id, imageData)
    return Response.json({ success: true, id })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

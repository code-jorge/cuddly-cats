import { getImage, getPrompt } from '../utils/image'

export default async (request) => {
  try {
    const { tags } = await request.json()
    if (!tags || !Array.isArray(tags)) return Response.json({ error: "Tags are required as an array." }, { status: 400 })
    const prompt = getPrompt(tags)
    const response = await getImage(prompt)
    const data = await response.json()
    if (!response.ok) return Response.json({ error: data.error.message }, { status: response.status })
    return Response.json({ url: data.data[0].url })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

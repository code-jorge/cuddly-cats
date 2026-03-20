import { getStore } from "@netlify/blobs"

export default async () => {
  try {
    const store = getStore("videos")
    const { blobs } = await store.list()
    if (!blobs || blobs.length === 0) {
      return Response.json({ pending: false })
    }
    const { key } = blobs[0]
    const data = await store.get(key, { type: 'json' })
    if (!data) return Response.json({ pending: false })
    return Response.json({
      pending: true,
      status: data.status || "queued",
      progress: data.progress || 0,
      last_checked: data.last_checked || null
    })
  } catch (error) {
    return Response.json({ pending: false })
  }
}

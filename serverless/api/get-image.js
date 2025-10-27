import { getStore } from "@netlify/blobs";

export default async (request) => {
  try {
    const store = getStore("images");
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return Response.json({ error: "Image ID is required" }, { status: 400 });
    const data = await store.get(id);
    if (!data) return Response.json({ error: "Image not found" }, { status: 404 });
    const imageData = JSON.parse(data)
    return Response.json(imageData);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

import { getStore } from "@netlify/blobs";

export const config = {
  schedule: "@weekly"
}

export default async () => {
  const store = getStore("images");
  const currentTime = new Date();
  const expirationTime = 36 * 60 * 60 * 1000; // 36 hours in milliseconds
  const blobs = await store.list();
  let deletedCount = 0;
  for (const blobKey of blobs) {
    const blobData = await store.get(blobKey);
    if (!blobData || !blobData.timestamp) continue;
    const blobTime = new Date(blobData.timestamp);
    const age = currentTime - blobTime;
    if (age > expirationTime) {
      await store.delete(blobKey);
      deletedCount++;
    }
  }
  return Response.json({ success: true, message: `Cleanup completed. Deleted ${deletedCount} old blobs.` });
}

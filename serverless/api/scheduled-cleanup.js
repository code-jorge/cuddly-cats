import { getStore } from "@netlify/blobs";

export const config = {
  schedule: "@weekly"
}

export default async (request, context) => {
  try {
    const store = getStore("images");
    const currentTime = new Date();
    const expirationTime = 36 * 60 * 60 * 1000; // 36 hours in milliseconds
    
    // List all blobs
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

    return Response.json({
      success: true,
      message: `Cleanup completed. Deleted ${deletedCount} old blobs.`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

const fetchTags = async ()=> {
  try {
    const response = await fetch('/api/words')
    const { tags } = await response.json()
    return tags
  } catch (error) {
    logError("Error fetching tags", error)
    showError("Failed to fetch today's cat theme.")
    return []
  }
}

const fetchCatImage = async (tags)=> {
  try {
    const response = await fetch('/api/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tags }),
    })
    const data = await response.json()
    if (data.url) return data.url
    else throw new Error(data.error || "Unknown error occurred")
  } catch (error) {
    logError("Error fetching cat image", error)
    showError("Failed to generate the cat image.")
    return null
  }
}

const uploadImageToS3 = async (url)=> {
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: url }),
    })
    const data = await response.json()
    if (response.ok) {
      showSuccess("Image saved to album")
      return true
    }
    else throw new Error(data.error || "Unknown error occurred")
  } catch (error) {
    logError("Error uploading image", error)
    showError("Failed to upload the image.")
    return false
  }
}

const fetchGallery = async ()=> {
  try {
    const response = await fetch('/api/gallery')
    const urls = await response.json()
    return urls
  } catch (error) {
    logError("Error fetching gallery", error)
    showError("Failed to fetch the gallery.")
    return []
  }
}
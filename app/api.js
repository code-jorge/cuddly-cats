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
    const response = await fetch('/api/image-upload', {
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

const fetchGallery = async (page = 1)=> {
  try {
    const response = await fetch(`/api/image-gallery?page=${page}`)
    const data = await response.json()
    return data
  } catch (error) {
    logError("Error fetching gallery", error)
    showError("Failed to fetch the gallery.")
    return { images: [], pagination: { currentPage: 1, totalPages: 0, totalImages: 0 } }
  }
}

const fetchVideoGallery = async (page = 1)=> {
  try {
    const response = await fetch(`/api/video-gallery?page=${page}`)
    const data = await response.json()
    return data
  } catch (error) {
    logError("Error fetching video gallery", error)
    showError("Failed to fetch the video gallery.")
    return { videos: [], pagination: { currentPage: 1, totalPages: 0, totalVideos: 0 } }
  }
}
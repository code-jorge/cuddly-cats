const imageElement = document.getElementById('cat-image')
const generateButtonElement = document.getElementById('generate-button')
const generateIndicator = document.getElementById('generate-text')
const imageActionButtons = document.getElementById('buttons')
const uploadButtonElement = document.getElementById('upload-button')
const retryButtonElement = document.getElementById('retry-button')

const MAX_ATTEMPTS = 15
const INTERVAL = 5000

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))  

const renderTags = (tags) => {
  const tagsElement = document.getElementById('tags')
  if (tags.length > 0) tagsElement.innerHTML = `
    <span>Today's Cat Theme:</span>${' '}
    <span class="tag" data-index="0">${tags[0]}</span>
    ${' '}and${' '}
    <span class="tag" data-index="1">${tags[1]}</span>
  `
  else tagsElement.textContent = "Unable to fetch today's cat theme."
}

const isLoading = (element)=> getAttribute(element, 'loading') === 'true'

const setLoading = (loading)=> {
  setAttribute(generateButtonElement, 'loading', loading)
  setAttribute(uploadButtonElement, 'loading', loading)
  setAttribute(retryButtonElement, 'loading', loading)
}

document.addEventListener("DOMContentLoaded", async () => {

  // Fetch tags on page load
  const tags = await fetchTags()
  renderTags(tags)

  // Generate image
  generateButtonElement.addEventListener('click', async () => {
    if (isLoading(generateButtonElement)) return
    if (tags.length === 0) {
      showError("Cannot generate a cat without tags!")
      return
    }
    setLoading(true)
    setText(generateIndicator, 'Generating cat...')

    // Generate a unique ID for this request
    const requestId = `cat-${Date.now()}`
    
    try {
      // Initial request to the background function
      const response = await fetch('/api/image-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags, id: requestId })
      })

      if (!response.ok) {
        throw new Error('Failed to start image generation')
      }

      const pollForImage = async () => {
        const pollResponse = await fetch(`/api/get-image?id=${requestId}`)
        if (pollResponse.ok) {
          const data = await pollResponse.json()
          if (data.content) {
            // Image is ready
            imageElement.src = `data:image/png;base64,${data.content}`
            imageElement.dataset.requestId = requestId  // Store the request ID
            hideElement(generateButtonElement)
            showElement(imageElement)
            showElement(imageActionButtons)
            return true
          }
        }
        return false
      }

      let attempts = 0;

      // Poll every 5 seconds until image is ready or timeout
      while (attempts < MAX_ATTEMPTS) {
        await wait(INTERVAL)
        const imageReady = await pollForImage()
        if (imageReady) break
      }

    } catch (error) {
      showError(error.message || "Failed to generate the cat image.")
    } finally {
      setLoading(false)
      setText(generateIndicator, 'Generate cat')
    }
  })

  // Upload image
  uploadButtonElement.addEventListener('click', async () => {
    if (isLoading(uploadButtonElement)) return
    const imageElement = document.getElementById('cat-image')
    const requestId = imageElement.dataset.requestId
    if (!requestId) {
      showError("No image available to upload!")
      return
    }
    setLoading(true)
    setText(uploadButtonElement, 'Saving...')
    
    try {
      const response = await fetch('/api/image-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: requestId })
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload image')
      }
      
      setText(uploadButtonElement, 'Saved to album')
      setAttribute(uploadButtonElement, 'finished', true)
    } catch (error) {
      showError(error.message || 'Failed to save image')
      setText(uploadButtonElement, 'Save to album')
    } finally {
      setLoading(false)
    }
  })

  // Retry image
  retryButtonElement.addEventListener('click', async ()=> {
    window.location.reload()
  })

})
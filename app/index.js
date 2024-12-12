const imageElement = document.getElementById('cat-image')
const generateButtonElement = document.getElementById('generate-button')
const generateIndicator = document.getElementById('generate-text')
const imageActionButtons = document.getElementById('buttons')
const uploadButtonElement = document.getElementById('upload-button')
const retryButtonElement = document.getElementById('retry-button')

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
    const imageUrl = await fetchCatImage(tags)
    if (imageUrl) {
      imageElement.src = imageUrl
      hideElement(generateButtonElement)
      showElement(imageElement)
      showElement(imageActionButtons)
    } else {
      showError("Failed to generate the cat image.")
    }
    setLoading(false)
    setText(generateIndicator, 'Generate cat')
  })

  // Upload image
  uploadButtonElement.addEventListener('click', async () => {
    if (isLoading(uploadButtonElement)) return
    const imageElement = document.getElementById('cat-image')
    const imageUrl = imageElement.src
    if (!imageUrl) {
      showError("No image available to upload!")
      return
    }
    setLoading(true)
    setText(uploadButtonElement, 'Saving...')
    const uploaded = await uploadImageToS3(imageUrl)
    setLoading(false)
    if (uploaded) {
      setText(uploadButtonElement, 'Saved to album')
      setAttribute(uploadButtonElement, 'finished', true)
    }
    else {
      setText(uploadButtonElement, 'Save to album')
    }
  })

  // Retry image
  retryButtonElement.addEventListener('click', async ()=> {
    if (isLoading(retryButtonElement)) return
    setLoading(true)
    setText(retryButtonElement, 'Generating new cat...')
    const imageUrl = await fetchCatImage(tags)
    if (imageUrl) {
      imageElement.src = imageUrl
      setAttribute(uploadButtonElement, 'finished', false)
      setText(uploadButtonElement, 'Save to album')
      // Use a timeout to render the new image on the page
      setTimeout(()=> {
        setLoading(false)
        setText(retryButtonElement, 'Generate another')
      }, 750)
    } else {
      showError("Failed to generate the new cat image.")
      setLoading(false)
      setText(retryButtonElement, 'Generate another')
    }
  })

})
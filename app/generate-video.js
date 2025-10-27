const generateButtonElement = document.getElementById('generate-button')
const generateIndicator = document.getElementById('generate-text')
const videoStatusElement = document.getElementById('video-status')
const generateAnotherButton = document.getElementById('generate-another-button')

const isLoading = (element) => getAttribute(element, 'loading') === 'true'

const setLoading = (loading) => {
  setAttribute(generateButtonElement, 'loading', loading)
}

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

document.addEventListener("DOMContentLoaded", async () => {
  // Fetch tags on page load
  const tags = await fetchTags()
  renderTags(tags)

  // Generate video
  generateButtonElement.addEventListener('click', async () => {
    if (isLoading(generateButtonElement)) return
    if (tags.length === 0) {
      showError("Cannot generate a video without tags!")
      return
    }
    setLoading(true)
    setText(generateIndicator, 'Generating video...')

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error('Failed to start video generation')
      }

      // Show success status
      hideElement(generateButtonElement)
      showElement(videoStatusElement)
    } catch (error) {
      showError(error.message || "Failed to generate the cat video.")
      setText(generateIndicator, 'Generate cat video')
      setLoading(false)
    }
  })
})

const gallery = document.getElementById("video-gallery")
const modal = document.getElementById('modal')
const modalVideo = document.getElementById('modal-video')
const closeBtn = document.getElementById('close')
const paginationContainer = document.getElementById('pagination')

let currentPagination = null

// Get current page from URL
const getCurrentPage = () => {
  const params = new URLSearchParams(window.location.search)
  return parseInt(params.get('page') || '1', 10)
}

// Update URL without page reload
const updateURL = (page) => {
  const url = new URL(window.location)
  url.searchParams.set('page', page)
  window.history.pushState({}, '', url)
}

// Navigate to a specific page
const goToPage = async (page) => {
  updateURL(page)
  await loadGallery(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Render pagination controls
const renderPagination = (pagination) => {
  if (!paginationContainer) return

  const { currentPage, totalPages, hasNext, hasPrev } = pagination

  if (totalPages <= 1) {
    paginationContainer.innerHTML = ''
    return
  }

  let html = '<div class="pagination-controls">'

  // Previous button
  html += `<button class="pagination-btn" ${!hasPrev ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">← Previous</button>`

  // Page info
  html += `<span class="page-info">Page ${currentPage} of ${totalPages}</span>`

  // Next button
  html += `<button class="pagination-btn" ${!hasNext ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">Next →</button>`

  html += '</div>'
  paginationContainer.innerHTML = html
}

// Load gallery for a specific page
const loadGallery = async (page = 1) => {
  const data = await fetchVideoGallery(page)
  const videos = data.videos || []
  currentPagination = data.pagination

  if (!videos || videos.length === 0) {
    gallery.innerHTML = "<p>No videos found in the gallery.</p>"
    paginationContainer.innerHTML = ''
    return
  }

  gallery.innerHTML = ""
  videos.forEach(videoUrl => {
    // Create main item
    const item = document.createElement('div')
    item.className = 'gallery-item'
    // Add skeleton loader
    const skeleton = document.createElement('div')
    skeleton.className = 'skeleton'
    item.appendChild(skeleton)
    // Source the video
    const video = document.createElement('video')
    video.src = videoUrl
    video.alt = 'Cuddly Cat Video (AI Generated)'
    video.muted = true
    video.loop = true
    video.playsInline = true
    // Handle video load
    video.onloadeddata = () => {
      video.classList.add('loaded')
      skeleton.remove()
    }
    item.appendChild(video)
    gallery.appendChild(item)

    // Play video on hover
    item.addEventListener('mouseenter', () => {
      video.play()
    })

    item.addEventListener('mouseleave', () => {
      video.pause()
      video.currentTime = 0
    })

    // Add click event to show modal
    item.addEventListener('click', () => {
      modal.classList.add('active')
      modalVideo.src = videoUrl
      modalVideo.play()
    })
  })

  renderPagination(currentPagination)
}

// Make goToPage available globally for onclick handlers
window.goToPage = goToPage

document.addEventListener("DOMContentLoaded", async () => {
  const page = getCurrentPage()
  await loadGallery(page)
})

// Handle browser back/forward buttons
window.addEventListener('popstate', async () => {
  const page = getCurrentPage()
  await loadGallery(page)
})

// Close modal when clicking the close button
closeBtn.addEventListener('click', () => {
  modal.classList.remove('active')
  modalVideo.pause()
  modalVideo.src = ''
})

// Close modal when clicking outside the video
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active')
    modalVideo.pause()
    modalVideo.src = ''
  }
})

// Close modal with escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.classList.remove('active')
    modalVideo.pause()
    modalVideo.src = ''
  }
})

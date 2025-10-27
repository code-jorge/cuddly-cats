const gallery = document.getElementById("image-gallery")
const modal = document.getElementById('modal')
const modalImg = document.getElementById('modal-img')
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
  const data = await fetchGallery(page)
  const images = data.images || []
  currentPagination = data.pagination

  if (!images || images.length === 0) {
    gallery.innerHTML = "<p>No images found in the gallery.</p>"
    paginationContainer.innerHTML = ''
    return
  }

  gallery.innerHTML = ""
  images.forEach(imageUrl => {
    // Create main item
    const item = document.createElement('div')
    item.className = 'gallery-item'
    // Add skeleton loader
    const skeleton = document.createElement('div')
    skeleton.className = 'skeleton'
    item.appendChild(skeleton)
    // Source the image
    const img = document.createElement('img')
    img.src = imageUrl
    img.alt = 'Cuddly Cat (IA Generated)'
    // Handle image load
    img.onload = () => {
      img.classList.add('loaded')
      skeleton.remove()
    }
    item.appendChild(img)
    gallery.appendChild(item)
    // Add click event to show modal
    item.addEventListener('click', () => {
      modal.classList.add('active')
      // Load larger version of image (remove -thumbnail from filename)
      modalImg.src = imageUrl.replace('-thumbnail', '')
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
})

// Close modal when clicking outside the image
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active')
  }
})

// Close modal with escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.classList.remove('active')
  }
})
const gallery = document.getElementById("image-gallery")
const modal = document.getElementById('modal')
const modalImg = document.getElementById('modal-img')
const closeBtn = document.getElementById('close')

document.addEventListener("DOMContentLoaded", async () => {
  const images = await fetchGallery()
  if (!images || images.length === 0) {
    gallery.innerHTML = "<p>No images found in the gallery.</p>"
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
      // Load larger version of image
      modalImg.src = imageUrl.replace(encodeURIComponent(' - thumbnail'), '') 
    })
  })
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
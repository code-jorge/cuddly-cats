const gallery = document.getElementById("image-gallery")

document.addEventListener("DOMContentLoaded", async () => {
  const images = await fetchGallery()
  if (!images || images.length === 0) {
    gallery.innerHTML = "<p>No images found in the gallery.</p>"
    return
  }
  gallery.innerHTML = ""
  images.forEach((image) => {
    const imgElement = document.createElement("img")
    imgElement.src = image
    imgElement.alt = 'Cuddly Cat (AI Generated)'
    gallery.appendChild(imgElement)
  })
})
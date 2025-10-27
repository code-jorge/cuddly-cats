import { getImages, getImageUrl, isValidImage } from "../utils/gallery"

const ITEMS_PER_PAGE = 60

export default async (request) => {
  try {
    // Get page parameter from URL
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    // Get all images
    const images = await getImages()
    const imageUrls = images.map(getImageUrl).filter(isValidImage)
    // Calculate pagination
    const totalImages = imageUrls.length
    const totalPages = Math.ceil(totalImages / ITEMS_PER_PAGE)
    const validPage = Math.max(1, Math.min(page, totalPages || 1))
    const startIndex = (validPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    // Get paginated results
    const paginatedUrls = imageUrls.slice(startIndex, endIndex)
    return Response.json({
      images: paginatedUrls,
      pagination: {
        currentPage: validPage,
        totalPages,
        totalImages,
        itemsPerPage: ITEMS_PER_PAGE,
        hasNext: validPage < totalPages,
        hasPrev: validPage > 1
      }
    })
  } catch (error) {
    return Response.json({ error: "Failed to retrieve images." }, { status: 500 })
  }
}

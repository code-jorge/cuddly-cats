import { getVideos, getVideoUrl, isValidVideo } from "../utils/video-gallery"

const ITEMS_PER_PAGE = 12

export default async (request) => {
  try {
    // Get page parameter from URL
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    // Get all videos
    const videos = await getVideos()
    const videoUrls = videos.map(getVideoUrl).filter(isValidVideo)
    // Calculate pagination
    const totalVideos = videoUrls.length
    const totalPages = Math.ceil(totalVideos / ITEMS_PER_PAGE)
    const validPage = Math.max(1, Math.min(page, totalPages || 1))
    const startIndex = (validPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    // Get paginated results
    const paginatedUrls = videoUrls.slice(startIndex, endIndex)
    return Response.json({
      videos: paginatedUrls,
      pagination: {
        currentPage: validPage,
        totalPages,
        totalVideos,
        itemsPerPage: ITEMS_PER_PAGE,
        hasNext: validPage < totalPages,
        hasPrev: validPage > 1
      }
    })
  } catch (error) {
    return Response.json({ error: "Failed to retrieve videos." }, { status: 500 })
  }
}

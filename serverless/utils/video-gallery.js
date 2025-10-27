import s3Client from './s3'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'

const BUCKET_NAME = process.env.PROJECT_S3_BUCKET_NAME

const extractDateFromFilename = (filename) => {
  const match = filename.match(/cat-video-(\d+)\.mp4$/)
  if (match) return new Date(parseInt(match[1], 10))
  return new Date(0)
}

export const getVideos = async ()=> {
  const params = { Bucket: BUCKET_NAME, Prefix: "Cuddle Cats/" };
  const command = new ListObjectsV2Command(params)
  const data = await s3Client.send(command)
  if (!data.Contents) return []
  const sortedContents = data.Contents.sort((a, b) => {
    const dateA = extractDateFromFilename(a.Key)
    const dateB = extractDateFromFilename(b.Key)
    return dateB - dateA // Descending order (newest first)
  })
  return sortedContents.map((file) => file.Key)
}

export const getVideoUrl = (video)=> {
  const baseUrl = `https://cdn.jorgeaguirre.es`;
  return `${baseUrl}/${encodeURIComponent(video)}`
}

export const isValidVideo = (url)=> {
  if (!url) return false
  return url.endsWith(".mp4") && url.includes("cat-video-")
}

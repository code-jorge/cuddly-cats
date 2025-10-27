import s3 from './s3'

const BUCKET_NAME = process.env.PROJECT_S3_BUCKET_NAME

const extractDateFromFilename = (filename) => {
  const match = filename.match(/cat-(\d+)(?:-thumbnail)?\.png$/)
  if (match) return new Date(parseInt(match[1], 10))
  return new Date(0)
}

export const getImages = async ()=> {
  const params = {
    Bucket: BUCKET_NAME,
    Prefix: "Cuddle Cats/",
  };
  const data = await s3.listObjectsV2(params).promise();
  if (!data.Contents) return []

  const sortedContents = data.Contents.sort((a, b) => {
    const dateA = extractDateFromFilename(a.Key)
    const dateB = extractDateFromFilename(b.Key)
    return dateB - dateA
  })

  return sortedContents.map((file) => file.Key)
}

export const getImageUrl = (image)=> {
  const baseUrl = `https://cdn.jorgeaguirre.es`;
  return `${baseUrl}/${encodeURIComponent(image)}`
}

export const isValidImage = (url)=> {
  if (!url) return false
  return url.endsWith("thumbnail.png")
}
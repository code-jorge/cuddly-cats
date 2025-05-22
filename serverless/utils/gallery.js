import s3 from './s3'

const BUCKET_NAME = process.env.PROJECT_S3_BUCKET_NAME

export const getImages = async ()=> {
  const params = {
    Bucket: BUCKET_NAME,
    Prefix: "Cuddle Cats/",
  };
  const data = await s3.listObjectsV2(params).promise();
  if (!data.Contents) return []
  return data.Contents.map((file) => file.Key)
}

export const getImageUrl = (image)=> {
  const baseUrl = `https://cdn.jorgeaguirre.es/`;
  return `${baseUrl}/${encodeURIComponent(image)}`
}

export const isValidImage = (url)=> {
  if (!url) return false
  return url.endsWith("thumbnail.png")
}
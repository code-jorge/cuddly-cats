import s3 from './s3'

const BUCKET_NAME = process.env.PROJECT_S3_BUCKET_NAME
const AWS_REGION = process.env.PROJECT_AWS_REGION

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
  const baseUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com`;
  return `${baseUrl}/${encodeURIComponent(image)}`
}

export const isValidImage = (url)=> {
  if (!url) return false
  return url.endsWith("thumbnail.png")
}
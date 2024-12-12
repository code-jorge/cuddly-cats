import sharp from 'sharp'
import { getWords } from './words'
import s3 from './s3'

const BUCKET_NAME = process.env.PROJECT_S3_BUCKET_NAME

export const getImageName = ()=> {
  const [date, time] = new Date().toISOString().split('T')
  const today = `${date} ${time.split('.')[0]}`
  const tags = getWords(2)
  const imageName = `${tags.join(' ').toLowerCase()} cat (${today}).png`
  return imageName
}

export const getThumbnailName = (imageName)=> {
  return imageName.replace('.png', ' - thumbnail.png')
}

export const resize = async (buffer)=> {
  const thumbnailBuffer = await sharp(buffer)
    .resize(250, 250, { fit: 'cover' })
    .toBuffer()
  return thumbnailBuffer
}

export const upload = async (buffer, name)=> {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `Cuddle Cats/${name}`,
    Body: buffer,
    ContentType: 'image/png',
    ACL: 'public-read',
  }
  return await s3.upload(params).promise()
}

import sharp from 'sharp'
import s3Client from './s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'

const BUCKET_NAME = process.env.PROJECT_S3_BUCKET_NAME

export const getThumbnailName = (imageName)=> {
  return imageName.replace('.png', '-thumbnail.png')
}

export const resizeImage = async (buffer)=> {
  const thumbnailBuffer = await sharp(buffer)
    .resize(250, 250, { fit: 'cover' })
    .toBuffer()
  return thumbnailBuffer
}

export const uploadImage = async (buffer, name)=> {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `Cuddle Cats/${name}`,
    Body: buffer,
    ContentType: 'image/png',
    ACL: 'public-read',
  }
  const command = new PutObjectCommand(params)
  return await s3Client.send(command)
}

export const uploadVideo = async (buffer, name) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `Cuddle Cats/${name}`,
    Body: buffer,
    ContentType: 'video/mp4',
    ACL: 'public-read',
  }
  const command = new PutObjectCommand(params)
  return await s3Client.send(command)
}
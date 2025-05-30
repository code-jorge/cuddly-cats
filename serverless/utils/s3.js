import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  accessKeyId: process.env.PROJECT_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.PROJECT_AWS_SECRET_ACCESS_KEY,
  region: process.env.PROJECT_AWS_REGION,
})

export default s3
// backend/utils/s3.js
import AWS from 'aws-sdk';

// Configure S3 client
const s3 = new AWS.S3({
  endpoint: process.env.S3_ENDPOINT,   // e.g., MinIO
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  s3ForcePathStyle: true,
  signatureVersion: 'v4'
});

// Generate presigned URL for uploads
export function getPresignedUrl(filename, contentType) {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: filename,
    Expires: 60, // seconds
    ContentType: contentType
  };
  return s3.getSignedUrl('putObject', params);
}

// You can add more S3 helper functions below as needed, e.g.:
// export async function listObjects() { ... }
// export async function deleteObject(key) { ... }

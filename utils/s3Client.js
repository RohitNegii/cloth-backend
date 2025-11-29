import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const REGION = process.env.AWS_REGION;
const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadToS3 = async (
  fileBuffer,
  fileName,
  mimetype
) => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  console.log(`https://${bucketName}.s3.${REGION}.amazonaws.com/${fileName}`);
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimetype,
    // ACL: "public-read",
  };
  await s3.send(new PutObjectCommand(params));
  return `https://${bucketName}.s3.${REGION}.amazonaws.com/${fileName}`;
};

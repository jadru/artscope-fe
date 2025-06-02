import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const { contentType } = await request.json();

  try {
    const client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key:
        process.env.S3_PATH + '/' + uuidv4() + `.${contentType.split('/')[1]}`,
      Conditions: [
        ['content-length-range', 0, 20971520], // up to 20 MB
        ['starts-with', '$Content-Type', contentType],
      ],
      Fields: {
        acl: 'public-read',
        'Content-Type': contentType,
      },
      Expires: 1800, // Seconds before the presigned post expires. 3600 by default.
    });

    return NextResponse.json({
      url,
      fields,
    });
  } catch (error) {
    return NextResponse.json({ error: error, status: 500 });
  }
}

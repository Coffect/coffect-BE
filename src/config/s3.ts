import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';
import { MulterUploadError } from '../middleware/error';

dotenv.config();

const settingS3 = new S3Client({
  region: process.env.AWS_REGION || 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || ''
  }
});

const upload = multer({
  storage: multerS3({
    s3: settingS3,
    bucket: process.env.S3_NAME || '',
    acl: 'private',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fileName: file.filename });
    },
    key: function (req, file, cb) {
      const uniqueName = `${uuidv4()}-${file.originalname}`;
      cb(null, uniqueName);
    }
  })
});

async function uploadToS3(file: Express.Multer.File): Promise<string> {
  if (!file.mimetype.startsWith('image/')) {
    throw new MulterUploadError('지원되지 않는 파일 형식입니다.');
  }
  const uniqueName = `${uuidv4()}-${file.originalname}`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_NAME || '',
    Key: uniqueName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'private'
  });
  try {
    await settingS3.send(command);
  } catch (err) {
    new MulterUploadError('사진을 올리는 중 오류가 발생했습니다');
  }
  // S3 URL 반환 (필요에 따라 public URL로 수정)
  return `https://${process.env.S3_NAME}.s3.ap-northeast-2.amazonaws.com/${uniqueName}`;
}

async function deleteFromS3(fileUrl: string): Promise<boolean> {
  try {
    const fileKey = extractFileKeyFromUrl(fileUrl);
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_NAME || '',
      Key: fileKey
    });

    await settingS3.send(command);
    return true;
  } catch (error) {
    throw new MulterUploadError('S3에서 파일 삭제 중 오류가 발생했습니다');
  }
}

function extractFileKeyFromUrl(fileUrl: string): string {
  if (!fileUrl.startsWith('http')) {
    return fileUrl; // 이미 파일 키인 경우
  }

  const urlParts = fileUrl.split('/');
  return urlParts[urlParts.length - 1];
}

export { upload, uploadToS3, deleteFromS3, extractFileKeyFromUrl };

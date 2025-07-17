import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';

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
    // acl: 'public-read', // 공개적으로 읽을 수 있게 설정
    metadata: function (req, file, cb) {
      cb(null, { fileName: file.filename });
    },
    key: function (req, file, cb) {
      const uniqueName = `${uuidv4()}-${file.originalname}`; // 함수를 실행 안시켰음
      cb(null, uniqueName);
    }
  })
});

export default upload;

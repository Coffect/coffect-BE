import { NextFunction, Request, Response } from 'express';
import upload from '../config/s3';
import { MulterUploadError } from './error';

const uploadSingle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await upload.single('img')(req, res, (err: any) => {
    if (err) {
      throw new MulterUploadError('사진을 올리는 중 오류가 발생했습니다');
    } else {
      return next();
    }
  });
};

export { uploadSingle };

import { NextFunction, Request, Response } from 'express';
import { upload } from '../config/s3';
import { MulterUploadError } from './error';

// const uploadProfile = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   await upload.single('img')(req, res, async (err: any) => {
//     if (err) {
//       next(new MulterUploadError('사진을 올리는 중 오류가 발생했습니다'));
//     } else {
//       req.body.userInfo = JSON.parse(req.body.userInfo);
//       req.body.profile = (req.file as any).location;
//       next();
//     }
//   });
// };

// // export { uploadProfile };

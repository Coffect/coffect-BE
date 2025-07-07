import { Request, Response, NextFunction } from 'express';

//에러 처리 미들웨어
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if(res.headersSent){
    next(err);
    return;
  }

  //커스텀 에러 처리
  if(err instanceof BasicError){
    res.status(err.statusCode).json({
      resultType: 'FAIL',
      error: {
        errorCode: err.code,
        reason: err.message,
        data: err.description
      },
      success: null
    });

    return;
  }

  //기본 에러 처리 (500)
  res.status(500).json({
    resultType: 'FAIL',
    error: {
      errorCode: 'ERR-0',
      reason: err.message || 'Unknown server error.',
      data: null
    },
    success: null
  });
};

//에러 클래스
export class BasicError extends Error {
  public statusCode: number;
  public code: string;
  public description: string;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    description: string
  ){
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.description = description || 'No description: 에러 설명이 없습니다.';
  }
};

//커스텀 에러 클래스 예시
export class CustomErrorEx extends BasicError {
  constructor(description: string) {
    super(400, 'ERR-1', 'Bad Request', description);
  }
};
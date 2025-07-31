import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import * as swaggerJson from './config/swagger.json';
import * as swaggerUI from 'swagger-ui-express';

import { Request, Response, NextFunction } from 'express';
import { RegisterRoutes } from './routes/tsoaRoutes';
import { errorHandler } from './middleware/error';
import './config/scheduler';

dotenv.config();
const app = express();
const router = express.Router();
const port = process.env.EC2_PORT || 3000;

app.use(cors());
app.use(express.json()); // JSON 본문을 파싱
app.use(express.urlencoded({ extended: true })); // HTML Form에서 전송된 데이터를 파싱
app.use(morgan('dev')); // HTTP Req 요청 로그 출력

//라우터 설정
RegisterRoutes(app);

// Health Check Router (HTTPS때 사용 예정)
router.get('/', (req, res) => {
  res.json({ message: 'Health check' });
});

//swagger 문서 셋업
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJson));

// 서버 실행
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(errorHandler);

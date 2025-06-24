import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import userRouter from './user/user.Router';
import { swaggerSpec, swaggerUi } from './config/swagger';

dotenv.config();
const app = express();
const router = express.Router();
const port = process.env.EC2_PORT || 3000;

app.use(cors());
app.use(express.json()); // JSON 본문을 파싱
app.use(express.urlencoded({ extended: true })); // HTML Form에서 전송된 데이터를 파싱
app.use(morgan('dev')); // HTTP Req 요청 로그 출력

// Health Check Router (HTTPS때 사용 예정)
router.get('/', (req, res) => {
  res.json({ message: 'Health check' });
});

app.use('/swagger-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 상단 Router 설정
router.use('/user', userRouter);

// 서버 실행
app.listen(port, () => {
  console.log(`Sever is running on port ${port}`);
});

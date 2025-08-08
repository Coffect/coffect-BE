import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'http';

import * as swaggerJson from './config/swagger.json';
import * as swaggerUI from 'swagger-ui-express';

import { RegisterRoutes } from './routes/tsoaRoutes';
import { errorHandler } from './middleware/error';
import './config/scheduler';
import initSocket from './socket/socket';
import { Server } from 'socket.io';
import verifySocket from './middleware/verifySocket';
import { ClientToServerEvents, ServerToClientEvents } from './middleware/socket.DTO/socket.DTO';

dotenv.config();
const app = express();
const router = express.Router();
const port = process.env.EC2_PORT || 3000;
const httpServer = createServer(app);

app.use(cors());
app.use(express.json()); // JSON 본문을 파싱
app.use(express.urlencoded({ extended: true })); // HTML Form에서 전송된 데이터를 파싱ㄴ
app.use(morgan('dev')); // HTTP Req 요청 로그 출력

//socket.io 설정
const io = new Server
<
  ServerToClientEvents,
  ClientToServerEvents
>
(httpServer, {
  cors: {
    origin: ['https://admin.socket.io', '*'], //추후 클라이언트 주소 허용
    credentials: true
  }
});
io.use(verifySocket);
initSocket(io);

//라우터 설정
RegisterRoutes(app);

// Health Check Router (HTTPS때 사용 예정)
router.get('/', (req, res) => {
  res.json({ message: 'Health check' });
});

//swagger 문서 셋업
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJson));

app.use(errorHandler);

// 서버 실행
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

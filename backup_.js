import { Server } from 'socket.io';

/*****************************************************************************
 * server configurations
 ****************************************************************************/
const PORT = 2004; // 서버가 열릴 포트

/*****************************************************************************
 * socket server configurations
 ****************************************************************************/

const io = new Server(PORT, {
  pingInterval: 5000,  // Ping 간격
  pingTimeout: 20000,  // Ping Timeout
  cors: {
    origin: "*",  // 모든 출처 허용
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'], // WebSocket과 폴링 방식을 모두 허용
  allowEIO3: true
});



console.log(`Server is running on port ${PORT}`);

/*****************************************************************************
 * socket event handlers
 ****************************************************************************/
io.sockets.on('connection', socket => {
  console.log('A device connected:', socket.id);

  // on DEVICE DISCONNECT
  socket.on('disconnect', reason => {
    console.log('A device disconnected:', socket.id, 'Reason:', reason);
  });

  // on telemetry report (ESP32가 데이터를 보낼 때 사용하는 이벤트)
  socket.on('tlog', data => {
    console.log('Telemetry data received:', data);
    // 필요하다면 여기서 데이터를 처리할 수 있습니다.
  });
});
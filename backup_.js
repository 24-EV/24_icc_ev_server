// 테스트했던 백업코드입니다.

const ip = require("ip");
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server, {
 pingTimeout: 25000,
 pingInterval: 20000, 
 cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ['websocket', 'polling'],  // 폴링 및 웹소켓 허용
});
var port = 2004; // || 연산자로 기본 포트 설정

app.get('/', function (req, res) {
    // check sender ip
    var senderip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('Sender IP:', senderip);  // IP 주소 로그 출력
    res.send('<h3>Hello world!</h3>');  // 클라이언트에게 응답 전송
});


function getKoreaTime() {
  const koreaTime = new Date(Date.now() + (9 * 60 * 60 * 1000)); // UTC + 9시간
  return koreaTime.toISOString().replace('T', ' ').split('.')[0];
}

io.on('connection', function (socket) {
    console.log(getKoreaTime(), 'Client connected');
    socket.on('message', function (data) {
        console.log(getKoreaTime(), 'Message received: ', data);
    });
    socket.on('disconnect', function () {
        console.log(getKoreaTime(), 'Client disconnected');
    });
});

server.listen(port, () => {
    console.log('Server is running on port', port);
});
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(bodyParser.json()); // JSON 본문 파싱

// socketTest 페이지에서 보내는 실시간 메시지 확인용
// io.on("connection", (socket) => {
//     console.log("연결됨 :", socket.id);

//     socket.on("message", (data: string) => {
//         console.log("받은 메시지 :", data);
//         io.emit("message", data);
//     });

//     socket.on("disconnect", () => {
//         console.log("연결 끊김", socket.id);
//     });
// });

// 소켓 기본 설정 - 소켓 연결시 바로 실행 될 세팅값
io.on("connection", (socket) => {
    console.log("연결됨 :", socket.id);

    // 방문기록 실시간 출력 - 가맹점 별로 룸 생성 되고 소켓에 부여
    socket.on("joinStore", (storeId: number) => {
        const roomName = `store-${storeId}`;
        socket.join(roomName);
        console.log(`소켓 ${socket.id} 이 store-${storeId} 룸에 입장`);
    });

    // 나중에 기능 추가시 여기에 넣기

    socket.on("disconnect", () => {
        console.log("연결 끊김", socket.id);
    });
});

// 방문기록 API - Spring VisitLogServiceImpl에서 방문기록 생성시 호출
app.post("/api/socket/store-visitLogs", (req, res) => {
    const { storeId, visitLog } = req.body;

    if (!storeId || !visitLog) {
        return res
            .status(400)
            .json({ message: "storeId 또는 visitLog가 누락됨" });
    }

    const roomName = `store-${storeId}`;
    io.to(roomName).emit("storeMessage", visitLog);
    console.log(`${roomName} 룸에 방문기록 전송됨`);

    return res.status(200).json({ message: "전송 성공" });
});

const PORT = 7951;
httpServer.listen(PORT, () => {
    console.log(`소켓 서버 실행중 : http://localhost:${PORT}`);
});

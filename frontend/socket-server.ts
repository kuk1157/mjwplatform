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

// 백엔드에서 보낸 방문기록 수신 (REST 방식)
io.on("connection", (socket) => {
    console.log("연결됨 :", socket.id);

    // storeId를 받아서 해당 방에 입장
    socket.on("joinStore", (storeId: number) => {
        const roomName = `store-${storeId}`;
        socket.join(roomName);
        console.log(`소켓 ${socket.id} 이 store-${storeId} 룸에 입장`);
    });

    socket.on("disconnect", () => {
        console.log("연결 끊김", socket.id);
    });
});

// 방문기록 API
app.post("/api/socket/store-new-visit", (req, res) => {
    const { storeId, visitLog } = req.body;

    if (!storeId || !visitLog) {
        return res
            .status(400)
            .json({ message: "storeId 또는 visitLog가 누락됨" });
    }

    const roomName = `store-${storeId}`;
    io.to(roomName).emit("storeMessage", visitLog);
    console.log(`store-${storeId} 룸에 방문기록 전송됨`);

    res.status(200).json({ message: "전송 성공" });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
    console.log(`소켓 서버 실행중 : http://localhost:${PORT}`);
});

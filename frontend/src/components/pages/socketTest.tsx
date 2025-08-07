import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:4000");

const SocketTest = () => {
    const [message, setMessage] = useState("");
    const [log, setLog] = useState<string[]>([]);

    useEffect(() => {
        socket.on("message", (data: string) => {
            setLog((prev) => [...prev, `데이터 : ${data}`]);
        });

        return () => {
            socket.off("message");
        };
    }, []);

    const sendMessage = () => {
        socket.emit("message", message);
        setLog((prev) => [...prev, `메시지 :${message}`]);
        setMessage("");
    };

    return (
        <div className="max-w-md mx-auto my-56 p-6 border border-gray-300 rounded-lg shadow-md bg-white">
            <h2 className="text-2xl font-semibold mb-4 text-center">
                Socket.IO 테스트
            </h2>
            <div className="flex mb-4">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="메시지 입력"
                    className="flex-grow border border-gray-400 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition"
                >
                    전송
                </button>
            </div>
            <ul className="max-h-64 overflow-y-auto border border-gray-200 rounded p-2 bg-gray-50">
                {log.map((msg, i) => (
                    <li key={i} className="text-gray-700 mb-1">
                        {msg}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SocketTest;

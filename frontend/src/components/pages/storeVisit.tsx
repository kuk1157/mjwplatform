import axios from "axios";
import { useState, useEffect } from "react"; // useState, useEffect 추가

interface VisitLog {
    id: number;
    storeId: number;
    customerId: number;
    storeName?: string;
    createdAt: string;
}

function StoreVisit() {
    const [visitLogs, setvisits] = useState<VisitLog[]>([]);
    const [visitAmounts, setVisitAmounts] = useState<{ [key: number]: string }>(
        {}
    ); // 테이블번호별 금액

    const storeNum = 4;
    const VisitLogss = async () => {
        try {
            const url = `/api/v1/visits/${storeNum}`;
            const response = await axios.get(url);
            setvisits(response.data); // 받아온 데이터를 상태에 저장
        } catch (error) {
            console.error("매장 방문기록 데이터 조회 실패:", error);
        }
    };

    // 주문금액 입력 핸들러
    const handleAmountChange = (id: number, value: string) => {
        setVisitAmounts((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // 주문하기 버튼 클릭 시 POST 요청
    const handleOrder = async (id: number) => {
        const price = visitAmounts[id];

        if (!price) {
            alert("주문 금액을 입력해주세요.");
            return;
        }

        if (Number(price) <= 0) {
            alert("0원이나 (-) 금액은 입력할 수 없습니다.");
            return;
        }

        const visitLogId = id;

        // console.log("방문기록 고유번호 : " + id);

        // return;

        try {
            const url = `/api/v1/pay/${visitLogId}`;
            const orderData = {
                visitLogId,
                price: Number(price),
            };

            const response = await axios.post(url, orderData);
            console.log(`주문금액 입력 완료:`, response.data);

            // 주문 성공 후 처리 (예: input 값 초기화, 성공 메시지 등)
            alert(`주문금액 입력이 완료되었습니다.`);
            window.location.reload();
        } catch (error) {
            console.error(`${id}번 방문기록 관련 금액 입력 실패:`, error);
        }
    };

    useEffect(() => {
        VisitLogss(); // 컴포넌트 마운트 시 데이터 조회
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="grid grid-cols-4 gap-4 p-4">
                {/* 테이블 목록 동적으로 렌더링 */}
                {visitLogs.map((visitLog, index) => (
                    <div
                        key={index}
                        className="w-40 h-40 bg-gray-100 rounded shadow flex flex-col items-center justify-center"
                    >
                        <p className="text-lg font-semibold">
                            방문 기록 : {visitLog.id}
                        </p>
                        <input
                            type="number"
                            placeholder="금액 입력"
                            className="mt-2 px-2 py-1 border rounded w-24 text-center"
                            value={visitAmounts[visitLog.id] || ""}
                            onChange={(e) =>
                                handleAmountChange(visitLog.id, e.target.value)
                            }
                        />
                        <button
                            className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => handleOrder(visitLog.id)}
                        >
                            금액 입력
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StoreVisit;

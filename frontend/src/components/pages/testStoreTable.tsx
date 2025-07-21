import axios from "axios";
import { useState, useEffect } from "react"; // useState, useEffect 추가

interface Table {
    id: number;
    storeId: number;
    tableNumber: number;
    createdAt: string;
}

function TestStoreTable() {
    const [tables, setTables] = useState<Table[]>([]);
    const [orderAmounts, setOrderAmounts] = useState<{ [key: number]: string }>(
        {}
    ); // 테이블번호별 금액

    const storeNum = 1;
    const StoreTable = async () => {
        try {
            const url = `/api/v1/stores/${storeNum}/tables`;
            const response = await axios.get(url);
            setTables(response.data); // 받아온 데이터를 상태에 저장
        } catch (error) {
            console.error("매장 테이블 데이터 조회 실패:", error);
        }
    };

    // 주문금액 입력 핸들러
    const handleAmountChange = (tableNumber: number, value: string) => {
        setOrderAmounts((prev) => ({
            ...prev,
            [tableNumber]: value,
        }));
    };

    // 주문하기 버튼 클릭 시 POST 요청
    const handleOrder = async (tableNumber: number) => {
        const price = orderAmounts[tableNumber];

        if (!price) {
            alert("주문 금액을 입력해주세요.");
            return;
        }

        if (Number(price) <= 0) {
            alert("0원이나 (-) 금액은 입력할 수 없습니다.");
            return;
        }

        try {
            const url = `/api/v1/orders/${storeNum}/${tableNumber}`;
            const orderData = {
                tableNumber,
                price: Number(price),
            };

            const response = await axios.post(url, orderData);
            console.log(`${tableNumber}번 주문 성공:`, response.data);

            // 주문 성공 후 처리 (예: input 값 초기화, 성공 메시지 등)
            alert(`${tableNumber}번 테이블의 주문이 완료되었습니다.`);
        } catch (error) {
            console.error(`${tableNumber}번 테이블 주문 실패:`, error);
        }
    };

    useEffect(() => {
        StoreTable(); // 컴포넌트 마운트 시 데이터 조회
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex gap-4 p-4">
                {/* 테이블 목록 동적으로 렌더링 */}
                {tables.map((table, index) => (
                    <div
                        key={index}
                        className="w-40 h-40 bg-gray-100 rounded shadow flex flex-col items-center justify-center"
                    >
                        <p className="text-lg font-semibold">
                            테이블번호 : {table.tableNumber}
                        </p>
                        <input
                            type="number"
                            placeholder="주문금액"
                            className="mt-2 px-2 py-1 border rounded w-24 text-center"
                            value={orderAmounts[table.tableNumber] || ""}
                            onChange={(e) =>
                                handleAmountChange(
                                    table.tableNumber,
                                    e.target.value
                                )
                            }
                        />
                        <button
                            className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => handleOrder(table.tableNumber)} // 주문하기 버튼 클릭 시 호출
                        >
                            주문하기
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TestStoreTable;

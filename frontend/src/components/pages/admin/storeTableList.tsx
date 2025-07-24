import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useCallback, useRef } from "react";
import { StoreTable } from "src/types";

export function StoreTableList() {
    const { storeId } = useParams();
    const [tables, setTables] = useState<StoreTable[]>([]);
    const [storeName, setStoreName] = useState<string>("");
    const calledRef = useRef(false);

    // 매장테이블 정보 뽑기
    const fetchTables = useCallback(async () => {
        if (!storeId) return;

        try {
            const url = `/api/v1/stores/${storeId}/tables`;
            const response = await axios.get<StoreTable[]>(url);
            setTables(response.data);
        } catch (error) {
            console.error("매장 테이블 데이터 조회 실패:", error);
        }
    }, [storeId]);

    useEffect(() => {
        if (tables.length === 0 && !calledRef.current) {
            fetchTables();
            calledRef.current = true;
        }
    }, [tables, fetchTables]);

    // 매장 정보 뽑기(매장이름 뽑기용)
    const fetchStoreName = useCallback(async () => {
        if (!storeId) return;

        try {
            const response = await axios.get(`/api/v1/stores/${storeId}`);
            setStoreName(response.data.name);
        } catch (error) {
            console.error("매장 이름 조회 실패:", error);
        }
    }, [storeId]);

    useEffect(() => {
        fetchStoreName();
    }, [fetchStoreName]);

    const tableNumberSubmit = async () => {
        if (!storeId) return;
        try {
            const url = `/api/v1/stores/${storeId}/tables`;
            await axios.post(url);
            alert("테이블 등록이 완료되었습니다.");
            await fetchTables();
        } catch (error) {
            console.error("테이블 등록 실패:", error);
        }
    };

    return (
        <div className="flex flex-col  items-center justify-center min-h-screen bg-gray-100">
            <div>
                <h2 className="font-[TmoneyRoundWind] font-extrabold text-[35px]  text-[#333] md:text-[30px] ">
                    [{storeName}] - 매장 테이블 관리
                </h2>
            </div>
            <div className="grid grid-cols-4 gap-4 p-4">
                {tables.length === 0 ? (
                    <div className="col-span-4 text-center text-gray-500 text-lg">
                        매장 테이블이 존재하지 않습니다
                    </div>
                ) : (
                    tables.map((table, index) => (
                        <div
                            key={index}
                            style={{ backgroundColor: "#21A089" }}
                            className="w-40 h-40 rounded shadow flex flex-col items-center justify-center"
                        >
                            <p className="text-lg font-normal text-white">
                                테이블번호 : {table.tableNumber}
                            </p>
                        </div>
                    ))
                )}
            </div>

            <div className={tables.length === 0 ? "w-[545px]" : "w-[684px]"}>
                <button
                    className="px-4 h-9 bg-[#21A089] text-[#fff] rounded-[5px]"
                    onClick={tableNumberSubmit}
                >
                    매장 테이블 등록
                </button>
            </div>
        </div>
    );
}

export default StoreTableList;

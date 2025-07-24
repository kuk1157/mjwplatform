import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useCallback, useRef } from "react";
import { StoreTable } from "src/types";
import { SubmitButton } from "src/components/organisms/submitButton"; // 공통 등록 버튼 컴포넌트

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

    if (!tables || tables.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl text-gray-600">
                    매장 테이블이 존재하지 않습니다.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col  items-center justify-center min-h-screen bg-gray-100">
            <div>
                <h2 className="font-[TmoneyRoundWind] font-extrabold text-[35px]  text-[#333] md:text-[30px] ">
                    [{storeName}] - 매장 테이블 관리
                </h2>
            </div>
            <div className="grid grid-cols-4 gap-4 p-4">
                {/* 테이블 목록 동적으로 렌더링 */}
                {tables.map((table, index) => (
                    <div
                        key={index}
                        style={{ backgroundColor: "#21A089" }}
                        className="w-40 h-40 rounded shadow flex flex-col items-center justify-center"
                    >
                        <p className="text-lg font-normal text-white">
                            테이블번호 : {table.tableNumber}
                        </p>
                    </div>
                ))}
                {/* 테이블 목록 동적으로 렌더링 */}
                {tables.map((table, index) => (
                    <div
                        key={index}
                        style={{ backgroundColor: "#21A089" }}
                        className="w-40 h-40 rounded shadow flex flex-col items-center justify-center"
                    >
                        <p className="text-lg font-normal text-white">
                            테이블번호 : {table.tableNumber}
                        </p>
                    </div>
                ))}

                {/* 테이블 목록 동적으로 렌더링 */}
                {tables.map((table, index) => (
                    <div
                        key={index}
                        style={{ backgroundColor: "#21A089" }}
                        className="w-40 h-40 rounded shadow flex flex-col items-center justify-center"
                    >
                        <p className="text-lg font-normal text-white">
                            테이블번호 : {table.tableNumber}
                        </p>
                    </div>
                ))}
            </div>

            {/* 공통 등록 버튼 submitButton= */}
            <div className=" w-[684px]">
                {
                    <SubmitButton
                        label="매장 등록"
                        path={`/admin/store/${storeId}/StoreTableCreate`}
                    />
                }
            </div>
        </div>
    );
}

export default StoreTableList;

import axios from "axios";
import { useState } from "react";
import { useRecoilValueLoadable } from "recoil";
import { userSelectorUpdated } from "src/recoil/userState";

function TestStoreTable() {
    const { contents: user } = useRecoilValueLoadable(userSelectorUpdated);

    const storeNum = 1;
    const StoreTable = async () => {
        try {
            const url = `/api/v1/storeTable/${storeNum}`;
            const response = await axios.get(url);
            // Page 객체 기준: content 배열만 추출
            console.log("매장 테이블 데이터 조회", response.data);
        } catch (error) {
            console.error("매장 테이블 데이터 조회 실패:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex gap-4 p-4">
                <div className="w-40 h-40 bg-gray-100 rounded shadow flex flex-col items-center justify-center">
                    <p className="text-lg font-semibold">테이블 1</p>
                    <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                        주문하기
                    </button>
                </div>
                <div className="w-40 h-40 bg-gray-100 rounded shadow flex flex-col items-center justify-center">
                    <p className="text-lg font-semibold">테이블 2</p>
                    <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                        주문하기
                    </button>
                </div>
                <div className="w-40 h-40 bg-gray-100 rounded shadow flex flex-col items-center justify-center">
                    <p className="text-lg font-semibold">테이블 3</p>
                    <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                        주문하기
                    </button>
                </div>
                <div className="w-40 h-40 bg-gray-100 rounded shadow flex flex-col items-center justify-center">
                    <p className="text-lg font-semibold">테이블 4</p>
                    <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                        주문하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TestStoreTable;

import { MainContainer } from "../../molecules/container";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { StoreTable } from "src/types";

function OwnerStoreTableList() {
    const { ownerId } = useParams();
    const navigate = useNavigate();
    const [tables, setTables] = useState<StoreTable[]>([]);

    useEffect(() => {
        if (!ownerId) return;

        const fetchData = async () => {
            try {
                const storeRes = await axios.get(
                    `/api/v1/stores/ownerId/${ownerId}`
                );
                console.log(storeRes.data.id);
                const storeId = storeRes.data.id;
                const storeTableRes = await axios.get(
                    `/api/v1/stores/${storeId}/tables`
                );
                setTables(storeTableRes.data);
                return;
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [ownerId]);

    // 점주 대시보드로 이동
    const OwnerDashBoard = () => {
        navigate(`/owner/dashboard/${ownerId}`);
    };
    return (
        <MainContainer className="py-[230px] bg-[#F6F6F6] lg:py-[150px] sm:py-[100px]">
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="w-full min-w-[1200px] mx-auto">
                    <div className="mb-6 flex justify-start">
                        <button
                            onClick={OwnerDashBoard}
                            className="px-5 py-2 bg-yellow-400 text-white font-semibold rounded-lg shadow hover:bg-yellow-500 transition-colors"
                        >
                            🏠 대시보드로 이동
                        </button>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">
                        📊 매장 테이블 조회
                    </h1>
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
                </div>
            </div>
        </MainContainer>
    );
}

export default OwnerStoreTableList;

import { MainContainer } from "../molecules/container";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreType } from "src/types";
import axios from "axios";

function TestQr() {
    const navigate = useNavigate();
    const [stores, setStores] = useState<StoreType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storeRes = await axios.get(`/api/v1/stores`);
                const storeList: StoreType[] = storeRes.data.content; // 타입 단언
                setStores(storeList);
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, []);

    // 매장 목록 먼저 뿌리기 (임시) - 고객이 실제 매장 방문하기전 길에서 매장 고르기

    return (
        <MainContainer className="py-[230px] bg-[#F6F6F6] lg:py-[150px] sm:py-[100px]">
            {/* <div>메인페이지</div> */}
            <div>[고객이 어느 매장 갈지 선택]</div>
            <div className="grid grid-cols-4 gap-4 p-4">
                {stores.length === 0 ? (
                    <div className="col-span-4 text-center text-gray-500 text-lg">
                        매장이 존재하지 않습니다.
                    </div>
                ) : (
                    stores.map((store) => (
                        <button
                            key={store.id}
                            className="w-40 h-40 rounded shadow flex flex-col items-center justify-center
                   border-2 border-[#21A089] bg-[#F6F6F6] text-[#21A089]
                   hover:bg-[#21A089] hover:text-white transition-colors duration-300"
                            onClick={() => navigate(`/testVisit/${store.id}`)}
                        >
                            <p className="text-lg font-normal">[매장 이름]</p>
                            <p className="text-lg font-normal">{store.name}</p>
                        </button>
                    ))
                )}
            </div>
        </MainContainer>
    );
}

export default TestQr;

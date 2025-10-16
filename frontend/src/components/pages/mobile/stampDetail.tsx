import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// [파일 첨부 경로]
import { cdn } from "src/constans"; // 파일첨부 경로(네이버클라우드)
import { storeFolder } from "src/constans"; // 첨부 디렉토리 경로 stroe

// [아이콘 및 공통 컴포넌트]
import { MdArrowBackIosNew } from "react-icons/md"; // 이전 페이지이동 좌측 화살표 아이콘
import { MobileMain } from "src/components/organisms/mobileMain"; // 모바일 상단 타이틀
import { MobileFooter } from "src/components/organisms/mobileFooter"; // 하단 모바일 footer 공통 컴포넌트

// [공통 데이터 인터페이스]
import { StoreType } from "src/types"; // 가맹점(매장) 인터페이스
import { StoreStamp } from "src/types"; // 방문 스탬프 인터페이스

export function MobileMyStampDetail() {
    const navigate = useNavigate();
    const { id, storeId } = useParams(); // 스탬프 id, 가맹점 id
    const customerId = localStorage.getItem("customerId"); // 고객 번호 localStroage
    const [stamp, setStamp] = useState<StoreStamp>(); // 방문 스탬프 데이터 세팅
    const [store, setStore] = useState<StoreType>(); // 가맹점(매장) 데이터 세팅

    if (id != storeId) {
        alert(
            "스탬프 발급받은 매장이 일치하지 않습니다. \n메인페이지로 돌아갑니다."
        );
        navigate("/mobile/mainPage");
    }

    // 방문 스탬프, 가맹점 상세보기
    useEffect(() => {
        if (!customerId) return;
        const fetchData = async () => {
            try {
                const [stampDetail, storeDetail] = await Promise.all([
                    axios.get(`/api/v1/storeStamps/detail/${id}`),
                    axios.get(`/api/v1/stores/${storeId}`),
                ]);
                setStamp(stampDetail.data); // 방문 스탬프 추출
                setStore(storeDetail.data); // 가맹점(매장) 추출
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };
        fetchData();
    }, [customerId, id, storeId]);

    const handleBack = () => {
        navigate(-1); // 뒤로 가기
    };

    return (
        <div className="min-h-screen bg-white p-4">
            {/* 모바일 타이틀 */}
            {<MobileMain param={Number(customerId)} />}

            <div className="mt-8 mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <button
                        className="w-full flex items-center justify-between"
                        onClick={handleBack}
                    >
                        <h2 className="text-2xl font-semibold font-Pretendard flex items-center">
                            <span className="mr-2">
                                <MdArrowBackIosNew />
                            </span>
                            <span>나의 스탬프 상세보기</span>
                        </h2>
                    </button>
                </div>
            </div>
            {stamp && store ? (
                <div>
                    <div className=" px-3 py-3 mb-3 flex items-center">
                        <div className="w-full flex justify-center items-center">
                            <img
                                src={`${cdn}/${storeFolder}/${store.thumbnail}${store.extension}`}
                                alt={store.name}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm shadow-[rgb(92, 123, 185, 0.102)] border border-gray-100 px-3 py-4 mb-3 flex items-center">
                        <div className="flex flex-col ml-3 font-Pretendard min-w-0">
                            <p className="text-base text-[#000]">
                                매장 이름 : {store.name}
                            </p>
                            <p className="text-xs text-[#999ca2] flex">
                                <span className="font-normal truncate w-full">
                                    <p>
                                        {stamp.createdAt.replace("T", " ")}
                                        &nbsp;초에
                                    </p>
                                    <p>
                                        {store.name} 매장에서 {stamp.id}
                                        번째로 발급받은 스탬프 입니다.
                                    </p>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-gray-400">스탬프 정보를 불러오는 중...</p>
            )}

            {/* 하단 네비게이션 */}
            {customerId && <MobileFooter />}
        </div>
    );
}
export default MobileMyStampDetail;

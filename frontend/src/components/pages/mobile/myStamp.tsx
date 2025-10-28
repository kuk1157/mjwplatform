import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
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

export function MobileMyStamp() {
    const navigate = useNavigate();
    const customerId = localStorage.getItem("customerId");
    const [stamps, setStamp] = useState<StoreStamp[]>([]); // 방문 스탬프 데이터 세팅
    const [stores, setStore] = useState<StoreType[]>([]); // 가맹점(매장) 데이터 세팅

    useEffect(() => {
        if (!customerId) return;

        const fetchData = async () => {
            try {
                const [storeStamp, storeList] = await Promise.all([
                    axios.get(`/api/v1/storeStamps/customer/${customerId}`),
                    axios.get("/api/v1/stores"),
                ]);
                setStamp(storeStamp.data); // 방문 스탬프 추출
                setStore(storeList.data.content); // 가맹점(매장) 추출
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [customerId]);
    const handleBack = () => {
        navigate(-1); // 뒤로 가기
    };

    return (
        <div className="min-h-screen bg-white font-Pretendard">
            <div className="p-4 mb-20">
                {/* 모바일 타이틀 */}
                {<MobileMain param={Number(customerId)} />}
                <div className="mt-8 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                        <button
                            className="w-full flex items-center justify-between"
                            onClick={handleBack}
                        >
                            <h2 className="text-2xl font-semibold flex items-center">
                                <span className="mr-2">
                                    <MdArrowBackIosNew />
                                </span>
                                <span>나의 스탬프</span>
                            </h2>
                        </button>
                    </div>
                </div>

                {/* NFT 목록 */}
                <section>
                    {stamps.length > 0 ? (
                        stamps.map((stamp, idx) => {
                            // 매칭되는 매장 찾기
                            const matchedStore = stores?.find(
                                (s) => s.id === stamp.storeId
                            );

                            // 이미지 경로 생성
                            const src = matchedStore
                                ? `${cdn}/${storeFolder}/${matchedStore.thumbnail}${matchedStore.extension}`
                                : "/assets/image/mobile/stampIcon.svg"; // 기본 이미지

                            return (
                                <Link
                                    to={`/mobile/stampDetail/${stamp.id}/${stamp.storeId}`}
                                    key={idx}
                                >
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-3 flex items-center">
                                        <div className="flex items-center">
                                            <img
                                                src={src}
                                                alt={`${matchedStore?.name || "가맹점"} 썸네일`}
                                                className="w-12 h-12 rounded-md object-cover"
                                            />
                                            <div className="flex flex-col ml-3">
                                                <p className="text-xl font-semibold mb-1">
                                                    {matchedStore?.name ||
                                                        "알 수 없는 매장"}
                                                </p>
                                                <p className="text-xs text-[#999ca2]">
                                                    <span className="font-bold mr-2">
                                                        스탬프 찍은 시간
                                                    </span>
                                                    <span className="font-normal">
                                                        {stamp.createdAt.replace(
                                                            "T",
                                                            " "
                                                        )}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center  text-[#999ca2]">
                            <img
                                src="/assets/image/mobile/noVisitIcon.svg"
                                alt="스탬프가 없습니다 아이콘"
                            />
                            <p className="text-lg font-semibold mt-2">
                                가맹점에 방문하여 스탬프를 찍은 기록이 없습니다.
                            </p>
                            <p className="text-sm font-light mt-1">
                                가맹점 방문하며 스탬프를 찍으면 이곳에
                                표시됩니다.
                            </p>
                        </div>
                    )}
                </section>
            </div>
            {/* 하단 네비게이션 */}
            {customerId && <MobileFooter />}
        </div>
    );
}
export default MobileMyStamp;

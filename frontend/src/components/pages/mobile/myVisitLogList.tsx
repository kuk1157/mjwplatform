import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { MdArrowBackIosNew } from "react-icons/md"; // 이전 페이지이동 좌측 화살표 아이콘
import { MobileMain } from "src/components/organisms/mobileMain"; // 모바일 상단 타이틀
import { MobileFooter } from "src/components/organisms/mobileFooter"; // 하단 모바일 footer 공통 컴포넌트

interface VisitLog {
    id: number;
    storeId: number;
    customerId: number;
    storeName?: string;
    createdAt: string;
}

export function MobileMyVisitLogList() {
    const customerId = localStorage.getItem("customerId");
    const [visitLogs, setVisitLogs] = useState<VisitLog[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!customerId) return;

        const fetchData = async () => {
            try {
                const [visits] = await Promise.all([
                    axios.get(`/api/v1/customers/${customerId}/visits`),
                ]);

                // setMemberId(customerRes.data.memberId);
                setVisitLogs(visits.data);
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
        <div className="min-h-screen bg-white">
            <div className="p-4 mb-20">
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
                                <span>나의 방문기록 목록</span>
                            </h2>
                        </button>
                    </div>
                </div>

                {/* 방문 목록 */}
                <section>
                    {visitLogs.length > 0 ? (
                        visitLogs.map((visitLog, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-3 flex items-center"
                            >
                                <div className="flex items-center">
                                    <img
                                        src="/assets/image/mobile/visitIcon.svg"
                                        alt="방문기록 리스트 아이콘"
                                    />
                                    <div className="flex flex-col ml-3 font-Pretendard">
                                        <p className="text-xl font-semibold mb-1 ">
                                            {visitLog.storeName}
                                        </p>
                                        <p className="text-xs text-[#999ca2]">
                                            <span className="font-bold mr-2">
                                                방문 시간
                                            </span>
                                            <span className="font-normal">
                                                {visitLog.createdAt.replace(
                                                    "T",
                                                    " "
                                                )}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <section className="w-full min-h-[400px] flex flex-col items-center justify-center bg-white font-Pretendard text-[#999ca2]">
                            <img
                                src="/assets/image/mobile/noVisitIcon.svg"
                                alt="방문기록이 없습니다 아이콘"
                            />
                            <p className="text-lg font-semibold mt-2">
                                방문 기록이 없습니다.
                            </p>
                            <p className="text-sm font-light mt-1">
                                새로운 방문이 등록되면 이곳에 표시됩니다.
                            </p>
                        </section>
                    )}
                </section>
            </div>
            {/* 하단 네비게이션 */}
            {customerId && <MobileFooter />}
        </div>
    );
}
export default MobileMyVisitLogList;

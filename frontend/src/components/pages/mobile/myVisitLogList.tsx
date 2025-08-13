import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BiStore } from "react-icons/bi"; // 방문기록 리스트 제목 아이콘
import { BsBell } from "react-icons/bs"; // 방문 기록 아이콘
import { ImNotification } from "react-icons/im"; // 데이터가 없습니다 아이콘

import { MobileFooter } from "src/components/organisms/mobileFooter"; // 하단 모바일 footer 공통 컴포넌트

interface VisitLog {
    id: number;
    storeId: number;
    customerId: number;
    storeName?: string;
    createdAt: string;
}

export function MobileMyVisitLogList() {
    const { customerId } = useParams();
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
        <div className="min-h-screen bg-white p-4">
            <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                        소상공인 상생 플랫폼
                    </h2>
                </div>
            </div>

            <div className="mt-6 mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <BsBell className="w-[22px] h-[22px] text-blue-600" />
                    <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                        나의 방문기록 목록
                    </h2>
                </div>
                <div className="h-[2px] bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.15)]"></div>
            </div>

            {/* 방문 목록 */}
            <section>
                {visitLogs.length > 0 ? (
                    visitLogs.map((visitLog, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 flex items-center"
                        >
                            {/* 아이콘 or 색 포인트 */}
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4">
                                <BiStore />
                            </div>

                            {/* 기존 데이터는 그대로 */}
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-gray-900">
                                    가맹점 이름 : {visitLog.storeName}
                                </p>
                                <p className="text-xs text-gray-600">
                                    방문 시간 :{" "}
                                    {new Date(
                                        visitLog.createdAt
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 flex items-center justify-center text-black mb-3">
                            <ImNotification className="w-8 h-8" />
                        </div>
                        <p className="text-black text-sm font-semibold">
                            방문 기록이 없습니다.
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                            새로운 방문이 등록되면 이곳에 표시됩니다.
                        </p>
                    </div>
                )}
            </section>

            <div className="text-center my-6">
                <button
                    className="border-2 border-blue-600 text-blue-600 px-12 py-3 rounded-md font-semibold"
                    onClick={handleBack}
                >
                    이전
                </button>
            </div>

            {/* 하단 네비게이션 */}
            {customerId && <MobileFooter param={Number(customerId)} />}
        </div>
    );
}
export default MobileMyVisitLogList;

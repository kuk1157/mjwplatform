import { MainContainer } from "../../molecules/container";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

import { MdArrowBackIosNew } from "react-icons/md"; // 페이징 이전 아이콘
import { MdArrowForwardIos } from "react-icons/md"; // 페이징 다음 아이콘

function OwnerAllVisitLogList() {
    const { storeId } = useParams();
    const navigate = useNavigate();

    interface VisitLog {
        id: number;
        storeId: number;
        storeTableId: number;
        customerId: number;
        storeName?: string;
        memberName?: string;
        createdAt: string;
    }

    const [ownerAllLogs, setOwnerAllLogs] = useState<VisitLog[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (!storeId) return;

        const fetchData = async () => {
            try {
                const url = `/api/v1/visits/${storeId}?page=${page}&size=${pageSize}`;
                const response = await axios.get(url);
                // Page 객체 기준: content 배열만 추출
                setOwnerAllLogs(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [storeId, page, pageSize]);

    // 점주 대시보드로 이동
    const OwnerDashBoard = () => {
        navigate("/owner/dashBoard");
    };

    const maxPageButtons = 5; // 한 번에 보여줄 버튼 개수
    const startPage = Math.floor(page / maxPageButtons) * maxPageButtons;
    const endPage = Math.min(startPage + maxPageButtons, totalPages);

    return (
        <MainContainer className="py-[230px] bg-[#F6F6F6] lg:py-[150px] sm:py-[100px]">
            <div className="min-h-screen w-full max-w-[1000px] mx-auto bg-gray-50 p-8">
                <div className="w-full mx-auto">
                    <div className="mb-6 flex justify-start">
                        <button
                            onClick={OwnerDashBoard}
                            className="px-5 py-2 bg-[#E61F2C] text-white font-semibold rounded-lg"
                        >
                            대시보드로 이동
                        </button>
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                        <img
                            className="inline-block w-[45px] mr-1"
                            src="/assets/image/dashboard/pay.svg"
                            alt="결제 조회"
                        />
                        <span>전체 방문 조회</span>
                    </div>

                    {/* 테이블 content 영역 */}
                    <div className="overflow-x-auto bg-white rounded-[25px] border ml-8 mb-8">
                        <table className="min-w-full border-collapse text-[#000]">
                            <thead>
                                <tr className="bg-[#FBFBFC] uppercase text-base tracking-wide select-none">
                                    <th className="py-4 px-6 text-center">
                                        번호
                                    </th>
                                    <th className="py-4 px-6 text-center">
                                        고객 이름
                                    </th>
                                    <th className="py-4 px-6 text-center">
                                        테이블 번호
                                    </th>
                                    <th className="py-4 px-6 text-center">
                                        방문일시
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {ownerAllLogs.map((visitLog, index) => (
                                    <tr
                                        key={visitLog.id}
                                        className="transition-colors duration-200 cursor-default"
                                    >
                                        <td className="py-4 px-6 text-center whitespace-nowrap font-semibold">
                                            {page * pageSize + index + 1}
                                        </td>
                                        <td className="py-4 px-6 text-center whitespace-nowrap">
                                            {visitLog.memberName}
                                        </td>
                                        <td className="py-4 px-6 text-center whitespace-nowrap">
                                            {visitLog.storeTableId}
                                        </td>
                                        <td className="py-4 px-6 text-center whitespace-nowrap">
                                            {new Date(
                                                visitLog.createdAt
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* 페이징 영역 */}
                    <div className="flex items-center justify-center gap-2">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-4 py-2 text-[#C7CBD2] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            <MdArrowBackIosNew />
                        </button>

                        {Array.from({ length: endPage - startPage }, (_, i) => {
                            const pageNumber = startPage + i;
                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => setPage(pageNumber)}
                                    className={`px-4 py-2 flex items-center justify-center ${
                                        page === pageNumber
                                            ? "bg-[#E61F2C] text-white rounded-[25px]"
                                            : "text-[#C7CBD2] hover:text-[#E61F2C]"
                                    }`}
                                >
                                    {pageNumber + 1}
                                </button>
                            );
                        })}

                        <button
                            disabled={page + 1 >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-4 py-2 text-[#C7CBD2] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            <MdArrowForwardIos />
                        </button>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}

export default OwnerAllVisitLogList;

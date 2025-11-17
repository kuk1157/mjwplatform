import { MainContainer } from "../../molecules/container";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

import { MdArrowBackIosNew } from "react-icons/md"; // 페이징 이전 아이콘
import { MdArrowForwardIos } from "react-icons/md"; // 페이징 다음 아이콘
import { Pay } from "src/types";

function OwnerPayList() {
    const ownerId = localStorage.getItem("ownerId"); // 점주 ID 로그인 시 저장한거 추출

    const navigate = useNavigate();

    const [ownerPays, setOwnerPays] = useState<Pay[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (!ownerId) return;

        const fetchData = async () => {
            try {
                const url = `/api/v1/pay/owner/${ownerId}?page=${page}&size=${pageSize}`;
                const response = await axios.get(url);
                // Page 객체 기준: content 배열만 추출
                setOwnerPays(response.data.content || []);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [ownerId, page, pageSize]);

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
                        <span>결제 조회</span>
                    </div>
                    {/* 테이블 content 영역 */}
                    <div className="overflow-x-auto bg-white rounded-[25px] border mb-8">
                        <table className="min-w-full border-collapse text-[#000]">
                            <thead>
                                <tr className="bg-[#FBFBFC] uppercase text-base tracking-wide select-none">
                                    <th className="py-4 px-6 text-center">
                                        번호
                                    </th>
                                    <th className="py-4 px-6 text-center">
                                        결제 금액
                                    </th>
                                    <th className="py-4 px-6 text-center">
                                        할인 금액
                                    </th>
                                    <th className="py-4 px-6 text-center">
                                        최종 결제 금액
                                    </th>
                                    <th className="py-4 px-6 text-center">
                                        등록일
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {ownerPays.map((pays, index) => (
                                    <tr
                                        key={pays.id}
                                        className="transition-colors duration-200 cursor-default"
                                    >
                                        <td className="py-4 px-6 text-center whitespace-nowrap font-semibold">
                                            {page * pageSize + index + 1}
                                        </td>
                                        <td className="py-4 px-6 text-center whitespace-nowrap">
                                            {(
                                                pays.amount ?? 0
                                            ).toLocaleString()}{" "}
                                            원
                                        </td>
                                        <td className="py-4 px-6 text-center whitespace-nowrap">
                                            {(
                                                pays.discountAmount ?? 0
                                            ).toLocaleString()}{" "}
                                            원
                                        </td>
                                        <td className="py-4 px-6 text-center whitespace-nowrap font-semibold">
                                            {(
                                                pays.finalAmount ?? 0
                                            ).toLocaleString()}{" "}
                                            원
                                        </td>
                                        <td className="py-4 px-6 text-center whitespace-nowrap">
                                            {pays.createdAt
                                                ? pays.createdAt.replace(
                                                      "T",
                                                      " "
                                                  )
                                                : "데이터 없음"}
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

export default OwnerPayList;

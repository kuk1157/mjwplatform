import { MainContainer } from "../../molecules/container";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

import { MdArrowBackIosNew } from "react-icons/md"; // 페이징 이전 아이콘
import { MdArrowForwardIos } from "react-icons/md"; // 페이징 다음 아이콘

function OwnerPayLogList() {
    const { ownerId } = useParams();
    const navigate = useNavigate();

    interface OwnerPayLog {
        id: number;
        payId: number;
        amount: number;
        discountAmount: number;
        finalAmount: number;
        createdAt: string;
    }

    const [ownerPayLogs, setOwnerPayLogs] = useState<OwnerPayLog[]>([]);

    useEffect(() => {
        if (!ownerId) return;

        const fetchData = async () => {
            try {
                const url = `/api/v1/payLog/owner/${ownerId}`;
                const response = await axios.get(url);
                // Page 객체 기준: content 배열만 추출
                setOwnerPayLogs(response.data.content || []);
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [ownerId]);

    const [page, setPage] = useState(1);
    const pageSize = 5;

    const total = ownerPayLogs.length;
    const totalPages = Math.ceil(total / pageSize);

    // 현재 페이지 데이터만 자르기
    const currentData = ownerPayLogs.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    // 점주 대시보드로 이동
    const OwnerDashBoard = () => {
        navigate(`/owner/dashboard/${ownerId}`);
    };
    return (
        <MainContainer className="py-[230px] bg-[#F6F6F6] lg:py-[150px] sm:py-[100px]">
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="w-full min-w-[1000px] mx-auto">
                    <div className="mb-6 flex justify-start">
                        <button
                            onClick={OwnerDashBoard}
                            className="px-5 py-2 bg-[#E61F2C] text-white font-semibold rounded-lg"
                        >
                            대시보드로 이동
                        </button>
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-8">
                        <img
                            className="inline-block w-[45px] mr-1"
                            src="/assets/image/dashboard/payLog.svg"
                            alt="결제내역 조회"
                        />
                        <span>결제내역 조회</span>
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
                                        결제 고유번호
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
                                {currentData.map((payLogs, index) => (
                                    <tr
                                        key={payLogs.id}
                                        className="transition-colors duration-200 cursor-default"
                                    >
                                        <td className="py-4 px-6 text-center whitespace-nowrap font-semibold">
                                            {(page - 1) * pageSize + index + 1}
                                        </td>
                                        <td className="py-4 px-6 text-center whitespace-nowrap">
                                            {payLogs.payId} 번
                                        </td>
                                        <td className="py-4 px-6 text-center whitespace-nowrap">
                                            {payLogs.amount} 원
                                        </td>
                                        <td className="py-4 px-6 text-center whitespace-nowrap">
                                            {payLogs.discountAmount} 원
                                        </td>
                                        <td className="py-4 px-6 text-center whitespace-nowrap font-semibold">
                                            {payLogs.finalAmount} 원
                                        </td>
                                        <td className="py-4 px-6 text-center whitespace-nowrap">
                                            {payLogs.createdAt
                                                ? payLogs.createdAt.replace(
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
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-4 py-2 text-[#C7CBD2] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            <MdArrowBackIosNew />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setPage(i + 1)}
                                className={`px-4 py-2 flex items-center justify-center ${
                                    page === i + 1
                                        ? "bg-[#E61F2C] text-[#fff] rounded-[25px]"
                                        : "text-[#C7CBD2] hover:text-[#E61F2C]"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            disabled={page === totalPages}
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

export default OwnerPayLogList;

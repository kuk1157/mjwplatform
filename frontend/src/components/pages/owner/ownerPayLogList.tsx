import { MainContainer } from "../../molecules/container";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

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

    const [items, setItems] = useState<OwnerPayLog[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    useEffect(() => {
        if (!ownerId) return;

        const fetchData = async () => {
            try {
                const url = `/api/v1/payLog/owner/${ownerId}`;
                const response = await axios.get(url);
                // Page 객체 기준: content 배열만 추출
                setItems(response.data.content || []);
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [ownerId]);

    const handlePageClick = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    // 현재 페이지 기준 slice
    const pagedItems = items.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                        📊 결제 내역 조회{" "}
                    </h1>
                    <div className="overflow-x-auto border rounded-lg shadow-lg bg-white">
                        <table className="min-w-full divide-y divide-gray-200 table-fixed">
                            <thead className="bg-gradient-to-r from-yellow-200 to-yellow-100 sticky top-0 z-10 shadow-md">
                                <tr>
                                    {[
                                        "번호",
                                        "결제고유번호",
                                        "결제금액",
                                        "할인금액",
                                        "최종결제금액",
                                        "등록일",
                                    ].map((col, idx) => (
                                        <th
                                            key={idx}
                                            className={`px-6 py-3 text-left text-sm font-semibold text-gray-700 ${
                                                idx < 5
                                                    ? "border-r border-gray-300"
                                                    : ""
                                            }`}
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pagedItems.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-center py-10 text-gray-400"
                                        >
                                            데이터가 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    pagedItems.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-yellow-50 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200">
                                                {(currentPage - 1) *
                                                    itemsPerPage +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200">
                                                {item.payId} 번
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200">
                                                {item.amount} 원
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200">
                                                {item.discountAmount} 원
                                            </td>
                                            <td className="px-6 py-4 text-sm border-r border-gray-200">
                                                {item.finalAmount} 원
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {item.createdAt
                                                    ? item.createdAt.replace(
                                                          "T",
                                                          " "
                                                      )
                                                    : "데이터 없음"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* 중앙 정렬 페이징 */}
                    <div className="mt-6 flex justify-center space-x-2">
                        <button
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                            onClick={() => handlePageClick(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            이전
                        </button>
                        {Array.from(
                            { length: Math.min(totalPages, 10) },
                            (_, i) => (
                                <button
                                    key={i}
                                    className={`px-4 py-2 rounded transition ${
                                        currentPage === i + 1
                                            ? "bg-yellow-400 text-white shadow-md"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                    onClick={() => handlePageClick(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            )
                        )}
                        <button
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                            onClick={() => handlePageClick(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            다음
                        </button>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}

export default OwnerPayLogList;

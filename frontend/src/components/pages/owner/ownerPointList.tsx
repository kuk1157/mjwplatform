import { MainContainer } from "../../molecules/container";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

import { MdArrowBackIosNew } from "react-icons/md"; // 페이징 이전 아이콘
import { MdArrowForwardIos } from "react-icons/md"; // 페이징 다음 아이콘

function OwnerPointList() {
    const { ownerId } = useParams();
    const navigate = useNavigate();

    interface OwnerPoint {
        id: number;
        payId: number;
        orderPrice: number;
        point: number;
        createdAt: string;
    }

    const [ownerPoints, setOwnerPoints] = useState<OwnerPoint[]>([]);

    useEffect(() => {
        if (!ownerId) return;

        const fetchData = async () => {
            try {
                const url = `/api/v1/point/owner/${ownerId}`;
                const response = await axios.get(url);
                setOwnerPoints(response.data.content || []);
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [ownerId]);

    const [page, setPage] = useState(1);
    const pageSize = 5;

    const total = ownerPoints.length;
    const totalPages = Math.ceil(total / pageSize);

    // 현재 페이지 데이터만 자르기
    const currentData = ownerPoints.slice(
        (page - 1) * pageSize,
        page * pageSize
    );
    // 점주 대시보드로 이동
    const OwnerDashBoard = () => {
        navigate(`/owner/dashboard/${ownerId}`);
    };
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
                            src="/assets/image/dashboard/point.svg"
                            alt="포인트 조회"
                        />
                        <span className="leading-5">포인트 조회</span>
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
                                        주문 금액
                                    </th>
                                    <th className="py-4 px-6 text-center">
                                        점주가 받을 포인트
                                    </th>
                                    <th className="py-4 px-6 text-center">
                                        등록일
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((points, index) => (
                                    <tr
                                        key={points.id}
                                        className="transition-colors duration-200 cursor-default"
                                    >
                                        <td className="py-4 px-6 text-center whitespace-nowrap font-semibold">
                                            {(page - 1) * pageSize + index + 1}
                                        </td>
                                        <td className="py-4 px-6 text-center whitespace-nowrap">
                                            {points.payId} 번
                                        </td>
                                        <td className="py-4 px-6 text-center whitespace-nowrap">
                                            {(
                                                points.orderPrice ?? 0
                                            ).toLocaleString()}{" "}
                                            원
                                        </td>
                                        <td className="py-4 px-6 text-center whitespace-nowrap font-semibold">
                                            {(
                                                points.point ?? 0
                                            ).toLocaleString()}{" "}
                                            원
                                        </td>
                                        <td className="py-4 px-6 text-center whitespace-nowrap">
                                            {points.createdAt
                                                ? points.createdAt.replace(
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

export default OwnerPointList;

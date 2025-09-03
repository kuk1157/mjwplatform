import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MobileMain } from "src/components/organisms/mobileMain"; // 모바일 상단 타이틀
import { MobileFooter } from "src/components/organisms/mobileFooter"; // 하단 모바일 footer 공통 컴포넌트

import { MdArrowBackIosNew } from "react-icons/md"; // 이전 페이지이동 좌측 화살표 아이콘

export function MobileMyWallet() {
    const { customerId } = useParams();
    const [Wallet, setWallet] = useState(); // 지갑 세팅 (member 테이블)
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("accessToken"); // 토큰 세팅

    useEffect(() => {
        if (!customerId) return;

        if (!accessToken) {
            alert("로그인이 정상적으로 완료되지 않았습니다.");
            navigate("/user/userVisitStore");
        }

        const fetchData = async () => {
            try {
                const memberRes = await axios.get("/api/v1/member", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                setWallet(memberRes.data.walletAddress); // member에서 지갑 추출
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [customerId, accessToken, navigate]);

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
                            <span>나의 정보</span>
                        </h2>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm shadow-[#5C7BB91A] border border-gray-100 px-3 py-28 mb-3 flex items-center">
                <div className="w-full flex justify-center items-center font-Pretendard min-w-0 text-[#999ca2] text-base font-normal">
                    지갑 이미지
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm shadow-[#5C7BB91A] border border-gray-100 px-3 py-4 mb-3 flex items-center">
                <div className="flex flex-col ml-3 font-Pretendard min-w-0">
                    <p className="text-xs text-[#999ca2] flex">
                        <span className="font-normal truncate w-full">
                            {Wallet}
                        </span>
                    </p>
                </div>
            </div>

            {/* 하단 네비게이션 */}
            {customerId && <MobileFooter param={Number(customerId)} />}
        </div>
    );
}
export default MobileMyWallet;

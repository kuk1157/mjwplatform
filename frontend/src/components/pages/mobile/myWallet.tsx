import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { MobileFooter } from "src/components/organisms/mobileFooter"; // 하단 모바일 footer 공통 컴포넌트
import { IoWalletOutline } from "react-icons/io5"; // 지갑 아이콘
import { FaRegUserCircle } from "react-icons/fa"; // 나의 정보 아이콘

export function MobileMyWallet() {
    const { customerId } = useParams();
    const [Wallet, setWallet] = useState(); // 지갑 세팅 (member 테이블)
    const [memberName, setMemberName] = useState(); // name 세팅 (member 테이블)
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("accessToken"); // 토큰 세팅

    useEffect(() => {
        if (!customerId) return;

        const fetchData = async () => {
            try {
                console.log(accessToken);
                const memberRes = await axios.get("/api/v1/member", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                setWallet(memberRes.data.walletAddress); // member에서 지갑 추출
                setMemberName(memberRes.data.name); // member에서 name 추출

                console.log(memberRes.data);
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [customerId, accessToken]);

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
                    <FaRegUserCircle className="w-[22px] h-[22px] text-blue-600" />
                    <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                        나의 정보
                    </h2>
                </div>
                <div className="h-[2px] bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.15)]"></div>
            </div>

            <div className="mx-4 mb-6 px-4 py-5 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white text-center rounded-xl ">
                <p>DID</p>
                <span className="mb-3 block break-words">{Wallet}</span>
                <p>이름 : {memberName}</p>
            </div>

            <div className="mx-4 px-4 py-5 bg-gradient-to-r from-sky-200 via-sky-400 to-sky-600 text-white text-center rounded-xl ">
                <p>
                    <IoWalletOutline className="inline-block text-4xl"></IoWalletOutline>
                </p>
                <p className="mt-3">나의 지갑 정보</p>
            </div>

            <div className="text-center my-6">
                <button
                    className="border-2 border-[#21a089] text-[#21a089] px-12 py-3 rounded-md"
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
export default MobileMyWallet;

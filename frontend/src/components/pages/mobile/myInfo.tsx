// import { BiStore } from "react-icons/bi"; // 소상공인 상생플랫폼 제목 아이콘
import { useNavigate, useParams } from "react-router-dom";
// import { RiNftLine } from "react-icons/ri"; // 최근 nft 아이콘
import { IoWalletOutline } from "react-icons/io5"; // 지갑 아이콘

import { MobileFooter } from "src/components/organisms/mobileFooter"; // 하단 모바일 footer 공통 컴포넌트

export function MobileMyInfo() {
    const { customerId } = useParams();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // 뒤로 가기
    };

    return (
        <div className="min-h-screen bg-white p-4">
            <div className="mb-3 font-bold text-lg">나의 정보</div>

            <div className="mx-4 mb-6 px-4 py-5 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white text-center rounded-xl ">
                <p>DID</p>
                <p className="mb-3">askdjqwkandqwkdjdqa;lidkoadhijasd</p>
                <p>이름 : 문정원</p>
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
export default MobileMyInfo;

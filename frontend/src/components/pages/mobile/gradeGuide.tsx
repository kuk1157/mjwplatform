import { useNavigate } from "react-router-dom";

// [아이콘 및 공통 컴포넌트]
import { MdArrowBackIosNew } from "react-icons/md"; // 이전 페이지이동 좌측 화살표 아이콘
import { MobileMain } from "src/components/organisms/mobileMain"; // 모바일 상단 타이틀
import { MobileFooter } from "src/components/organisms/mobileFooter"; // 하단 모바일 footer 공통 컴포넌트
import { MobileFooter2 } from "src/components/organisms/mobileFooter2"; // 하단 모바일 footer 공통 컴포넌트

export function MobileGradeGuide() {
    const navigate = useNavigate();
    const customerId = localStorage.getItem("customerId"); // 고객 번호 localStroage
    const handleBack = () => {
        navigate(-1); // 뒤로 가기
    };

    return (
        <div className="min-h-screen bg-white p-4 font-Pretendard">
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
                            <span>고객 등급 안내 {""}(등업 기준)</span>
                        </h2>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-3 flex items-center">
                <div className="flex items-center">
                    <img
                        src="/assets/image/customerGrade/silverGrade.png"
                        alt="실버"
                        className="w-12 h-12 rounded-md object-cover"
                    />
                    <div className="flex flex-col ml-3 font-Pretendard">
                        <p className="text-xl font-semibold mb-1">
                            실버(SILVER)
                        </p>
                        <p className="text-sm mb-1 text-[#999CA2]">
                            - 가게 1개 방문(최초)
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-3 flex items-center">
                <div className="flex items-center">
                    <img
                        src="/assets/image/customerGrade/goldGrade.png"
                        alt="골드"
                        className="w-12 h-12 rounded-md object-cover"
                    />
                    <div className="flex flex-col ml-3 font-Pretendard">
                        <p className="text-xl font-semibold mb-1">골드(GOLD)</p>
                        <p className="text-sm mb-1 text-[#999CA2]">
                            - 가게 4개 방문
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-3 flex items-center">
                <div className="flex items-center">
                    <img
                        src="/assets/image/customerGrade/platinumGrade.png"
                        alt="플래티넘"
                        className="w-12 h-12 rounded-md object-cover"
                    />
                    <div className="flex flex-col ml-3 font-Pretendard">
                        <p className="text-xl font-semibold mb-1">
                            플래티넘(PLATINUM)
                        </p>
                        <p className="text-sm mb-1 text-[#999CA2]">
                            - 가게 7개 방문
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-3 flex items-center">
                <div className="flex items-center">
                    <img
                        src="/assets/image/customerGrade/diamondGrade.png"
                        alt="다이아"
                        className="w-12 h-12 rounded-md object-cover"
                    />
                    <div className="flex flex-col ml-3 font-Pretendard">
                        <p className="text-xl font-semibold mb-1">
                            다이아(DIAMOND)
                        </p>
                        <p className="text-sm mb-1 text-[#999CA2]">
                            - 모든 가게 방문(10개)
                        </p>
                    </div>
                </div>
            </div>

            <div className="text-[#999CA2] text-sm border-t py-3">
                <p className="text-sm">
                    가게 방문 시 자동으로 스탬프가 발급됩니다.
                </p>
                <p className="font-semibold my-1">
                    [ 스탬프 개수 = 가게 방문 ]
                </p>
                <p className="text-xs">
                    ※ 비정상적으로 스탬프를 발급 받을 경우 등급은 초기화 됩니다.
                </p>
            </div>

            {/* 하단 네비게이션 */}
            {customerId ? <MobileFooter /> : <MobileFooter2 />}
        </div>
    );
}
export default MobileGradeGuide;

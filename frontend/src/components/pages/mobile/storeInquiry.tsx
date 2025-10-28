import { useNavigate } from "react-router-dom";

// [파일 첨부 경로]

// [아이콘 및 공통 컴포넌트]
import { MdArrowBackIosNew } from "react-icons/md"; // 이전 페이지이동 좌측 화살표 아이콘
import { MobileMain } from "src/components/organisms/mobileMain"; // 모바일 상단 타이틀
import { MobileFooter } from "src/components/organisms/mobileFooter"; // 하단 모바일 footer 공통 컴포넌트
import { MobileFooter2 } from "src/components/organisms/mobileFooter2"; // 하단 모바일 footer 공통 컴포넌트

// [공통 데이터 인터페이스]

export function MobileStoreInquiry() {
    const navigate = useNavigate();
    const customerId = localStorage.getItem("customerId"); // 고객 번호 localStroage

    if (customerId) {
        navigate(-1);
    }

    const handleBack = () => {
        navigate(-1); // 뒤로 가기
    };

    // 이전 버튼
    const inquirySubmitButton = () => {
        navigate("/mobile/inquiryCreate");
    };

    // 이전 버튼
    const inquirySearchButton = () => {
        navigate("/mobile/inquirySearch");
    };

    return (
        <div className="min-h-screen bg-white font-Pretendard">
            <div className="p-4 mb-20">
                {/* 모바일 타이틀 */}
                {<MobileMain param={Number(customerId)} />}

                <div className="mt-8 mb-5">
                    <div className="flex items-center gap-2 mb-2">
                        <button
                            className="w-full flex items-center justify-between"
                            onClick={handleBack}
                        >
                            <h2 className="text-2xl font-semibold flex items-center">
                                <span className="mr-2">
                                    <MdArrowBackIosNew />
                                </span>
                                <span> 입점 문의</span>
                            </h2>
                        </button>
                    </div>
                </div>

                <div className="flex mb-5 w-full justify-center shadow-md py-20">
                    <button
                        type="button"
                        className="bg-[#580098] text-[#fff] p-3 rounded-md mr-3"
                        onClick={inquirySubmitButton}
                    >
                        입점 문의
                    </button>
                    <button
                        type="button"
                        className="border border-[#580098] text-[#580098] p-3 rounded-md "
                        onClick={inquirySearchButton}
                    >
                        문의 확인
                    </button>
                </div>
            </div>

            {/* 하단 네비게이션 */}
            {customerId ? <MobileFooter /> : <MobileFooter2 />}
        </div>
    );
}
export default MobileStoreInquiry;

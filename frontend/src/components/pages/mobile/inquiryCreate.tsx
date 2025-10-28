import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// [파일 첨부 경로]

// [아이콘 및 공통 컴포넌트]
import { MdArrowBackIosNew } from "react-icons/md"; // 이전 페이지이동 좌측 화살표 아이콘
import { MobileMain } from "src/components/organisms/mobileMain"; // 모바일 상단 타이틀
import { MobileFooter } from "src/components/organisms/mobileFooter"; // 하단 모바일 footer 공통 컴포넌트
import { MobileFooter2 } from "src/components/organisms/mobileFooter2"; // 하단 모바일 footer 공통 컴포넌트

// [공통 데이터 인터페이스]

export function MobileStoreInquiryCreate() {
    const navigate = useNavigate();
    const customerId = localStorage.getItem("customerId"); // 고객 번호 localStroage

    const handleBack = () => {
        navigate(-1); // 뒤로 가기
    };

    const inquirySearch = () => {
        alert("등록이 완료되었습니다.");
    };

    const [formData, setFormData] = useState({
        storeName: "",
        ownerName: "",
        phoneNumber: "",
        address: "",
        password: "",
    });

    const openPostcode = () => {
        new window.daum.Postcode({
            oncomplete: (data: any) => {
                console.log("선택된 주소 데이터:", data);
                console.log(data.roadAddress);
                const finalAddress = data.roadAddress;

                // data.roadAddress, data.jibunAddress 등 활용 가능
                setFormData((prev) => ({
                    ...prev,
                    address: finalAddress,
                }));
            },
        }).open();
    };

    // 외부 스크립트 로드
    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

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
                                <span> 입점 문의 등록</span>
                            </h2>
                        </button>
                    </div>
                </div>

                <div className="mb-5 p-5 w-full flex flex-col shadow-md">
                    <div className="flex flex-col">
                        <span className="w-full flex mb-2 font-bold">
                            상호 이름
                        </span>
                        <input
                            type="text"
                            name="storeName"
                            className="w-full flex border px-3 py-2"
                            placeholder="상호 이름 입력"
                        ></input>
                    </div>
                    <div className="flex flex-col my-7">
                        <span className="w-full flex mb-2 font-bold">
                            점주 이름
                        </span>
                        <input
                            type="text"
                            name="ownerName"
                            className="w-full flex border px-3 py-2"
                            placeholder="점주 이름 입력"
                        ></input>
                    </div>
                    <div className="flex flex-col">
                        <span className="w-full flex mb-2 font-bold">
                            전화번호
                        </span>
                        <input
                            type="text"
                            name="phoneNumber"
                            className="w-full flex border px-3 py-2"
                            placeholder="전화번호 입력"
                        ></input>
                    </div>

                    <div className="flex flex-col my-7">
                        <span className="w-full flex mb-2 font-bold">주소</span>
                        <div className="w-full flex">
                            <input
                                type="text"
                                className="w-full flex border px-3 py-2 mr-3"
                                name="address"
                                placeholder="주소 검색"
                                value={formData.address}
                                disabled
                            ></input>
                            <button
                                type="button"
                                className="bg-[#580098] text-[#fff] p-3 w-24 rounded-md"
                                onClick={openPostcode}
                            >
                                검색
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="w-full flex mb-2 font-bold">
                            비밀번호
                        </span>
                        <input
                            type="password"
                            name="password"
                            className="w-full flex border px-3 py-2"
                            placeholder="문의 비밀번호 입력"
                        ></input>
                    </div>
                    <div className="flex w-full justify-center mt-7">
                        <button
                            type="button"
                            className="bg-[#580098] text-[#fff] p-3 w-24 rounded-md mr-3"
                            onClick={inquirySearch}
                        >
                            완료
                        </button>
                        <button
                            type="button"
                            className="border border-[#580098] text-[#580098] p-3 w-24 rounded-md "
                            onClick={handleBack}
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>

            {/* 하단 네비게이션 */}
            {customerId ? <MobileFooter /> : <MobileFooter2 />}
        </div>
    );
}
export default MobileStoreInquiryCreate;

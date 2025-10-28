import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchUser } from "src/utils/userApi";
import { useQuery } from "react-query";

// [아이콘 및 공통 컴포넌트]
import { MainContainer } from "src/components/molecules/container";
import { MenuList } from "src/constants/index";
import { useTranslation } from "react-i18next";

// [공통 데이터 인터페이스]
function HomePageStoreInquirySearch() {
    const { data: user } = useQuery(
        ["userSelectorUpdated"], // 기존 selector 이름 그대로 key 사용
        fetchUser,
        {
            enabled: !!localStorage.getItem("accessToken"), // 토큰 있을 때만 실행
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
        }
    );

    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            navigate("/", { replace: true });
        }
    }, [user, navigate]);
    // 이전 버튼
    const backButton = () => {
        navigate(-1);
    };

    // 완료
    const inquirySubmitButton = () => {
        alert("검색이 완료되었습니다.");
    };

    // 취소
    const inquirySearchButton = () => {
        navigate(-1);
    };

    const { t } = useTranslation(["header"]);
    const nowLink = "/inquiry/storeInquiry";

    const [formData, setFormData] = useState({
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
        <MainContainer className="bg-[#FFF] py-[100px] lg:py-[150px] sm:py-[100px] xs:py-[60px]">
            <div className="w-full">
                <div className="w-full bg-[#FFF] p-6">
                    <div className="w-[1700px] m-auto flex">
                        <div className="h-[300px] w-[175px] p-5 py-10 bg-[#580098] text-[#fff] rounded-3xl text-center">
                            {MenuList?.map((menu) => {
                                return (
                                    <Link to={`${menu.path}`}>
                                        <p
                                            className={`my-1 ${menu.path === nowLink ? "opacity-100 font-bold" : "opacity-30"}`}
                                        >
                                            {t(`${menu.name}`)}
                                        </p>
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="flex flex-col w-[1450px] bg-[#fff] shadow-2xl px-20 py-10 ml-20">
                            <div className="w-full mb-10">
                                <button
                                    type="button"
                                    className="border border-[#580098] rounded-md text-[#580098] h-[43px] px-8"
                                    onClick={backButton}
                                >
                                    이전
                                </button>
                            </div>
                            <div className="w-full mb-20 max-w-[500px] mx-auto text-xl">
                                <div className="w-full flex mb-10">
                                    <span className="w-32 leading-[54px] font-bold">
                                        주소
                                    </span>
                                    <div className="w-full flex">
                                        <input
                                            type="text"
                                            className="border py-3 px-6 w-[235px] flex ml-[26px] mr-3"
                                            name="address"
                                            placeholder="주소 입력"
                                            disabled
                                            value={formData.address}
                                        ></input>
                                        <button
                                            type="button"
                                            className="text-xl w-20 bg-[#580098] text-[#fff] rounded-md"
                                            onClick={openPostcode}
                                        >
                                            검색
                                        </button>
                                    </div>
                                </div>

                                <div className="w-full flex">
                                    <span className="w-32 leading-[54px] font-bold">
                                        비밀번호
                                    </span>
                                    <input
                                        type="password"
                                        className="border py-3 px-6"
                                        name="password"
                                        placeholder="비밀번호 입력"
                                    ></input>
                                </div>
                            </div>
                            <div className="mx-auto w-full text-center">
                                <button
                                    type="button"
                                    className="text-xl px-10 py-3 bg-[#580098] text-[#fff] rounded-md mr-3"
                                    onClick={inquirySubmitButton}
                                >
                                    완료
                                </button>
                                <button
                                    type="button"
                                    className="text-xl px-10 py-3 border border-[#580098] text-[#580098] rounded-md"
                                    onClick={inquirySearchButton}
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}

export default HomePageStoreInquirySearch;

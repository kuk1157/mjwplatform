import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchUser } from "src/utils/userApi";
import { useQuery } from "react-query";

// [아이콘 및 공통 컴포넌트]
import { MainContainer } from "src/components/molecules/container";
import { MenuList } from "src/constants/index";
import { useTranslation } from "react-i18next";

// [공통 데이터 인터페이스]
function HomePageStoreInquiry() {
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

    // 이전 버튼
    const inquirySubmitButton = () => {
        navigate("/inquiry/storeInquiryCreate");
    };

    // 이전 버튼
    const inquirySearchButton = () => {
        navigate("/inquiry/storeInquirySearch");
    };

    const { t } = useTranslation(["header"]);
    const location = useLocation();
    const nowLink = location.pathname;

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
                            <div className="mx-auto w-full text-center">
                                <button
                                    type="button"
                                    className="text-xl px-5 py-3 bg-[#580098] text-[#fff] rounded-md mr-3"
                                    onClick={inquirySubmitButton}
                                >
                                    입점 문의
                                </button>
                                <button
                                    type="button"
                                    className="text-xl px-5 py-3 border border-[#580098] text-[#580098] rounded-md"
                                    onClick={inquirySearchButton}
                                >
                                    문의 확인
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}

export default HomePageStoreInquiry;

import { Button } from "../atoms/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { MenuList } from "src/constants/index";
import shortid from "shortid";
import { useTranslation } from "react-i18next";
import i18n from "src/language";
import { useQuery } from "react-query";
import { fetchUser } from "src/utils/userApi";

import { SiHomeassistantcommunitystore } from "react-icons/si";

interface NavProps {
    mainMenu: any;
}

export const AccessDeny = (user: any, pathname: string) => {
    const role = user.length !== 0 ? "" : user.role;
    if (
        (pathname.includes("coaching-room") || pathname.includes("zoom")) &&
        (user.length === 0 || role.includes(["admin", "consultant"]))
    ) {
        return true;
    } else {
        return false;
    }
};
const Nav = ({ mainMenu }: NavProps) => {
    const { t } = useTranslation(["header"]);
    const languageRef = useRef<null | HTMLDivElement>(null);
    const pathname = useLocation().pathname;
    const [isLanguageMenuOpen, setLanguageMenuOpen] = useState<boolean>(false);
    // const [languageTitle, setLanguageTitle] = useState<string>("한국어");

    // 외부 클릭 시 닫기
    const handleUserClose = useCallback(
        (e: any) => {
            if (
                isLanguageMenuOpen &&
                languageRef.current !== null &&
                !languageRef.current.contains(e.target)
            )
                setLanguageMenuOpen(false);
        },
        [isLanguageMenuOpen]
    );
    useEffect(() => {
        document.addEventListener("click", handleUserClose);
        return () => document.removeEventListener("click", handleUserClose);
    }, [handleUserClose]);
    // 언어 변경하기
    // const changeLanguage = (lang: string) => {
    //     i18n.changeLanguage(lang);
    //     setLanguageMenuOpen(false);
    //     setLanguageTitle(lang === "en" ? "English" : "한국어");
    //     localStorage.setItem("lang", lang);
    // };
    // useEffect(() => {
    //     const lang = localStorage.getItem("lang");
    //     setLanguageTitle(lang === "en" ? "English" : "한국어");
    // }, []);
    return (
        <nav className="h-full w-1/2 flex flex-1 items-center xl:px-[20px]">
            <ul className="w-full h-full flex flex-wrap gap-[3%] lg:px-5">
                <>
                    {mainMenu?.map((menu: any) => {
                        return (
                            <li
                                key={"nav" + shortid.generate()}
                                className="flex items-center justify-center w-fit h-full"
                            >
                                <Link
                                    to={menu.path}
                                    className={`w-full h-fit font-Pretendard text-[20px] leading-[24px] text-[#000] font-semibold cursor-pointer  lg:text-[18px] xs:text-[16px]
                                        hover:text-[#2A2F3C99]
                                     ${pathname.includes(menu.path) ? "text-[#580098]" : ""}`}
                                >
                                    {t(`${menu.name}`)}
                                </Link>
                            </li>
                        );
                    })}
                    {/* <li className="flex items-center">
                        <div
                            ref={languageRef}
                            className="header-gnb-nav-link lang-en w-full h-fit font-Pretendard text-[20px] relative leading-[19px] text-[#2A2F3C] font-medium cursor-pointer lg:text-[18px] xs:text-[16px]"
                            role="button"
                            tabIndex={0}
                            onClick={() => setLanguageMenuOpen((prev) => !prev)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    setLanguageMenuOpen((prev) => !prev);
                                }
                            }}
                        >
                            {languageTitle}
                            {isLanguageMenuOpen && (
                                <ul className="header-gnb-nav-link-dropDown absolute right-[-15px] text-center rounded-lg bg-[#fff] whitespace-nowrap mt-3 z-20">
                                    <li className="header-gnb-nav-link-dropDown-item hover:text-[#2072FF] py-3 px-5">
                                        <button
                                            type="button"
                                            onClick={() => changeLanguage("ko")}
                                        >
                                            한국어
                                        </button>
                                    </li>
                                    <li className="header-gnb-nav-link-dropDown-item hover:text-[#2072FF] py-3">
                                        <button
                                            type="button"
                                            onClick={() => changeLanguage("en")}
                                        >
                                            English
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </li> */}
                </>
            </ul>
        </nav>
    );
};

const HamburgerMenu = ({ ...props }) => {
    const { openHamburger } = props;
    const { t } = useTranslation("core");
    const [activeMain, setActiveMain] = useState<any>(undefined);
    const navigate = useNavigate();
    const location = useLocation().pathname;

    const languageRef = useRef<null | HTMLDivElement>(null);
    const [isLanguageMenuOpen, setLanguageMenuOpen] = useState<boolean>(false);
    const [languageTitle, setLanguageTitle] = useState<string>("한국어");

    // 언어 변경하기
    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setLanguageMenuOpen(false);
        setLanguageTitle(lang === "en" ? "English" : "한국어");
        localStorage.setItem("lang", lang);
    };
    useEffect(() => {
        const lang = localStorage.getItem("lang");
        setLanguageTitle(lang === "en" ? "English" : "한국어");
    }, []);

    useEffect(() => {
        if (activeMain?.path) navigate(`${activeMain?.path}`);
    }, [activeMain, navigate]);
    return (
        <nav
            className={`h-screen bg-white top-[100px] right-0 flex z-10 xs:top-[70px] ${openHamburger ? "fixed" : "absolute"} w-[300px]`}
        >
            <div className="w-full h-full flex flex-col border-l border">
                {MenuList?.map((menu: any, index: number) => {
                    return (
                        <button
                            key={"mainMenu" + index}
                            className={`border-b w-full py-4 px-7 text-left text-[#2A2F3C] xs:py-4 xs:px-6 hover:bg-[#e7e7e7] ${activeMain == undefined && location.includes(menu.path) ? "bg-gradient-to-r from-[#46ac72] from-10% via-[#21A089e0] via-50% to-[#21A089] to-90% hover:bg-[#f4f4f4] text-white" : ""} ${menu.id === activeMain?.id ? "bg-gradient-to-r from-[#46ac72] from-10% via-[#21A089e0] via-50% to-[#21A089] to-90% hover:bg-[#f4f4f4] text-white" : ""}`}
                            onClick={() => {
                                setActiveMain(menu);
                            }}
                        >
                            <p
                                className={`w-full h-full font-Pretendard font-bold cursor-pointer text-[15px] text-nowrap`}
                            >
                                {t(menu.name)}
                            </p>
                        </button>
                    );
                })}
                <li className="flex items-center">
                    <div
                        ref={languageRef}
                        className="header-gnb-nav-link lang-en w-full h-fit font-Pretendard text-[15px] relative leading-[19px] text-[#2A2F3C] font-bold cursor-pointer py-[16px] px-[28px]"
                        role="button"
                        tabIndex={0}
                        onClick={() => setLanguageMenuOpen((prev) => !prev)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                setLanguageMenuOpen((prev) => !prev);
                            }
                        }}
                    >
                        {languageTitle}
                        {isLanguageMenuOpen && (
                            <ul className="header-gnb-nav-link-dropDown absolute left-[8px] text-center rounded-lg bg-[#e7e7e7] whitespace-nowrap mt-3 z-20">
                                <li className="header-gnb-nav-link-dropDown-item hover:text-[#008E80] py-3 px-5">
                                    <button
                                        type="button"
                                        onClick={() => changeLanguage("ko")}
                                    >
                                        한국어
                                    </button>
                                </li>
                                <li className="header-gnb-nav-link-dropDown-item hover:text-[#008E80] py-3">
                                    <button
                                        type="button"
                                        onClick={() => changeLanguage("en")}
                                    >
                                        English
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>
                </li>
            </div>
        </nav>
    );
};

const NavSide = ({ ...props }) => {
    const { openHamburger, setOpenHamburger, isLarge } = props;
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
    const [openToggle, setOpenToggle] = useState<boolean>(false);
    const handleLogout = () => {
        localStorage.clear();
        location.reload();
        window.location.replace("/");
    };
    const path = useLocation().pathname;
    useEffect(() => {
        setOpenToggle(false);
    }, [path]);
    return (
        <div className="flex gap-[30px] w-full max-w-[25%] justify-end lg:max-w-none font-Pretendard">
            {user?.name ? (
                <div className="flex items-center gap-[20px] xl:gap-2 xl:text-[13px]">
                    <div className="relative flex justify-center">
                        <Button
                            onClick={() => setOpenToggle(!openToggle)}
                            className="xs:hidden xxs:hidden bg-[#FFFFFF] rounded-[25px] py-[15px] px-[18px] max-h-[31px] text-sm font-Pretendard font-semibold text-[#000000] border border-[#C7CBD24D]"
                        >
                            {user?.name}님
                        </Button>

                        <Button
                            onClick={() => setOpenToggle(!openToggle)}
                            className="hidden xs:block xxs:block text-xs font-Pretendard font-semibold text-[#000000]"
                        >
                            {user?.name}
                        </Button>
                        {openToggle && (
                            <div className="absolute w-[170px] bg-white border border-[rgba(0,0,0,0.16)] rounded-[15px] shadow-[0px_0px_3px_rgba(0,0,0,0.16)] top-[40px] z-20">
                                <div className="py-[15px] px-[20px] flex flex-col gap-[10px] items-start">
                                    {user?.role === "owner" && (
                                        <Link
                                            to={`/owner/dashboard`}
                                            className="text-[15px] text-[#000] font-medium leading-[18px] tracking-[-0.6px] flex justify-center"
                                            onClick={() =>
                                                setOpenToggle(!openToggle)
                                            }
                                        >
                                            <SiHomeassistantcommunitystore className="w-[20px] h-[24px] text-[#ccc] flex-shrink-0" />
                                            <span className="ml-2 text-base">
                                                점주용 대시보드
                                            </span>
                                        </Link>
                                    )}

                                    {user?.role.includes("admin") ? (
                                        <Link
                                            to={"/admin"}
                                            className="text-[15px] text-[#666] font-medium leading-[18px] tracking-[-0.6px]"
                                        >
                                            관리자페이지
                                        </Link>
                                    ) : (
                                        <Link
                                            to={"/myPage/myInfo"}
                                            className="text-[15px] text-[#000] font-medium leading-[18px] tracking-[-0.6px] flex justify-center"
                                        >
                                            <img
                                                src="/assets/icon/hamburger_myInfo.svg"
                                                alt=""
                                            />
                                            <span className="ml-2 text-base">
                                                내 정보
                                            </span>
                                        </Link>
                                    )}

                                    <button onClick={handleLogout}>
                                        <span className="text-[15px] text-[#000] font-medium leading-[18px] tracking-[-0.6px] flex justify-center">
                                            <img
                                                src="/assets/icon/hamburger_logout.svg"
                                                alt=""
                                            />
                                            <span className="ml-2 text-base">
                                                로그아웃
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <Link to="/login">
                    <Button className="bg-[#E61F2C] rounded-[25px] py-[10px] px-[18.5px]">
                        <span className="text-[13px] leading-[15px] tracking-[-0.26px] text-[#FFFFFF] font-semibold font-Pretendard whitespace-pre">
                            로그인
                        </span>
                    </Button>
                </Link>
            )}

            {isLarge && (
                <Button onClick={() => setOpenHamburger(!openHamburger)}>
                    <img src="/assets/icon/hamburger.svg" alt="" />
                </Button>
            )}
        </div>
    );
};

interface PathMenuProps {
    mainMenu?: any;
}
const PathMenu = ({ mainMenu }: PathMenuProps) => {
    return (
        <>
            <div className="mb-[50px] flex font-Pretendard text-[15px] gap-[15px] items-center md:text-[13px] md:mb-[20px] flex-wrap">
                <span className="flex items-center">
                    <img
                        src="/assets/icon/home.svg"
                        alt=""
                        className="w-[12px] h-[12px]"
                    />
                    <Link
                        to={"/"}
                        className="ml-[5px] text-[#888] text-opacity-60 text-nowrap"
                    >
                        홈
                    </Link>
                </span>
                {mainMenu && (
                    <>
                        <img
                            src="/assets/icon/right_arrow_sm.svg"
                            alt=""
                            className="opacity-60"
                        />
                        <Link
                            to={mainMenu?.path}
                            className="text-[#888] text-opacity-60 text-nowrap"
                        >
                            {mainMenu?.name}
                        </Link>
                    </>
                )}
            </div>
        </>
    );
};
Nav.displayName = "Nav";
NavSide.displayName = "NavSide";
PathMenu.displayName = "PathMenu";
HamburgerMenu.displayName = "PathMenu";

export { Nav, NavSide, PathMenu, HamburgerMenu };

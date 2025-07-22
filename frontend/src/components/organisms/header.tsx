import { Nav, HamburgerMenu, NavSide } from "../molecules/menu";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PrimaryContainer } from "../molecules/container";
import { useMediaQuery } from "../../utils/useMediaQuery";
import { MenuList } from "../../constants/index";

const Header = () => {
    const [openHamburger, setOpenHamburger] = useState<boolean>(false);
    const [mainMenu, setMainMenu] = useState<any>();

    const isLarge = useMediaQuery("(max-width: 1023px)");
    useEffect(() => {
        setOpenHamburger(false);
    }, []);

    useEffect(() => {
        setMainMenu(MenuList?.filter((menu: any) => menu.parent_id == null));
    }, []);

    useEffect(() => {
        if (openHamburger && isLarge) {
            document.body.style.overflow = "hidden"; // 스크롤 비활성화
        } else {
            document.body.style.overflow = "auto"; // 스크롤 활성화
        }
        return () => {
            document.body.style.overflow = "auto"; // 컴포넌트 언마운트 시 원래대로 복원
        };
    }, [openHamburger, isLarge]);

    return (
        <header className="fixed z-20 top-0 w-full">
            <div
                className={`w-full h-[100px] xs:h-[70px] backdrop-blur-[10px] bg-[rgba(255,255,255,0.9)] shadow-[0px_0px_10px_#43475233] flex justify-center z-[1000] top-0 ${openHamburger ? "fixed" : "relative"}`}
            >
                <PrimaryContainer className="px-[100px] items-center justify-between">
                    <Link
                        to={"/"}
                        onClick={() => setOpenHamburger(false)}
                        className="w-1/4 xs:w-fit"
                    >
                        <img
                            // 임시 이미지
                            src="/assets/image/logo.svg"
                            alt="logo"
                            className="cursor-pointer w-[264px] lg:min-w-[204px] md:min-w-[174px]"
                        />
                    </Link>
                    {!isLarge && <Nav mainMenu={mainMenu} />}

                    <NavSide
                        openHamburger={openHamburger}
                        setOpenHamburger={setOpenHamburger}
                        isLarge={isLarge}
                    />
                </PrimaryContainer>
                {openHamburger && (
                    <>
                        <div
                            className={
                                !isLarge || openHamburger
                                    ? "bg-[#333333] bg-opacity-80 w-full h-screen fixed top-[100px] bottom-0 z-10"
                                    : ""
                            }
                            onClick={() => {
                                setOpenHamburger(false);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                    setOpenHamburger(false);
                                }
                            }}
                            tabIndex={0}
                            role="button"
                        ></div>
                        <HamburgerMenu
                            openHamburger={openHamburger}
                            setOpenHamburger={setOpenHamburger}
                            isLarge={isLarge}
                        />
                    </>
                )}
            </div>
        </header>
    );
};

export { Header };

import { useNavigate } from "react-router-dom";
// 메뉴 타입 정의
type MenuItem = {
    label: string;
    path: string; // 해당 메뉴 링크
    iconName: string; // 이미지 파일 이름 (확장자 포함)
    matchPaths?: string[]; // 추가: 포함 체크할 경로 배열
};

// 메뉴 데이터
const menuList: MenuItem[] = [
    { label: "홈", path: `/mobile/mainPageTest`, iconName: "home.svg" },
    {
        label: "공지사항",
        path: `/mobile/noticeList`,
        iconName: "nftGallery.svg",
        matchPaths: ["/mobile/noticeList", "/mobile/noticeDetail"],
    },
    {
        label: "가맹점",
        path: `/mobile/storeList`,
        iconName: "visit.svg",
        matchPaths: ["/mobile/storeList", "/mobile/storeDetail"],
    },
    {
        label: "없음",
        path: `/mobile/mainPageTest`,
        iconName: "myInfo.svg",
        matchPaths: ["/mobile/myPage", "/mobile/myWallet"],
    },
];

const MobileFooter2 = () => {
    const navigate = useNavigate();
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-md font-Pretendard">
            <div className="flex justify-around items-center h-16 border-t">
                {menuList.map((menu) => {
                    const fullPath = `${menu.path}`; // param 붙인 실제 URL
                    const isActive = menu.matchPaths
                        ? menu.matchPaths.some((p) =>
                              location.pathname.startsWith(p)
                          )
                        : location.pathname === fullPath;

                    const imgSrc = isActive
                        ? `/assets/image/mobile/active/${menu.iconName}`
                        : `/assets/image/mobile/non-active/${menu.iconName}`;

                    return (
                        <button
                            key={menu.label}
                            className="flex flex-col items-center justify-center text-sm cursor-pointer select-none"
                            onClick={() => navigate(fullPath)}
                        >
                            <span className="text-xl">
                                <img
                                    src={imgSrc}
                                    alt={`${menu.label} 이미지`}
                                    className="w-6 h-6"
                                />
                            </span>
                            <span
                                className={`mt-1 font-normal ${
                                    isActive
                                        ? "text-[#e61f2c]"
                                        : "text-[#c7cbd2]"
                                }`}
                            >
                                {menu.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export { MobileFooter2 };

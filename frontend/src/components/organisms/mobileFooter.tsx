import { useNavigate, useLocation } from "react-router-dom";
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
        label: "NFT 갤러리",
        path: `/mobile/myNftList`,
        iconName: "nftGallery.svg",
        matchPaths: ["/mobile/myNftList", "/mobile/nftDetail"],
    },
    {
        label: "방문 기록",
        path: `/mobile/myVisitLogList`,
        iconName: "visit.svg",
    },
    {
        label: "나의 정보",
        path: `/mobile/myPage`,
        iconName: "myInfo.svg",
        matchPaths: ["/mobile/myPage", "/mobile/myWallet"],
    },
    {
        label: "나의 스탬프",
        path: `/mobile/myStamp`,
        iconName: "visit.svg",
    },
];

const MobileFooter = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-md font-Pretendard">
            <div className="flex justify-around items-center h-16">
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

export { MobileFooter };

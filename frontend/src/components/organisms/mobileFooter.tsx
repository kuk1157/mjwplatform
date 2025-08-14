import { useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5"; // 홈 아이콘
import { GrGallery } from "react-icons/gr"; // NFT 갤러리 아이콘
import { BsBell } from "react-icons/bs"; // 방문 기록 아이콘
import { FaRegUserCircle } from "react-icons/fa"; // 나의 정보 아이콘

interface MobileFooterProps {
    param: number;
}

const MobileFooter = ({ param }: MobileFooterProps) => {
    const navigate = useNavigate();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-md">
            <div className="flex justify-around items-center h-16">
                <button
                    className="flex flex-col items-center justify-center text-sm text-black cursor-pointer hover:text-blue-600 transition-colors select-none"
                    onClick={() => navigate(`/mobile/mainPage/${param}`)}
                >
                    <span className="text-xl">
                        <IoHomeOutline />
                    </span>
                    <span className="mt-1">홈</span>
                </button>

                <button
                    className="flex flex-col items-center justify-center text-sm text-black cursor-pointer hover:text-blue-600 transition-colors select-none"
                    onClick={() => navigate(`/mobile/myNftList/${param}`)}
                >
                    <span className="text-xl">
                        <GrGallery />
                    </span>
                    <span className="mt-1">NFT 갤러리</span>
                </button>

                <button
                    className="flex flex-col items-center justify-center text-sm text-black cursor-pointer hover:text-blue-600 transition-colors select-none"
                    onClick={() => navigate(`/mobile/myVisitLogList/${param}`)}
                >
                    <span className="text-xl">
                        <BsBell />
                    </span>
                    <span className="mt-1">방문기록</span>
                </button>

                <button
                    className="flex flex-col items-center justify-center text-sm text-black cursor-pointer hover:text-blue-600 transition-colors select-none"
                    onClick={() => navigate(`/mobile/myPage/${param}`)}
                >
                    <span className="text-xl">
                        <FaRegUserCircle />
                    </span>
                    <span className="mt-1">나의 정보</span>
                </button>
            </div>
        </nav>
    );
};

export { MobileFooter };

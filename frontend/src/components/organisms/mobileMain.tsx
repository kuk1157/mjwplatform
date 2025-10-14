import { Link } from "react-router-dom";
interface MobileMainProps {
    param: number;
}
const MobileMain = ({ param }: MobileMainProps) => {
    return (
        <div className="mb-3 p-1">
            <div className="flex items-center gap-2 mb-2 justify-between">
                <Link to={`/mobile/mainPage/${param}`}>
                    <img
                        src="/assets/image/mobile/mobileMain.svg"
                        alt="메인 이미지"
                    />
                </Link>
                {param ? (
                    <div></div>
                ) : (
                    <div>
                        <button
                            className="cursor-poiner flex items-center justify-center bg-[#E61F2C] rounded-[25px] py-[8px] px-[14.5px] text-[#fff] font-Pretendard"
                            onClick={() => alert("으아악 위험")}
                        >
                            로그인
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export { MobileMain };

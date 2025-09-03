import { Link } from "react-router-dom";
interface MobileMainProps {
    param: number;
}
const MobileMain = ({ param }: MobileMainProps) => {
    return (
        <div className="mb-3 p-1">
            <div className="flex items-center gap-2 mb-2">
                <Link to={`/mobile/mainPage/${param}`}>
                    <img
                        src="/assets/image/mobile/mobileMain.svg"
                        alt="메인 이미지"
                    />
                </Link>
            </div>
        </div>
    );
};

export { MobileMain };

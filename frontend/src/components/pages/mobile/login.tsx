import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export function MobileLogin() {
    const navigate = useNavigate();
    const { storeNum, tableNumber } = useParams();

    const LoginSubmit = async () => {
        const did = "did:testdid3"; // 현재 임시로 입력해줘야함. 다대구 did 연동하게 되면 해결
        try {
            const url = `/api/v1/TestVisitLogs/${storeNum}/${tableNumber}`;
            const orderData = {
                tableNumber,
                did,
            };
            const response = await axios.post(url, orderData);
            console.log(response.data);
            navigate("/mypage"); // 성공하면 마이페이지로 이동. 모든 프로세스 이동 후
        } catch (error) {
            console.error(`${tableNumber}번 테이블 QR 인증 실패:`, error);
        }
    };
    return (
        <div className="w-screen h-screen flex items-center justify-cente">
            <div className="w-[360px] bg-white text-center p-6 rounded-xl">
                {/* 로고 */}
                <div className="mb-6">
                    <img
                        src="/assets/image/moblieLogo.png"
                        alt="mobileLogo"
                        className="w-24 h-auto mx-auto"
                    />
                </div>

                {/* 타이틀 */}
                <div className="mb-2 text-xl font-bold">
                    동대구역 맛집 3% 할인
                </div>
                <div className="mb-4 text-xl font-bold">
                    다대구 DID로 간편하게!
                </div>

                <button
                    className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
                    onClick={LoginSubmit}
                >
                    다대구 연동 로그인
                </button>
            </div>
        </div>
    );
}
export default MobileLogin;

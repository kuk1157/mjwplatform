import { useParams } from "react-router-dom";
import DidLoginButton from "../../atoms/didLoginButton";

export function MobileLogin() {
    const params = useParams();
    const storeNum = params.storeNum ? Number(params.storeNum) : undefined;
    const tableNumber = params.tableNumber
        ? Number(params.tableNumber)
        : undefined;
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="w-[360px] bg-white text-center p-6 rounded-xl">
                {/* 로고 */}
                <div className="mb-6">
                    <img
                        src="/assets/image/did/icon_2.png"
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

                <DidLoginButton storeNum={storeNum} tableNumber={tableNumber} />

                {/* <button
                    className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
                    onClick={LoginSubmit}
                >
                    다대구 연동 로그인
                </button> */}
            </div>
        </div>
    );
}
export default MobileLogin;

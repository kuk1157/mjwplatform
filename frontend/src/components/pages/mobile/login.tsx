import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export function MobileLogin() {
    const navigate = useNavigate();
    const { storeNum, tableNumber } = useParams();

    const LoginSubmit = async () => {
        const did = "did:testdid3"; // 현재 임시로 입력해줘야함. 다대구 did 연동하게 되면 해결
        try {
            // 방문기록 api
            // 첫 방문일 경우 계정 생성도 동시에 이뤄짐
            const url = `/api/v1/visits/${storeNum}/${tableNumber}`;
            const orderData = {
                tableNumber,
                did,
            };
            const response = await axios.post(url, orderData);

            console.log("로그인 성공");
            console.log(response.data);

            // [ 여기 모바일 로그인 로직 추가 해야함 ]

            const customerId = response.data.customerId; // 고객 번호 가공

            // nft 중복 발급 체크위한 API
            const nftCheckUrl = `/api/v1/customers/${customerId}/stores/${storeNum}/nfts/check`;
            const resCheck = await axios.get(nftCheckUrl);
            console.log(resCheck.data);

            // nft 중복 발급 막기
            if (resCheck.data == false) {
                // 로그인 성공 후 NFT발급 진행
                const nftUrl = `/api/v1/stores/${storeNum}/customers/${customerId}/nfts`;
                const nftData = {
                    did,
                };
                const res = await axios.post(nftUrl, nftData);
                console.log("nft발급 성공");
                console.log(res.data);
            } else {
                console.log("이미 발급된 nft 매장 바로 마이페이지로");
            }

            // 마이 페이지에서 nft 정보 호출을 위해 customerId 활용
            console.log("마이페이지로 이동");
            navigate(`/mobile/mypage/${customerId}`); // 성공하면 마이페이지로 이동. 모든 프로세스 완료 후
        } catch (error) {
            console.error(`다대구 연동 로그인 실패:`, error);
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

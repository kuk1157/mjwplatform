import { MainContainer } from "../molecules/container";
import axios from "axios";

function MainPage() {
    const mintNft = async () => {
        try {
            const payload = {
                fileUri:
                    "https://www.daegu.go.kr/daeguchain/upload/nft/cdd448e938baa0fc4e640d76523579a4e3ebe9d89ac860c42fcf6ad3c447183c.json",
                receiver: "0x99E0fEBA3791314c2d22e9F27b57c1275c15d6f5fca",
            };
            const response = await axios.post(
                "/api/v1/nft/mint-test",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );

            const data = response.data;
            console.log("Mint API 반환값:", data);
            alert("Mint 결과는 콘솔을 확인하세요");
        } catch (error) {
            console.error("Mint 실패:", error);
            alert("Mint 실패");
        }
    };
    // 매장 목록 먼저 뿌리기 (임시) - 고객이 실제 매장 방문하기전 길에서 매장 고르기

    return (
        <MainContainer className="py-[227.5px] bg-[#F6F6F6] lg:py-[150px]">
            <div>메인페이지</div>

            <button
                onClick={mintNft}
                className="mt-3 p-2 border-2 border-gray-800"
            >
                테스트 버튼
            </button>
        </MainContainer>
    );
}

export default MainPage;

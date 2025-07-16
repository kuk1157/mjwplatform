import { MainContainer } from "../molecules/container";
import axios from "axios";

function MainPage() {
    const handleFetchPays = async () => {
        try {
            const url = "/api/v1/pay";
            const response = await axios.get(url);
            // Page 객체 기준: content 배열만 추출
            console.log("결제 조회 결과:", response.data.content);
        } catch (error) {
            console.error("결제 조회 실패:", error);
        }
    };

    return (
        <MainContainer className="py-[230px] bg-[#F6F6F6] lg:py-[150px] sm:py-[100px]">
            메인 페이지
            {/* // 임시 버튼 웹 플랫폼 api 호출 확인용 */}
            <div className="bg-slate-400 p-4 my-7">
                <button type="button" onClick={handleFetchPays}>
                    점주 포스기 입력
                </button>
            </div>
            <div className="bg-slate-400 p-4">
                <button type="button">점주 현금화 신청</button>
            </div>
        </MainContainer>
    );
}

export default MainPage;

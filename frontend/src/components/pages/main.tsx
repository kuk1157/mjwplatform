import { MainContainer } from "../molecules/container";
import axios from "axios";
import { useState } from "react";

function MainPage() {
    const [orderPrice, setOrderPrice] = useState("");

    const TestGetPay = async () => {
        try {
            const url = "/api/v1/pay";
            const response = await axios.get(url);
            // Page 객체 기준: content 배열만 추출
            console.log("결제 조회 결과:", response.data.content);
        } catch (error) {
            console.error("결제 조회 실패:", error);
        }
    };

    const TestGetPayId = async () => {
        try {
            const url = `/api/v1/pay/1`;
            const response = await axios.get(url);
            // Page 객체 기준: content 배열만 추출
            console.log("결제 상세 조회 결과:", response.data);
        } catch (error) {
            console.error("결제 상세 조회 실패:", error);
        }
    };

    const TestPostay = async () => {
        try {
            if (!orderPrice) {
                alert("주문 금액을 입력해주세요.");
            }

            const url = "/api/v1/pay";
            const response = await axios.post(url, {
                amount: Number(orderPrice),
            });
            console.log("결제 등록 결과:", response.data);
        } catch (error) {
            alert(11);
            console.error("결제 등록 실패:", error);
        }
    };

    return (
        <MainContainer className="py-[230px] bg-[#F6F6F6] lg:py-[150px] sm:py-[100px]">
            메인 페이지
            {/* // 임시 버튼 웹 플랫폼 api 호출 확인용 */}
            <div className="bg-slate-400 p-4 my-7">
                <button type="button" onClick={TestGetPay}>
                    결제 전체 조회
                </button>
            </div>
            <div className="bg-slate-400 p-4 my-7">
                <button type="button" onClick={TestGetPayId}>
                    결제 상세 조회
                </button>
            </div>
            <div className="bg-slate-400 p-4 my-7">
                <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="text"
                        placeholder="주문 금액 입력"
                        value={orderPrice}
                        onChange={(e) => setOrderPrice(e.target.value)}
                        className="border p-1 mr-2"
                    />
                    <button type="button" onClick={TestPostay}>
                        점주 포스기 입력
                    </button>
                </form>
            </div>
            <div className="bg-slate-400 p-4">
                <button type="button">점주 현금화 신청</button>
            </div>
        </MainContainer>
    );
}

export default MainPage;

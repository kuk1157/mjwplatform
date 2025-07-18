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

    const TestGetPayLog = async () => {
        try {
            const url = "/api/v1/payLog";
            const response = await axios.get(url);
            // Page 객체 기준: content 배열만 추출
            console.log("결제내역 조회 결과:", response.data.content);
        } catch (error) {
            console.error("결제내역 조회 실패:", error);
        }
    };

    const TestGetPoint = async () => {
        try {
            const url = "/api/v1/point";
            const response = await axios.get(url);
            // Page 객체 기준: content 배열만 추출
            console.log("포인트 조회 결과:", response.data.content);
        } catch (error) {
            console.error("포인트 조회 실패:", error);
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
                return;
            }

            const order_id = 1; // 추후 주문 상세보기에서 주문정보로 가져갈부분
            const price = 10000; // 추후 주문 상세보기에서 주문정보로 가져갈부분
            if (price !== Number(orderPrice)) {
                alert("주문금액과 포스기 입력금액은 일치해야합니다.");
                return;
            }

            const url = `/api/v1/pay/${order_id}`;
            const response = await axios.post(url, {
                amount: Number(orderPrice),
                headers: { "Content-Type": "application/json" },
            });
            console.log("결제 등록 결과:", response.data);
        } catch (error) {
            console.error("결제 등록 실패:", error);
        }
    };

    return (
        <MainContainer className="py-[230px] bg-[#F6F6F6] lg:py-[150px] sm:py-[100px]">
            메인 페이지
            {/* // 임시 버튼 웹 플랫폼 api 호출 확인용 */}
            <div className="bg-slate-400 p-4 my-7">
                <button type="button" onClick={TestGetPay}>
                    결제 전체 조회(완료✅)
                </button>
            </div>
            <div className="bg-slate-400 p-4 my-7">
                <button type="button" onClick={TestGetPayId}>
                    결제 상세 조회(완료✅)
                </button>
            </div>
            <div className="bg-slate-400 p-4 my-7">
                <button type="button" onClick={TestGetPayLog}>
                    결제내역 전체 조회(완료✅)
                </button>
            </div>
            <div className="bg-slate-400 p-4 my-7">
                <button type="button" onClick={TestGetPoint}>
                    포인트 전체 조회(완료✅)
                </button>
            </div>
            <div className="bg-slate-400 p-4 my-7">
                <form onSubmit={(e) => e.preventDefault()} method="post">
                    <input
                        type="text"
                        placeholder="주문 금액 입력"
                        value={orderPrice}
                        onChange={(e) => setOrderPrice(e.target.value)}
                        className="border p-1 mr-2"
                    />
                    <button type="button" onClick={TestPostay}>
                        점주 포스기 입력(완료✅) - 10000원 입력해야함.
                    </button>
                </form>
            </div>
            <div className="bg-slate-400 p-4">
                <button type="button">점주 현금화 신청(대기)</button>
            </div>
        </MainContainer>
    );
}

export default MainPage;

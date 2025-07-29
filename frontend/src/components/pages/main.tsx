import { MainContainer } from "../molecules/container";
import axios from "axios";
import { useState } from "react";
// import { useRecoilValueLoadable } from "recoil";
// import { userSelectorUpdated } from "src/recoil/userState";
import { useNavigate } from "react-router-dom";

function MainPage() {
    const [orderPrice, setOrderPrice] = useState("");
    // const [requestPrice, setRequestPrice] = useState("");
    // const { contents: user } = useRecoilValueLoadable(userSelectorUpdated);
    const navigate = useNavigate();

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

    const order_id = 4; // 추후 주문 상세보기에서 주문정보로 가져갈부분
    const price = 30000; // 추후 주문 상세보기에서 주문정보로 가져갈부분
    const TestPostpay = async () => {
        try {
            const payInput = document.querySelector(
                ".payInput"
            ) as HTMLInputElement | null;

            alert("입력 못합니다.");
            return;

            if (!orderPrice) {
                alert("주문 금액을 입력해주세요.");
                if (payInput) {
                    setOrderPrice("");
                }
                return;
            }

            if (Number(orderPrice) <= 0) {
                alert("0원이나 (-) 금액은 입력할 수 없습니다.");
                if (payInput) {
                    setOrderPrice("");
                }
                return;
            }

            if (price !== Number(orderPrice)) {
                alert("주문금액과 포스기 입력금액은 일치해야합니다.");
                if (payInput) {
                    setOrderPrice("");
                }
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

    // const TestPostcash = async () => {
    //     try {
    //         const cashInput = document.querySelector(
    //             ".cashInput"
    //         ) as HTMLInputElement | null;

    //         const memberId = user.id;
    //         const requestNumber = Number(requestPrice);

    //         if (!requestPrice) {
    //             alert("현금 신청할 금액을 입력해주세요.");
    //             if (cashInput) {
    //                 setRequestPrice("");
    //             }
    //             return;
    //         }

    //         if (requestNumber <= 0) {
    //             alert("0원이나 (-) 금액은 입력할 수 없습니다.");
    //             if (cashInput) {
    //                 setRequestPrice("");
    //             }
    //             return;
    //         }

    //         if (user.totalPoint <= requestNumber) {
    //             alert("현금 신청할 금액은 보유포인트보다 클 수 없습니다.");
    //             if (cashInput) {
    //                 setRequestPrice("");
    //             }
    //             return;
    //         }

    //         const url = `/api/v1/pointCashOutRequest/${memberId}`;
    //         const response = await axios.post(url, {
    //             cash: requestNumber,
    //             headers: { "Content-Type": "application/json" },
    //         });
    //         alert(`${requestNumber}포인트 현금화 신청이 완료 되었습니다.`);
    //         navigate(0);
    //         console.log("현금 신청 결과:", response.data);
    //     } catch (error) {
    //         console.error("현금 신청 실패:", error);
    //     }
    // };

    const TestStoreTable = () => {
        navigate("/testStoreTable");
    };

    const QrVisit = () => {
        navigate("/testVisit");
    };

    return (
        <MainContainer className="py-[230px] bg-[#F6F6F6] lg:py-[150px] sm:py-[100px]">
            메인 페이지
            {/* // 임시 버튼 웹 플랫폼 api 호출 확인용 */}
            <div className="bg-white p-4 my-7">
                <button
                    className="bg-slate-400 p-2"
                    type="button"
                    onClick={TestStoreTable}
                >
                    매장 테이블로 이동
                </button>
            </div>
            <div className="bg-white p-4 my-7">
                <button
                    className="bg-slate-400 p-2"
                    type="button"
                    onClick={TestGetPay}
                >
                    결제 전체 조회(완료✅)
                </button>
            </div>
            <div className="bg-white p-4 my-7">
                <button
                    className="bg-slate-400 p-2"
                    type="button"
                    onClick={TestGetPayId}
                >
                    결제 상세 조회(완료✅)
                </button>
            </div>
            <div className="bg-white p-4 my-7">
                <button
                    className="bg-slate-400 p-2"
                    type="button"
                    onClick={TestGetPayLog}
                >
                    결제내역 전체 조회(완료✅)
                </button>
            </div>
            <div className="bg-white p-4 my-7">
                <button
                    className="bg-slate-400 p-2"
                    type="button"
                    onClick={TestGetPoint}
                >
                    포인트 전체 조회(완료✅)
                </button>
            </div>
            <div className="bg-white p-4 my-7">
                <form onSubmit={(e) => e.preventDefault()} method="post">
                    <p className="my-2">
                        <input
                            type="number"
                            placeholder="주문 금액 입력"
                            value={orderPrice}
                            onChange={(e) => setOrderPrice(e.target.value)}
                            className="border p-1 mr-2 payInput"
                        />
                        [ - {price} 입력해야함. ]
                    </p>
                    <button
                        className="bg-slate-400 p-2"
                        type="button"
                        onClick={TestPostpay}
                    >
                        점주 포스기 입력(예전)
                    </button>
                </form>
            </div>
            <div className="bg-white p-4 my-7">
                <button
                    className="bg-slate-400 p-2"
                    type="button"
                    onClick={QrVisit}
                >
                    금액 입력하러 가기
                </button>
            </div>
            {/* 임시주석 */}
            {/* <div className="bg-white p-4">
                <p>[ 점주 보유 포인트 : {user.totalPoint} ]</p>
                <p>[ 점주 보유 현금 : {user.totalCash} ]</p>
                <p className="my-2">
                    <input
                        type="number"
                        placeholder="현금화 신청 금액 입력"
                        value={requestPrice}
                        onChange={(e) => setRequestPrice(e.target.value)}
                        className="border p-1 mr-2 cashInput"
                    />
                </p>
                <button
                    className="bg-slate-400 p-2"
                    type="button"
                    onClick={TestPostcash}
                >
                    점주 현금화 신청(완료✅)
                </button>
            </div> */}
        </MainContainer>
    );
}

export default MainPage;

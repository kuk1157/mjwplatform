import { MainContainer } from "../molecules/container";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilValueLoadable } from "recoil";
import { userSelectorUpdated } from "src/recoil/userState";
import { useNavigate } from "react-router-dom";

function MainPage() {
    const [orderPrice, setOrderPrice] = useState("");
    // const [requestPrice, setRequestPrice] = useState("");
    const { contents: user } = useRecoilValueLoadable(userSelectorUpdated);
    const [name, setStoreName] = useState();
    const [ownerName, setOwnerName] = useState();
    const navigate = useNavigate();
    const ownerId = user.id;

    useEffect(() => {
        if (!ownerId) return;

        console.log(ownerId);

        const fetchData = async () => {
            try {
                const storeRes = await axios.get(
                    `/api/v1/stores/ownerId/${ownerId}`
                );
                const storeId = storeRes.data.id;
                console.log(storeId);
                console.log(storeRes.data);
                setStoreName(storeRes.data.name);
                setOwnerName(storeRes.data.ownerName);

                const visitLogRes = await axios.get(
                    `/api/v1/visits/${storeId}`
                );
                console.log(visitLogRes.data);
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [ownerId]);

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

    // 점주 기준 결제 조회
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

    // 점주 기준 결제 조회
    // const OwnerIdByPay = async () => {
    //     try {
    //         const url = `/api/v1/pay/owner/${ownerId}`;
    //         const response = await axios.get(url);
    //         // Page 객체 기준: content 배열만 추출
    //         console.log("점주 기준 결제 조회 결과:", response.data.content);
    //     } catch (error) {
    //         console.error("점주 기준 결제 조회 실패:", error);
    //     }
    // };

    // 점주 기준 결제내역 조회
    const OwnerIdByPayLog = async () => {
        try {
            const url = `/api/v1/payLog/owner/${ownerId}`;
            const response = await axios.get(url);
            // Page 객체 기준: content 배열만 추출
            console.log("점주 기준 결제내역 조회 결과:", response.data.content);
        } catch (error) {
            console.error("점주 기준 결제내역 조회 실패:", error);
        }
    };

    // 점주 기준 결제 조회 페이지로 이동
    const OwnerPay = () => {
        navigate("/ownerPayList");
    };

    // // 점주 기준 결제 조회 페이지로 이동
    // const OwnerPayLog = () => {
    //     navigate("/ownerPayLogList");
    // };

    // // 점주 기준 결제 조회 페이지로 이동
    // const OwnerPoint = () => {
    //     navigate("/ownerPonintList");
    // };

    // // 점주 기준 결제 조회 페이지로 이동
    // const OwnerStoreTable = () => {
    //     navigate("/ownerStoreTableList");
    // };

    const TestStoreTable = () => {
        navigate("/testStoreTable");
    };

    const QrVisit = () => {
        navigate("/testVisit");
    };

    const StoreVisit = () => {
        navigate("/storeVisit");
    };

    return (
        <MainContainer className="py-[230px] bg-[#F6F6F6] lg:py-[150px] sm:py-[100px]">
            {user.role === "owner" ? (
                <div>
                    {/* 가맹점 및 금액 정보 섹션 */}
                    <div className="mb-12 px-10">
                        <h2 className="text-2xl font-semibold text-gray-700 pb-1 mb-6 inline-block border-b-2 border-yellow-400 w-auto">
                            🏢 가맹점 및 금액 정보
                        </h2>
                        <div className="flex justify-center gap-6">
                            {/* 매장 이름 카드 */}
                            <div className="bg-white rounded-xl py-3 px-6 shadow-md text-center w-56">
                                <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                                    🏪 <span>매장 이름</span>
                                </div>
                                <div className="text-xl font-bold text-gray-900 mt-1 truncate">
                                    {name}
                                </div>
                            </div>

                            {/* 점주 이름 카드 */}
                            <div className="bg-white rounded-xl py-3 px-6 shadow-md text-center w-56">
                                <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                                    🙍‍♂️ <span>점주 이름</span>
                                </div>
                                <div className="text-xl font-bold text-gray-900 mt-1 truncate">
                                    {ownerName}
                                </div>
                            </div>

                            {/* 보유 포인트 카드 */}
                            <div className="bg-yellow-100 rounded-xl py-3 px-6 shadow-md text-center w-56">
                                <div className="text-xs text-yellow-700 flex items-center justify-center gap-1 font-semibold">
                                    💰 <span>보유 포인트</span>
                                </div>
                                <div className="text-2xl font-extrabold text-yellow-700 mt-1 truncate">
                                    {user.totalPoint} P
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 버튼 섹션 */}
                    <div className="mb-12 px-10">
                        <h2 className="text-2xl font-semibold text-gray-700 pb-1 mb-6 inline-block border-b-2 border-yellow-400 w-auto">
                            🛠️ 기능 선택
                        </h2>
                        <div className="grid grid-cols-4 gap-6 px-8">
                            <button
                                className="flex flex-col items-center justify-center bg-white rounded-xl shadow p-4 hover:bg-gray-50 transition"
                                onClick={OwnerPay}
                            >
                                <div className="text-2xl mb-1">📥</div>
                                <div className="text-sm font-medium text-gray-800">
                                    결제조회
                                </div>
                            </button>

                            <button
                                className="flex flex-col items-center justify-center bg-white rounded-xl shadow p-4 hover:bg-gray-50 transition"
                                onClick={OwnerIdByPayLog}
                            >
                                <div className="text-2xl mb-1">🧾</div>
                                <div className="text-sm font-medium text-gray-800">
                                    결제내역조회
                                </div>
                            </button>

                            <button className="flex flex-col items-center justify-center bg-white rounded-xl shadow p-4 hover:bg-gray-50 transition">
                                <div className="text-2xl mb-1">💳</div>
                                <div className="text-sm font-medium text-gray-800">
                                    포인트조회
                                </div>
                            </button>

                            <button className="flex flex-col items-center justify-center bg-white rounded-xl shadow p-4 hover:bg-gray-50 transition">
                                <div className="text-2xl mb-1">📋</div>
                                <div className="text-sm font-medium text-gray-800">
                                    매장테이블 조회
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* 방문 기록 섹션 */}
                    <div className="mb-12 px-10">
                        <h2 className="text-2xl font-semibold text-gray-700 pb-1 mb-6 inline-block border-b-2 border-yellow-400 w-auto">
                            📅 방문 기록
                        </h2>
                        <div className="grid grid-cols-4 gap-6 px-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                                <div
                                    key={idx}
                                    className="w-40 h-48 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center p-5 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <p className="text-lg font-semibold mb-3 text-gray-900 select-none">
                                        방문 기록 {idx}
                                    </p>
                                    <input
                                        type="number"
                                        placeholder="금액 입력"
                                        className="w-full text-center border border-gray-300 rounded-lg py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                                    />
                                    <button className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg py-2 shadow-md hover:shadow-lg transition duration-300">
                                        금액 입력
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div>
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
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            method="post"
                        >
                            <p className="my-2">
                                <input
                                    type="number"
                                    placeholder="주문 금액 입력"
                                    value={orderPrice}
                                    onChange={(e) =>
                                        setOrderPrice(e.target.value)
                                    }
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
                </div>
            )}
            {/* 임시 버튼 웹 플랫폼 api 호출 확인용 */}
            <div className="space-y-6 max-w-md mx-auto mt-12">
                <button
                    onClick={QrVisit}
                    className="flex items-center justify-center gap-3 bg-white rounded-xl shadow p-4 hover:bg-gray-50 transition w-full"
                    type="button"
                >
                    <span className="text-2xl">📱</span>
                    <span className="text-lg font-semibold text-gray-900">
                        QR 인증하러 가기
                    </span>
                </button>

                <button
                    onClick={StoreVisit}
                    className="flex items-center justify-center gap-3 bg-white rounded-xl shadow p-4 hover:bg-gray-50 transition w-full"
                    type="button"
                >
                    <span className="text-2xl">💵</span>
                    <span className="text-lg font-semibold text-gray-900">
                        금액 입력하러 가기
                    </span>
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

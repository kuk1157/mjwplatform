import { MainContainer } from "../../molecules/container";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { io } from "socket.io-client";
import { useRef } from "react";

interface VisitLog {
    id: number;
    storeId: number;
    storeTableId: number;
    customerId: number;
    storeName?: string;
    memberName?: string;
    createdAt: string;
}

function OwnerDashBoard() {
    const [name, setStoreName] = useState();
    const [ownerName, setOwnerName] = useState();
    const [storeId, setStoreId] = useState();
    const { ownerId } = useParams();
    const [totalPoint, setTotalPoint] = useState();
    const [visitLogs, setvisits] = useState<VisitLog[]>([]);
    const [newVisitLogs, setNewVisits] = useState<VisitLog[]>([]);
    const [visitAmounts, setVisitAmounts] = useState<{ [key: number]: string }>(
        {}
    ); // 테이블번호별 금액
    const navigate = useNavigate();
    const socketRef = useRef<any>(null);

    // 받아온 ownerId로 가맹점과 방문기록 바로 가져오기
    useEffect(() => {
        if (!ownerId) return;
        const accessToken = localStorage.getItem("accessToken"); // 토큰 세팅

        const fetchData = async () => {
            try {
                // 매장 상세보기(점주고유번호 기준), 점주 보유포인트 구하기(member에서)
                const [storeRes, userRes] = await Promise.all([
                    axios.get(`/api/v1/stores/ownerId/${ownerId}`),
                    axios.get("/api/v1/member", {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }),
                ]);
                setTotalPoint(userRes.data.totalPoint); // 점주 보유포인트 세팅

                const storeId = storeRes.data.id; // 가맹점 고유번호 추출
                setStoreId(storeId); // 가맹점 고유번호 저장
                setStoreName(storeRes.data.name); // 가맹점 이름
                setOwnerName(storeRes.data.ownerName); // 점주 이름

                // 신규 방문(주문) 기록, 전체 방문 기록(아래)
                const [newVisitLogRes, visitLogRes] = await Promise.all([
                    axios.get(`/api/v1/visits/new/${storeId}`),
                    axios.get(`/api/v1/visits/${storeId}`),
                ]);
                setNewVisits(newVisitLogRes.data);
                setvisits(visitLogRes.data);

                // 소켓 연결 및 방 참가
                if (!socketRef.current) {
                    socketRef.current = io("https://coex.everymeta.kr:7951");
                }

                socketRef.current.emit("joinStore", storeId);

                socketRef.current.on("storeMessage", (visitLog: VisitLog) => {
                    // 신규 방문기록을 newVisitLogs에 추가
                    setNewVisits((prev) => {
                        if (prev.some((v) => v.id === visitLog.id)) return prev;
                        return [...prev, visitLog];
                    });
                    // 전체 방문기록에도 추가
                    setvisits((prev) => {
                        if (prev.some((v) => v.id === visitLog.id)) return prev;
                        return [...prev, visitLog];
                    });
                });
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();

        // 🔌 컴포넌트 언마운트 시 소켓 종료
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [ownerId]);
    // 주문금액 입력 핸들러
    const handleAmountChange = (id: number, value: string) => {
        setVisitAmounts((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // 주문하기 버튼 클릭 시 POST 요청
    const handleOrder = async (id: number) => {
        const price = visitAmounts[id];

        if (!price) {
            alert("주문 금액을 입력해주세요.");
            return;
        }

        if (Number(price) <= 0) {
            alert("0원이나 (-) 금액은 입력할 수 없습니다.");
            return;
        }

        const visitLogId = id;
        try {
            const url = `/api/v1/pay/${visitLogId}`;
            const orderData = {
                visitLogId,
                amount: Number(price),
            };

            const response = await axios.post(url, orderData);
            console.log(`금액 입력 완료:`, response.data);

            // 주문 성공 후 처리 (예: input 값 초기화, 성공 메시지 등)
            alert(`금액 입력이 완료되었습니다.`);
            window.location.reload();
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const message = axiosError.response?.data?.message; // message를 변수로
            if (message) {
                alert(message);
            } else {
                alert("알 수 없는 오류가 발생했습니다.");
            }
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

    // 점주 결제내역 조회
    // const OwnerIdByPayLog = async () => {
    //     try {
    //         const url = `/api/v1/payLog/owner/${ownerId}`;
    //         const response = await axios.get(url);
    //         // Page 객체 기준: content 배열만 추출
    //         console.log("점주 기준 결제내역 조회 결과:", response.data.content);
    //     } catch (error) {
    //         console.error("점주 기준 결제내역 조회 실패:", error);
    //     }
    // };

    // 점주 결제 목록 조회 페이지로 이동
    const OwnerPay = () => {
        navigate(`/ownerPayList/${ownerId}`);
    };

    // 점주 결제내역 목록 조회 페이지로 이동
    const OwnerPayLog = () => {
        navigate(`/ownerPayLogList/${ownerId}`);
    };

    // 점주 포인트 목록 조회 페이지로 이동
    const OwnerPoint = () => {
        navigate(`/ownerPonintList/${ownerId}`);
    };

    // 점주 매장 테이블 목록 조회 페이지로 이동
    const OwnerStoreTable = () => {
        navigate(`/ownerStoreTableList/${storeId}`);
    };

    // const QrVisit = () => {
    //     navigate(`/testVisit/${storeId}`);
    // };

    // const StoreVisit = () => {
    //     navigate("/storeVisit");
    // };

    // const dummyData: VisitLog[] = Array.from({ length: 57 }, (_, i) => ({
    //     id: i + 1,
    //     storeId: 100 + ((i % 5) + 1),
    //     customerId: 2000 + i,
    //     storeName: `매장 ${100 + ((i % 5) + 1)}`,
    //     createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString(),
    // }));

    const [page, setPage] = useState(1);
    const pageSize = 5;

    const total = visitLogs.length;
    const totalPages = Math.ceil(total / pageSize);

    // 현재 페이지 데이터만 자르기
    const currentData = visitLogs.slice((page - 1) * pageSize, page * pageSize);

    return (
        <MainContainer className="py-[230px] bg-[#F6F6F6] lg:py-[150px] sm:py-[100px]">
            <div>
                {/* 가맹점 및 금액 정보 섹션 */}
                <div className="mb-20 px-10">
                    <h2 className="text-2xl font-semibold text-gray-700 pb-1 mb-6 inline-block border-b-2 border-yellow-400 w-full">
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
                                {totalPoint} P
                            </div>
                        </div>
                    </div>
                </div>

                {/* 버튼 섹션 */}
                <div className="mb-20 px-10">
                    <h2 className="text-2xl font-semibold text-gray-700 pb-1 mb-6 inline-block border-b-2 border-yellow-400 w-full">
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
                            onClick={OwnerPayLog}
                        >
                            <div className="text-2xl mb-1">🧾</div>
                            <div className="text-sm font-medium text-gray-800">
                                결제내역조회
                            </div>
                        </button>

                        <button
                            className="flex flex-col items-center justify-center bg-white rounded-xl shadow p-4 hover:bg-gray-50 transition"
                            onClick={OwnerPoint}
                        >
                            <div className="text-2xl mb-1">💳</div>
                            <div className="text-sm font-medium text-gray-800">
                                포인트조회
                            </div>
                        </button>

                        <button
                            className="flex flex-col items-center justify-center bg-white rounded-xl shadow p-4 hover:bg-gray-50 transition"
                            onClick={OwnerStoreTable}
                        >
                            <div className="text-2xl mb-1">📋</div>
                            <div className="text-sm font-medium text-gray-800">
                                매장테이블 조회
                            </div>
                        </button>
                    </div>
                </div>
                {/* 신규 방문(주문) 기록 섹션 */}
                <div className="mb-20 px-10">
                    <h2 className="text-2xl font-semibold text-gray-700 pb-1 mb-6 inline-block border-b-2 border-yellow-400 w-full">
                        📅 신규 방문(주문) 기록
                    </h2>

                    {newVisitLogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                            <div className="text-5xl mb-4">📭</div>
                            <p className="text-lg font-medium">
                                {name} 매장의 신규 방문(주문)기록이 없습니다.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-6 px-8">
                            {newVisitLogs.map((newVisitLog) => (
                                <div
                                    key={newVisitLog.id}
                                    className="w-40 h-48 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center p-3 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <p className="text-lg font-semibold mb-3 text-gray-900 select-none">
                                        방문 기록 ID : {newVisitLog.id}
                                    </p>
                                    <p className="text-lg font-semibold mb-3 text-gray-900 select-none">
                                        테이블 번호 : {newVisitLog.storeTableId}
                                    </p>
                                    <input
                                        type="number"
                                        placeholder="금액 입력"
                                        className="w-full text-center border border-gray-300 rounded-lg py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                                        value={
                                            visitAmounts[newVisitLog.id] || ""
                                        }
                                        onChange={(e) =>
                                            handleAmountChange(
                                                newVisitLog.id,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <button
                                        className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg py-2 shadow-md hover:shadow-lg transition duration-300"
                                        onClick={() =>
                                            handleOrder(newVisitLog.id)
                                        }
                                    >
                                        금액 입력
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* <div className="mb-20 px-10">
                    <h2 className="text-2xl font-semibold text-gray-700 pb-1 mb-6 inline-block border-b-2 border-yellow-400 w-full">
                        📅 전체 방문 기록
                    </h2>

                    {visitLogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                            <div className="text-5xl mb-4">📭</div>
                            <p className="text-lg font-medium">
                                {name} 매장의 방문(주문)기록이 없습니다.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-6 px-8">
                            {visitLogs.map((visitLog) => (
                                <div
                                    key={visitLog.id}
                                    className="w-40 h-48 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center p-5 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <p className="text-lg font-semibold mb-3 text-gray-900 select-none">
                                        방문 기록 : {visitLog.id}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div> */}

                {/* 전체 방문 기록 섹션 */}
                <div className="mb-20 px-10">
                    <h2 className="text-2xl font-semibold text-gray-700 pb-1 mb-6 inline-block border-b-2 border-yellow-400 w-full">
                        📅 전체 방문 기록
                    </h2>
                    <div className="overflow-x-auto p-6 bg-white rounded-xl shadow-lg ml-8">
                        {visitLogs.length === 0 ? (
                            <div className="py-12 text-center text-gray-400 text-lg font-medium">
                                {name} 매장의 방문(주문)기록이 없습니다.
                            </div>
                        ) : (
                            <>
                                <table className="min-w-full border-collapse text-gray-800">
                                    <thead>
                                        <tr className="bg-[#21a089] text-white uppercase text-sm tracking-wide select-none">
                                            <th className="py-4 px-6 text-center border-b border-gray-700 border-r">
                                                번호
                                            </th>
                                            <th className="py-4 px-6 text-center border-b border-gray-700 border-r">
                                                고객 이름
                                            </th>
                                            <th className="py-4 px-6 text-center border-b border-gray-700 border-r">
                                                테이블 번호
                                            </th>
                                            <th className="py-4 px-6 text-center border-b border-gray-700">
                                                방문일시
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((visitLog, index) => (
                                            <tr
                                                key={visitLog.id}
                                                className="hover:bg-gray-100 transition-colors duration-200 cursor-default"
                                            >
                                                <td className="py-4 px-6 text-center whitespace-nowrap font-semibold border-r border-gray-300">
                                                    {(page - 1) * pageSize +
                                                        index +
                                                        1}
                                                </td>
                                                <td className="py-4 px-6 text-center whitespace-nowrap border-r border-gray-300">
                                                    {visitLog.memberName}
                                                </td>
                                                <td className="py-4 px-6 text-center whitespace-nowrap border-r border-gray-300">
                                                    {visitLog.storeTableId}번
                                                </td>
                                                <td className="py-4 px-6 text-center whitespace-nowrap">
                                                    {new Date(
                                                        visitLog.createdAt
                                                    ).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                <div className="flex justify-center items-center gap-3 mt-6 select-none">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage((p) => p - 1)}
                                        className="px-4 py-2 border border-gray-400 rounded-md bg-white text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                    >
                                        이전
                                    </button>
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setPage(i + 1)}
                                                className={`px-4 py-2 border border-gray-400 rounded-md transition ${
                                                    page === i + 1
                                                        ? "bg-blue-600 text-white border-blue-600"
                                                        : "bg-white text-gray-700 hover:bg-gray-200"
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        )
                                    )}
                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => setPage((p) => p + 1)}
                                        className="px-4 py-2 border border-gray-400 rounded-md bg-white text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                    >
                                        다음
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* 임시 버튼 웹 플랫폼 api 호출 확인용 */}
            {/* <div className="space-y-6 max-w-md mx-auto mt-12">
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
            </div> */}
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

export default OwnerDashBoard;

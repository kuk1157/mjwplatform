import { MainContainer } from "../../molecules/container";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MdArrowBackIosNew } from "react-icons/md"; // 페이징 이전 아이콘
import { MdArrowForwardIos } from "react-icons/md"; // 페이징 다음 아이콘

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
    }, [ownerId, storeId]);
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
    // 점주 결제 목록 조회 페이지로 이동
    const OwnerPay = () => {
        navigate(`/owner/ownerPayList/${ownerId}`);
    };

    // 점주 결제내역 목록 조회 페이지로 이동
    const OwnerPayLog = () => {
        navigate(`/owner/ownerPayLogList/${ownerId}`);
    };

    // 점주 포인트 목록 조회 페이지로 이동
    const OwnerPoint = () => {
        navigate(`/owner/ownerPointList/${ownerId}`);
    };

    // 점주 매장 테이블 목록 조회 페이지로 이동
    const OwnerStoreTable = () => {
        navigate(`/owner/ownerStoreTableList/${ownerId}`);
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
    const pageSize = 7;

    const total = visitLogs.length;
    const totalPages = Math.ceil(total / pageSize);

    // 현재 페이지 데이터만 자르기
    const currentData = visitLogs.slice((page - 1) * pageSize, page * pageSize);

    return (
        <MainContainer className="bg-[#FFF] py-[100px] lg:py-[150px] sm:py-[100px] xs:py-[60px]">
            <div className="w-full">
                <div className="w-full bg-[#FFF] py-6">
                    <div className="w-full max-w-[880px] mx-auto p-4 flex flex-row md:flex-col items-center justify-between gap-6 bg-white rounded-[20px] shadow-md border border-[#FF4854]">
                        {/* 좌측: 매장/점주 정보 */}
                        <div className="flex flex-col md:items-center md:text-center">
                            <p className="text-lg lg:text-sm md:text-xs text-gray-500">
                                매장 이름 :{" "}
                                <span className="font-semibold text-gray-900">
                                    {name}
                                </span>
                            </p>
                            <p className="text-lg lg:text-sm md:text-xs text-gray-500">
                                점주 이름 :{" "}
                                <span className="font-semibold text-gray-900">
                                    {ownerName}
                                </span>
                            </p>
                        </div>

                        {/* 중앙: 보유 포인트 */}
                        <div className="flex flex-col items-center justify-center border-2 border-[#FF4854] rounded-lg py-3 px-2 shadow-sm min-w-[140px] md:mb-4 md:w-full">
                            <p className="text-sm text-[#FF4854] font-medium tracking-wide">
                                보유 포인트
                            </p>
                            <p className="text-xl font-extrabold text-[#FF4854] mt-1">
                                {(totalPoint ?? 0).toLocaleString()} P
                            </p>
                        </div>

                        {/* 우측: 기능 버튼 1줄 */}
                        <div className="flex justify-end gap-3 overflow-x-auto md:w-full md:justify-start md:flex-wrap">
                            <button
                                className="w-full h-full py-5 px-15 hover:text-[#E61F2C]"
                                onClick={OwnerPay}
                            >
                                <img
                                    className="mb-2 inline-block w-[70px] h-[70px]"
                                    src="/assets/image/dashboard/pay.svg"
                                    alt="결제 조회"
                                />
                                <p className="font-semibold text-sm">결제</p>
                            </button>
                            <button
                                className="w-full h-full py-5 px-15 hover:text-[#E61F2C]"
                                onClick={OwnerPayLog}
                            >
                                <img
                                    className="mb-2 inline-block w-[70px] h-[70px]"
                                    src="/assets/image/dashboard/payLog.svg"
                                    alt="결제 내역 조회"
                                />
                                <p className="font-semibold text-sm">
                                    결제 내역
                                </p>
                            </button>
                            <button
                                className="w-full h-full py-5 px-15 hover:text-[#E61F2C]"
                                onClick={OwnerPoint}
                            >
                                <img
                                    className="mb-2 inline-block w-[70px] h-[70px]"
                                    src="/assets/image/dashboard/point.svg"
                                    alt="포인트 조회"
                                />
                                <p className="font-semibold text-sm">포인트</p>
                            </button>
                            <button
                                className="w-full h-full py-5 px-15 hover:text-[#E61F2C]"
                                onClick={OwnerStoreTable}
                            >
                                <img
                                    className="mb-2 inline-block w-[70px] h-[70px]"
                                    src="/assets/image/dashboard/storeTable.svg"
                                    alt="매장 테이블 조회"
                                />
                                <p className="font-semibold text-sm">
                                    매장 테이블
                                </p>
                            </button>
                            <button
                                className="w-full h-full py-5 px-15 hover:text-[#E61F2C]"
                                onClick={OwnerPay}
                            >
                                <img
                                    className="mb-2 inline-block w-[70px] h-[70px]"
                                    src="/assets/image/dashboard/pay.svg"
                                    alt="전체 방문기록"
                                />
                                <p className="font-semibold text-sm">
                                    전체 방문
                                </p>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-[#FFF] py-6">
                    <div className="w-full max-w-[880px] mx-auto mb-8">
                        <span className="text-2xl font-bold text-[#E61F2C]">
                            결제 처리
                        </span>
                        <div className="border-b border-b-[#ccc] mt-3"></div>
                    </div>

                    <div className="w-full max-w-[880px] mx-auto p-8 bg-white rounded-[20px] shadow-xl border border-[#E61F2C] relative bg-gradient-to-br from-white via-[#fffafa] to-white">
                        <div className="flex flex-row md:flex-col w-full gap-8">
                            {/* 좌측: 고객 정보 */}
                            <div className="flex-[1] flex flex-col justify-between border-r border-r-[#eee] pr-6 md:border-r-0 md:border-b md:pb-6 space-y-3">
                                <p className="flex items-center gap-3 text-gray-600">
                                    <span className="text-2xl">🪑</span>
                                    <span className="font-medium">
                                        테이블 번호 :
                                    </span>
                                    <span className="font-bold text-gray-900">
                                        3 번
                                    </span>
                                </p>
                                <p className="flex items-center gap-3 text-gray-600">
                                    <span className="text-2xl">👤</span>
                                    <span className="font-medium">
                                        고객 이름 :
                                    </span>
                                    <span className="font-bold text-gray-900">
                                        김김김
                                    </span>
                                </p>
                                <p className="flex items-center gap-3 text-gray-600">
                                    <span className="text-2xl">📅</span>
                                    <span className="font-medium">
                                        방문 날짜 :
                                    </span>
                                    <span className="font-bold text-gray-900">
                                        2025.08.31
                                    </span>
                                </p>
                                <p className="flex items-center gap-3 text-gray-600">
                                    <span className="text-2xl">⏰</span>
                                    <span className="font-medium">
                                        방문 시간 :
                                    </span>
                                    <span className="font-bold text-gray-900">
                                        12:01:01
                                    </span>
                                </p>
                            </div>

                            {/* 우측: 금액 입력 및 금액 정보 */}
                            <div className="flex-[2] flex flex-col gap-4 pl-6 md:pl-0 md:items-center md:text-center">
                                {/* 금액 입력 */}
                                <div className="flex items-center w-full">
                                    <span className="w-28 text-gray-700 font-medium flex-shrink-0">
                                        💵 금액입력
                                    </span>
                                    <input
                                        type="number"
                                        className="border border-[#ccc] rounded-lg flex-1 px-3 py-2 focus:outline-none focus:border-[#E61F2C] focus:ring-1 focus:ring-[#E61F2C] transition"
                                        placeholder="금액 입력"
                                    />
                                </div>

                                {/* 금액 요약 */}
                                {/* 금액 요약 */}
                                <div className="flex items-center bg-[#fafafa] rounded-md px-3 py-2 border border-[#eee] transition w-full">
                                    <span className="w-28 text-gray-600 font-medium flex-shrink-0">
                                        할인금액
                                    </span>
                                    <span className="flex-1 text-right font-bold text-gray-900">
                                        300
                                    </span>
                                </div>

                                <div className="flex items-center bg-[#fafafa] rounded-md px-3 py-2 border border-[#eee] transition w-full">
                                    <span className="w-28 text-gray-600 font-medium flex-shrink-0">
                                        결제금액
                                    </span>
                                    <span className="flex-1 text-right font-bold text-gray-900">
                                        10000
                                    </span>
                                </div>

                                <div className="flex items-center bg-[#fafafa] rounded-md px-3 py-2 border border-[#eee] transition w-full">
                                    <span className="w-28 text-gray-600 font-medium flex-shrink-0">
                                        적용포인트
                                    </span>
                                    <span className="flex-1 text-right font-bold text-gray-900">
                                        300
                                    </span>
                                </div>

                                {/* 버튼 */}
                                <div className="mt-5 flex justify-end md:justify-center w-full">
                                    <button className="bg-[#E61F2C] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:scale-105 hover:bg-red-600 active:scale-95 transition-transform duration-150">
                                        결제 완료
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 신규 방문 기록 섹션 */}
                <div className="w-full bg-[#FBFBFC] py-12">
                    <div className="w-full max-w-[880px] mx-auto px-4">
                        <div className="text-center mb-10">
                            <span className="font-semibold text-2xl">
                                신규 방문(주문) 기록
                            </span>
                        </div>
                        <div className="flex items-center justify-center">
                            {newVisitLogs.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2 px-2">
                                    {newVisitLogs.map((newVisitLog) => (
                                        <div
                                            key={newVisitLog.id}
                                            className="rounded-[50px] bg-[#fff] px-7 py-8 hover:text-[#E61F2C] shadow-md"
                                        >
                                            <div className="text-base mb-8">
                                                <p className="mb-3 flex">
                                                    <span className="flex-[8]">
                                                        방문기록 번호
                                                    </span>
                                                    <span className="font-semibold text-[#E61F2C]">
                                                        {newVisitLog.id}
                                                    </span>
                                                </p>
                                                <p className="mb-3 flex">
                                                    <span className="flex-[8]">
                                                        테이블번호
                                                    </span>
                                                    <span className="font-semibold text-[#E61F2C]">
                                                        {
                                                            newVisitLog.storeTableId
                                                        }
                                                    </span>
                                                </p>
                                                <p className="flex">
                                                    <span className="flex-[8]">
                                                        방문 날짜
                                                    </span>
                                                    <span className="font-semibold text-[#E61F2C]">
                                                        {
                                                            newVisitLog.createdAt.split(
                                                                "T"
                                                            )[0]
                                                        }
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex w-full">
                                                <div className="flex items-center w-full">
                                                    <input
                                                        type="number"
                                                        placeholder="금액 입력"
                                                        className="flex-1 min-w-0 rounded-[25px] bg-[#FBFBFC] placeholder:text-[#C7CBD2] py-3 pl-3 pr-20"
                                                        value={
                                                            visitAmounts[
                                                                newVisitLog.id
                                                            ] || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleAmountChange(
                                                                newVisitLog.id,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        className="ml-[-4rem] md:ml-[-4rem] flex-shrink-0 z-10 bg-[#E61F2C] text-[#fff] rounded-[25px] px-4 py-3"
                                                        onClick={() =>
                                                            handleOrder(
                                                                newVisitLog.id
                                                            )
                                                        }
                                                    >
                                                        등록
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <section className="flex flex-col items-center text-center justify-center text-[#999ca2] mt-16">
                                    <img
                                        className="w-20"
                                        src="/assets/image/mobile/noVisitIcon.svg"
                                        alt="방문기록이 없습니다 아이콘"
                                    />
                                    <p className="text-2xl font-semibold mt-6">
                                        신규 방문 기록이 없습니다.
                                    </p>
                                    <p className="text-1xl font-light mt-2">
                                        새로운 방문이 등록되면 이곳에
                                        표시됩니다.
                                    </p>
                                </section>
                            )}
                        </div>
                    </div>
                </div>

                {/* 가맹점 및 금액 정보 섹션 */}
                <div className="w-full bg-[#FFF]">
                    <div className="w-full max-w-[880px] mx-auto px-4">
                        <div className="rounded-[75px] bg-[#FBFBFC] pl-12 flex items-center mb-10">
                            <div className="flex-[7] flex">
                                <div className="flex-[3]">
                                    <p className="text-[#999CA2] text-sm mb-1">
                                        매장 이름
                                    </p>
                                    <p className="text-[#000] text-2xl font-semibold">
                                        {name}
                                    </p>
                                </div>
                                <div className="border-l-[2px] border-[##999CA2] flex-[1]"></div>
                                <div className="flex-[4]">
                                    <p className="text-[#999CA2] text-sm mb-1">
                                        점주 이름
                                    </p>
                                    <p className="text-[#000] text-2xl font-semibold">
                                        {ownerName}
                                    </p>
                                </div>
                            </div>
                            <div className="flex-[3] text-[#fff] font-semibold bg-gradient-to-r from-[#FF4854] to-[#E61F2C] text-center py-10 rounded-[75px]">
                                <p className="text-sm font-light">
                                    보유 포인트
                                </p>
                                <p className="text-3xl">
                                    {(totalPoint ?? 0).toLocaleString()}P
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="flex-[2.5] border border-[rgba(199, 203, 210, 0.3)] text-center rounded-[35px] mr-4">
                                <button
                                    className="w-full h-full py-5 px-15 hover:text-[#E61F2C]"
                                    onClick={OwnerPay}
                                >
                                    <img
                                        className="mb-2 inline-block"
                                        src="/assets/image/dashboard/pay.svg"
                                        alt="결제 조회"
                                    />
                                    <p className="font-semibold ">결제 조회</p>
                                </button>
                            </div>
                            <div className="flex-[2.5] border border-[rgba(199, 203, 210, 0.3)] text-center rounded-[35px] mr-4">
                                <button
                                    className="w-full h-full py-5 px-15 hover:text-[#E61F2C]"
                                    onClick={OwnerPayLog}
                                >
                                    <img
                                        className="mb-2 inline-block"
                                        src="/assets/image/dashboard/payLog.svg"
                                        alt="결제 내역 조회"
                                    />
                                    <p className="font-semibold ">
                                        결제 내역 조회
                                    </p>
                                </button>
                            </div>
                            <div className="flex-[2.5] border border-[rgba(199, 203, 210, 0.3)] text-center rounded-[35px] mr-4">
                                <button
                                    className="w-full h-full py-5 px-15 hover:text-[#E61F2C]"
                                    onClick={OwnerPoint}
                                >
                                    <img
                                        className="mb-2 inline-block"
                                        src="/assets/image/dashboard/point.svg"
                                        alt="포인트 조회"
                                    />
                                    <p className="font-semibold ">
                                        포인트 조회
                                    </p>
                                </button>
                            </div>
                            <div className="flex-[2.5] border border-[rgba(199, 203, 210, 0.3)] text-center rounded-[35px]">
                                <button
                                    className="w-full h-full py-5 px-15 hover:text-[#E61F2C]"
                                    onClick={OwnerStoreTable}
                                >
                                    <img
                                        className="mb-2 inline-block"
                                        src="/assets/image/dashboard/storeTable.svg"
                                        alt="매장 테이블 조회"
                                    />
                                    <p className="font-semibold ">
                                        매장 테이블 조회
                                    </p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 신규 방문 기록 섹션 */}
                <div className="w-full bg-[#FBFBFC] py-24 my-24">
                    <div className="w-full max-w-[880px] mx-auto px-4">
                        <div className="text-center mb-10">
                            <span className="font-semibold text-2xl">
                                신규 방문(주문) 기록
                            </span>
                        </div>
                        <div className="flex items-center justify-center">
                            {newVisitLogs.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2 px-2">
                                    {newVisitLogs.map((newVisitLog) => (
                                        <div
                                            key={newVisitLog.id}
                                            className="rounded-[50px] bg-[#fff] px-7 py-8 hover:text-[#E61F2C] shadow-md"
                                        >
                                            <div className="text-base mb-8">
                                                <p className="mb-3 flex">
                                                    <span className="flex-[8]">
                                                        방문기록 번호
                                                    </span>
                                                    <span className="font-semibold text-[#E61F2C]">
                                                        {newVisitLog.id}
                                                    </span>
                                                </p>
                                                <p className="mb-3 flex">
                                                    <span className="flex-[8]">
                                                        테이블번호
                                                    </span>
                                                    <span className="font-semibold text-[#E61F2C]">
                                                        {
                                                            newVisitLog.storeTableId
                                                        }
                                                    </span>
                                                </p>
                                                <p className="flex">
                                                    <span className="flex-[8]">
                                                        방문 날짜
                                                    </span>
                                                    <span className="font-semibold text-[#E61F2C]">
                                                        {
                                                            newVisitLog.createdAt.split(
                                                                "T"
                                                            )[0]
                                                        }
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex w-full">
                                                <div className="flex items-center w-full">
                                                    <input
                                                        type="number"
                                                        placeholder="금액 입력"
                                                        className="flex-1 min-w-0 rounded-[25px] bg-[#FBFBFC] placeholder:text-[#C7CBD2] py-3 pl-3 pr-20"
                                                        value={
                                                            visitAmounts[
                                                                newVisitLog.id
                                                            ] || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleAmountChange(
                                                                newVisitLog.id,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        className="ml-[-4rem] md:ml-[-4rem] flex-shrink-0 z-10 bg-[#E61F2C] text-[#fff] rounded-[25px] px-4 py-3"
                                                        onClick={() =>
                                                            handleOrder(
                                                                newVisitLog.id
                                                            )
                                                        }
                                                    >
                                                        등록
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <section className="flex flex-col items-center text-center justify-center text-[#999ca2] mt-16">
                                    <img
                                        className="w-20"
                                        src="/assets/image/mobile/noVisitIcon.svg"
                                        alt="방문기록이 없습니다 아이콘"
                                    />
                                    <p className="text-2xl font-semibold mt-6">
                                        신규 방문 기록이 없습니다.
                                    </p>
                                    <p className="text-1xl font-light mt-2">
                                        새로운 방문이 등록되면 이곳에
                                        표시됩니다.
                                    </p>
                                </section>
                            )}
                        </div>
                    </div>
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
                <div className="w-full bg-[#FFF]">
                    <div className="w-full max-w-[880px] mx-auto px-4">
                        <div className="text-center mb-10">
                            <span className="font-semibold text-2xl">
                                전체 방문(주문) 기록
                            </span>
                        </div>

                        {/* 테이블 content 영역 */}
                        <div className="overflow-x-auto bg-white rounded-[25px] border ml-8 mb-8">
                            <table className="min-w-full border-collapse text-[#000]">
                                <thead>
                                    <tr className="bg-[#FBFBFC] uppercase text-base tracking-wide select-none">
                                        <th className="py-4 px-6 text-center">
                                            번호
                                        </th>
                                        <th className="py-4 px-6 text-center">
                                            고객 이름
                                        </th>
                                        <th className="py-4 px-6 text-center">
                                            테이블 번호
                                        </th>
                                        <th className="py-4 px-6 text-center">
                                            방문일시
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.map((visitLog, index) => (
                                        <tr
                                            key={visitLog.id}
                                            className="transition-colors duration-200 cursor-default"
                                        >
                                            <td className="py-4 px-6 text-center whitespace-nowrap font-semibold">
                                                {(page - 1) * pageSize +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="py-4 px-6 text-center whitespace-nowrap">
                                                {visitLog.memberName}
                                            </td>
                                            <td className="py-4 px-6 text-center whitespace-nowrap">
                                                {visitLog.storeTableId}
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
                        </div>

                        {/* 페이징 영역 */}
                        <div className="flex items-center justify-center gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="px-4 py-2 text-[#C7CBD2] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                <MdArrowBackIosNew />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    className={`px-4 py-2 flex items-center justify-center ${
                                        page === i + 1
                                            ? "bg-[#E61F2C] text-[#fff] rounded-[25px]"
                                            : "text-[#C7CBD2] hover:text-[#E61F2C]"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                className="px-4 py-2 text-[#C7CBD2] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                <MdArrowForwardIos />
                            </button>
                        </div>
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

import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

// [아이콘 및 공통 컴포넌트]
import { MainContainer } from "../../molecules/container";
import { IoIosArrowDown } from "react-icons/io"; // 페이지 접는용도

// socket
import { io } from "socket.io-client";

// [공통 데이터 인터페이스]
import { VisitLog } from "src/types"; // 방문기록 인터페이스

function OwnerDashBoard() {
    const navigate = useNavigate();
    const ownerId = localStorage.getItem("ownerId"); // 점주 ID 로그인 시 저장한거 추출
    const [amount, setAmount] = useState(""); // 주문 금액 동적 처리 세팅
    const [name, setStoreName] = useState(); // 가맹점 이름 세팅
    const [ownerName, setOwnerName] = useState(); // 점주 이름 세팅
    const [storeId, setStoreId] = useState(); // 가맹점 id 세팅
    const [totalPoint, setTotalPoint] = useState(); // 합계포인트(점주 보유포인트)
    const [newVisitLogs, setNewVisits] = useState<VisitLog[]>([]); // 최근 방문 기록 세팅
    const [requestPrice, setRequestPrice] = useState(""); // 현금화 금액
    const [isOpen, setIsOpen] = useState(false); // 모바일 상단 정보 토글 버튼 값 세팅
    const socketRef = useRef<any>(null);

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
                setStoreId(storeId); // 가맹점 고유번호 세팅
                setStoreName(storeRes.data.name); // 가맹점 이름 세팅
                setOwnerName(storeRes.data.ownerName); // 점주 이름 세팅

                // 신규 방문(주문) 기록
                const [newVisitLogRes] = await Promise.all([
                    axios.get(`/api/v1/visits/new/${storeId}`),
                ]);
                setNewVisits(newVisitLogRes.data);

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
                });
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();

        // 컴포넌트 언마운트 시 소켓 종료
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [ownerId, storeId]);

    // [신규 방문 데이터 클릭 시 동적 처리]
    const parsedAmount = Number(amount) || 0;

    // [계산 로직]
    const discount = Math.floor(parsedAmount * 0.03); // 3% (할인 금액)
    const payment = parsedAmount - discount; // 결제 금액
    const points = discount; // 점주가 받을 포인트

    // 신규방문 active border
    const [activeId, setActiveId] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleCardClick = (id: number) => {
        setActiveId(id);
        if (inputRef.current) {
            inputRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            inputRef.current.focus();
        }
    };

    // 취소 버튼
    const closeClick = () => {
        setActiveId(null);
    };

    // 금액 입력 시 동적 처리
    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        // 0 이하 값 체크
        if (Number(value) < 0) {
            alert("금액은 1원 이상 입력해주세요!");
            setAmount("0");
            return;
        }
        setAmount(value);
    };

    // 주문하기 버튼 클릭 시 POST 요청
    const handleOrder = async () => {
        if (!activeId) {
            alert("주문을 선택하지 않았습니다.");
            return;
        }
        if (!amount) {
            alert("주문 금액을 입력해주세요.");
            return;
        }

        if (Number(amount) <= 0) {
            alert("0원이나 (-) 금액은 입력할 수 없습니다.");
            return;
        }

        const visitLogId = activeId;
        try {
            const url = `/api/v1/pay/${visitLogId}`;
            const orderData = {
                visitLogId,
                amount: Number(amount),
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

    // 점주 결제 목록 조회 페이지로 이동
    const OwnerPay = () => {
        navigate(`/owner/ownerPayList`);
    };

    // 점주 결제내역 목록 조회 페이지로 이동
    const OwnerPayLog = () => {
        navigate(`/owner/ownerPayLogList`);
    };

    // 점주 포인트 목록 조회 페이지로 이동
    const OwnerPoint = () => {
        navigate(`/owner/ownerPointList`);
    };

    // 점주 매장 테이블 목록 조회 페이지로 이동
    const OwnerStoreTable = () => {
        navigate(`/owner/ownerStoreTableList/${storeId}`);
    };

    // 점주 매장 전체 방문 페이지로 이동
    const OwnerAllVisitLog = () => {
        navigate(`/owner/ownerAllVisitLog/${storeId}`);
    };

    const TestPostcash = async () => {
        try {
            const cashInput = document.querySelector(
                ".cashInput"
            ) as HTMLInputElement | null;

            const memberId = ownerId;
            const requestNumber = Number(requestPrice);

            if (!requestNumber) {
                alert("현금 신청할 금액을 입력해주세요.");
                if (cashInput) {
                    setRequestPrice("");
                }
                return;
            }

            if (requestNumber <= 0) {
                alert("0원이나 (-) 금액은 입력할 수 없습니다.");
                if (cashInput) {
                    setRequestPrice("");
                }
                return;
            }

            if (requestNumber < 1000) {
                alert("현금 신청 금액은 최소 1000원부터 가능합니다.");
                if (cashInput) {
                    setRequestPrice("");
                }
                return;
            }

            if ((totalPoint ?? 0) <= requestNumber) {
                alert("현금 신청할 금액은 보유포인트보다 클 수 없습니다.");
                if (cashInput) {
                    setRequestPrice("");
                }
                return;
            }

            const url = `/api/v1/pointCashOutRequest/${memberId}`;
            const response = await axios.post(url, {
                cash: requestNumber,
                headers: { "Content-Type": "application/json" },
            });
            alert(`${requestNumber}포인트 현금화 신청이 완료 되었습니다.`);
            navigate(0);
            console.log("현금 신청 결과:", response.data);
        } catch (error) {
            console.error("현금 신청 실패:", error);
        }
    };

    return (
        <MainContainer className="bg-[#FFF] py-[100px] lg:py-[150px] sm:py-[100px] xs:py-[60px]">
            <div className="w-full">
                <div className="w-full bg-[#FFF] p-6">
                    {/* 모바일 환경 토글 (열기,닫기) */}
                    <div className="xs:block xxs:block hidden mb-4">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center gap-2"
                        >
                            <IoIosArrowDown
                                className={`${isOpen ? "rotate-180" : ""} transition-transform`}
                            />
                            <span>{isOpen ? "닫기" : "열기"}</span>
                        </button>
                    </div>

                    <div
                        className={`${!isOpen ? "block" : "hidden"} w-full max-w-[880px] mx-auto p-4 flex flex-row md:flex-col items-center justify-between bg-white rounded-[20px] shadow-md border-2 border-[#E61F2C]`}
                    >
                        {/* 좌측 + 중앙 */}
                        <div className="w-full flex flex-row gap-4 md:px-10 xs:p-0 xxs:p-0 xs:flex-row md:justify-between sm:justify-between xxs:flex-row xs:justify-between xxs:justify-between">
                            {/* 좌측: 매장/점주 정보 */}
                            <div className="flex flex-col justify-center xs:w-[48%] xxs:w-[48%]">
                                <p className="text-lg lg:text-sm md:text-sm text-gray-500">
                                    매장 이름 :{" "}
                                    <span className="font-semibold text-gray-900">
                                        {name}
                                    </span>
                                </p>
                                <p className="text-lg lg:text-sm md:text-sm text-gray-500">
                                    점주 이름 :{" "}
                                    <span className="font-semibold text-gray-900">
                                        {ownerName}
                                    </span>
                                </p>
                            </div>

                            {/* 중앙: 보유 포인트 */}
                            <div className="flex flex-col items-center ml-14 xs:ml-0 xxs:ml-0 justify-center border-2 border-[#E61F2C] rounded-lg py-3 px-2 shadow-sm min-w-[140px] xs:w-[48%] xxs:w-[48%]">
                                <p className="text-sm text-[#E61F2C] font-medium tracking-wide">
                                    보유 포인트
                                </p>
                                <p className="text-xl font-extrabold text-[#E61F2C] mt-1">
                                    {(totalPoint ?? 0).toLocaleString()} P
                                </p>
                            </div>
                        </div>

                        {/* 버튼 5개 가로 배치 */}
                        <div className="w-full flex justify-center md:mt-3 xs:mt-3 xxs:mt-3 xs:flex-nowrap xxs:flex-nowrap">
                            <button
                                className="flex-1 xs:min-w-[18%] xxs:min-w-[18%] py-3 hover:text-[#E61F2C]"
                                onClick={OwnerPay}
                            >
                                <img
                                    className="w-[50px] h-[50px] mb-1 inline-block"
                                    src="/assets/image/dashboard/pay.svg"
                                    alt="결제 조회"
                                />
                                <p className="text-sm font-semibold">결제</p>
                            </button>
                            <button
                                className="flex-1 xs:min-w-[18%] xxs:min-w-[18%] py-3 hover:text-[#E61F2C]"
                                onClick={OwnerPayLog}
                            >
                                <img
                                    className="w-[50px] h-[50px] mb-1 inline-block"
                                    src="/assets/image/dashboard/payLog.svg"
                                    alt="결제 내역 조회"
                                />
                                <p className="text-sm font-semibold">
                                    결제 내역
                                </p>
                            </button>
                            <button
                                className="flex-1 xs:min-w-[18%] xxs:min-w-[18%] py-3 hover:text-[#E61F2C]"
                                onClick={OwnerPoint}
                            >
                                <img
                                    className="w-[50px] h-[50px] mb-1 inline-block"
                                    src="/assets/image/dashboard/point.svg"
                                    alt="포인트 조회"
                                />
                                <p className="text-sm font-semibold">포인트</p>
                            </button>
                            <button
                                className="flex-1 xs:min-w-[18%] xxs:min-w-[18%] py-3 hover:text-[#E61F2C]"
                                onClick={OwnerStoreTable}
                            >
                                <img
                                    className="w-[50px] h-[50px] mb-1 inline-block"
                                    src="/assets/image/dashboard/storeTable.svg"
                                    alt="매장 테이블 조회"
                                />
                                <p className="text-sm font-semibold">테이블</p>
                            </button>
                            <button
                                className="flex-1 xs:min-w-[18%] xxs:min-w-[18%] py-3 hover:text-[#E61F2C]"
                                onClick={OwnerAllVisitLog}
                            >
                                <img
                                    className="w-[50px] h-[50px] mb-1 inline-block"
                                    src="/assets/image/dashboard/pay.svg"
                                    alt="전체 방문기록"
                                />
                                <p className="text-sm font-semibold">
                                    전체 방문
                                </p>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 현금화 신청 영역 */}
                <div className="w-full bg-[#FFF] p-6 mt-6">
                    <div className="w-full max-w-[880px] mx-auto p-6 flex flex-col md:flex-row items-center justify-between bg-white rounded-[20px] shadow-md border-2 border-[#E61F2C]">
                        {/* 좌측: 포인트 정보 */}
                        <div className="flex flex-col text-center md:text-left">
                            <p className="text-gray-600 text-sm">보유 포인트</p>
                            <p className="text-2xl font-bold text-[#E61F2C]">
                                {(totalPoint ?? 0).toLocaleString()} P
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                1,000P 이상부터 현금화 신청 가능
                            </p>
                        </div>

                        {/* 중앙 구분선 (데스크탑 전용) */}
                        <div className="hidden md:block h-12 w-px bg-gray-200"></div>

                        {/* 우측: 금액 입력 + 신청 버튼 */}
                        <div className="flex flex-col items-center md:items-end w-full md:w-auto mt-4 md:mt-0">
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="신청 금액 입력"
                                    value={requestPrice}
                                    onChange={(e) =>
                                        setRequestPrice(e.target.value)
                                    }
                                    className="cashInput border border-gray-300 rounded-lg px-3 py-2 text-sm w-[140px] focus:outline-none focus:ring-2 focus:ring-[#E61F2C]"
                                />
                                <button
                                    className="px-5 py-2 rounded-lg font-semibold shadow-sm bg-[#E61F2C] hover:bg-[#c51b25] text-white"
                                    onClick={TestPostcash}
                                >
                                    신청
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                관리자 승인 후 입금 처리됩니다.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 신규 방문 기록 섹션 */}
                <div className="w-full bg-[#FBFBFC] py-12">
                    <div className="w-full max-w-[880px] mx-auto px-4">
                        <div className="text-center mb-10">
                            <span className="font-semibold text-2xl">
                                신규 방문(주문)
                            </span>
                        </div>
                        <div className="flex items-center justify-center">
                            {newVisitLogs.length > 0 ? (
                                <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 px-2">
                                    {newVisitLogs.map((newVisitLog) => (
                                        <div
                                            key={newVisitLog.id}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() =>
                                                handleCardClick(newVisitLog.id)
                                            }
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === "Enter" ||
                                                    e.key === " "
                                                )
                                                    handleCardClick(
                                                        newVisitLog.id
                                                    );
                                            }}
                                            className={`rounded-[50px] pt-10 pl-10 pr-10 shadow-md cursor-pointer
            ${activeId === newVisitLog.id ? "border-2 border-[#E61F2C]" : "border border-transparent"}`}
                                        >
                                            <div className="text-base">
                                                <p className="mb-3 flex justify-between border-b border-[#CCC] pb-1">
                                                    <span className="font-bold text-xl">
                                                        테이블 번호 :{" "}
                                                        {
                                                            newVisitLog.storeTableId
                                                        }
                                                    </span>
                                                </p>

                                                <p className="mb-3 flex justify-between">
                                                    <span>고객 이름</span>
                                                    <span className="font-bold">
                                                        {newVisitLog.memberName}
                                                    </span>
                                                </p>

                                                <p className="mb-3 flex justify-between">
                                                    <span>방문기록 번호</span>
                                                    <span className="font-semibold text-[#E61F2C]">
                                                        {newVisitLog.id}
                                                    </span>
                                                </p>
                                                <p className="mb-3 flex justify-between">
                                                    <span>방문 날짜</span>
                                                    <span className="font-semibold text-[#E61F2C]">
                                                        {
                                                            newVisitLog.createdAt.split(
                                                                "T"
                                                            )[0]
                                                        }
                                                    </span>
                                                </p>

                                                <p className="flex justify-between">
                                                    <span>방문 시간</span>
                                                    <span className="font-semibold text-[#E61F2C]">
                                                        {
                                                            newVisitLog.createdAt.split(
                                                                "T"
                                                            )[1]
                                                        }
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex w-full">
                                                <div className="flex items-center w-full opacity-0 pointer-events-none">
                                                    <input
                                                        type="number"
                                                        placeholder="금액 입력"
                                                        className="flex-1 min-w-0 rounded-[25px] bg-[#FBFBFC] placeholder:text-[#C7CBD2] py-3 pl-3 pr-20"
                                                    />
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
                <div
                    className={`${
                        activeId
                            ? "fixed inset-0 z-50 flex items-center justify-center"
                            : "hidden"
                    }`}
                >
                    {/* 팝업전용 배경 */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>

                    <div className="relative w-full max-w-[880px] mx-auto p-6 bg-[#FFF] rounded-[20px] shadow-2xl z-10 animate-fadeIn ">
                        <div className="w-full max-w-[880px] mx-auto mb-8 md:mb-4">
                            <span className="text-2xl font-bold text-[#E61F2C]">
                                결제 처리
                            </span>
                            <span className="text-base font-semibold text-[#ccc]">
                                {""} ※ 빠른 정산을 권장 드립니다.
                            </span>
                            <div className="border-b border-b-[#ccc] mt-3"></div>
                        </div>
                        <div className="relative w-full mb-5 max-w-[880px] mx-auto p-8 rounded-[20px] bg-gradient-to-br border-2 border-[#E61F2C]">
                            <div className="flex flex-row md:flex-col w-full ">
                                {/* 좌측: 고객 정보 */}
                                <div className="flex-[1] flex flex-col last:border-r border-r-[#eee] md:border-r-0 md:pb-6">
                                    <p className="mb-10 xs:mb-5 xxs:mb-5 flex items-center gap-3 border-b-[#ccc] border-b pb-3">
                                        <span className="text-2xl">🪑</span>
                                        <span className="font-bold text-2xl">
                                            테이블 번호 : {""}
                                            {activeId
                                                ? newVisitLogs.find(
                                                      (v) => v.id === activeId
                                                  )?.storeTableId
                                                : ""}
                                        </span>
                                    </p>

                                    <p className="mb-10 xs:mb-5 xxs:mb-5 flex items-center gap-3 text-gray-600">
                                        <span className="text-2xl">👤</span>
                                        <span className="font-medium">
                                            고객 이름 :
                                        </span>
                                        <span className="font-bold text-gray-900">
                                            {activeId
                                                ? newVisitLogs.find(
                                                      (v) => v.id === activeId
                                                  )?.memberName
                                                : ""}
                                        </span>
                                    </p>
                                    <p className="mb-10 xs:mb-5 xxs:mb-5 flex items-center gap-3 text-gray-600">
                                        <span className="text-2xl">📅</span>
                                        <span className="font-medium">
                                            방문 날짜 :
                                        </span>
                                        <span className="font-bold text-gray-900">
                                            {activeId
                                                ? newVisitLogs
                                                      .find(
                                                          (v) =>
                                                              v.id === activeId
                                                      )
                                                      ?.createdAt.split("T")[0]
                                                : ""}
                                        </span>
                                    </p>
                                    <p className="flex items-center gap-3 text-gray-600">
                                        <span className="text-2xl">⏰</span>
                                        <span className="font-medium">
                                            방문 시간 :
                                        </span>
                                        <span className="font-bold text-gray-900">
                                            {activeId
                                                ? newVisitLogs
                                                      .find(
                                                          (v) =>
                                                              v.id === activeId
                                                      )
                                                      ?.createdAt.split("T")[1]
                                                : ""}
                                        </span>
                                    </p>

                                    {/* 버튼 */}
                                    <div className="mt-12  md:justify-center w-full md:hidden block">
                                        <button
                                            onClick={closeClick}
                                            className="bg-[#fff] text-[#E61F2C] border-[#E61F2C] border px-6 py-3 rounded-xl font-semibold active:scale-95 transition-transform duration-150 mr-5"
                                        >
                                            닫기
                                        </button>
                                    </div>
                                </div>

                                {/* 우측: 금액 입력 및 금액 정보 */}
                                <div className="flex-[2] flex flex-col gap-4 pl-6 md:pl-0 border-[#ccc]">
                                    {/* 금액 입력 */}

                                    <div className="w-full border-b-[#ccc] border-b pb-3">
                                        <span className=" text-black font-bold text-2xl">
                                            💵 금액입력
                                        </span>
                                    </div>
                                    <div className="flex items-center w-full">
                                        <input
                                            type="number"
                                            ref={inputRef}
                                            value={amount}
                                            onChange={handleAmountChange}
                                            className="border border-[#ccc] rounded-lg w-full min-w-0 px-3 py-2 focus:outline-none focus:border-[#E61F2C] focus:ring-1 focus:ring-[#E61F2C] transition"
                                            placeholder="금액 입력"
                                        />
                                    </div>

                                    {/* 금액 요약 */}
                                    <div className="flex items-center bg-[#fafafa] rounded-md px-3 py-2 border border-[#eee] transition w-full">
                                        <span className="w-28 text-gray-600 font-medium flex-shrink-0">
                                            할인금액
                                        </span>
                                        <span className="flex-1 text-right font-bold text-gray-900">
                                            {discount.toLocaleString()}원
                                        </span>
                                    </div>

                                    <div className="flex items-center bg-[#fafafa] rounded-md px-3 py-2 border border-[#eee] transition w-full">
                                        <span className="w-28 text-gray-600 font-medium flex-shrink-0">
                                            결제금액
                                        </span>
                                        <span className="flex-1 text-right font-bold text-gray-900">
                                            {payment.toLocaleString()}원
                                        </span>
                                    </div>

                                    <div className="flex items-center bg-[#fafafa] rounded-md px-3 py-2 border border-[#eee] transition w-full">
                                        <span className="w-28 text-gray-600 font-medium flex-shrink-0">
                                            적용포인트
                                        </span>
                                        <span className="flex-1 text-right font-bold text-gray-900">
                                            {points.toLocaleString()}P
                                        </span>
                                    </div>

                                    {/* 버튼 */}
                                    <div className="mt-5 flex justify-end md:justify-center w-full">
                                        <button
                                            onClick={closeClick}
                                            className="md:block hidden bg-[#fff] text-[#E61F2C] border-[#E61F2C] border px-6 py-3 rounded-xl font-semibold active:scale-95 transition-transform duration-150 mr-5"
                                        >
                                            닫기
                                        </button>
                                        <button
                                            onClick={handleOrder}
                                            className="bg-[#E61F2C] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:scale-105 hover:bg-red-600 active:scale-95 transition-transform duration-150"
                                        >
                                            결제 완료
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}

export default OwnerDashBoard;

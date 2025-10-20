import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

// [파일 첨부 경로]
import { cdn } from "src/constans"; // 파일첨부 경로(네이버클라우드)
import { storeFolder } from "src/constans"; // 첨부 디렉토리 경로 stroe

// [아이콘 및 공통 컴포넌트]
import { MdArrowForwardIos } from "react-icons/md"; // 우측 화살표 아이콘
import { MobileMain } from "src/components/organisms/mobileMain"; // 모바일 상단 타이틀
import { MobileFooter } from "src/components/organisms/mobileFooter"; // 하단 모바일 footer 공통 컴포넌트
import { MobileFooter2 } from "src/components/organisms/mobileFooter2"; // 하단 모바일 footer 공통 컴포넌트

// [공통 데이터 인터페이스]
import { StoreType } from "src/types"; // 가맹점(매장) 인터페이스
import { NoticeDataType } from "src/types"; // 공지사항 인터페이스
import { Customer } from "src/types"; // 고객 인터페이스(고객등급, 발급가능여부 추출)
import { StoreStamp } from "src/types"; // 방문스탬프 인터페이스
import { Nft } from "src/types"; // NFT 인터페이스
import { VisitLog } from "src/types"; // 방문기록 인터페이스

// [swiper 플러그인]
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

export function MobileMainPageTest() {
    const navigate = useNavigate();
    const customerId = localStorage.getItem("customerId"); // 로그인 후 고객ID 세팅
    const [stores, setStores] = useState<StoreType[]>([]); // 가맹점(매장) 데이터 세팅
    const [notices, setNotices] = useState<NoticeDataType[]>([]); // 공지사항 데이터 세팅
    const [customer, setCustomer] = useState<Customer | null>(null); // 고객 데이터 세팅
    const [stamps, setStamp] = useState<StoreStamp[]>([]); // 방문 스탬프 데이터 세팅
    const [nftLogs, setNfts] = useState<Nft[]>([]); // NFT 데이터 세팅
    const [visitLogs, setVisitLogs] = useState<VisitLog[]>([]); // 방문 기록 데이터 세팅
    const itemsPerPage = 3; // 공지사항 3개 고정

    // 고객 등급 객체
    const CustomerGrades: Record<string, string> = {
        SILVER: "실버",
        GOLD: "골드",
        PLATINUM: "플래티넘",
        DIAMOND: "다이아",
    };

    // 가맹점, 공지사항, 최근 NFT, 최근 방문기록 데이터 추출
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (customerId) {
                    // 고객이 로그인되어 있을 때
                    const [
                        storeList,
                        noticeList,
                        customerDetail,
                        storeStamp,
                        nftRes,
                        visits,
                    ] = await Promise.all([
                        axios.get("/api/v1/stores"),
                        axios.get(`/api/v1/notice?size=${itemsPerPage}`),
                        axios.get(`/api/v1/customers/${customerId}`),
                        axios.get(`/api/v1/storeStamps/customer/${customerId}`),
                        axios.get(
                            `/api/v1/customers/${customerId}/nfts?sort=desc&limit=2`
                        ),
                        axios.get(
                            `/api/v1/customers/${customerId}/visits?sort=desc&limit=2`
                        ),
                    ]);
                    setStores(storeList.data.content); // 가맹점 데이터 추출
                    setNotices(noticeList.data.content); // 공지사항 데이터 추출
                    setCustomer(customerDetail.data); // 고객 정보 추출
                    setStamp(storeStamp.data); // 방문 스탬프 추출
                    setNfts(nftRes.data); // NFT 데이터 추출
                    setVisitLogs(visits.data); // 방문기록 데이터 추출
                } else {
                    // 로그인 안 된 경우
                    const [storeList, noticeList] = await Promise.all([
                        axios.get("/api/v1/stores"),
                        axios.get(`/api/v1/notice?size=${itemsPerPage}`),
                    ]);
                    setStores(storeList.data.content); // 가맹점 데이터 추출
                    setNotices(noticeList.data.content); // 공지사항 데이터 추출
                }
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [customerId, itemsPerPage, navigate]);

    // 나의 스탬프 페이지로 이동
    const myStampButton = () => {
        navigate(`/mobile/myStamp`);
    };

    // 나의 정보 페이지로 이동
    const myInfoButton = () => {
        navigate(`/mobile/myPage`);
    };

    // 스탬프 없는 가맹점 alert
    const notMyStampButton = (storeId: number) => {
        alert(
            "아직 방문하지 않은 매장입니다. \n가맹점 상세 페이지로 이동합니다."
        );
        navigate(`/mobile/storeDetail/${storeId}`);
    };

    return (
        <div className="min-h-screen bg-[#fbfbfc] p-4 font-Pretendard overflow-y-auto">
            {/* 모바일 타이틀 */}
            {<MobileMain param={Number(customerId)} />}

            {/* 상단 배너 슬라이드 */}
            <div className=" rounded-lg mb-5 font-semibold text-base truncate">
                <Swiper
                    modules={[Navigation, Autoplay]}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    speed={1500}
                    spaceBetween={20}
                    navigation={false}
                    className="rounded-2xl overflow-hidden"
                >
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <SwiperSlide key={idx}>
                            <img
                                src={`/assets/image/mainTitle.png`}
                                alt={`메인 타이틀 ${idx + 1}`}
                                className="w-full h-[150px] block"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* 가맹점 썸네일 슬라이드 */}
            {stores?.length > 1 && (
                <div className=" rounded-lg mb-5 font-semibold text-base truncate">
                    <Swiper
                        modules={[Autoplay]}
                        slidesPerView="auto"
                        spaceBetween={20}
                        loop={true}
                        allowTouchMove={false}
                        autoplay={{
                            delay: 0,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: false,
                            stopOnLastSlide: false,
                        }}
                        onInit={(swiper) => swiper.autoplay.start()}
                        speed={3000}
                        className="flex items-center"
                    >
                        {stores?.map((store, idx) => {
                            // 최종 경로 가공
                            const src = `${cdn}/${storeFolder}/${store.thumbnail}${store.extension}`;
                            return (
                                <SwiperSlide key={idx}>
                                    <Link
                                        to={`/mobile/storeDetail/${store.id}`}
                                    >
                                        <div className="relative w-full h-[120px]">
                                            {/* 가맹점 이름 오버레이 */}
                                            <div className="absolute bottom-2 left-2 font-bold border border-[#fff] text-[#fff] px-2 py-1 rounded-md text-sm">
                                                {store.name}
                                            </div>
                                            {store.thumbnail ? (
                                                <img
                                                    src={src}
                                                    alt={`가게 ${store.name}`}
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                            ) : (
                                                <div className="text-center items-center">
                                                    썸네일 없음
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            )}

            {/* 금액 타이틀 영역 */}
            <div className="mt-8 mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-semibold ">금액 정보</h2>
                </div>
            </div>

            {/* 금액 컨텐츠 영역 */}
            <div className="mb-5 p-5 font-semibold text-base truncate bg-white rounded-xl border-[#580098] border">
                {customerId ? (
                    <div>
                        <div className="flex justify-between border-b border-[#580098] p-5">
                            <span>현재 보유 포인트</span>
                            <span className="text-[#580098]">13,500P</span>
                        </div>
                        <div className="flex flex-col">
                            <Link to={`/mobile/gradeGuide`}>
                                <div className="flex justify-between border-b border-[#580098] p-5">
                                    <div className="flex flex-col">
                                        <span>현재 나의 등급</span>
                                        <span className="mt-3">
                                            [ {""}
                                            {CustomerGrades[
                                                customer?.customerGrade ?? ""
                                            ] ?? "-"}{" "}
                                            회원 ]
                                        </span>
                                    </div>
                                    <div className="flex items-end">
                                        <span className="text-[#A19CB4] text-sm font-normal">
                                            적립률 3%
                                        </span>
                                        <span>
                                            <img
                                                src={`/public/assets/image/customerGrade/${customer?.customerGrade}Grade.png`}
                                                alt={`${CustomerGrades[customer?.customerGrade ?? ""] ?? "-"} 등급`}
                                                className="block"
                                            ></img>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                            <div className="p-5">
                                <div>최근 결제 내역</div>
                                <div className="flex flex-col bg-[#ededed] rounded-lg p-4 mt-2 text-sm font-semibold">
                                    <span>금액 : 15,000원</span>
                                    <span>시간 : 2025.10.10 14:02:17</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <p>로그인 후 확인할 수 있습니다</p>
                        <p>
                            <Link
                                className="underline text-[#580098] font-bold"
                                to={`/mobile/gradeGuide`}
                            >
                                [ 등급 안내 ]
                            </Link>
                        </p>
                    </div>
                )}
            </div>

            {/* 공지사항 타이틀 영역 */}
            <div className="mt-8 mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-semibold ">공지사항</h2>
                </div>
            </div>

            {/* 공지사항 컨텐츠 영역 */}
            <div>
                <div className="flex flex-col p-5 font-normal text-sm bg-white rounded-xl border-[#580098] border">
                    <div className="flex flex-col">
                        {notices.length > 0 ? (
                            notices.map((notice, idx) => (
                                <Link to={`/mobile/noticeDetail/${notice.id}`}>
                                    <div
                                        key={idx}
                                        className="flex p-2 border-b border-[#580098]"
                                    >
                                        <span className="bg-[#580098] w-14 text-[#fff] text-center rounded-md mr-4 flex-shrink-0">
                                            공지
                                        </span>
                                        <span className="truncate whitespace-nowrap overflow-hidden">
                                            {notice.title}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="p-2 text-gray-400">
                                공지사항이 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {customerId ? (
                <div>
                    {/* 나의 정보 영역 */}
                    <div className="bg-[#fff] border-collapse rounded-2xl shadow-sm mt-8 border border-[#580098]">
                        <button
                            className="w-full px-4 py-5 flex items-center justify-between"
                            onClick={myInfoButton}
                        >
                            <span className="text-left  font-bold">
                                나의 정보
                            </span>
                            <span className="float-right">
                                <MdArrowForwardIos />
                            </span>
                        </button>
                    </div>
                    {/* 나의 등급 타이틀 영역 */}
                    <div className="mt-8 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-2xl font-semibold ">
                                나의 등급
                            </h2>
                        </div>
                    </div>
                    {/* 나의 등급 컨텐츠 영역 */}
                    <div>
                        <div className="grid grid-cols-3 gap-4 bg-white rounded-xl border border-[#580098] p-5 mb-3 items-center">
                            <span>
                                {CustomerGrades[
                                    customer?.customerGrade ?? ""
                                ] ?? "-"}{" "}
                                회원
                            </span>
                            <span>
                                <img
                                    src={`/public/assets/image/customerGrade/${customer?.customerGrade}Grade.png`}
                                    alt={`${CustomerGrades[customer?.customerGrade ?? ""] ?? "-"} 등급`}
                                ></img>
                            </span>
                        </div>
                        <div className="bg-white rounded-xl border border-[#580098] p-5 mb-3 flex items-center">
                            <span>
                                쿠폰 발급 가능 여부{" "}
                                {customer?.couponAvailable === "Y"
                                    ? "✅"
                                    : "❌"}
                            </span>
                            {/* 실제로 활용하게 될 경우 이벤트 만들기 */}
                            {customer?.couponAvailable === "Y" && (
                                <button>쿠폰신청 하기</button>
                            )}
                        </div>
                    </div>
                    {/* 내 스탬프 타이틀 영역 */}
                    <div className="mt-8 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-2xl font-semibold ">
                                내 스탬프 카드
                            </h2>
                        </div>
                    </div>
                    {/* 내 스탬프 컨텐츠 영역 */}
                    <div>
                        <div className="grid grid-cols-3 gap-4 bg-white rounded-xl border-[#580098] border p-5 mb-3 items-center ">
                            {stores?.map((store, idx) => {
                                // 최종 파일 첨부 경로 가공
                                const src = `${cdn}/${storeFolder}/${store.thumbnail}${store.extension}`;

                                // 방문 여부 체크
                                const isStamped = stamps?.some(
                                    (s) => s.storeId === store.id
                                );

                                return (
                                    <button
                                        key={idx}
                                        className="relative rounded-lg overflow-hidden"
                                        onClick={() =>
                                            isStamped
                                                ? myStampButton()
                                                : notMyStampButton(store.id)
                                        }
                                    >
                                        <div className="absolute text-[#fff] z-10 text-xs p-2">
                                            {store.name}
                                        </div>
                                        <img
                                            src={src}
                                            className="w-full h-28 object-cover transition-all duration-500 brightness-100"
                                            alt={store.name}
                                        />
                                        {isStamped && (
                                            <img
                                                src="/public/assets/image/mobile/checkImage.jpg"
                                                alt="stamp"
                                                className="absolute inset-0 m-auto w-16 h-16 animate-[stampIn_0.4s_ease-out]"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <div></div>
            )}

            {/* NFT 컨텐츠 영역 */}
            {customerId ? (
                <div>
                    {/* NFT 타이틀 영역 */}
                    <div className="mt-8 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-2xl font-semibold ">
                                최근 NFT 목록
                            </h2>
                        </div>
                    </div>
                    {/* NFT 컨텐츠 영역 */}
                    <section>
                        {nftLogs.length > 0 ? (
                            nftLogs.map((nft, idx) => (
                                <Link to={`/mobile/nftDetail/${nft.id}`}>
                                    <div
                                        key={idx}
                                        className="bg-white rounded-xl shadow-sm border border-[#580098] p-5 mb-3 flex items-center"
                                    >
                                        {/* 기존 데이터는 그대로 */}
                                        <div className="flex items-center">
                                            <img
                                                src="/assets/image/mobile/nftIcon.svg"
                                                alt="nft 리스트 아이콘"
                                            />
                                            <div className="flex flex-col ml-3 ">
                                                <p className="text-xl font-semibold mb-1 ">
                                                    {nft.storeName}
                                                </p>
                                                <p className="text-xs text-[#999ca2]">
                                                    <span className="font-bold mr-2">
                                                        NFT ID
                                                    </span>
                                                    <span className="font-normal ">
                                                        {nft.tokenId}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-[#580098] p-6 flex flex-col items-center justify-center">
                                <p className="text-black text-sm font-semibold">
                                    최근 NFT 발급 기록이 없습니다.
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                    새로운 NFT가 발급되면 이곳에 표시됩니다.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            ) : (
                <div></div>
            )}

            {customerId ? (
                <div>
                    {/* 방문 기록 타이틀 영역 */}
                    <div className="mt-8 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-2xl font-semibold ">
                                최근 방문기록
                            </h2>
                        </div>
                    </div>

                    {/* 방문 기록 컨텐츠 영역 */}
                    <section>
                        {visitLogs.length > 0 && customerId ? (
                            visitLogs.map((visitLog, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white rounded-xl shadow-sm border border-[#580098] p-5 mb-3 flex items-center"
                                >
                                    <div className="flex items-center">
                                        <img
                                            src="/assets/image/mobile/visitIcon.svg"
                                            alt="방문기록 리스트 아이콘"
                                        />
                                        <div className="flex flex-col ml-3 ">
                                            <p className="text-xl font-semibold mb-1 ">
                                                {visitLog.storeName}
                                            </p>
                                            <p className="text-xs text-[#999ca2]">
                                                <span className="font-bold mr-2">
                                                    방문 시간
                                                </span>
                                                <span className="font-normal">
                                                    {visitLog.createdAt.replace(
                                                        "T",
                                                        " "
                                                    )}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-[#580098] p-6 flex flex-col items-center justify-center  text-[#999ca2]">
                                <img
                                    src="/assets/image/mobile/noVisitIcon.svg"
                                    alt="방문기록이 없습니다 아이콘"
                                />
                                <p className="text-lg font-semibold mt-2">
                                    방문 기록이 없습니다.
                                </p>
                                <p className="text-sm font-light mt-1">
                                    새로운 방문이 등록되면 이곳에 표시됩니다.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            ) : (
                <div></div>
            )}

            {/* 하단 네비게이션 */}
            {customerId ? <MobileFooter /> : <MobileFooter2 />}
        </div>
    );
}
export default MobileMainPageTest;

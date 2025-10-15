import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

// import { MdArrowForwardIos } from "react-icons/md";
import { MobileMain } from "src/components/organisms/mobileMain"; // 모바일 상단 타이틀
import { MobileFooter2 } from "src/components/organisms/mobileFooter2"; // 하단 모바일 footer 공통 컴포넌트

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { NoticeDataType } from "src/types";
import { StoreType } from "src/types";
import { cdn } from "src/constans";
import { storeFolder } from "src/constans";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

interface Nft {
    id: number;
    tokenId: number;
    storeId: number;
    customerId: number;
    storeName?: string;
    createdAt: string;
}

interface VisitLog {
    id: number;
    storeId: number;
    customerId: number;
    storeName?: string;
    createdAt: string;
}

// 위에 배너 슬라이드
const images = [
    "/public/assets/image/mainTitle.png",
    "/public/assets/image/mainTitle.png",
    "/public/assets/image/mainTitle.png",
    "/public/assets/image/mainTitle.png",
    "/public/assets/image/mainTitle.png",
];

export function MobileMainPageTest() {
    const navigate = useNavigate();
    const { customerId } = useParams();
    const [nftLogs, setNfts] = useState<Nft[]>([]);
    const [visitLogs, setVisitLogs] = useState<VisitLog[]>([]);
    const [noticefilteredData, setNoticeFilteredData] = useState<
        NoticeDataType[]
    >([]); // 필터링된 데이터
    const [storefilteredData, setStoreFilteredData] = useState<StoreType[]>([]); // 필터링된 데이터

    // 공지사항 3개 불러오기
    const itemsPerPage = 3;
    const { data: noticeData, isFetching: noticeLoading } = useQuery({
        queryKey: ["noticeList"],
        queryFn: async () => {
            const res = await axios.get(`/api/v1/notice?size=${itemsPerPage}`);
            return res.data;
        },
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (!noticeLoading && noticeData) {
            setNoticeFilteredData(noticeData.content);
        }
    }, [noticeData, noticeLoading]);

    // 가맹점 목록 출력 - 이미지 슬라이드 용도
    const { data: storeData, isFetching: storeLoading } = useQuery({
        queryKey: ["storeList"],
        queryFn: async () => {
            const res = await axios.get("/api/v1/stores"); // 각 가맹점 정보 포함
            return res.data;
        },
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (!storeLoading && storeData) {
            setStoreFilteredData(storeData.content);
        }
    }, [storeData, storeLoading]);

    // 최근 NFT, 최근 방문기록
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [nftRes, visits] = await Promise.all([
                    axios.get(
                        `/api/v1/customers/${customerId}/nfts?sort=desc&limit=2`
                    ),
                    axios.get(
                        `/api/v1/customers/${customerId}/visits?sort=desc&limit=2`
                    ),
                ]);
                setNfts(nftRes.data); // 해당 고객의 NFT데이터 추출(최근 2개)
                setVisitLogs(visits.data); // 해당 고객의 방문기록 데이터 추출(최근 2개)
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [customerId, navigate]);

    return (
        <div className="min-h-screen bg-[#fbfbfc] p-4 font-Pretendard">
            {/* 모바일 타이틀 */}
            {<MobileMain param={Number(customerId)} />}

            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">내 스탬프 카드</h2>

                <div className="grid grid-cols-3 gap-4">
                    {storefilteredData?.map((store, idx) => {
                        const src = `${cdn}/${storeFolder}/${store.thumbnail}${store.extension}`;
                        return (
                            <div
                                key={idx}
                                className="relative rounded-lg overflow-hidden"
                            >
                                <div className="absolute text-[#fff] z-10 text-xs p-2">
                                    {store.name}
                                </div>
                                <img
                                    src={src}
                                    className="w-full h-28 object-cover transition-all duration-500 brightness-100"
                                    alt={store.name}
                                />
                                <img
                                    src="/public/assets/image/mobile/checkImage.jpg"
                                    alt="stamp"
                                    className="absolute inset-0 m-auto w-16 h-16 animate-[stampIn_0.4s_ease-out]"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 상단 배너 광고 */}
            <header className=" rounded-lg mb-5 font-semibold text-base truncate">
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
                    {images.map((src, idx) => (
                        <SwiperSlide key={idx}>
                            <img
                                src={src}
                                alt={`메인 타이틀 ${idx + 1}`}
                                className="w-full h-[150px] block"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </header>

            {/* 가맹점 썸네일 슬라이드 */}
            <header className=" rounded-lg mb-5 font-semibold text-base truncate">
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
                    {storefilteredData?.map((store, idx) => {
                        const src = `${cdn}/${storeFolder}/${store.thumbnail}${store.extension}`;
                        return (
                            <SwiperSlide key={idx}>
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
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </header>

            {/* 금액 영역 */}
            <header className=" rounded-lg mb-5 font-semibold text-base truncate">
                <div className="flex justify-between border-b border-[#580098] p-5">
                    <span>현재 보유 포인트</span>
                    <span className="text-[#580098]">13,500P</span>
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-between border-b border-[#580098] p-5">
                        <div className="flex flex-col">
                            <span>현재 나의 등급</span>
                            <span className="mt-3">일반 회원</span>
                        </div>
                        <div className="flex items-end">
                            <span className="text-[#A19CB4] text-sm font-normal">
                                적립률 3%
                            </span>
                            <span>
                                <img
                                    src="/public/assets/image/mainNft.png"
                                    alt="영수증"
                                    className="block"
                                />
                            </span>
                        </div>
                    </div>
                    <div className="p-5">
                        <div>최근 결제 내역</div>
                        <div className="flex flex-col bg-[#ededed] rounded-lg p-4 mt-2 text-sm font-semibold">
                            <span>금액 : 15,000원</span>
                            <span>시간 : 2025.10.10 14:02:17</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="mt-8 mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-semibold ">공지사항</h2>
                </div>
            </div>

            {/* NFT 목록 */}
            <section>
                <div className="flex flex-col p-5 font-normal  text-sm">
                    <div className="flex flex-col">
                        {noticefilteredData.length > 0 ? (
                            noticefilteredData.map((notice, idx) => (
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
                            ))
                        ) : (
                            <div className="p-2 text-gray-400">
                                공지사항이 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="mt-8 mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-semibold ">최근 NFT 목록</h2>
                </div>
            </div>

            {/* NFT 목록 */}
            <section>
                {nftLogs.length > 0 ? (
                    nftLogs.map((nft, idx) => (
                        <Link to={`/mobile/nftDetail/${customerId}/${nft.id}`}>
                            <div
                                key={idx}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-3 flex items-center"
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
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
                        <p className="text-black text-sm font-semibold">
                            최근 NFT 발급 기록이 없습니다.
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                            새로운 NFT가 발급되면 이곳에 표시됩니다.
                        </p>
                    </div>
                )}
            </section>
            <div className="mt-8 mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-semibold ">최근 방문기록</h2>
                </div>
            </div>

            {/* 방문 목록 */}
            <section>
                {visitLogs.length > 0 ? (
                    visitLogs.map((visitLog, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-3 flex items-center"
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
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center  text-[#999ca2]">
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

            {/* 하단 네비게이션 */}
            {<MobileFooter2 />}
        </div>
    );
}
export default MobileMainPageTest;

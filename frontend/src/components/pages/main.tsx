import axios from "axios";
import { useEffect, useState } from "react";

// [파일 첨부 경로]
import { cdn } from "src/constans"; // 파일첨부 경로(네이버클라우드)
import { storeFolder } from "src/constans"; // 첨부 디렉토리 경로 stroe

// [아이콘 및 공통 컴포넌트]
import { MainContainer } from "../molecules/container";

// [공통 데이터 인터페이스]
import { StoreType } from "src/types"; // 가맹점(매장) 인터페이스
import { NoticeDataType } from "src/types"; // 공지사항 인터페이스

// [swiper 플러그인]
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

// 슬라이드 화살표 커스텀
const customSwiperStyle = `
.swiper-button-next,
.swiper-button-prev {
  color: #010b6a;
  width: 50px;
  height: 50px;
  background-color: #FFF;
  border-radius: 50%;
  padding: 15px 0px;
}
  
// .swiper-button-next:hover,
// .swiper-button-prev:hover {
//   background-color: rgba(0, 0, 0, 0.6);
// }
.swiper-button-next::after,
.swiper-button-prev::after {
  font-size: 18px;
  font-weight: bold;

}
.swiper-button-next { right: 30px !important; }
.swiper-button-prev { left: 30px !important; }
`;

function MainPage() {
    const [stores, setStores] = useState<StoreType[]>([]); // 가맹점(매장) 데이터 세팅
    const [notices, setNotices] = useState<NoticeDataType[]>([]); // 공지사항 데이터 세팅
    const itemsPerPage = 3; // 공지사항 3개 고정

    // 가맹점, 공지사항, 최근 NFT, 최근 방문기록 데이터 추출
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [storeList, noticeList] = await Promise.all([
                    axios.get("/api/v1/stores"),
                    axios.get(`/api/v1/notice?size=${itemsPerPage}`),
                ]);
                setStores(storeList.data.content); // 가맹점 데이터 추출
                setNotices(noticeList.data.content); // 공지사항 데이터 추출
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [itemsPerPage]);

    // 점주 결제 목록 조회 페이지로 이동
    const btn1 = () => {
        alert("로그인 후에 확인할 수 있습니다.");
    };

    const btn2 = () => {
        alert("로그인 후에 확인할 수 있습니다.");
    };

    return (
        <MainContainer className="bg-[#FFF] py-[100px] lg:py-[150px] sm:py-[100px] xs:py-[60px]">
            <div className="w-full">
                <div className="w-full bg-[#FFF] p-6">
                    <div className="w-[1700px] mx-auto p-4">
                        {/* 첫번째 영역 */}
                        <div className="w-full flex">
                            {/* 메인 슬라이드 영역 */}
                            <div className="relative w-full max-w-[1200px]">
                                <Swiper
                                    modules={[Navigation, Autoplay]}
                                    slidesPerView={1}
                                    loop={true}
                                    autoplay={{
                                        delay: 3000,
                                        disableOnInteraction: false,
                                    }}
                                    speed={3000}
                                    spaceBetween={20}
                                    navigation={true}
                                    className="rounded-2xl overflow-hidden"
                                >
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <SwiperSlide key={idx}>
                                            <img
                                                src={`/assets/image/mainTitle.png`}
                                                alt={`메인 타이틀 ${idx + 1}`}
                                                className="w-full h-auto block"
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <style>{customSwiperStyle}</style>
                            </div>

                            {/* 포인트 영역 */}
                            <div className="w-[400px] h-[460px] mx-3 flex flex-col border border-[#580098] rounded-xl text-lg font-bold shadow-xl">
                                <div className="flex justify-between border-b border-[#580098] p-5">
                                    <span>현재 보유 포인트</span>
                                    <span className="text-[#580098]">
                                        13,500P
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex justify-between border-b border-[#580098] p-5">
                                        <div className="flex flex-col">
                                            <span>현재 나의 등급</span>
                                            <span className="mt-3">
                                                일반 회원
                                            </span>
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
                                            <span>
                                                시간 : 2025.10.10 14:02:17
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 두번째 영역 */}
                        <div className="w-full overflow-hidden mt-16">
                            <Swiper
                                modules={[Autoplay]}
                                slidesPerView="auto"
                                spaceBetween={20}
                                loop={true}
                                allowTouchMove={false}
                                autoplay={{
                                    delay: 0,
                                    disableOnInteraction: false,
                                }}
                                speed={3000}
                                className="flex items-center"
                            >
                                {[...Array(3)].flatMap(() =>
                                    stores?.map((store, idx) => {
                                        const src = `${cdn}/${storeFolder}/${store.thumbnail}${store.extension}`;
                                        return (
                                            <SwiperSlide
                                                key={`${idx}-${Math.random()}`}
                                                style={{ width: 300 }}
                                            >
                                                <div className="relative w-full h-[150px]">
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
                                    })
                                )}
                            </Swiper>
                        </div>

                        {/* 세번째 영역 */}
                        <div className="w-full flex mt-16">
                            {/* 게시판 영역 */}
                            <div className="w-[800px] mx-3 flex flex-col border border-[#580098] rounded-xl text-lg font-bold shadow-xl">
                                <div className="flex justify-between border-b border-[#580098] p-5 text-2xl">
                                    <span>공지사항</span>
                                </div>
                                <div className="flex flex-col p-5 font-normal">
                                    <div className="flex flex-col">
                                        {notices.length > 0 ? (
                                            notices.map((notice, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex p-2 border-b border-[#580098]"
                                                >
                                                    <span className="bg-[#580098] w-14 text-[#fff] text-center rounded-md mr-4">
                                                        공지
                                                    </span>
                                                    <span>{notice.title}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-2 text-gray-400">
                                                공지사항이 없습니다.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 버튼 영역 */}
                            <div className="w-[850px] text-xl flex">
                                <button
                                    className="w-[390px] p-5 mx-2 bg-[#580098] rounded-xl text-[#fff] flex flex-col items-center justify-center"
                                    onClick={btn1}
                                >
                                    <img
                                        src="/public/assets/image/mainbutton1.svg"
                                        alt="영수증"
                                        className="block"
                                    />
                                    <span className="mt-2 text-center">
                                        영수증
                                    </span>
                                </button>

                                <button
                                    className="w-[390px] p-5 mx-2 bg-[#580098] rounded-xl text-[#fff] flex flex-col items-center justify-center"
                                    onClick={btn2}
                                >
                                    <img
                                        src="/public/assets/image/mainbutton2.svg"
                                        alt="적립내역"
                                        className="block"
                                    />
                                    <span className="mt-2 text-center">
                                        적립내역
                                    </span>
                                </button>

                                {/* <button className="w-[180px] p-5 mx-2 bg-[#580098] rounded-xl text-[#fff] flex flex-col items-center justify-center">
                                    <img
                                        src="/public/assets/image/mainbutton3.svg"
                                        alt="레이아웃"
                                        className="block"
                                    />
                                    <span className="mt-2 text-center">
                                        레이아웃
                                    </span>
                                </button>

                                <button className="w-[180px] p-5 mx-2 bg-[#580098] rounded-xl text-[#fff] flex flex-col items-center justify-center">
                                    <img
                                        src="/public/assets/image/mainbutton4.svg"
                                        alt="레이아웃"
                                        className="block"
                                    />
                                    <span className="mt-2 text-center">
                                        레이아웃
                                    </span>
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}

export default MainPage;

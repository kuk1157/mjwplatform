import { MainContainer } from "../molecules/container";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import { useEffect, useState } from "react";
import { NoticeDataType } from "src/types";
import { StoreType } from "src/types";
import { useQuery } from "react-query";
import axios from "axios";
import { cdn } from "src/constans";
import { storeFolder } from "src/constans";
// import { UserApi } from "src/utils/userApi";
// import { useRecoilValue } from "recoil";

// import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

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
    const [noticefilteredData, setNoticeFilteredData] = useState<
        NoticeDataType[]
    >([]); // 필터링된 데이터
    const [storefilteredData, setStoreFilteredData] = useState<StoreType[]>([]); // 필터링된 데이터

    const itemsPerPage = 3;
    const { data: noticeData, isFetching: noticeLoading } = useQuery({
        queryKey: ["noticeList"],
        queryFn: async () => {
            // size=3로 고정
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
    // 위에 배너 슬라이드
    const images = [
        "/public/assets/image/mainTitle.png",
        "/public/assets/image/mainTitle.png",
        "/public/assets/image/mainTitle.png",
        "/public/assets/image/mainTitle.png",
        "/public/assets/image/mainTitle.png",
    ];

    // // 가로 메인 이미지
    // const imageSrc = "/public/assets/image/mainStore.png";

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
                                    speed={1500}
                                    spaceBetween={20}
                                    navigation={true}
                                    className="rounded-2xl overflow-hidden"
                                >
                                    {images.map((src, idx) => (
                                        <SwiperSlide key={idx}>
                                            <img
                                                src={src}
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
                                slidesPerView="auto"
                                spaceBetween={20}
                                loop={storefilteredData?.length * 350 > 1600} // 영역 넘어가면 loop
                                autoplay={
                                    storefilteredData?.length * 350 > 1600
                                        ? {
                                              delay: 0,
                                              disableOnInteraction: false,
                                          }
                                        : false
                                }
                            >
                                {storefilteredData?.map((store, idx) => {
                                    const src = `${cdn}/${storeFolder}/${store.thumbnail}${store.extension}`;
                                    return (
                                        <SwiperSlide
                                            key={idx}
                                            style={{ width: 350 }}
                                        >
                                            <div className="relative w-full h-[150px]">
                                                {/* 가맹점 이름 오버레이 */}
                                                <div className="absolute bottom-2 left-2 font-bold border border-[#580098] text-[#580098] px-2 py-1 rounded-md text-sm">
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
                                        {noticefilteredData.length > 0 ? (
                                            noticefilteredData.map(
                                                (notice, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex p-2 border-b border-[#580098]"
                                                    >
                                                        <span className="bg-[#580098] w-14 text-[#fff] text-center rounded-md mr-4">
                                                            공지
                                                        </span>
                                                        <span>
                                                            {notice.title}
                                                        </span>
                                                    </div>
                                                )
                                            )
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
                                    className="w-[360px] p-5 mx-2 bg-[#580098] rounded-xl text-[#fff] flex flex-col items-center justify-center"
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
                                    className="w-[360px] p-5 mx-2 bg-[#580098] rounded-xl text-[#fff] flex flex-col items-center justify-center"
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

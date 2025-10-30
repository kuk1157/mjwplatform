import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

// [파일 첨부 경로]
import { cdn } from "src/constans"; // 파일첨부 경로(네이버클라우드)
import { storeFolder } from "src/constans"; // 첨부 디렉토리 경로 notice

// [아이콘 및 공통 컴포넌트]
import { CiImageOff } from "react-icons/ci"; // 데이터없음 아이콘
import { MdArrowBackIosNew } from "react-icons/md"; // 이전 페이지이동 좌측 화살표 아이콘
import { MobileMain } from "src/components/organisms/mobileMain"; // 모바일 상단 타이틀
import { MobileFooter } from "src/components/organisms/mobileFooter"; // 하단 모바일 footer 공통 컴포넌트
import { MobileFooter2 } from "src/components/organisms/mobileFooter2"; // 하단 모바일 footer 공통 컴포넌트

// [공통 데이터 인터페이스]
import { StoreDetailType } from "src/types"; //  가맹점 인터페이스

export function MobileStoreDetail() {
    const navigate = useNavigate();
    const { id } = useParams(); //  가맹점 id
    const customerId = localStorage.getItem("customerId"); // 고객 번호 localStroage
    const [storeDetail, setStore] = useState<StoreDetailType>(); //  가맹점 데이터 세팅

    // 지도 관련
    const [naverMap, setNaverMap] = useState(String);
    const mapRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // 방문 스탬프, 가맹점 상세보기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [storeDetail, mapKey] = await Promise.all([
                    axios.get(`/api/v1/stores/${id}`),
                    axios.get("/api/v1/naver/maps"), // API KEY 추출 API
                ]);
                setStore(storeDetail.data); //  가맹점 정보 저장
                setNaverMap(mapKey.data); // API KEY 저장
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };
        fetchData();
    }, [id]);

    const handleBack = () => {
        navigate(-1); // 뒤로 가기
    };

    const clientId = naverMap;

    // 지도 스크립트 로드
    useEffect(() => {
        if (!clientId) return; // key 없으면 기다리기
        if (window.naver?.maps) {
            // 이미 로드된 경우
            setIsLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
        script.async = true;
        script.onload = () => setIsLoaded(true);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [clientId]);

    // 지도 초기화
    useEffect(() => {
        if (!isLoaded || !mapRef.current || !storeDetail) return;
        const lat = 35.8775458;
        const lng = 128.6309931;

        const mapOptions = {
            center: new window.naver.maps.LatLng(
                storeDetail?.latitude ?? lat,
                storeDetail?.longitude ?? lng
            ),
            zoom: 17,
        };

        // 지도만 초기화
        const maps = new window.naver.maps.Map(mapRef.current, mapOptions);

        const info = `<div style="color:#FFF; font-size:13px; padding:6px; text-align:center;">${storeDetail?.name}</div>`;

        const infowindow = new window.naver.maps.InfoWindow({
            content: info,
            maxWidth: 140,
            borderWidth: 0,
            backgroundColor: "#E61F2C",
            pixelOffset: new window.naver.maps.Point(0, 0),
        });

        const marker = {
            position: new window.naver.maps.LatLng(
                storeDetail?.latitude ?? lat,
                storeDetail?.longitude ?? lng
            ),
            map: maps,
            icon: {
                url: "/assets/image/mobile/active/visit.svg",
                anchor: new naver.maps.Point(10, 10),
            },
        };
        const markerInstance = new window.naver.maps.Marker(marker);
        infowindow.open(maps, markerInstance);
    }, [isLoaded, storeDetail]);

    return (
        <div className="min-h-screen bg-white font-Pretendard">
            <div className="p-4 mb-20">
                {/* 모바일 타이틀 */}
                {<MobileMain param={Number(customerId)} />}

                <div className="mt-8 mb-5">
                    <div className="flex items-center gap-2 mb-2">
                        <button
                            className="w-full flex items-center justify-between"
                            onClick={handleBack}
                        >
                            <h2 className="text-2xl font-semibold flex items-center">
                                <span className="mr-2">
                                    <MdArrowBackIosNew />
                                </span>
                                <span> 가맹점 상세보기</span>
                            </h2>
                        </button>
                    </div>
                </div>
                {storeDetail ? (
                    <div>
                        <div className="mb-5 flex items-center">
                            <div className="w-full flex justify-center items-center">
                                <div
                                    id="map"
                                    ref={mapRef}
                                    className="w-[330px] h-[330px] border-2 border-[#580098] rounded-3xl"
                                />
                            </div>
                        </div>

                        <div className="mb-5 flex items-center">
                            <div className="w-full flex justify-center items-center">
                                {storeDetail.thumbnail ? (
                                    <img
                                        src={`${cdn}/${storeFolder}/${storeDetail.thumbnail}${storeDetail.extension}`}
                                        alt={storeDetail.name}
                                    />
                                ) : (
                                    <span className="p-6 text-xl text-center">
                                        <p>썸네일 없음</p>
                                        <p className="text-center inline-block mt-3">
                                            <CiImageOff />
                                        </p>
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm shadow-[rgb(92, 123, 185, 0.102)] border  mb-3 flex items-center">
                            <div className="flex flex-col min-w-0 w-full">
                                <p className="text-xl text-[#000] font-bold px-5 pt-4">
                                    {storeDetail.name}
                                </p>
                                <span className="border-b my-5 w-full border-[#ededed]"></span>
                                <p className="flex px-5 pb-4">
                                    <span className="truncate w-full">
                                        <p className="text-base w-full flex">
                                            <span className="mr-4">
                                                <img
                                                    src="/assets/image/mobile/non-active/myInfo.svg"
                                                    alt="점주 이름"
                                                ></img>
                                            </span>
                                            <span className="">
                                                {storeDetail.ownerName}
                                            </span>
                                        </p>
                                        <p className="text-base w-full flex mt-2">
                                            <span className="mr-4">
                                                <img
                                                    src="/assets/image/mobile/non-active/visit.svg"
                                                    alt="주소"
                                                ></img>
                                            </span>
                                            <span className="">
                                                {storeDetail.address}
                                            </span>
                                        </p>
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-400">
                        {" "}
                        가맹점 정보를 불러오는 중...
                    </p>
                )}
            </div>

            {/* 하단 네비게이션 */}
            {customerId ? <MobileFooter /> : <MobileFooter2 />}
        </div>
    );
}
export default MobileStoreDetail;

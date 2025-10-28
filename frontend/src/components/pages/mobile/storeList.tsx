import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

// [파일 첨부 경로]
import { cdn } from "src/constans"; // 파일첨부 경로(네이버클라우드)
import { storeFolder } from "src/constans"; // 첨부 디렉토리 경로 stroe

// [아이콘 및 공통 컴포넌트]
import { MdArrowBackIosNew } from "react-icons/md"; // 이전 페이지이동 좌측 화살표 아이콘
import { MobileMain } from "src/components/organisms/mobileMain"; // 모바일 상단 타이틀
import { MobileFooter } from "src/components/organisms/mobileFooter"; // 하단 모바일 footer 공통 컴포넌트
import { MobileFooter2 } from "src/components/organisms/mobileFooter2"; // 하단 모바일 footer 공통 컴포넌트

// [공통 데이터 인터페이스]
import { StoreDetailType } from "src/types"; // 가맹점(매장) 인터페이스

export function MobileStoreList() {
    const navigate = useNavigate();
    const customerId = localStorage.getItem("customerId");
    const [stores, setStore] = useState<StoreDetailType[]>([]); // 가맹점(매장) 데이터 세팅

    // 지도 관련
    const [naverMap, setNaverMap] = useState(String);
    const mapRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [storeList, mapKey] = await Promise.all([
                    axios.get("/api/v1/stores"),
                    axios.get("/api/v1/naver/maps"), // API KEY 추출
                ]);
                setStore(storeList.data.content); // 가맹점(매장) 추출
                setNaverMap(mapKey.data); // API KEY 추출
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [customerId]);
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
        if (!isLoaded || !mapRef.current) return;
        const lat = 35.8755227;
        const lng = 128.6285939;

        const mapOptions = {
            center: new window.naver.maps.LatLng(lat, lng),
            zoom: 16,
        };

        // 지도만 초기화
        const maps = new window.naver.maps.Map(mapRef.current, mapOptions);
        // 좌표별로 그룹핑
        const coordMap: Record<string, typeof stores> = {};
        stores?.forEach((store) => {
            const x = store.latitude ?? lat;
            const y = store.longitude ?? lng;
            const key = `${x},${y}`;
            if (!coordMap[key]) coordMap[key] = [];
            coordMap[key].push(store);
        });

        Object.entries(coordMap).forEach(([coord, storeList]) => {
            const [x, y] = coord.split(",").map(Number);
            const marker = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(x, y),
                map: maps,
                icon: {
                    url: "/assets/image/mobile/active/visit.svg",
                    anchor: new window.naver.maps.Point(10, 10),
                },
            });

            const content = storeList
                .map(
                    (s) =>
                        `<div style="color: #FFF; font-size: 11px; padding:6px; text-align:center; font-family: Pretendard; ">${s.name}</div>`
                )
                .join("");

            const infowindow = new window.naver.maps.InfoWindow({
                content,
                maxWidth: 140,
                borderWidth: 0,
                backgroundColor: "#E61F2C",
                anchorSkew: true,
                pixelOffset: new window.naver.maps.Point(0, 0),
            });

            window.naver.maps.Event.addListener(marker, "click", () => {
                if (infowindow.getMap()) {
                    infowindow.close();
                } else {
                    infowindow.open(maps, marker);
                }
            });
        });
    }, [isLoaded, stores]);

    return (
        <div className="min-h-screen bg-white font-Pretendard">
            <div className="p-4 mb-20">
                {/* 모바일 타이틀 */}
                {<MobileMain param={Number(customerId)} />}
                <div className="mt-8 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                        <button
                            className="w-full flex items-center justify-between"
                            onClick={handleBack}
                        >
                            <h2 className="text-2xl font-semibold flex items-center">
                                <span className="mr-2">
                                    <MdArrowBackIosNew />
                                </span>
                                <span>가맹점 목록</span>
                            </h2>
                        </button>
                    </div>
                </div>

                <div className="mb-5 flex items-center">
                    <div
                        id="map"
                        ref={mapRef}
                        className="w-[330px] h-[330px] border-2 border-[#580098] rounded-3xl"
                    />
                </div>

                {/* NFT 목록 */}
                <section>
                    {stores.length > 0 ? (
                        stores.map((store, idx) => {
                            return (
                                <Link
                                    to={`/mobile/storeDetail/${store.id}`}
                                    key={idx}
                                >
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 flex items-center">
                                        <div className="flex items-center">
                                            <img
                                                src={`${cdn}/${storeFolder}/${store.thumbnail}${store.extension}`}
                                                alt={`${store.name}`}
                                                className="w-16 h-16 rounded-md object-cover"
                                            />
                                            <div className="flex flex-col ml-3">
                                                <p className="text-base font-bold mb-1">
                                                    {store.name}
                                                </p>
                                                <p className="text-sm text-[#999CA2] mb-1">
                                                    점주 이름 :{" "}
                                                    {store.ownerName}
                                                </p>
                                                <p className="text-xs text-[#999CA2] mb-1">
                                                    주소 : {store.address}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center  text-[#999ca2]">
                            <img
                                src="/assets/image/mobile/noVisitIcon.svg"
                                alt="스탬프가 없습니다 아이콘"
                            />
                            <p className="text-lg font-semibold mt-2">
                                가맹점이 없습니다.
                            </p>
                            <p className="text-sm font-light mt-1">
                                가맹점이 등록되면 이곳에 표시됩니다.
                            </p>
                        </div>
                    )}
                </section>
            </div>
            {/* 하단 네비게이션 */}
            {customerId ? <MobileFooter /> : <MobileFooter2 />}
        </div>
    );
}
export default MobileStoreList;

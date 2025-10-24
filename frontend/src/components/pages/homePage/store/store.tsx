import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// [파일 첨부 경로]
import { cdn } from "src/constans"; // 파일첨부 경로(네이버클라우드)
import { storeFolder } from "src/constans"; // 첨부 디렉토리 경로 stroe

// [아이콘 및 공통 컴포넌트]
import { MainContainer } from "src/components/molecules/container";

// [공통 데이터 인터페이스]
import { StoreDetailType } from "src/types"; // 가맹점(매장) 인터페이스

function HomePageStoreList() {
    const navigate = useNavigate();
    const [stores, setStores] = useState<StoreDetailType[]>([]); // 가맹점 목록 데이터 세팅
    const [naverMap, setNaverMap] = useState(String);
    // const navigate = useNavigate();
    // 지도 관련
    const mapRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // 가맹점, 공지사항, 최근 NFT, 최근 방문기록 데이터 추출
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [storeList, mapKey] = await Promise.all([
                    axios.get("/api/v1/stores?sort=id,asc"),
                    axios.get("/api/v1/naver/maps"), // API KEY 추출
                ]);
                setStores(storeList.data.content); // 가맹점 목록 데이터 추출
                setNaverMap(mapKey.data);
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, []);

    // 이전 버튼
    const backButton = () => {
        navigate(-1);
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
        const lat = 35.874995583678;
        const lng = 128.629063165313;

        const mapOptions = {
            center: new window.naver.maps.LatLng(lat, lng),
            zoom: 17,
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
                        `<div style="color: #FFF; font-size: 14px; padding:5px 10px; text-align:center;">${s.name}</div>`
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

    const menuList = [
        { menuName: "공지사항", menuLink: "/notice" },
        { menuName: "가맹점", menuLink: "/store/store" },
        { menuName: "마이페이지", menuLink: "/myPage/myInfo" },
    ];
    const location = useLocation();
    const nowLink = location.pathname;

    return (
        <MainContainer className="bg-[#FFF] py-[100px] lg:py-[150px] sm:py-[100px] xs:py-[60px]">
            <div className="w-full">
                <div className="w-full bg-[#FFF] p-6">
                    <div className="w-[1700px] m-auto flex">
                        <div className="h-[300px] w-[175px] p-5 py-10 bg-[#580098] text-[#fff] rounded-3xl text-center">
                            {menuList?.map((menu) => {
                                return (
                                    <Link to={`${menu.menuLink}`}>
                                        <p
                                            className={`my-1 ${menu.menuLink === nowLink ? "opacity-100 font-bold" : "opacity-30"}`}
                                        >
                                            {menu.menuName}
                                        </p>
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="flex flex-col w-[1450px] bg-[#fff] shadow-2xl px-20 py-10 ml-20">
                            <div className="w-full mb-10">
                                <button
                                    type="button"
                                    className="border border-[#580098] rounded-md text-[#580098] h-[43px] px-8"
                                    onClick={backButton}
                                >
                                    이전
                                </button>
                            </div>
                            <div className="flex">
                                <div className="w-[750px] h-[650px] mr-20">
                                    {/* 지도 영역 */}
                                    <div
                                        id="map"
                                        ref={mapRef}
                                        className="w-[750px] h-[650px] border-2 border-[#580098] rounded-3xl"
                                    />
                                </div>
                                <div className="border border-[#ededed] p-5 w-[450px] h-[650px] rounded-lg overflow-y-auto">
                                    {stores?.map((store) => {
                                        return (
                                            <Link
                                                to={`/store/store/${store.id}`}
                                            >
                                                <div className="mb-4 border py-3 px-5 border-[#ccc] rounded-md flex hover:border-[#580098]">
                                                    <div>
                                                        <div className="font-bold text-base">
                                                            {store.name}
                                                        </div>
                                                        <img
                                                            src={`${cdn}/${storeFolder}/${store.thumbnail}${store.extension}`}
                                                            alt={store.name}
                                                            className="w-[50px] h-[50px] object-cover rounded-md"
                                                        ></img>
                                                    </div>

                                                    <div className="mx-5 text-sm">
                                                        <p className="mb-3">
                                                            {store.address}
                                                        </p>
                                                        <p className="">
                                                            {store.ownerName}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}

export default HomePageStoreList;

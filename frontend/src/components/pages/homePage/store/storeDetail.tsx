import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// [파일 첨부 경로]
import { cdn } from "src/constans"; // 파일첨부 경로(네이버클라우드)
import { storeFolder } from "src/constans"; // 첨부 디렉토리 경로 stroe

// [아이콘 및 공통 컴포넌트]
import { MainContainer } from "src/components/molecules/container";

// [공통 데이터 인터페이스]
import { StoreDetailType } from "src/types"; // 가맹점(매장) 인터페이스

function HomePageStoreDetail() {
    const [storeDetail, setStoreDetail] = useState<StoreDetailType>(); // 가맹점(매장) 상세보기 데이터 세팅
    const [stores, setStores] = useState<StoreDetailType[]>([]); // 가맹점 목록 데이터 세팅
    const navigate = useNavigate();
    const { id } = useParams();

    const storeId = id;
    console.log(storeId);

    // 지도 관련
    const mapRef = useRef<HTMLDivElement>(null);
    const clientId = "xywfm22tkk";
    const [isLoaded, setIsLoaded] = useState(false);

    // 가맹점, 공지사항, 최근 NFT, 최근 방문기록 데이터 추출
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [storeList, storeDetail] = await Promise.all([
                    axios.get("/api/v1/stores?sort=id,asc"),
                    axios.get(`/api/v1/stores/${storeId}`),
                ]);
                setStores(storeList.data.content); // 가맹점 목록 데이터 추출
                setStoreDetail(storeDetail.data); // 가맹점 상세 데이터 추출
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [storeId]);

    if (!storeId) {
        navigate(-1);
    }

    // 지도 스크립트 로드
    useEffect(() => {
        if (window.naver?.maps) {
            setIsLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=geocoder`;
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
        const lat = 35.8775458;
        const lng = 128.6309931;

        const mapOptions = {
            center: new window.naver.maps.LatLng(lat, lng),
            zoom: 17,
        };

        // 지도만 초기화
        new window.naver.maps.Map(mapRef.current, mapOptions);
    }, [isLoaded]);

    return (
        <MainContainer className="bg-[#FFF] py-[100px] lg:py-[150px] sm:py-[100px] xs:py-[60px]">
            <div className="w-full">
                <div className="w-full bg-[#FFF] p-6">
                    <div className="w-[1700px] m-auto flex">
                        <div className="h-[300px] w-[175px] p-5 py-10 bg-[#580098] text-[#fff] rounded-3xl text-center">
                            {stores?.map((store) => {
                                return (
                                    <Link to={`/store/store/${store.id}`}>
                                        <p
                                            className={`my-1 ${store.name === storeDetail?.name ? "opacity-100 font-bold" : "opacity-30"}`}
                                        >
                                            {store.name}
                                        </p>
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="flex w-[1450px] bg-[#fff] shadow-2xl p-20 ml-20">
                            <div className="w-[750px] h-[650px] mr-20">
                                <div
                                    id="map"
                                    ref={mapRef}
                                    className="w-[750px] h-[650px] border-2 border-[#580098] rounded-3xl"
                                />
                                {/* <img
                                    src="/assets/image/homePage/storeDetail.png"
                                    alt="가맹점 상세보기"
                                    className="border-2 border-[#580098] rounded-3xl w-[750px] h-[650px]"
                                ></img> */}
                            </div>
                            <div className="border border-[#ededed] p-10 w-[450px] h-[650px] rounded-lg">
                                <div className="font-bold text-2xl">
                                    {storeDetail?.name}
                                </div>
                                <div className="my-5">
                                    <img
                                        src={`${cdn}/${storeFolder}/${storeDetail?.thumbnail}${storeDetail?.extension}`}
                                        alt={storeDetail?.name}
                                    ></img>
                                </div>
                                <div>
                                    <p className="mb-3 flex">
                                        <span className="text-[#706D72] w-[80px]">
                                            주소
                                        </span>
                                        <span>{storeDetail?.address}</span>
                                    </p>
                                    <p className="flex">
                                        <span className="text-[#706D72] w-[80px]">
                                            점주 이름
                                        </span>
                                        <span>{storeDetail?.ownerName}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}

export default HomePageStoreDetail;

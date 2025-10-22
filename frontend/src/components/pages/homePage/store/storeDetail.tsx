import axios from "axios";
import { useEffect, useState } from "react";
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

    // 가맹점, 공지사항, 최근 NFT, 최근 방문기록 데이터 추출
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [storeList, storeDetail] = await Promise.all([
                    axios.get("/api/v1/stores"),
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
                                <img
                                    src="/assets/image/homePage/storeDetail.png"
                                    alt="가맹점 상세보기"
                                    className="border-2 border-[#580098] rounded-3xl w-[750px] h-[650px]"
                                ></img>
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

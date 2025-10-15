import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import { MdArrowForwardIos } from "react-icons/md";
import { MobileMain } from "src/components/organisms/mobileMain"; // 모바일 상단 타이틀
import { MobileFooter } from "src/components/organisms/mobileFooter"; // 하단 모바일 footer 공통 컴포넌트
import { StoreType } from "src/types";
import { cdn } from "src/constans";
import { storeFolder } from "src/constans";
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

export function MobileMainPage() {
    const navigate = useNavigate();
    const { customerId } = useParams();
    const [nftLogs, setNfts] = useState<Nft[]>([]);
    const [visitLogs, setVisitLogs] = useState<VisitLog[]>([]);
    const [customer, setCustomer] = useState(); // 고객
    const [stamp, setStamp] = useState(); // 고객 방문 스탬프
    const [storefilteredData, setStoreFilteredData] = useState<StoreType[]>([]); // 필터링된 데이터

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

    const accessToken = localStorage.getItem("accessToken"); // 다대구 연동 로그인시 생성된 토큰 가져오기

    useEffect(() => {
        if (!customerId) {
            alert("고객정보가 존재하지 않습니다.");
            navigate(-1);
        }

        if (!accessToken) {
            alert("로그인이 정상적으로 완료되지 않았습니다.");
            navigate("/user/userVisitStore");
        }

        const fetchData = async () => {
            try {
                const [nftRes, visits, customerDetail, storeStamp] =
                    await Promise.all([
                        axios.get(
                            `/api/v1/customers/${customerId}/nfts?sort=desc&limit=2`
                        ),
                        axios.get(
                            `/api/v1/customers/${customerId}/visits?sort=desc&limit=2`
                        ),
                        axios.get(`/api/v1/customers/${customerId}`),
                        axios.get(`/api/v1/storeStamps/${customerId}`),
                    ]);
                setNfts(nftRes.data); // 해당 고객의 NFT데이터 추출(최근 2개)
                setVisitLogs(visits.data); // 해당 고객의 방문기록 데이터 추출(최근 2개)

                setCustomer(customerDetail.data); // 고객 정보 추출
                setStamp(storeStamp.data); // 고객 매장 방문 스탬프
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [customerId, navigate, accessToken]);

    console.log("고객 등급 " + customer);
    console.log("고객 매장 방문 스탬프" + stamp);

    // 나의 정보 페이지로 이동
    const myInfoButton = () => {
        navigate(`/mobile/myPage/${customerId}`);
    };
    return (
        <div className="min-h-screen bg-[#fbfbfc] p-4">
            {/* 모바일 타이틀 */}
            {<MobileMain param={Number(customerId)} />}

            <section className="bg-[#fff] border-collapse rounded-2xl shadow-sm border-gray-100">
                <button
                    className="w-full px-4 py-5 flex items-center justify-between"
                    onClick={myInfoButton}
                >
                    <span className="text-left font-Pretendard font-bold">
                        나의 정보
                    </span>
                    <span className="float-right">
                        <MdArrowForwardIos />
                    </span>
                </button>
            </section>

            {/* 상단 DID 정보 */}
            {/* <header className="bg-blue-900 text-white rounded-lg p-4 mb-5 font-semibold text-base truncate">
                <p>[나의 DID 정보]</p>
                <p>DID : {did}</p>
            </header> */}

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

            <div className="mt-8 mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-semibold font-Pretendard">
                        최근 NFT 목록
                    </h2>
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
                                    <div className="flex flex-col ml-3 font-Pretendard">
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
                    <h2 className="text-2xl font-semibold font-Pretendard">
                        최근 방문기록
                    </h2>
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
                                <div className="flex flex-col ml-3 font-Pretendard">
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
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center font-Pretendard text-[#999ca2]">
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
            {customerId && <MobileFooter param={Number(customerId)} />}
        </div>
    );
}
export default MobileMainPage;

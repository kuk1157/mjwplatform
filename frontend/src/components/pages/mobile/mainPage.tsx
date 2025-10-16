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

// [공통 데이터 인터페이스]
import { Customer } from "src/types"; // 고객 인터페이스(고객등급, 발급가능여부 추출)
import { StoreStamp } from "src/types"; // 방문스탬프 인터페이스
import { StoreType } from "src/types"; // 가맹점(매장) 인터페이스
import { Nft } from "src/types"; // NFT 인터페이스
import { VisitLog } from "src/types"; // 방문기록 인터페이스

export function MobileMainPage() {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("accessToken"); // 다대구 연동 로그인시 생성된 토큰 가져오기
    const customerId = localStorage.getItem("customerId");
    const [customer, setCustomer] = useState<Customer | null>(null); // 고객 데이터 세팅
    const [stamps, setStamp] = useState<StoreStamp[]>([]); // 방문 스탬프 데이터 세팅
    const [stores, setStore] = useState<StoreType[]>([]); // 가맹점(매장) 데이터 세팅
    const [nftLogs, setNfts] = useState<Nft[]>([]); // NFT 데이터 세팅
    const [visitLogs, setVisitLogs] = useState<VisitLog[]>([]); // 방문 기록 데이터 세팅

    // 고객 등급 객체
    const CustomerGrades: Record<string, string> = {
        SILVER: "실버",
        GOLD: "골드",
        PLATINUM: "플래티넘",
        DIAMOND: "다이아",
    };

    // 고객 정보, 방문 스탬프, 가맹점(매장) NFT, 방문기록 데이터 추출
    useEffect(() => {
        if (!customerId) {
            alert("고객정보가 존재하지 않습니다.");
            navigate(-1);
            return;
        }

        if (!accessToken) {
            alert("로그인이 정상적으로 완료되지 않았습니다.");
            navigate("/user/userVisitStore");
            return;
        }

        const fetchData = async () => {
            try {
                const [customerDetail, storeStamp, storeList, nftRes, visits] =
                    await Promise.all([
                        axios.get(`/api/v1/customers/${customerId}`),
                        axios.get(`/api/v1/storeStamps/${customerId}`),
                        axios.get("/api/v1/stores"),
                        axios.get(
                            `/api/v1/customers/${customerId}/nfts?sort=desc&limit=2`
                        ),
                        axios.get(
                            `/api/v1/customers/${customerId}/visits?sort=desc&limit=2`
                        ),
                    ]);
                setCustomer(customerDetail.data); // 고객 정보 추출
                setStamp(storeStamp.data); // 방문 스탬프 추출
                setStore(storeList.data.content); // 가맹점(매장) 추출
                setNfts(nftRes.data); // 고객의 NFT데이터 추출(최근 2개)
                setVisitLogs(visits.data); // 고객의 방문기록 데이터 추출(최근 2개)
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [customerId, navigate, accessToken]);

    // 나의 정보 페이지로 이동
    const myInfoButton = () => {
        navigate(`/mobile/myPage`);
    };
    return (
        <div className="min-h-screen bg-[#fbfbfc] p-4 font-Pretendard">
            {/* 모바일 타이틀 */}
            {<MobileMain param={Number(customerId)} />}

            {/* 나의 정보 영역 */}
            <section className="bg-[#fff] border-collapse rounded-2xl shadow-sm border-gray-100">
                <button
                    className="w-full px-4 py-5 flex items-center justify-between"
                    onClick={myInfoButton}
                >
                    <span className="text-left  font-bold">나의 정보</span>
                    <span className="float-right">
                        <MdArrowForwardIos />
                    </span>
                </button>
            </section>

            {/* 나의 등급 타이틀 영역 */}
            <div className="mt-8 mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-semibold ">나의 등급</h2>
                </div>
            </div>

            {/* 나의 등급 컨텐츠 영역 */}
            <div>
                <div className="grid grid-cols-3 gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-3 items-center">
                    <span>
                        {CustomerGrades[customer?.customerGrade ?? ""] ?? "-"}
                    </span>
                    <span>
                        <img
                            src={`/public/assets/image/customerGrade/${customer?.customerGrade}Grade.png`}
                            alt={`${CustomerGrades[customer?.customerGrade ?? ""] ?? "-"} 등급`}
                        ></img>
                    </span>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-3 flex items-center">
                    <span>
                        쿠폰 발급 가능 여부{" "}
                        {customer?.couponAvailable === "Y" ? "✅" : "❌"}
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
                    <h2 className="text-2xl font-semibold ">내 스탬프 카드</h2>
                </div>
            </div>

            {/* 내 스탬프 컨텐츠 영역 */}
            <div>
                <div className="grid grid-cols-3 gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-3 items-center ">
                    {stores?.map((store, idx) => {
                        // 최종 파일 첨부 경로 가공
                        const src = `${cdn}/${storeFolder}/${store.thumbnail}${store.extension}`;

                        // 방문 여부 체크
                        const isStamped = stamps?.some(
                            (s) => s.storeId === store.id
                        );

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
                                {isStamped && (
                                    <img
                                        src="/public/assets/image/mobile/checkImage.jpg"
                                        alt="stamp"
                                        className="absolute inset-0 m-auto w-16 h-16 animate-[stampIn_0.4s_ease-out]"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* NFT 타이틀 영역 */}
            <div className="mt-8 mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-semibold ">최근 NFT 목록</h2>
                </div>
            </div>

            {/* NFT 컨텐츠 영역 */}
            <section>
                {nftLogs.length > 0 ? (
                    nftLogs.map((nft, idx) => (
                        <Link to={`/mobile/nftDetail/${nft.id}`}>
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

            {/* 방문 기록 타이틀 영역 */}
            <div className="mt-8 mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-semibold ">최근 방문기록</h2>
                </div>
            </div>

            {/* 방문 기록 컨텐츠 영역 */}
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
            {customerId && <MobileFooter />}
        </div>
    );
}
export default MobileMainPage;

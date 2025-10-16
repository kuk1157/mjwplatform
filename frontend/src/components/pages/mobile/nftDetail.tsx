import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { MobileMain } from "src/components/organisms/mobileMain"; // 모바일 상단 타이틀
import { MobileFooter } from "src/components/organisms/mobileFooter"; // 하단 모바일 footer 공통 컴포넌트

import { MdArrowBackIosNew } from "react-icons/md"; // 이전 페이지이동 좌측 화살표 아이콘
import { AxiosError } from "axios";

interface NftList {
    id: number;
    tokenId: string;
    storeId: number;
    customerId: number;
    nftIdx: number;
    storeTableId: number;
    storeName: string;
    nftImage: string;
    createdAt: string;
}

export function MobileMyWallet() {
    const { id } = useParams();
    const customerId = localStorage.getItem("customerId");
    const [nftDetails, setNftDetails] = useState<NftList | null>(null); // NFT 정보 세팅
    const navigate = useNavigate();

    const didFetch = useRef(false); // 2번 호출되는 useEffect 방지용
    useEffect(() => {
        if (!id || didFetch.current) return;

        didFetch.current = true;

        const fetchData = async () => {
            try {
                const nftDetailRes = await axios.get(`/api/v1/nfts/${id}`);
                setNftDetails(nftDetailRes.data);
            } catch (error) {
                // console.error("데이터 조회 실패:", error);
                const axiosError = error as AxiosError<{ message: string }>;
                const message = axiosError.response?.data?.message; // message를 변수로
                if (message) {
                    alert(message);
                    navigate(`/mobile/mainPage/${customerId}`);
                } else {
                    alert("알 수 없는 오류가 발생했습니다.");
                }
            }
        };

        fetchData();
    }, [id, navigate, customerId]);

    const handleBack = () => {
        navigate(-1); // 뒤로 가기
    };

    return (
        <div className="min-h-screen bg-white p-4">
            {/* 모바일 타이틀 */}
            {<MobileMain param={Number(customerId)} />}

            <div className="mt-8 mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <button
                        className="w-full flex items-center justify-between"
                        onClick={handleBack}
                    >
                        <h2 className="text-2xl font-semibold font-Pretendard flex items-center">
                            <span className="mr-2">
                                <MdArrowBackIosNew />
                            </span>
                            <span>NFT 상세보기</span>
                        </h2>
                    </button>
                </div>
            </div>
            {nftDetails ? (
                <div>
                    <div className=" px-3 py-3 mb-3 flex items-center">
                        <div className="w-full flex justify-center items-center">
                            <img
                                src={nftDetails.nftImage}
                                alt={nftDetails.storeName}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm shadow-[rgb(92, 123, 185, 0.102)] border border-gray-100 px-3 py-4 mb-3 flex items-center">
                        <div className="flex flex-col ml-3 font-Pretendard min-w-0">
                            <p className="text-base text-[#000]">
                                매장 이름 : {nftDetails.storeName}
                            </p>
                            <p className="text-xs text-[#999ca2] flex">
                                <span className="font-normal truncate w-full">
                                    <p>
                                        {nftDetails.createdAt.replace("T", " ")}
                                        &nbsp;초에
                                    </p>
                                    <p>
                                        {nftDetails.storeName} 매장의 테이블{" "}
                                        {nftDetails.storeTableId}번에서 발급받은
                                        NFT입니다.
                                    </p>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-gray-400">NFT 정보를 불러오는 중...</p>
            )}

            {/* 하단 네비게이션 */}
            {customerId && <MobileFooter />}
        </div>
    );
}
export default MobileMyWallet;

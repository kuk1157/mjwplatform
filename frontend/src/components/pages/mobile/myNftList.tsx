import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { MdArrowBackIosNew } from "react-icons/md"; // 이전 페이지이동 좌측 화살표 아이콘

import { MobileMain } from "src/components/organisms/mobileMain"; // 모바일 상단 타이틀
import { MobileFooter } from "src/components/organisms/mobileFooter"; // 하단 모바일 footer 공통 컴포넌트

interface Nft {
    id: number;
    tokenId: number;
    storeId: number;
    customerId: number;
    storeName?: string;
    createdAt: string;
}

export function MobileMyNftList() {
    const { customerId } = useParams();
    const [nftLogs, setNfts] = useState<Nft[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!customerId) return;

        const fetchData = async () => {
            try {
                const [nftRes] = await Promise.all([
                    axios.get(`/api/v1/customers/${customerId}/nfts`),
                ]);

                setNfts(nftRes.data);
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [customerId]);

    const handleBack = () => {
        navigate(-1); // 뒤로 가기
    };

    return (
        <div className="min-h-screen bg-white p-4">
            {/* 모바일 타이틀 */}
            {<MobileMain />}
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
                            <span>나의 NFT 갤러리</span>
                        </h2>
                    </button>
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
                            NFT 발급 기록이 없습니다.
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                            새로운 NFT가 발급되면 이곳에 표시됩니다.
                        </p>
                    </div>
                )}
            </section>
            {/* 하단 네비게이션 */}
            {customerId && <MobileFooter param={Number(customerId)} />}
        </div>
    );
}
export default MobileMyNftList;

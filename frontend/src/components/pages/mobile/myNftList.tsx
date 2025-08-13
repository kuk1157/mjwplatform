import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoHomeOutline } from "react-icons/io5"; // 홈 아이콘
import { GrGallery } from "react-icons/gr"; // NFT 갤러리 아이콘
import { BsBell } from "react-icons/bs"; // 방문 기록 아이콘
import { FaRegUserCircle } from "react-icons/fa"; // 나의 정보 아이콘
import { RiNftLine } from "react-icons/ri"; // 최근 nft 아이콘

import { ImNotification } from "react-icons/im"; // 방문기록이 없습니다 아이콘

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
            <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                        소상공인 상생 플랫폼
                    </h2>
                </div>
            </div>

            <div className="mt-6 mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <GrGallery className="w-[22px] h-[22px] text-blue-600" />
                    <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                        나의 NFT 갤러리
                    </h2>
                </div>
                <div className="h-[2px] bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.15)]"></div>
            </div>

            {/* NFT 목록 */}
            <section>
                {nftLogs.length > 0 ? (
                    nftLogs.map((nft, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 flex items-center"
                        >
                            {/* 아이콘 or 색 포인트 */}
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4">
                                <RiNftLine />
                            </div>

                            {/* 기존 데이터는 그대로 */}
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-gray-900">
                                    NFT ID : {nft.tokenId}
                                </p>
                                <p className="text-xs text-gray-600">
                                    NFT 가맹점 이름 : {nft.storeName}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 flex items-center justify-center text-black mb-3">
                            <ImNotification className="w-8 h-8" />
                        </div>
                        <p className="text-black text-sm font-semibold">
                            NFT 발급 기록이 없습니다.
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                            새로운 NFT가 발급되면 이곳에 표시됩니다.
                        </p>
                    </div>
                )}
            </section>

            <div className="text-center my-6">
                <button
                    className="border-2 border-blue-600 text-blue-600 px-12 py-3 rounded-md font-semibold"
                    onClick={handleBack}
                >
                    이전
                </button>
            </div>

            {/* 하단 네비게이션 */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-md">
                <ul className="flex justify-around items-center h-16">
                    <li className="flex flex-col items-center justify-center text-sm text-black cursor-pointer hover:text-blue-600 transition-colors select-none">
                        <span className="text-xl">
                            <IoHomeOutline />
                        </span>
                        <span className="mt-1">홈</span>
                    </li>

                    <li className="flex flex-col items-center justify-center text-sm text-black cursor-pointer hover:text-blue-600 transition-colors select-none">
                        <span className="text-xl">
                            <GrGallery />
                        </span>
                        <span className="mt-1">NFT 갤러리</span>
                    </li>

                    <li className="flex flex-col items-center justify-center text-sm text-black cursor-pointer hover:text-blue-600 transition-colors select-none">
                        <span className="text-xl">
                            <BsBell />
                        </span>
                        <span className="mt-1">방문기록</span>
                    </li>

                    <li className="flex flex-col items-center justify-center text-sm text-black cursor-pointer hover:text-blue-600 transition-colors select-none">
                        <span className="text-xl">
                            <FaRegUserCircle />
                        </span>
                        <span className="mt-1">나의 정보</span>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
export default MobileMyNftList;

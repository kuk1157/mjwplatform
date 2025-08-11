import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaRegWindowRestore } from "react-icons/fa";

interface Nft {
    id: number;
    tokenId: number;
    storeId: number;
    customerId: number;
    storeName?: string;
    createdAt: string;
}

export function MobileMyPage() {
    const { customerId } = useParams();
    const [did, setDid] = useState();
    // const [memberId, setMemberId] = useState(); // 멤버에서 did 땡겨오는 느낌 진행
    const [nftLogs, setNfts] = useState<Nft[]>([]);

    useEffect(() => {
        if (!customerId) return;

        const fetchData = async () => {
            try {
                const [customerRes, nftRes] = await Promise.all([
                    axios.get(`/api/v1/customers/${customerId}`),
                    axios.get(`/api/v1/customers/${customerId}/nfts`),
                ]);

                setDid(customerRes.data.did);
                // setMemberId(customerRes.data.memberId);
                setNfts(nftRes.data);
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [customerId]);

    return (
        <div className="min-h-screen bg-white p-4">
            <h1 className="font-semibold">🏪 소상공인 상생 플랫폼</h1>
            {/* 상단 DID 정보 */}
            <header className="bg-blue-900 text-white rounded-lg p-4 mb-5 font-semibold text-base truncate">
                <p>[나의 DID 정보]</p>
                <p>DID : {did}</p>
            </header>

            <h1 className="font-semibold">🏪 최근 NFT 목록</h1>
            {/* NFT 목록 */}
            <section>
                {nftLogs.map((nft, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-lg shadow-md flex items-center p-3 mb-3"
                    >
                        {/* <img
                            src={nft.imageUrl}
                            alt={nft.name}
                            className="w-16 h-16 rounded-md object-cover mr-4"
                        /> */}
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-900">
                                NFT ID : {nft.tokenId}
                            </p>
                            <p className="text-xs text-gray-600">
                                NFT 가맹점 이름 : {nft.storeName}
                            </p>
                        </div>
                    </div>
                ))}
            </section>

            <h1 className="font-semibold">🏪 최근 방문기록</h1>

            {/* 하단 네비게이션 */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-md">
                <ul className="flex justify-around items-center h-16">
                    <li className="flex flex-col items-center justify-center text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors select-none">
                        <span className="text-xl">
                            <FaRegWindowRestore />
                        </span>
                        <span className="mt-1">홈</span>
                    </li>

                    <li className="flex flex-col items-center justify-center text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors select-none">
                        <span className="text-xl">🖼️</span>
                        <span className="mt-1">NFT 갤러리</span>
                    </li>

                    <li className="flex flex-col items-center justify-center text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors select-none">
                        <span className="text-xl">📅</span>
                        <span className="mt-1">방문기록</span>
                    </li>

                    <li className="flex flex-col items-center justify-center text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors select-none">
                        <span className="text-xl">👤</span>
                        <span className="mt-1">나의 정보</span>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
export default MobileMyPage;

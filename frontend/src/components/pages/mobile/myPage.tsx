import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

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
        <div className="min-h-screen bg-gray-100 p-4">
            {/* 상단 DID 정보 */}
            <header className="bg-blue-900 text-white rounded-lg p-4 mb-5 font-semibold text-base truncate">
                <p>[나의 DID 정보]</p>
                <p>DID: {did}</p>
            </header>

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
                                NFT Id : {nft.tokenId}
                            </p>
                            <p className="text-xs text-gray-600">
                                NFT 가맹점 이름 : {nft.storeName}
                            </p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
export default MobileMyPage;

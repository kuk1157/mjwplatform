export function MobileMyPage() {
    const did = "did:example:123456789abcdefghi";

    // NFT 더미 데이터
    const dummyNFTs = Array.from({ length: 5 }, (_, i) => ({
        name: `NFT #${i + 1}`,
        storeName: `대구통닭 ${i + 1}`,
        imageUrl: "/assets/image/moblieLogo.png",
    }));

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            {/* 상단 DID 정보 */}
            <header className="bg-blue-900 text-white rounded-lg p-4 mb-5 font-semibold text-base truncate">
                <p>[나의 DID 정보]</p>
                <p>DID: {did}</p>
            </header>

            {/* NFT 목록 */}
            <section>
                {dummyNFTs.map((nft, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-lg shadow-md flex items-center p-3 mb-3"
                    >
                        <img
                            src={nft.imageUrl}
                            alt={nft.name}
                            className="w-16 h-16 rounded-md object-cover mr-4"
                        />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">
                                {nft.name}
                            </p>
                            <p className="text-xs text-gray-600">
                                {nft.storeName}
                            </p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
export default MobileMyPage;

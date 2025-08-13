import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BiStore } from "react-icons/bi"; // 소상공인 상생플랫폼 제목 아이콘
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

interface VisitLog {
    id: number;
    storeId: number;
    customerId: number;
    storeName?: string;
    createdAt: string;
}

export function MobileMyPage() {
    const navigate = useNavigate();
    const { customerId } = useParams();
    const [did, setDid] = useState();
    // const [memberId, setMemberId] = useState(); // 멤버에서 did 땡겨오는 느낌 진행
    const [nftLogs, setNfts] = useState<Nft[]>([]);
    const [visitLogs, setVisitLogs] = useState<VisitLog[]>([]);

    useEffect(() => {
        if (!customerId) return;

        const fetchData = async () => {
            try {
                const [customerRes, nftRes, visits] = await Promise.all([
                    axios.get(`/api/v1/customers/${customerId}`),
                    axios.get(
                        `/api/v1/customers/${customerId}/nfts?sort=desc&limit=2`
                    ),
                    axios.get(
                        `/api/v1/customers/${customerId}/visits?sort=desc&limit=2`
                    ),
                ]);

                setDid(customerRes.data.did);
                // setMemberId(customerRes.data.memberId);
                setNfts(nftRes.data);
                setVisitLogs(visits.data);
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [customerId]);

    console.log(did);

    const myInfoButton = () => {
        navigate(`/mobile/myInfo/${customerId}`); // 뒤로 가기
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

            <button
                className="
    bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900
    text-white
    rounded-xl
    py-6
    mb-6
    w-full
    select-none
    text-center
    font-semibold
    text-lg
  "
                onClick={myInfoButton}
            >
                나의 정보
            </button>

            {/* 상단 DID 정보 */}
            {/* <header className="bg-blue-900 text-white rounded-lg p-4 mb-5 font-semibold text-base truncate">
                <p>[나의 DID 정보]</p>
                <p>DID : {did}</p>
            </header> */}

            <div className="mt-6 mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <GrGallery className="w-[22px] h-[22px] text-blue-600" />
                    <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                        최근 NFT 목록
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
                            최근 NFT 발급 기록이 없습니다.
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                            새로운 NFT가 발급되면 이곳에 표시됩니다.
                        </p>
                    </div>
                )}
            </section>
            <div className="mt-6 mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <BsBell className="w-[22px] h-[22px] text-blue-600" />
                    <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                        최근 방문기록
                    </h2>
                </div>
                <div className="h-[2px] bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.15)]"></div>
            </div>

            {/* 방문 목록 */}
            <section>
                {visitLogs.length > 0 ? (
                    visitLogs.map((visitLog, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 flex items-center"
                        >
                            {/* 아이콘 or 색 포인트 */}
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4">
                                <BiStore />
                            </div>

                            {/* 기존 데이터는 그대로 */}
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-gray-900">
                                    가맹점 이름 : {visitLog.storeName}
                                </p>
                                <p className="text-xs text-gray-600">
                                    방문 시간 :{" "}
                                    {new Date(
                                        visitLog.createdAt
                                    ).toLocaleString()}
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
                            최근 방문 기록이 없습니다.
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                            새로운 방문이 등록되면 이곳에 표시됩니다.
                        </p>
                    </div>
                )}
            </section>

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
export default MobileMyPage;

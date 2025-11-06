import axios from "axios";
import { useEffect, useState } from "react";

// [아이콘 및 공통 컴포넌트]
import { MainContainer } from "../molecules/container";

// 신규가입자 수 DTO 타입
interface NewCustomerType {
    storeName: string;
    newCustomerCount: number;
}

function CountStores() {
    const [newCustomers, setNewCustomers] = useState<NewCustomerType[]>([]); // 신규가입자 수 데이터
    // 가맹점, 공지사항, 최근 NFT, 최근 방문기록 데이터 추출
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [newCustomerList] = await Promise.all([
                    axios.get("/api/v1/customers/newCustomers"),
                ]);
                setNewCustomers(newCustomerList.data.stores); // 가맹점 데이터 추출
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <MainContainer className="bg-[#FFF] py-[100px] flex justify-center">
            <table className="border-collapse text-center font-Pretendard shadow-sm rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-6">매장 이름</th>
                        <th className="py-2 px-6">신규 가입자 수</th>
                    </tr>
                </thead>
                <tbody>
                    {newCustomers.map((item, idx) => (
                        <tr
                            key={idx}
                            className="border-b hover:bg-gray-50 transition-colors"
                        >
                            <td className="py-2 px-6 whitespace-nowrap">
                                {item.storeName}
                            </td>
                            <td className="py-2 px-6 font-semibold">
                                {item.newCustomerCount} 명
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </MainContainer>
    );
}

export default CountStores;

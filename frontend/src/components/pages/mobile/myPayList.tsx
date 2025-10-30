import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// [파일 첨부 경로]
import { cdn } from "src/constans"; // 파일첨부 경로(네이버클라우드)
import { storeFolder } from "src/constans"; // 첨부 디렉토리 경로 stroe

// [아이콘 및 공통 컴포넌트]
import { MdArrowBackIosNew } from "react-icons/md"; // 이전 페이지이동 좌측 화살표 아이콘
import { MobileMain } from "src/components/organisms/mobileMain"; // 모바일 상단 타이틀
import { MobileFooter } from "src/components/organisms/mobileFooter"; // 하단 모바일 footer 공통 컴포넌트
import { MobileFooter2 } from "src/components/organisms/mobileFooter2"; // 하단 모바일 footer 공통 컴포넌트
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
    LabelList,
} from "recharts";

// [공통 데이터 인터페이스]
import { StoreDetailType, Pay, MyPayCustomer } from "src/types"; // 가맹점(매장) 인터페이스

export function MobilePayList() {
    const navigate = useNavigate();
    const customerId = localStorage.getItem("customerId");
    const [pays, setPays] = useState<(Pay & { store?: StoreDetailType })[]>([]); // 결제 내역 세팅
    const [paystats, setPayStats] = useState<MyPayCustomer>(); // 나의 결제내역 통계

    useEffect(() => {
        if (!customerId) {
            navigate(-1);
            return;
        }
        const fetchData = async () => {
            try {
                const payAnalytics = await axios.get(
                    `/api/v1/pay/analytics/customer/${customerId}`
                );

                setPayStats(payAnalytics.data);

                const { data } = await axios.get(
                    `/api/v1/pay/customer/${customerId}`
                );
                const payList: Pay[] = data.content;
                const storeIds = [
                    ...new Set(payList.map((p: Pay) => p.storeId)),
                ]; // 가맹점 고유번호 추출

                const storeResponses = await Promise.all(
                    storeIds.map((id) => axios.get(`/api/v1/stores/${id}`)) // 가맹점 상세 추출
                );

                const storeMap = storeResponses.reduce(
                    (acc, res) => {
                        const store = res.data;
                        acc[store.id] = store;
                        return acc;
                    },
                    {} as Record<number, StoreDetailType>
                );

                const mergedList = payList.map((pay: Pay) => ({
                    ...pay,
                    store: storeMap[pay.storeId],
                }));

                setPays(mergedList);
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [customerId, navigate]);
    const handleBack = () => {
        navigate(-1); // 뒤로 가기
    };

    const MyPayChart = () => {
        const amount = paystats?.sumAmount ?? 0;
        const discountAmount = paystats?.sumDiscountAmount ?? 0;
        const finamAmount = paystats?.sumFinalAmount ?? 0;

        const dataToRender = [
            { name: "미할인주문금액합계", value: amount, color: "#14b8a6" },
            { name: "할인금액합계", value: discountAmount, color: "#cc3333" },
            { name: "최종주문금액합계", value: finamAmount, color: "#3b82f6" },
        ];

        return (
            <BarChart
                width={500}
                height={350}
                data={dataToRender}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    type="number"
                    domain={[0, 500000]} // 최대값 50만
                    tick={{ fontSize: 12 }}
                />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 14 }} />
                <Tooltip
                    cursor={{ fill: "#ededed" }} // 막대 뒤에 회색 배경
                    formatter={(value: number | string) => {
                        // payload 타입 안전하게 가져오기
                        return [`${Number(value).toLocaleString()}원`];
                    }}
                />
                <Bar dataKey="value">
                    {dataToRender.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <LabelList
                        dataKey="value"
                        position="right"
                        formatter={(value) =>
                            `${(value as number).toLocaleString()}원`
                        }
                    />
                </Bar>
            </BarChart>
        );
    };

    return (
        <div className="min-h-screen bg-white font-Pretendard">
            <div className="p-4 mb-20">
                {/* 모바일 타이틀 */}
                {<MobileMain param={Number(customerId)} />}
                <div className="mt-8 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                        <button
                            className="w-full flex items-center justify-between"
                            onClick={handleBack}
                        >
                            <h2 className="text-2xl font-semibold flex items-center">
                                <span className="mr-2">
                                    <MdArrowBackIosNew />
                                </span>
                                <span>나의 결제 내역</span>
                            </h2>
                        </button>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 flex items-center">
                    {MyPayChart()}
                </div>

                {/* NFT 목록 */}
                <section>
                    {pays.length > 0 ? (
                        pays.map((pay, idx) => {
                            return (
                                <div
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 flex items-center"
                                    key={idx}
                                >
                                    <div className="flex items-center">
                                        <img
                                            src={`${cdn}/${storeFolder}/${pay.store?.thumbnail}${pay.store?.extension}`}
                                            alt={`${pay.store?.name}`}
                                            className="w-16 h-16 rounded-md object-cover"
                                        />
                                        <div className="flex flex-col ml-3">
                                            <p className="text-base font-bold mb-1">
                                                결제한 매장 : {pay.store?.name}
                                            </p>
                                            <p className="text-sm text-[#000] mb-1">
                                                주문 금액 :{" "}
                                                {pay.amount.toLocaleString()}원
                                            </p>
                                            <p className="text-sm text-[#000] mb-1">
                                                할인 금액 :{" "}
                                                {pay.discountAmount.toLocaleString()}
                                                원
                                            </p>
                                            <p className="text-xs text-[#000] mb-1">
                                                최종 할인 주문금액 :{" "}
                                                {pay.finalAmount.toLocaleString()}
                                                원
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center  text-[#999ca2]">
                            <img
                                src="/assets/image/mobile/noVisitIcon.svg"
                                alt="스탬프가 없습니다 아이콘"
                            />
                            <p className="text-lg font-semibold mt-2">
                                결제내역이 없습니다.
                            </p>
                            <p className="text-sm font-light mt-1">
                                결제가 등록되면 이곳에 표시됩니다.
                            </p>
                        </div>
                    )}
                </section>
            </div>
            {/* 하단 네비게이션 */}
            {customerId ? <MobileFooter /> : <MobileFooter2 />}
        </div>
    );
}
export default MobilePayList;

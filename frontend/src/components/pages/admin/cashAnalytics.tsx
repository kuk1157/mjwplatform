import { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { PageTitle } from "src/components/atoms/title";
import { SectionWrapper } from "src/components/atoms/wrapper";
import { SectionCard } from "src/components/molecules/card";
import { DateRangeInput } from "src/components/atoms/input";
import { UserApi } from "src/utils/userApi";

import { PointAnalytics } from "src/types";

// 날짜 포맷 YYYY-MM-DD
const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

function AdminCashAnalyticsPage() {
    const [startAt, setStartAt] = useState<Date | null>(null);
    const [endAt, setEndAt] = useState<Date | null>(null);
    const [trendTab, setTrendTab] = useState<"daily" | "monthly" | "yearly">(
        "daily"
    );
    const [pointTotal, setPointTotal] = useState<PointAnalytics | null>(null);
    // 8개 값 대시보드 API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pointTotal] = await Promise.all([
                    axios.get("/api/v1/points/admin/analytics/point/total"),
                ]);
                setPointTotal(pointTotal.data); // 공지사항 추출
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };
        fetchData();
    }, []);

    const { data: trafficData, refetch } = useQuery({
        queryKey: ["paymentStats"],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (startAt) params.append("start", formatDate(startAt));
            if (endAt) params.append("end", formatDate(endAt));

            const res = await UserApi.get(
                `/api/v1/points/admin/analytics/point?${params.toString()}`
            );

            console.log(res.data);
            return res.data;
        },
        enabled: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (!startAt && !endAt) {
            const today = new Date();
            const start = new Date();
            start.setMonth(today.getMonth() - 1);
            setStartAt(start);
            setEndAt(today);
            refetch();
        }
    }, [refetch, startAt, endAt]);

    const handleSearch = () => {
        if (!startAt || !endAt) return;
        refetch();
    };

    const chartData = (() => {
        if (!trafficData) return [];

        let rawData: any[] = [];
        switch (trendTab) {
            case "daily":
                rawData = trafficData.daily || [];
                break;
            case "monthly":
                rawData = trafficData.monthly || [];
                break;
            case "yearly":
                rawData = trafficData.yearly || [];
                break;
            default:
                rawData = [];
        }

        // 데이터가 7개 초과면 최근 7개만 추출
        return rawData.length > 7 ? rawData.slice(-7) : rawData;
    })();
    const trendTabs = [
        { label: "일별", value: "daily" },
        { label: "월별", value: "monthly" },
        { label: "년도별", value: "yearly" },
    ];

    const chartColorType = [
        { color: "#8b5cf6", type: "sumCash", name: "현금 합계" },
        { color: "#ec4899", type: "avgCash", name: "현금 평균" },
        { color: "#14b8a6", type: "minCash", name: "현금 최소" },
        { color: "#6366f1", type: "maxCash", name: "현금 최대" },
    ];

    // 개수 차트
    const countChart = () => {
        // chartData가 없으면 더미 데이터 생성
        const dataToRender =
            chartData && chartData.length > 0
                ? chartData
                : [{ date: "", count: 0 }];

        // 데이터가 1개면 BarChart
        if (dataToRender.length === 1) {
            return (
                <BarChart
                    data={dataToRender}
                    margin={{ top: 20, right: 40, left: 20, bottom: 40 }}
                >
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} dy={10} />
                    <YAxis tick={{ fontSize: 14 }} />
                    <Tooltip
                        formatter={(value: any) => [`${value}`, "데이터 개수"]}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Bar
                        dataKey="count"
                        fill="#3b82f6"
                        name="데이터 개수"
                        barSize={100}
                    />
                </BarChart>
            );
        }

        // 데이터 2개 이상이면 AreaChart
        return (
            <AreaChart
                data={dataToRender}
                margin={{ top: 20, right: 40, left: 20, bottom: 40 }}
            >
                <defs>
                    <linearGradient
                        id="colorPayment"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0}
                        />
                    </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} dy={10} />
                <YAxis tick={{ fontSize: 14 }} />
                <Tooltip
                    formatter={(value: any) => [`${value}`, "데이터 개수"]}
                />
                <Legend verticalAlign="top" height={36} />
                <Area
                    dataKey="count"
                    stroke="#3b82f6"
                    fill="url(#colorPayment)"
                    name="데이터 개수"
                />
            </AreaChart>
        );
    };

    // 주문, 포인트 관련 차트
    const pointChart = () => {
        // chartData가 없으면 더미 데이터 생성
        const dataToRender =
            chartData && chartData.length > 0
                ? chartData
                : [{ date: "", count: 0 }];

        // 데이터가 1개면 BarChart
        if (dataToRender.length === 1) {
            return (
                <BarChart
                    data={dataToRender}
                    margin={{ top: 20, right: 40, left: 20, bottom: 40 }}
                >
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} dy={10} />
                    <YAxis tick={{ fontSize: 14 }} />
                    <Tooltip
                        formatter={(value: any, name: string) => [
                            `${value}`,
                            name,
                        ]}
                    />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        wrapperStyle={{ fontWeight: "bold" }}
                    />
                    {chartColorType.map(({ type, color, name }) => (
                        <Bar
                            key={type}
                            dataKey={type}
                            fill={color}
                            name={name}
                            barSize={100}
                        />
                    ))}
                </BarChart>
            );
        }

        // 데이터 2개 이상이면 AreaChart
        return (
            <AreaChart
                data={dataToRender}
                margin={{ top: 20, right: 40, left: 20, bottom: 40 }}
            >
                <defs>
                    {chartColorType.map(({ color, type }) => (
                        <linearGradient
                            key={type}
                            id={type}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor={color}
                                stopOpacity={0.4}
                            />
                            <stop
                                offset="95%"
                                stopColor={color}
                                stopOpacity={0}
                            />
                        </linearGradient>
                    ))}
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} dy={10} />
                <YAxis tick={{ fontSize: 14 }} />
                <Tooltip
                    formatter={(value: any, name: string) => [`${value}`, name]}
                />
                <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ fontWeight: "bold" }}
                />
                {chartColorType.map(({ type, color, name }) => (
                    <Area
                        key={type}
                        type="monotone"
                        dataKey={type}
                        stroke={color}
                        fill={`url(#${type})`}
                        name={name}
                    />
                ))}
            </AreaChart>
        );
    };

    return (
        <SectionCard className="h-full text-[15px] leading-[18px]">
            <PageTitle className="p-10">현금화 통계</PageTitle>
            <SectionWrapper>
                <div className="p-[20px]">
                    {/* 트렌드 탭 */}
                    <div className="flex gap-3 mb-4">
                        {trendTabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setTrendTab(tab.value as any)}
                                className={`px-4 py-2 border rounded ${
                                    trendTab === tab.value
                                        ? "bg-[#21A089] text-white border-0"
                                        : "bg-white text-[#666] border border-[#b8b8b8]"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* 날짜 선택 + 검색 */}
                    <div className="flex items-center gap-3 my-4">
                        <DateRangeInput
                            title=""
                            startSelected={startAt}
                            handleStart={(d: Date | null) => setStartAt(d)}
                            endSelected={endAt}
                            handleEnd={(d: Date | null) => setEndAt(d)}
                            startPlaceholder="검색 시작 날짜"
                            endPlaceholder="검색 종료 날짜"
                        />
                        <button
                            className="px-4 py-2 bg-[#21A089] text-white rounded"
                            onClick={handleSearch}
                        >
                            기간 검색
                        </button>
                    </div>

                    {/* 차트 */}
                    <div className="flex py-6">
                        <ResponsiveContainer width="100%" height={500}>
                            {countChart()}
                        </ResponsiveContainer>
                    </div>

                    {/* 차트 */}
                    <div className="flex py-6">
                        <ResponsiveContainer width="100%" height={500}>
                            {pointChart()}
                        </ResponsiveContainer>
                    </div>
                    <div className="text-center flex justify-center">
                        <span className="w-[150px] border p-3">
                            <p className="font-normal">전체 합계 현금</p>
                            <p className="text-[#000] font-bold mt-1">
                                {pointTotal?.sumPoint?.toLocaleString()} P
                            </p>
                        </span>
                        <span className="w-[150px] border p-3 ml-3">
                            <p className="font-normal">전체 평균 현금</p>
                            <p className="text-[red] font-bold mt-1">
                                {pointTotal?.avgPoint} P
                            </p>
                        </span>
                        <span className="mx-3 w-[150px] border p-3">
                            <p className="font-normal">전체 최소 현금</p>
                            <p className="text-[blue] font-bold mt-1">
                                {pointTotal?.minPoint} P
                            </p>
                        </span>
                        <span className="w-[150px] border p-3">
                            <p className="font-normal">전체 최대 현금</p>
                            <p className="text-[green] font-bold mt-1">
                                {pointTotal?.maxPoint} P
                            </p>
                        </span>
                    </div>
                </div>
            </SectionWrapper>
        </SectionCard>
    );
}

export default AdminCashAnalyticsPage;

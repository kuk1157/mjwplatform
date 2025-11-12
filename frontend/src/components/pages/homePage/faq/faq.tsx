import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";

import { MenuList } from "src/constants/index";
import { useTranslation } from "react-i18next";
import { FaqData } from "src/types";

export function HomePageFaq() {
    const [faq, setFaq] = useState<FaqData[]>([]);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const { data } = useQuery({
        queryKey: ["faqList"],
        queryFn: async () => {
            const res = await axios.get(`/api/v1/faqs?size=1000`); // 충분히 큰 값
            return res.data;
        },
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (data) {
            setFaq(data.content);
        }
    }, [data]);

    const handleToggle = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const { t } = useTranslation(["header"]);
    const location = useLocation();
    const nowLink = location.pathname;

    return (
        <div className="flex gap-10 justify-center mt-40 px-4">
            {/* 좌측 메뉴 */}
            <div className="w-[175px] p-5 py-10 bg-[#580098] text-white rounded-3xl text-center">
                {MenuList?.map((menu) => (
                    <Link key={menu.path} to={menu.path}>
                        <p
                            className={`my-1 ${
                                menu.path === nowLink
                                    ? "opacity-100 font-bold"
                                    : "opacity-30"
                            }`}
                        >
                            {t(`${menu.name}`)}
                        </p>
                    </Link>
                ))}
            </div>

            {/* FAQ 영역 */}
            <div className="flex-1 max-w-3xl">
                <h1 className="text-6xl font-bold mb-6 text-center">FAQ</h1>
                <div className="space-y-4">
                    {faq.map((item) => (
                        <div
                            key={item.id}
                            className="border rounded-lg overflow-hidden shadow-sm"
                        >
                            <button
                                className="w-full text-left px-4 py-3 bg-purple-100 hover:bg-purple-200 flex justify-between items-center"
                                onClick={() => handleToggle(item.id)}
                            >
                                <span className="font-medium">
                                    {item.question}
                                </span>
                                <span className="text-xl">
                                    {expandedId === item.id ? "-" : "+"}
                                </span>
                            </button>
                            {expandedId === item.id && (
                                <div className="px-4 py-3 bg-white text-gray-700">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomePageFaq;

import { SectionContainer2 } from "../molecules/container";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import { PaginatedDataTable } from "../molecules/paginatedDataTable";
import { BoardSearch } from "../molecules/boardSearch";

import { MenuList } from "src/constants/index";
import { useTranslation } from "react-i18next";

function NoticePage() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const tableRef = useRef<any>(null);
    const [noticeData, setNoticeData] = useState([]);

    const itemsPerPage = 10;

    const { data: noticeList, isFetching } = useQuery({
        queryKey: ["noticeList", page, searchQuery],
        queryFn: async () => {
            const url = `/api/v1/notice?page=${page - 1}&size=${itemsPerPage}${searchQuery}`;
            const res = await axios.get(url);
            return res.data;
        },
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (noticeList) {
            setNoticeData(noticeList?.content);
        }
    }, [noticeList]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    const searchOption = [
        {
            key: "전체",
            value: "keyword",
        },
    ];

    const startIndex = (page - 1) * itemsPerPage;
    const columns = [
        {
            key: "id",
            value: "번호",
            width: "10%",
        },
        {
            key: "title",
            value: "제목",
            width: "50%",
        },
        {
            key: "author",
            value: "글쓴이",
            width: "10%",
        },
        {
            key: "createdAt",
            value: "등록일",
            width: "20%",
        },
        {
            key: "view",
            value: "조회",
            width: "10%",
        },
    ];

    const totalElements = noticeList?.totalElements;

    const { t } = useTranslation(["header"]);
    const location = useLocation();
    const nowLink = location.pathname;

    return (
        <div className="flex justify-center">
            <div className="h-[300px] w-[175px] p-5 py-10 bg-[#580098] text-[#fff] rounded-3xl text-center mr-40">
                {MenuList?.map((menu) => {
                    return (
                        <Link to={`${menu.path}`}>
                            <p
                                className={`my-1 ${menu.path === nowLink ? "opacity-100 font-bold" : "opacity-30"}`}
                            >
                                {t(`${menu.name}`)}
                            </p>
                        </Link>
                    );
                })}
            </div>
            <SectionContainer2 className=" pb-[150px] lg:pt-0">
                <section className="flex flex-col gap-[35px] w-full mt-[100px]">
                    <PaginatedDataTable
                        isFetching={isFetching}
                        dataTableProps={{
                            ref: tableRef,
                            data: noticeData,
                            columns: columns,
                            type: "notice",
                            startIndex: startIndex,
                        }}
                        paginationProps={{
                            totalItemsCount: totalElements,
                            activePage: page,
                            itemsCountPerPage: itemsPerPage,
                            paginationOnChange: handlePageChange,
                        }}
                    />
                </section>
                <section className="bg-[#F6F6F6] py-[18px] w-full mt-[45px]">
                    <BoardSearch
                        executeSearch={setSearchQuery}
                        searchOption={searchOption}
                    />
                </section>
            </SectionContainer2>
        </div>
    );
}

export default NoticePage;

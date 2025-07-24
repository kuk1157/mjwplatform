import { useEffect, useState } from "react";
import { StoreType } from "../../../types";
import { useQuery } from "react-query";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { sortState } from "src/recoil/sortState";
import { GenericDataTable } from "src/components/organisms/genericDataTable";

const searchOption = [
    {
        key: "전체",
        value: "keyword",
    },
];

export function StoreTablePage() {
    const [page, setPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [filteredData, setFilteredData] = useState<StoreType[]>(); // 필터링된 데이터
    const [searchQuery, setSearchQuery] = useState("");
    const sortConfig = useRecoilValue(sortState);

    const { data: storeList, isFetching } = useQuery({
        queryKey: ["storeList", page, searchQuery, sortConfig],
        queryFn: async () => {
            const url = `/api/v1/stores?page=${page - 1}&sort=${sortConfig.key},${sortConfig.array}&size=${itemsPerPage}${searchQuery}`;
            const res = await axios.get(url);
            return res.data;
        },
        refetchOnWindowFocus: false,
    });
    useEffect(() => {
        if (!isFetching) {
            setFilteredData(storeList.content);
            setTotalElements(storeList.totalElements);
        }
    }, [storeList, isFetching]);
    useEffect(() => {
        setPage(1);
    }, [searchQuery]);
    const itemsPerPage = 5;
    const handlePageChange = (page: number) => {
        setPage(page);
    };

    const columnsInquiry = [
        {
            key: "id",
            value: "번호",
            width: "10%",
        },
        {
            key: "ownerName",
            value: "점주 이름",
            width: "10%",
        },
        {
            key: "name",
            value: "매장 이름",
            width: "20%",
        },
        {
            key: "address",
            value: "주소",
            width: "20%",
        },
        {
            key: "detail",
            value: "매장 테이블 보기",
            width: "40%",
        },
    ];

    return (
        <GenericDataTable
            sectionTitle={"매장 테이블 관리"}
            type="admin_storeTablePage"
            data={filteredData!}
            isFetching={isFetching}
            columns={columnsInquiry}
            // columnWidths={columnWidthsServer}
            executeSearch={setSearchQuery}
            page={page}
            itemsPerPage={itemsPerPage}
            totalElements={totalElements}
            handlePageChange={handlePageChange}
            searchOption={searchOption}
        />
    );
}

export default StoreTablePage;

import { useEffect, useState } from "react";
import { NftList } from "../../../types";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { sortState } from "src/recoil/sortState";
import { GenericDataTable } from "src/components/organisms/genericDataTable";
import { UserApi } from "src/utils/userApi";

const searchOption = [
    {
        key: "전체",
        value: "keyword",
    },
];

export function AdminNftOnChainLog() {
    const [page, setPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [filteredData, setFilteredData] = useState<NftList[]>(); // 필터링된 데이터
    const [searchQuery, setSearchQuery] = useState("");
    const sortConfig = useRecoilValue(sortState);

    const { data: NftTransactionLog, isFetching } = useQuery({
        queryKey: ["NftTransactionLog", page, searchQuery, sortConfig],
        queryFn: async () => {
            const url = `/api/v1/admin/nftFailLog?page=${page - 1}&sort=${sortConfig.key},${sortConfig.array}&size=${itemsPerPage}${searchQuery}`;
            const res = await UserApi.get(url);
            return res.data;
        },
        refetchOnWindowFocus: false,
    });
    useEffect(() => {
        if (!isFetching) {
            setFilteredData(NftTransactionLog.content);
            setTotalElements(NftTransactionLog.totalElements);
        }
    }, [NftTransactionLog, isFetching]);
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
            width: "5%",
        },
        {
            key: "onChainCategory",
            value: "검증 유형",
            width: "10%",
        },
        {
            key: "errorType",
            value: "에러 타입",
            width: "15%",
        },
        {
            key: "koreanMsg",
            value: "메시지(kr)",
            width: "30%",
        },
        {
            key: "errorMsg",
            value: "에러메시지(en)",
            width: "30%",
        },
        {
            key: "createdAt",
            value: "발생일",
            width: "10%",
        },
    ];

    return (
        <GenericDataTable
            sectionTitle={"온체인 검증 실패 로그"}
            type="admin_OnChainFailLog"
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

export default AdminNftOnChainLog;

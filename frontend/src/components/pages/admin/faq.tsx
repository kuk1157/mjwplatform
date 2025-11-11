import { useEffect, useState } from "react";
import { NoticeDataType } from "../../../types";
import { useQuery } from "react-query";
import { UserApi } from "src/utils/userApi";
import { updateContentsWithImages } from "src/utils/common";
import { useRecoilValue } from "recoil";
import { sortState } from "src/recoil/sortState";
import { GenericDataTable } from "src/components/organisms/genericDataTable";
import { SubmitButton } from "src/components/organisms/submitButton"; // 공통 등록 버튼 컴포넌트

const searchOption = [
    {
        key: "전체",
        value: "keyword",
    },
];

function AdminFaq() {
    const [page, setPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [filteredData, setFilteredData] = useState<NoticeDataType[]>(); // 필터링된 데이터
    const [searchQuery, setSearchQuery] = useState("");
    const sortConfig = useRecoilValue(sortState);

    const { data: noticeList, isFetching } = useQuery({
        queryKey: ["noticeList", page, searchQuery, sortConfig],
        queryFn: async () => {
            const url = `/api/v1/admin/notices?page=${page - 1}&sort=${sortConfig.key},${sortConfig.array}&size=${itemsPerPage}${searchQuery}`;
            const res = await UserApi.get(url);

            const updatedData = res.data.content.map((data: any) => {
                if (!data.description || !data.filePaths) return data;
                const updatedContents = updateContentsWithImages(
                    data.description,
                    data.filePaths,
                    { onlyLast: true } // 마지막 uuid 추출 조건(true일때 마지막만)
                );
                return { ...data, description: updatedContents };
            });
            res.data.content = updatedData;
            return res.data;
            // return res.data;
        },
        refetchOnWindowFocus: false,
    });
    useEffect(() => {
        if (!isFetching) {
            setFilteredData(noticeList.content);
            setTotalElements(noticeList.totalElements);
        }
    }, [noticeList, isFetching]);
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
            key: "question",
            value: "질문",
            width: "35%",
        },
        {
            key: "answer",
            value: "답변",
            width: "35%",
        },

        {
            key: "createdAt",
            value: "작성일",
            width: "10%",
        },
        {
            key: "detail",
            value: "상세보기",
            width: "10%",
        },
    ];

    return (
        <GenericDataTable
            sectionTitle={"FAQ 관리"}
            type="admin_FAQ"
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
            // 공통 등록 버튼
            submitButton={
                <SubmitButton label="FAQ 등록" path="/admin/faq/faqCreate" />
            }
        />
    );
}

export default AdminFaq;

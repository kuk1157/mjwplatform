// import { useEffect, useState } from "react";
// import { NoticeDataType } from "../../../types";
// import axios from "axios";
// import { useQuery } from "react-query";
// import { extractBase64Data, updateContentsWithImages } from "src/utils/common";
// import { UserApi, UserFormApi } from "src/utils/userApi";
// import { Loading } from "src/components/molecules/Loading";
// import { sortState } from "src/recoil/sortState";
// import { useRecoilValue } from "recoil";
// import { GenericDataTableForm } from "src/components/organisms/genericDataTableForm";

// function NoticePage() {
//     const [totalElements, setTotalElements] = useState(0);
//     const [filteredData, setFilteredData] = useState<NoticeDataType[]>(); // 필터링된 데이터
//     const [searchQuery, setSearchQuery] = useState("");
//     const [page, setPage] = useState(1);
//     const sortConfig = useRecoilValue(sortState);
//     const { data: noticeList, isFetching } = useQuery({
//         queryKey: ["noticeList", page, searchQuery, sortConfig],
//         queryFn: async () => {
//             const url = `/api/v1/notice?page=${page - 1}&sort=${sortConfig.key},${sortConfig.array}&size=${itemsPerPage}${searchQuery}`;
//             const res = await axios.get(url);

//             const updatedData = res.data.content.map((data: any) => {
//                 if (!data.description || !data.filePaths) return data;
//                 const updatedContents = updateContentsWithImages(
//                     data.description,
//                     data.filePaths
//                 );
//                 return { ...data, description: updatedContents };
//             });
//             res.data.content = updatedData;
//             return res.data;
//             // return res.data;
//         },
//         refetchOnWindowFocus: false,
//     });

//     useEffect(() => {
//         if (!isFetching) {
//             setFilteredData(noticeList.content);
//             setTotalElements(noticeList.totalElements);
//         }
//     }, [noticeList, isFetching]);
//     useEffect(() => {
//         setPage(1);
//     }, [searchQuery]);

//     const [title, setTitle] = useState<string>(""); // 글의 제목
//     const [content, setContent] = useState<string>(""); // 글의 내용
//     const [isLoading, setIsLoading] = useState(false);

//     const itemsPerPage = 5;
//     const handlePageChange = (page: number) => {
//         setPage(page);
//     };

//     const [selectRow, setSelectRow] = useState<any>(undefined);

//     const onSave = async () => {
//         if (!title) {
//             alert("제목을 입력해주세요.");
//             return;
//         }
//         if (!content) {
//             alert("내용을 입력해주세요.");
//             return;
//         }
//         setIsLoading(true);

//         const thisContent = extractBase64Data(content);

//         const description = thisContent.updatedContent;
//         const images = thisContent.base64Data;

//         const saveData = new FormData();
//         if (selectRow) {
//             saveData.append("id", selectRow.id);
//         }
//         saveData.append("title", title);
//         saveData.append("description", description);
//         images.forEach((image: { blob: Blob; width?: number }) => {
//             const mimeType = image.blob.type;
//             const fileExtension = mimeType.split("/")[1];
//             const width = image.width;

//             saveData.append(
//                 `files`,
//                 image.blob,
//                 `media${width && `-width_${width}`}.${fileExtension}`
//             );
//         });

//         console.log(...saveData);
//         // 신규 저장
//         try {
//             const response = !selectRow
//                 ? await UserFormApi.post("/api/v1/admin/notice", saveData)
//                 : await UserFormApi.put("/api/v1/admin/notice", saveData);
//             if (response.status === 200 || response.status === 201) {
//                 alert("저장이 완료되었습니다.");
//                 window.location.reload();
//             } else {
//                 alert("저장에 실패했습니다. 다시 시도해주세요.");
//             }
//         } catch (error) {
//             console.error("저장 중 오류가 발생했습니다:", error);
//             alert("오류가 발생했습니다. 관리자에게 문의하세요.");
//         } finally {
//             setIsLoading(false);
//         }
//     };
//     const onDelete = async () => {
//         if (confirm("정말 삭제하시겠습니까?")) {
//             try {
//                 const response = await UserApi.delete(
//                     `/api/v1/admin/notice/${selectRow?.id}`
//                 );
//                 if (response.status === 200 || response.status === 201) {
//                     alert("삭제되었습니다.");
//                     window.location.reload();
//                 } else {
//                     alert("삭제 실패했습니다. 다시 시도해주세요.");
//                 }
//             } catch (error) {
//                 console.error("삭제 중 오류가 발생했습니다:", error);
//                 alert("오류가 발생했습니다. 관리자에게 문의하세요.");
//             }
//         }
//     };

//     const searchOption = [
//         {
//             key: "전체",
//             value: "keyword",
//         },
//     ];

//     const columnsInquiry = [
//         {
//             key: "id",
//             value: "번호",
//             width: "20%",
//         },
//         {
//             key: "title",
//             value: "제목",
//             width: "50%",
//         },
//         {
//             key: "createdAt",
//             value: "작성일",
//             width: "30%",
//         },
//     ];
//     const startIndex = (page - 1) * itemsPerPage;
//     return (
//         <>
//             {isLoading && <Loading />}
//             <GenericDataTableForm
//                 sectionTitle={"공지사항"}
//                 data={filteredData!}
//                 isFetching={isFetching}
//                 title={title}
//                 setTitle={setTitle}
//                 content={content}
//                 setContent={setContent}
//                 onSave={onSave}
//                 columns={columnsInquiry}
//                 searchOption={searchOption}
//                 executeSearch={setSearchQuery}
//                 page={page}
//                 itemsPerPage={itemsPerPage}
//                 totalElements={totalElements}
//                 handlePageChange={handlePageChange}
//                 selectRow={selectRow}
//                 setSelectRow={setSelectRow}
//                 onDelete={onDelete}
//                 type={"admin_notice"}
//                 startIndex={startIndex}
//             />
//         </>
//     );
// }

// export default NoticePage;

import { useEffect, useState } from "react";
import { NoticeDataType } from "../../../types";
import { useQuery } from "react-query";
import axios from "axios";
// import { UserApi } from "src/utils/userApi";
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

function NoticeTestPage() {
    const [page, setPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [filteredData, setFilteredData] = useState<NoticeDataType[]>(); // 필터링된 데이터
    const [searchQuery, setSearchQuery] = useState("");
    const sortConfig = useRecoilValue(sortState);

    const { data: noticeList, isFetching } = useQuery({
        queryKey: ["noticeList", page, searchQuery, sortConfig],
        queryFn: async () => {
            const url = `/api/v1/notice?page=${page - 1}&sort=${sortConfig.key},${sortConfig.array}&size=${itemsPerPage}${searchQuery}`;
            const res = await axios.get(url);

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
            key: "title",
            value: "제목",
            width: "50%",
        },
        {
            key: "description",
            value: "썸네일",
            width: "20%",
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
            sectionTitle={"공지사항 관리"}
            type="admin_notice"
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
                <SubmitButton
                    label="공지사항 등록"
                    path="/admin/notice/noticeCreate"
                />
            }
        />
    );
}

export default NoticeTestPage;

import { useEffect, useRef } from "react";
import { BoardSearch } from "../molecules/boardSearch";
import { PaginatedDataTable } from "../molecules/paginatedDataTable";
import { MainContainer } from "../molecules/container";
import { DetailForm } from "./detailForm";
import { updateContentsWithImages } from "src/utils/common";

type T = {
    id: any;
    [key: string]: any;
};

function GenericDataTableForm({
    sectionTitle,
    data,
    isFetching,
    title,
    setTitle,
    content,
    setContent,
    thumbnail,
    setThumbnail,
    // onSave,
    columns,
    searchOption,
    executeSearch,
    handlePageChange,
    page,
    itemsPerPage,
    totalElements,
    setThumbnailFile,
    startIndex,
    selectRow,
    setSelectRow,
    type,
    // onDelete,
    pageName,
    setSubDescription,
    setCategory,
}: {
    sectionTitle: string;
    data: T[];
    isFetching: boolean;
    title: string;
    setTitle: (data: string) => void;
    content: string;
    setContent: (data: string) => void;
    thumbnail?: string;
    type: string;
    setThumbnail?: (data: string) => void;
    setThumbnailFile?: any;
    onSave: () => Promise<void>;
    columns: { key: string; value: string }[];
    searchOption: { key: string; value: string }[];
    executeSearch: (searchQuery: string) => void;
    page: number;
    itemsPerPage: number;
    totalElements: number;
    handlePageChange: (page: number) => void;
    selectRow?: any;
    setSelectRow?: any;
    onDelete: () => Promise<void>;
    pageName?: string;
    startIndex?: number;
    descriptionTitle?: string;
    setDescriptionTitle?: (data: string) => void;
    subDescription?: string;
    setSubDescription?: (data: string) => void;
    category?: string;
    setCategory?: (data: string) => void;
}) {
    const tableRef = useRef<any>(null);

    const handleRowSelect = (row: T) => {
        if (selectRow && selectRow.id === row.id) {
            setSelectRow && setSelectRow(undefined);
        } else {
            setSelectRow && setSelectRow(row);
        }
        console.log(row);
    };

    useEffect(() => {
        if (selectRow) {
            const updatedContents = updateContentsWithImages(
                selectRow.description ?? "",
                selectRow.filePaths ?? []
            );
            const imgUrl = `https://kr.object.ncloudstorage.com/pudding/vpudding/${pageName}/${selectRow.uuid}/thumbnail.${selectRow.thumbnailExtension}`;
            setTitle(selectRow.title ?? "");
            setContent(updatedContents ?? "");
            setThumbnail && setThumbnail(imgUrl);
        } else {
            setTitle("");
            setContent("");
            setThumbnail && setThumbnail("");
        }
    }, [
        selectRow,
        data,
        setTitle,
        setContent,
        setThumbnail,
        pageName,
        setSubDescription,
        setCategory,
    ]);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { value } = e.target;
        console.log(value);

        const file = (e.target as HTMLInputElement).files?.[0] || null;
        if (file) {
            const imgUrl = URL.createObjectURL(file);
            setThumbnail && setThumbnail(imgUrl);
            setThumbnailFile && setThumbnailFile(file);
        }
    };
    return (
        <>
            <MainContainer className="flex flex-row gap-[30px]">
                <section className="flex self-start flex-col rounded-xl leading-[18px] bg-[#FFFFFF] px-[30px] py-[30px] border border-[#D5EBE8] w-full max-w-[600px] h-[711px]">
                    <h1 className="font-semibold text-base leading-[19px] tracking-[-0.64px] text-[#333333] pb-[30px]">
                        {sectionTitle}
                    </h1>
                    <BoardSearch
                        executeSearch={executeSearch}
                        searchOption={searchOption}
                    />
                    <div className="border-t border-[#EEEEEE]">
                        {data && (
                            <PaginatedDataTable
                                isFetching={isFetching}
                                dataTableProps={{
                                    ref: tableRef,
                                    data: data,
                                    columns: columns,
                                    type: type,
                                    startIndex: startIndex,
                                    handleRowSelect: handleRowSelect,
                                }}
                                paginationProps={{
                                    totalItemsCount: totalElements,
                                    activePage: page,
                                    itemsCountPerPage: itemsPerPage,
                                    paginationOnChange: handlePageChange,
                                }}
                            />
                        )}
                    </div>
                </section>

                <section className="flex flex-col rounded-xl leading-[18px] bg-[#FFFFFF] py-[30px] border border-[#D5EBE8] w-full max-w-[940px] h-fit max-h-full">
                    <h1 className="font-semibold text-base leading-[19px] tracking-[-0.64px] text-[#333333] px-[30px] pb-[30px]">{`${sectionTitle} ${selectRow ? "수정" : "등록"}`}</h1>
                    <div className="px-[30px] border-t border-[#EEEEEE]">
                        <DetailForm
                            title={title}
                            setTitle={setTitle}
                            content={content}
                            setContent={setContent}
                            thumbnail={thumbnail}
                            handleInputChange={
                                setThumbnail && handleInputChange
                            }
                            // selectRow={selectRow}
                            // onSave={onSave}
                            // onDelete={onDelete}
                        />
                    </div>
                </section>
            </MainContainer>
        </>
    );
}
export { GenericDataTableForm };

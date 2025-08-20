import { useRef } from "react";
import { SectionCard } from "../molecules/card";
import { PageTitle } from "../atoms/title";
import { SectionWrapper } from "../atoms/wrapper";
import { PaginatedDataTable } from "../molecules/paginatedDataTable";
import { SelectBoardSearch } from "../molecules/boardSearch";
import PageRedirect from "./pageRedirect";
function GenericDataTable({
    sectionTitle,
    type,
    data,
    isFetching,
    columns,
    columnWidths,
    executeSearch,
    handlePageChange,
    page,
    itemsPerPage,
    totalElements,
    handleRoleChange,
    handleIsActive,
    handleIsConfirmed,
    searchOption,
    submitButton, // 공통 등록 버튼
}: {
    sectionTitle: string;
    type: string;
    data: any[];
    isFetching: boolean;
    columns: { key: string; value: string }[];
    columnWidths?: string[];
    executeSearch: (searchQuery: string) => void;
    page: number;
    itemsPerPage: number;
    totalElements: number;
    handlePageChange: (page: number) => void;
    handleRoleChange?: (userId: number, role: string) => void;
    handleIsActive?: (userId: number, isActive: string) => void;
    handleIsConfirmed?: (userId: number, isConfirmed: string) => void;
    searchOption: { key: string; value: string }[];
    submitButton?: React.ReactNode; // 공통 등록 버튼
}) {
    const tableRef = useRef<any>(null);

    // const startIndex = (page - 1) * itemsPerPage;

    return (
        <>
            <SectionCard className="text-[15px] leading-[18px] h-full">
                <PageRedirect />
                <PageTitle className="pb-[50px]">{sectionTitle}</PageTitle>
                <div className={`flex pl-[30px] justify-end`}>
                    <SelectBoardSearch
                        searchOption={searchOption}
                        executeSearch={executeSearch}
                        submitButton={submitButton}
                    />
                </div>
                <SectionWrapper>
                    {data && (
                        <PaginatedDataTable
                            isFetching={isFetching}
                            dataTableProps={{
                                ref: tableRef,
                                data: data,
                                columnWidths: columnWidths && columnWidths,
                                columns: columns,
                                type: type,
                                handleRoleChange: handleRoleChange,
                                handleIsActive: handleIsActive,
                                handleIsConfirmed: handleIsConfirmed,
                            }}
                            paginationProps={{
                                totalItemsCount: totalElements,
                                activePage: page,
                                itemsCountPerPage: itemsPerPage,
                                paginationOnChange: handlePageChange,
                            }}
                        />
                    )}
                </SectionWrapper>
            </SectionCard>
        </>
    );
}

export { GenericDataTable };

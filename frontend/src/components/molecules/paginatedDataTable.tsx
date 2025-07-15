import { DataTableProps, IPaginationProps } from "../../types";
import { DataTable } from "./datatable";
import { Pagination } from "./pagination";

export const PaginatedDataTable = ({
    paginationProps,
    dataTableProps,
    isFetching,
}: {
    dataTableProps: DataTableProps;
    paginationProps: IPaginationProps;
    isFetching: boolean;
}) => {
    return (
        <>
            <DataTable
                isFetching={isFetching}
                dataTableProps={dataTableProps}
                paginationProps={paginationProps}
            />
            <Pagination
                isFetching={isFetching}
                paginationProps={paginationProps}
            />
        </>
    );
};

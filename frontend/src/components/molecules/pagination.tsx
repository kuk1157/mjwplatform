import React from "react";
import ReactPagination from "react-js-pagination";
import styled from "styled-components";
import { IPaginationProps } from "../../types";
const Paging = styled.div`
    .pagination {
        display: flex;
        justify-content: center;
        font-family: "Pretendard";
        // margin-top: 15px;
        // padding: 0px;
    }

    ul {
        list-style: none;
        padding: 0;
        padding-top: 50px;
    }

    ul.pagination li {
        display: inline-block;
        width: 35px;
        height: 35px;
        // border: 1px solid #e2e2e2;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        color: black;
    }

    ul.pagination li:first-child {
        border-radius: 5px 0 0 5px;
    }

    ul.pagination li:last-child {
        border-radius: 0 5px 5px 0;
    }

    ul.pagination li a {
        text-decoration: none;
        color: #333333;
        font-size: 16px;
        font-weight: 400;
    }

    ul.pagination li.active a {
        color: #ffffff;
        text-align: center;
        font-weight: 400;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 35px;
        height: 35px;
        background: #21a089;
        border-radius: 5px;
        line-height: 26px;
    }

    ul.pagination li.active {
        // background-color: #b4b4b4;
    }

    .page-selection {
        width: 48px;
        height: 30px;
        color: #b4b4b4;
    }
    @media (max-width: 768px) {
        ul.pagination li.active a {
            color: #ffffff;
            text-align: center;
            font-weight: 400;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            background: #21a089;
            border-radius: 5px;
            line-height: 26px;
        }
        ul.pagination li a {
            text-decoration: none;
            color: #333333;
            font-size: 13px;
            font-weight: 400;
        }
    }
`;
export const Pagination = ({
    paginationProps,
}: {
    paginationProps: IPaginationProps;
    isFetching?: boolean;
}) => {
    const prevIcon = React.createElement("img", {
        src: "/assets/icon/leftArrow.svg",
    });
    const nextIcon = React.createElement("img", {
        src: "/assets/icon/rightArrow.svg",
    });
    const firstPageIcon = React.createElement("img", {
        src: "/assets/icon/doubleLeftArrow.svg",
    });
    const lastPageIcon = React.createElement("img", {
        src: "/assets/icon/doubleRightArrow.svg",
    });
    // window.scrollTo(0, 0);

    return paginationProps.totalItemsCount > 0 ? (
        <Paging>
            <ReactPagination
                activePage={paginationProps.activePage}
                itemsCountPerPage={paginationProps.itemsCountPerPage}
                totalItemsCount={paginationProps.totalItemsCount}
                pageRangeDisplayed={5}
                prevPageText={prevIcon}
                nextPageText={nextIcon}
                firstPageText={firstPageIcon}
                lastPageText={lastPageIcon}
                onChange={paginationProps.paginationOnChange}
            />
        </Paging>
    ) : (
        <></>
    );
};

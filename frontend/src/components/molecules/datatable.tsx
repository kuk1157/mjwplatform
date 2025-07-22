/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, {
    useState,
    useEffect,
    useImperativeHandle,
    useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DataTableProps, IPaginationProps } from "../../types";
import { Button } from "../atoms/button";
import Portal from "./portal";
import Modal from "./modal";
import UserModal from "./userModal";
import { formatDate } from "src/utils/common";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { sortState } from "src/recoil/sortState";
import { UserRoleList } from "src/constants/index";
import { cdn } from "src/constans"; // 공지사항 첨부파일 경로 참조
import { noticeFolder } from "src/constans"; // 공지사항 첨부파일 경로 참조
// import parse from "html-react-parser"; // 공지사항 내용 html 태그 적용

export const DataTable = ({
    isFetching,
    dataTableProps,
    paginationProps,
}: {
    isFetching: boolean;
    dataTableProps: DataTableProps;
    paginationProps?: IPaginationProps;
}) => {
    const {
        columns,
        data,
        ref,
        type,
        handleRowSelect,
        handleRoleChange,
        handleIsConfirmed,
    } = dataTableProps;

    const {
        activePage = 1,
        totalItemsCount = 0,
        itemsCountPerPage = 10,
    } = paginationProps ?? {};

    // --- State ---
    const [checkedState, setCheckedState] = useState<{
        [key: string]: boolean;
    }>({});
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [modalData, setModalData] = useState<any>(null);
    const [tableData, setTableData] = useState(data);
    const [clickedRowIndex, setClickedRowIndex] = useState<number | null>(null);

    // --- Hooks ---
    const navigate = useNavigate();
    const location = useLocation();
    const sortConfig = useRecoilValue(sortState);
    const setSortConfig = useSetRecoilState(sortState);

    // --- Effects ---
    useEffect(() => {
        const initialCheckedState = data.reduce(
            (acc, row) => {
                acc[row.id] = row.is_active === "y";
                return acc;
            },
            {} as { [key: string]: boolean }
        );
        setCheckedState(initialCheckedState);
    }, [data]);

    useEffect(() => {
        setTableData(data);
    }, [data]);

    useEffect(() => {
        const handleResetRow = () => setClickedRowIndex(null);
        window.addEventListener("resetRow", handleResetRow);
        return () => {
            window.removeEventListener("resetRow", handleResetRow);
        };
    }, []);

    useImperativeHandle(ref, () => ({
        getCheckedItems: () => {
            return Object.keys(checkedState).filter((id) => checkedState[id]);
        },
    }));

    // --- 이벤트 핸들러 ---
    const handleSort = useCallback(
        (key: string) => {
            let direction = "desc";
            if (sortConfig.key === key && sortConfig.array === "desc") {
                direction = "asc";
            }
            setSortConfig({ key, array: direction });
        },
        [sortConfig, setSortConfig]
    );

    const handleDetailButtonClick = useCallback(
        (row: any, e?: React.MouseEvent) => {
            e?.stopPropagation();
            setModalData(row);
            setOpenModal(true);
        },
        []
    );

    const handleRowClick = useCallback(
        (row: any, rowIndex: number) => {
            setClickedRowIndex(rowIndex);

            if (handleRowSelect) {
                handleRowSelect(row);
            } else if (type === "notice" || type === "") {
                if (row.id) {
                    navigate(`${location.pathname}/${row.id}`, {
                        state: { row },
                    });
                }
            }
        },
        [navigate, location.pathname, type, handleRowSelect]
    );

    const handleRoleSelectChange = useCallback(
        (rowId: any, event: React.ChangeEvent<HTMLSelectElement>) => {
            event.stopPropagation();
            if (handleRoleChange) {
                handleRoleChange(rowId, event.target.value);
            }
        },
        [handleRoleChange]
    );

    const handleConfirmationClick = useCallback(
        (row: any, event: React.MouseEvent) => {
            event.stopPropagation();
            if (handleIsConfirmed) {
                const nextStatus = row.isConfirmed === "y" ? "n" : "y";
                handleIsConfirmed(row.id, nextStatus);
            }
        },
        [handleIsConfirmed]
    );

    const renderCellContent = (
        row: any,
        column: { key: string; value: string },
        rowIndex: number
    ) => {
        const cellValue = row[column.key];
        if (column.key === "createdAt") {
            return formatDate(cellValue);
        }
        if (column.key === "birthday") {
            return cellValue ? formatDate(cellValue) : "-";
        }

        if (column.value === "번호") {
            return (
                totalItemsCount -
                itemsCountPerPage * (activePage - 1) -
                rowIndex
            );
        }

        // 공지사항 리스트 썸네일 td 가공(최종)
        // const pTagRemove = (html: string = ""): string => {
        //     return (
        //         html
        //             // base64 이미지 태그 제거(에디터안에서 첨부한 이미지 제거)
        //             .replace(
        //                 /<img[^>]+src=["']data:image\/[^"']+["'][^>]*>/gi,
        //                 ""
        //             )
        //             // 빈 <p>, <p><br></p> 제거
        //             .replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, "")
        //             // 첫 번째 <p>태그 제거
        //             .replace(/<p>.*?<\/p>/, "")
        //             .trim()
        //     );
        // };

        // // 내용은 제거하고 이미지만 보이게끔
        // // 해당 변수는 관리자 공지사항에서만
        // const thumbnailUrl = pTagRemove(row.description);
        // console.log("내용과 이미지분리" + thumbnailUrl);

        // 최종 썸네일 가공
        const fileUrl = `${cdn}/${noticeFolder}/${row.uuid}/${row.thumbnail}${row.extension}`;

        switch (type) {
            case "notice":
                switch (column.key) {
                    case "title":
                        return row.title;
                    case "author":
                        return row.author;
                    case "view":
                        return row.view;
                    default:
                        return cellValue ?? "-";
                }
            case "admin_user":
                switch (column.key) {
                    case "name":
                        return row.name;
                    case "loginId":
                        return row.loginId;
                    case "role":
                        return (
                            <select
                                className="border py-1.5 px-2 rounded-[5px]"
                                value={row.role}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                    handleRoleSelectChange(row.id, e)
                                }
                            >
                                {UserRoleList.map((item) => (
                                    <option key={item.name} value={item.name}>
                                        {item.value}
                                    </option>
                                ))}
                            </select>
                        );
                    case "detail":
                        return (
                            <Button
                                className="px-[16px] py-[9px] bg-[#21A089] text-white mx-auto text-[15px] rounded"
                                // 고유번호 넘기는 navigate
                                onClick={() =>
                                    navigate(
                                        `/admin/user/userDetail/${row.id}`,
                                        {
                                            state: row,
                                        }
                                    )
                                }
                                // onClick={(e) => handleDetailButtonClick(row, e)}
                            >
                                상세보기
                            </Button>
                        );
                    default:
                        return cellValue ?? "-";
                }
            case "inquiry":
                switch (column.value) {
                    case "title":
                        return row.title;
                    case "author":
                        return row.name;
                    case "email":
                        return row.email;
                    case "status":
                        return row.isConfirmed === "y" ? "완료" : "미완료";
                    case "isConfirmed":
                        return (
                            <button
                                type="button"
                                className={`px-3 py-1 text-xs rounded-full border ${
                                    row.isConfirmed === "y"
                                        ? "bg-[#F2FAF8] text-[#21A089] border-[#21A089]"
                                        : "bg-[#fff] text-[#bbb] border-[#bbb]"
                                }`}
                                onClick={(e) => handleConfirmationClick(row, e)}
                            >
                                {row.isConfirmed === "y" ? "승인" : "미승인"}
                            </button>
                        );
                    case "detail":
                        return (
                            <Button
                                className="px-3 py-1 bg-[#21A089] text-white text-xs rounded"
                                onClick={(e) => handleDetailButtonClick(row, e)}
                            >
                                상세보기
                            </Button>
                        );
                    default:
                        return cellValue ?? "-";
                }
            case "admin_notice":
                switch (column.key) {
                    case "title":
                        return row.title;
                    case "description": // 내용 추가
                        return row.thumbnail ? (
                            <img
                                src={fileUrl}
                                className="w-24 inline-block"
                                alt="thumbnail"
                            />
                        ) : (
                            <span>첨부파일 없음</span>
                        );

                    // // 썸네일 뿌려주기(삼항연산자 사용) - 기존 다중 파일첨부
                    // return thumbnailUrl.trim()
                    //     ? parse(thumbnailUrl)
                    //     : "첨부파일 없음";

                    // 내용과 이미지 포함 데이터
                    // return parse(row.description); // html 가공
                    case "detail":
                        return (
                            <Button
                                className="px-[16px] py-[9px] bg-[#21A089] text-white mx-auto text-[15px] rounded"
                                // 고유번호 넘기는 navigate (공지사항)
                                onClick={() =>
                                    navigate(
                                        `/admin/notice/noticeDetail/${row.id}`,
                                        {
                                            state: row,
                                        }
                                    )
                                }
                                // onClick={(e) => handleDetailButtonClick(row, e)}
                            >
                                상세보기
                            </Button>
                        );

                    default:
                        return cellValue ?? "-";
                }
            default:
                return cellValue ?? "-";
        }
    };

    // --- JSX ---
    return (
        <>
            <table className="w-full border-b border-[#EEEEEE] ">
                {/* Column Widths */}
                {columns && (
                    <colgroup>
                        {columns.map((item: any, index: number) => (
                            <col
                                key={`col-${index}`}
                                style={{ width: item.width }}
                            />
                        ))}
                    </colgroup>
                )}

                {/* 테이블 헤더 */}
                <thead>
                    <tr>
                        {columns.map((column: any, index: number) => (
                            <th
                                className={`pt-[40px] pb-[15px] text-[rgba(68,68,68,0.7)] border-[#EEEEEE] bg-white border-b font-semibold text-center`}
                                key={`th-${index}`}
                            >
                                <div
                                    onClick={() =>
                                        column.key && handleSort(column.key)
                                    }
                                    className={`inline-flex items-center gap-1.5 ml-2 ${column.key ? "cursor-pointer" : ""} justify-center w-full`}
                                >
                                    {column.value}
                                    {column.key &&
                                        column.key !== "detailView" && (
                                            <img
                                                src="/assets/icon/sortIcon.svg"
                                                alt="Sort"
                                                className="w-3 h-3 opacity-60"
                                            />
                                        )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* 테이블 바디 */}
                {!isFetching && (
                    <tbody>
                        {tableData.length > 0 ? (
                            tableData.map((row, rowIndex) => {
                                const isClickable =
                                    type === "notice" || type === "";
                                return (
                                    <tr
                                        key={`row-${row.id ?? rowIndex}`}
                                        className={`transition-colors duration-150 ${
                                            rowIndex === tableData.length - 1
                                                ? ""
                                                : "border-b border-[rgba(51,51,51,0.1)]"
                                        } ${isClickable ? "cursor-pointer hover:bg-[#F2FAF8]" : "hover:bg-[#F8F8F8]"} `}
                                        onClick={() =>
                                            handleRowClick(row, rowIndex)
                                        }
                                    >
                                        {columns.map(
                                            (column: any, colIndex: number) => (
                                                <td
                                                    className={`py-[20px] px-2 ${
                                                        clickedRowIndex ===
                                                            rowIndex &&
                                                        isClickable
                                                            ? "text-[#21A089]"
                                                            : "text-[#444444]"
                                                    } text-center overflow-hidden whitespace-nowrap text-ellipsis max-w-0 font-normal`}
                                                    key={`td-${row.id ?? rowIndex}-${colIndex}`}
                                                    title={
                                                        typeof row[
                                                            column.key
                                                        ] === "string"
                                                            ? row[column.key]
                                                            : ""
                                                    }
                                                >
                                                    {renderCellContent(
                                                        row,
                                                        column,
                                                        rowIndex
                                                    )}
                                                </td>
                                            )
                                        )}
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="py-10 text-center text-gray-500"
                                >
                                    데이터가 존재하지 않습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                )}
            </table>

            {/* 로딩 */}
            {isFetching && (
                <div className="text-center py-10 text-gray-500">
                    데이터를 불러오는 중입니다...
                </div>
            )}

            {/* 모달 */}
            <Portal>
                <Modal onClose={() => setOpenModal(false)} visible={openModal}>
                    {(type === "admin_user" || type === "inquiry") &&
                        modalData && (
                            <UserModal
                                data={modalData}
                                onClose={() => setOpenModal(false)}
                            />
                        )}
                </Modal>
            </Portal>
        </>
    );
};

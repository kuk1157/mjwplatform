import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { UserApi } from "src/utils/userApi";
import { useRecoilValue } from "recoil";
import { sortState } from "src/recoil/sortState";
import { GenericDataTable } from "src/components/organisms/genericDataTable";
import { SubmitButton } from "src/components/organisms/submitButton"; // 공통 등록 버튼 컴포넌트

const searchOption = [
    {
        key: "전체",
        value: "keyword",
    },
    {
        key: "이름",
        value: "name",
    },
    {
        key: "아이디",
        value: "loginId",
    },
];
function UserPage() {
    const [page, setPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [filteredData, setFilteredData] = useState<any>();
    const [searchQuery, setSearchQuery] = useState("");
    const sortConfig = useRecoilValue(sortState);

    const { data: userList, isFetching } = useQuery({
        queryKey: ["userList", page, searchQuery, sortConfig],
        queryFn: async () => {
            const url = `/api/v1/admin/member?page=${page - 1}&sort=${sortConfig.key},${sortConfig.array}&size=${itemsPerPage}${searchQuery}`;
            const res = await UserApi.get(url);

            return res.data;
        },
        refetchOnWindowFocus: false,
    });
    useEffect(() => {
        if (!isFetching) {
            setFilteredData(userList.content);
            setTotalElements(userList.totalElements);
        }
    }, [userList, isFetching]);
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
        },
        {
            key: "name",
            value: "이름",
        },
        {
            key: "loginId",
            value: "아이디",
        },
        {
            key: "birthday",
            value: "생년월일",
        },
        {
            key: "role",
            value: "권한",
        },
        {
            key: "createdAt",
            value: "가입일",
        },
        {
            key: "detail",
            value: "상세보기",
        },
    ];
    // const columnWidthsServer = ["10%", "30%", "20%", "25%", "15%"];
    console.log(filteredData);

    const handleRoleChange = async (userId: number, role: string) => {
        try {
            const response = await UserApi.put("/api/v1/admin/member", {
                id: userId,
                role: role,
            });
            if (response.status === 200 || response.status === 201) {
                alert("권한 수정이 완료되었습니다.");
                window.location.replace("/admin/user");
            } else {
                alert("권한 수정에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("저장 중 오류가 발생했습니다:", error);
            alert("오류가 발생했습니다. 관리자에게 문의하세요.");
        }
    };

    const handleIsActive = async (userId: number, isActive: string) => {
        try {
            const response = await UserApi.put("/api/v1/admin/member/active", {
                id: userId,
                isActive: isActive,
            });
            if (response.status === 200 || response.status === 201) {
                alert("활성화 여부 변경이 완료되었습니다.");
                window.location.replace("/user");
            } else {
                alert("활성화 여부 변경에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("저장 중 오류가 발생했습니다:", error);
            alert("오류가 발생했습니다. 관리자에게 문의하세요.");
        }
    };

    return (
        <GenericDataTable
            sectionTitle={"사용자 관리"}
            type="admin_user"
            data={filteredData}
            isFetching={isFetching}
            columns={columnsInquiry}
            // columnWidths={columnWidthsServer}
            executeSearch={setSearchQuery}
            page={page}
            itemsPerPage={itemsPerPage}
            totalElements={totalElements}
            handlePageChange={handlePageChange}
            handleRoleChange={handleRoleChange}
            handleIsActive={handleIsActive}
            searchOption={searchOption}
            // 공통 등록 버튼
            submitButton={
                <SubmitButton
                    label="사용자 등록"
                    path="/admin/user/userCreate"
                />
            }
        />
    );
}

export default UserPage;

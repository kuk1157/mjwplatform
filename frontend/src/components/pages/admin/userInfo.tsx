import { useNavigate } from "react-router-dom";
import { UserApi } from "src/utils/userApi";
import { LabelDetail } from "src/components/atoms/labelDetail";
import { DetailActionButtons } from "src/components/organisms/detailActionButtons"; // 상세보기 공통 버튼영역

interface UserInfoProps {
    user: {
        id: number; // 고유번호
        name: string; // 이름
        loginId: string; // 아이디
        birthday: string; // 생년월일
        role: string; // 권한
        createdAt: string; // 생성일
        isActive: string; // 활성화여부
    } | null;
}

export function UserInfo({ user }: UserInfoProps) {
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="text-gray-500 text-sm">
                사용자 정보를 불러오는 중입니다...
            </div>
        );
    }

    // 사용자 삭제 API 호출
    const handleDelete = async () => {
        if (!user) return;
        if (!window.confirm("정말 사용자를 삭제하시겠습니까?")) return;

        try {
            await UserApi.put("/api/v1/admin/member/active", {
                id: user.id,
                isActive: "n",
            });
            alert("사용자 삭제(비활성화)가 완료되었습니다.");
            navigate("/admin/user"); // 목록으로 이동
        } catch (err) {
            console.error("삭제 실패", err);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // 뒤로 가기 (사용자목록 이동)
    const handleBack = () => {
        navigate("/admin/user");
    };

    // 사용자 수정 페이지 이동
    const handleEdit = () => {
        navigate(`/admin/user/userEdit/${user.id}`);
    };

    // 사용자 상세보기 메인 영역
    return (
        <div className="w-full bg-white p-10 rounded-xl shadow">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
                사용자 상세 정보
            </h2>

            <div className="grid gap-x-16 gap-y-6">
                <LabelDetail label="이름" value={user.name} />
                <LabelDetail label="아이디" value={user.loginId} />
                <LabelDetail label="생년월일" value={user.birthday} />
                <LabelDetail label="권한" value={user.role} />
                <LabelDetail label="가입일" value={user.createdAt} />
                <LabelDetail
                    label="활성화 여부"
                    value={user.isActive === "y" ? "⭕" : "❌"}
                />
            </div>
            {/* 상세보기 공통 버튼영역 */}
            <DetailActionButtons
                onBack={handleBack}
                onEdit={handleEdit}
                onDelete={handleDelete}
                backLabel="사용자 목록"
                editLabel="사용자 수정"
                deleteLabel="사용자 삭제"
            />
        </div>
    );
}

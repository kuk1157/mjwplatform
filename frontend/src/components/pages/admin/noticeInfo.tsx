import { useNavigate } from "react-router-dom";
import { UserApi } from "src/utils/userApi";
import { LabelDetail } from "src/components/atoms/labelDetail";
import { DetailActionButtons } from "src/components/organisms/detailActionButtons";

interface NoticeInfoProps {
    notice: {
        id: number; // 고유번호
        title: string; // 제목
        description: string; // 내용
        author: string; // 작성자
        createdAt: string; // 생성일
        isActive: string; // 활성화여부
    } | null;
}

export function NoticeInfo({ notice }: NoticeInfoProps) {
    const navigate = useNavigate();

    if (!notice) {
        return (
            <div className="text-gray-500 text-sm">
                공지사항 정보를 불러오는 중입니다...
            </div>
        );
    }

    // 공지사항 삭제 API 호출
    const handleDelete = async () => {
        if (!notice) return;
        if (!window.confirm("정말 공지사항을 삭제하시겠습니까?")) return;
        const id = notice.id;

        try {
            await UserApi.delete(`/api/v1/admin/notice/${id}`, {});
            alert("공지사항 삭제(비활성화)가 완료되었습니다.");
            navigate("/admin/noticeTest"); // 목록으로 이동
        } catch (err) {
            console.error("삭제 실패", err);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // 뒤로 가기 (공지사항목록 이동)
    const handleBack = () => {
        navigate("/admin/noticeTest");
    };

    // 공지사항 수정 페이지 이동
    const handleEdit = () => {
        navigate(`/admin/notice/noticeEdit/${notice.id}`);
    };

    // 공지사항 상세보기 메인 영역
    return (
        <div className="w-full bg-white p-10 rounded-xl shadow">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
                공지사항 상세 정보
            </h2>

            <div className="grid grid-cols-2 gap-x-16 gap-y-6">
                <LabelDetail label="제목" value={notice.title} />
                <LabelDetail label="내용" value={notice.description} />
                <LabelDetail label="작성자" value={notice.author} />
                <LabelDetail label="작성일" value={notice.createdAt} />
            </div>
            {/* 상세보기 공통 버튼영역 */}
            <DetailActionButtons
                onBack={handleBack}
                onEdit={handleEdit}
                onDelete={handleDelete}
                backLabel="공지사항 목록"
                editLabel="공지사항 수정"
                deleteLabel="공지사항 삭제"
            />
        </div>
    );
}

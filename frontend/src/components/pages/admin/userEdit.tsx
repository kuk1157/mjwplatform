import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserApi } from "src/utils/userApi";
import { LabelDetail } from "src/components/atoms/labelDetail";
import { SectionCard } from "../../molecules/card";
import { ActionButtons } from "src/components/organisms/actionButtons"; // 등록, 수정 공통 버튼
export function UserEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        birthday: "",
    });

    useEffect(() => {
        if (id) {
            UserApi.get(`/api/v1/admin/member/${id}`)
                .then((res) => setUser(res.data))
                .catch((err) => {
                    console.error("유저 정보를 불러오는 데 실패했습니다.", err);
                    alert("데이터 로딩 실패");
                    navigate("/admin/user"); // ← 실패 시 목록으로 이동
                });
        }
    }, [id, navigate]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                birthday: user.birthday || "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 사용자 수정
    const handleEdit = async () => {
        try {
            await UserApi.patch(`/api/v1/admin/member/${user.id}`, {
                id: user.id,
                name: formData.name,
                birthday: formData.birthday,
            });
            alert("수정이 완료되었습니다.");
            navigate(`/admin/user/userDetail/${user.id}`);
        } catch (error) {
            console.error("수정 실패", error);
            alert("사용자 수정 중 오류가 발생했습니다.");
        }
    };

    // 이전 버튼
    const handleBack = () => {
        navigate(`/admin/user/userDetail/${user.id}`);
    };

    if (!user) {
        return (
            <div className="text-gray-500 text-sm">
                사용자 정보를 불러오는 중입니다...
            </div>
        );
    }

    return (
        <SectionCard className="px-[30px]">
            <h2 className="font-[TmoneyRoundWind] font-extrabold text-[35px] leading-[50px] tracking-[-1.75px] text-[#333] md:text-[30px] pb-[50px]">
                사용자 관리
            </h2>
            <div className="w-full bg-white p-10 rounded-xl shadow">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
                    사용자 수정
                </h2>

                <div className="grid grid-cols-1 gap-y-6">
                    <LabelDetail
                        label="이름"
                        value={formData.name}
                        editable
                        name="name"
                        onChange={handleChange}
                    />
                    <LabelDetail
                        label="생년월일"
                        value={formData.birthday}
                        editable
                        name="birthday"
                        type="date"
                        onKeyDown={(e) => e.preventDefault()}
                        onChange={handleChange}
                    />
                    <LabelDetail label="아이디" value={user.loginId} />
                    <LabelDetail label="권한" value={user.role} />
                    <LabelDetail label="가입일" value={user.createdAt} />
                    <LabelDetail
                        label="활성화 여부"
                        value={user.isActive === "y" ? "⭕" : "❌"}
                    />
                </div>

                {/* 공통 버튼 영역 */}
                <ActionButtons
                    onBack={handleBack}
                    onSubmit={handleEdit}
                    submitLabel="수정 완료"
                />
            </div>
        </SectionCard>
    );
}

export default UserEdit;

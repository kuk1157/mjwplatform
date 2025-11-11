import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserApi } from "src/utils/userApi";
import { SectionCard } from "../../molecules/card";
import { LabelDetail } from "src/components/atoms/labelDetail";
import { ActionButtons } from "../../organisms/actionButtons"; // 등록, 수정 공통 버튼

export function AdminFaqCreate() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    // 이전 버튼
    const handleBack = () => {
        navigate("/admin/faq");
    };

    // FAQ 등록(파일첨부 다중 버전)
    const handleSubmit = async () => {
        if (!formData.question) {
            alert("질문을 입력해주세요.");
            return;
        }
        if (!formData.answer) {
            alert("답변을 입력해주세요.");
            return;
        }
        const form = new FormData();

        try {
            await UserApi.post("/api/v1/admin/notices", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("등록이 완료되었습니다.");
            navigate("/admin/faq");
        } catch (error) {
            alert("FAQ 등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <SectionCard className="px-[30px]">
            <h2 className="font-[TmoneyRoundWind] font-extrabold text-[35px] leading-[50px] tracking-[-1.75px] text-[#333] md:text-[30px] pb-[50px]">
                FAQ 관리
            </h2>
            <div className="w-full bg-white p-10 rounded-xl shadow">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
                    FAQ 등록
                </h2>

                <div className="grid grid-cols-1 gap-y-6">
                    <LabelDetail
                        label="질문"
                        value={formData.question}
                        editable
                        name="question"
                        onChange={handleChange}
                    />

                    <LabelDetail
                        label="답변"
                        value={formData.answer}
                        editable
                        name="answer"
                        onChange={handleChange}
                    />
                </div>
                {/* 공통 버튼 영역 */}
                <ActionButtons
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                    submitLabel="등록 완료"
                />
            </div>
        </SectionCard>
    );
}

export default AdminFaqCreate;

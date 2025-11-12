import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserApi } from "src/utils/userApi";
import { LabelDetail } from "src/components/atoms/labelDetail";
import { SectionCard } from "../../molecules/card";
import { ActionButtons } from "src/components/organisms/actionButtons"; // 등록, 수정 공통 버튼
import { FaqData } from "src/types";

export function AdminFaqEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [faq, setFaq] = useState<FaqData | null>(null);
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
    });

    useEffect(() => {
        if (id) {
            UserApi.get(`/api/v1/admin/faqs/${id}`)
                .then((res) => {
                    setFaq(res.data);
                })
                .catch((err) => {
                    console.error("FAQ 정보를 불러오는 데 실패했습니다.", err);
                    alert("데이터 로딩 실패");
                    alert(id);
                    navigate("/admin/faq"); // 실패 시 목록으로
                });
        }
    }, [id, navigate]);
    useEffect(() => {
        if (faq) {
            setFormData({
                question: faq.question || "",
                answer: faq.answer || "",
            });
        }
    }, [faq]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // FAQ 수정(첨부 에디터안엔 계속 쌓이고, 썸네일은 수정되게끔)
    const handleEdit = async () => {
        if (!formData.question) {
            alert("질문을 입력해주세요.");
            return;
        }
        if (!formData.answer) {
            alert("답변을 입력해주세요.");
            return;
        }

        try {
            await UserApi.put(`/api/v1/admin/faqs/${id}`, {
                question: formData.question,
                answer: formData.answer,
            });
            alert("수정이 완료되었습니다.");
            navigate(`/admin/faq/faqDetail/${id}`);
        } catch (error) {
            console.error("수정 실패", error);
            alert("FAQ 수정 중 오류가 발생했습니다.");
        }
    };

    // 이전 버튼
    const handleBack = () => {
        navigate(`/admin/faq/faqDetail/${id}`);
    };

    if (!faq) {
        return (
            <div className="text-gray-500 text-sm">
                FAQ 정보를 불러오는 중입니다...
            </div>
        );
    }

    return (
        <SectionCard className="px-[30px]">
            <h2 className="font-[TmoneyRoundWind] font-extrabold text-[35px] leading-[50px] tracking-[-1.75px] text-[#333] md:text-[30px] pb-[50px]">
                FAQ 관리
            </h2>
            <div className="w-full bg-white p-10 rounded-xl shadow">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
                    FAQ 수정
                </h2>

                <div className="grid grid-cols-1 gap-y-6">
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
                    <LabelDetail label="작성일" value={faq.createdAt} />
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

export default AdminFaqEdit;

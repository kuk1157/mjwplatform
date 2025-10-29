import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserApi } from "src/utils/userApi";
import { SectionCard } from "../../molecules/card";
import { DetailForm } from "../../organisms/detailForm";
import { extractBase64Data } from "src/utils/common";
import { ActionButtons } from "../../organisms/actionButtons"; // 등록, 수정 공통 버튼

export function NoticeCreate() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        thumbnail: "",
    });

    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            setThumbnailFile(file);
        }
    };

    // 이전 버튼
    const handleBack = () => {
        navigate("/admin/notice");
    };

    // 공지사항 등록(파일첨부 다중 버전)
    const handleSubmit = async () => {
        if (!formData.title) {
            alert("제목을 입력해주세요.");
            return;
        }
        if (!formData.description) {
            alert("내용을 입력해주세요.");
            return;
        }

        const form = new FormData();

        // base64 → blob 추출
        const { updatedContent, base64Data } = extractBase64Data(
            formData.description
        );

        // 가공된 텍스트(description) 적용
        form.append("title", formData.title);
        form.append("description", updatedContent);

        // 썸네일이 별도로 존재하면 추가 (선택)
        if (thumbnailFile) {
            form.append("file", thumbnailFile);
        }

        // base64 → blob 파일 변환해서 추가
        base64Data.forEach((image: { blob: Blob; width?: number }) => {
            const mimeType = image.blob.type;
            const fileExtension = mimeType.split("/")[1];
            const width = image.width;

            form.append(
                `files`,
                image.blob,
                `media${width ? `-width_${width}` : ""}.${fileExtension}`
            );
        });

        try {
            await UserApi.post("/api/v1/admin/notices", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("등록이 완료되었습니다.");
            navigate("/admin/notice");
        } catch (error) {
            alert("공지사항 등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <SectionCard className="px-[30px]">
            <h2 className="font-[TmoneyRoundWind] font-extrabold text-[35px] leading-[50px] tracking-[-1.75px] text-[#333] md:text-[30px] pb-[50px]">
                공지사항 관리
            </h2>
            <div className="w-full bg-white p-10 rounded-xl shadow">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
                    공지사항 등록
                </h2>
                <div className="grid grid-cols-1 gap-y-6">
                    <DetailForm
                        title={formData.title}
                        setTitle={(val) =>
                            setFormData((prev) => ({ ...prev, title: val }))
                        }
                        content={formData.description}
                        setContent={(val) =>
                            setFormData((prev) => ({
                                ...prev,
                                description: val,
                            }))
                        }
                        thumbnail={
                            thumbnailFile
                                ? URL.createObjectURL(thumbnailFile)
                                : undefined
                        }
                        handleInputChange={handleInputChange}
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

export default NoticeCreate;

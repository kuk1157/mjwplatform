import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserApi } from "src/utils/userApi";
import { LabelDetail } from "src/components/atoms/labelDetail";
import { SectionCard } from "../../molecules/card";
import { DetailForm } from "../../organisms/detailForm";
import { ActionButtons } from "src/components/organisms/actionButtons"; // 등록, 수정 공통 버튼
import { cdn } from "src/constans"; // 공지사항 첨부파일 경로 참조
import { noticeFolder } from "src/constans"; // 공지사항 첨부파일 경로 참조
import { updateContentsWithImages } from "src/utils/common"; // 수정 페이지에서 에디터 안에 이미지 띄우기
import { extractBase64Data } from "src/utils/common";

export function NoticeEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [notice, setNotice] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });

    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

    // 썸네일 미리보기 이미지 추출
    const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(
        undefined
    );

    // 이미지 만료 여부 체크
    // const [isExpired, setIsExpired] = useState(false); // 이미지 만료 여부 상태

    useEffect(() => {
        if (id) {
            UserApi.get(`/api/v1/notice/${id}`)
                .then((res) => {
                    setNotice(res.data);
                    // [presigned URL 값 추출 및 가공 ]
                    // // 이미지가 있으면 해당 presigned URL을 thumbnailUrl로 설정
                    // if (res.data.filePaths && res.data.filePaths.length > 0) {
                    //     // 배열 마지막 값 가져오기
                    //     const file =
                    //         res.data.filePaths[res.data.filePaths.length - 1];

                    //     setThumbnailUrl(file.preSignedUrl);

                    //     // expirationTime 체크
                    //     const currentTime = new Date().getTime();
                    //     const expirationTime = file.expirationTime; // 백엔드에서 받은 만료시간

                    //     if (currentTime > expirationTime) {
                    //         setIsExpired(true); // 만료된 경우
                    //         console.log("presigned URL 만료됨");
                    //     } else {
                    //         setIsExpired(false); // 유효한 경우
                    //     }
                    // }

                    // 에디터안에 이미지 띄우기
                    if (res.data.description && res.data.filePaths) {
                        const updatedContents = updateContentsWithImages(
                            res.data.description,
                            res.data.filePaths
                        );

                        res.data.description = updatedContents;
                    }

                    // 썸네일 미리보기 코드
                    const uuid = res.data.uuid;
                    const thumbnail = res.data.thumbnail;
                    const extension = res.data.extension;
                    if (thumbnail) {
                        // 첨부파일 최종경로
                        const fileUrl = `${cdn}/${noticeFolder}/${uuid}/${thumbnail}${extension}`;
                        setThumbnailUrl(fileUrl);
                    } else {
                        // 이미지 미리보기 경로 세팅
                        setThumbnailUrl("");
                    }
                })

                .catch((err) => {
                    console.error(
                        "공지사항 정보를 불러오는 데 실패했습니다.",
                        err
                    );
                    alert("데이터 로딩 실패");
                    alert(id);
                    navigate("/admin/noticeTest"); // 실패 시 목록으로
                });
        }
    }, [id, navigate]);
    useEffect(() => {
        if (notice) {
            setFormData({
                title: notice.title || "",
                description: notice.description || "",
            });
        }
    }, [notice]);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            setThumbnailFile(file);
            setThumbnailUrl(URL.createObjectURL(file));
        }
    };

    // 공지사항 수정(첨부 에디터안엔 계속 쌓이고, 썸네일은 수정되게끔)
    const handleEdit = async () => {
        if (!formData.title) {
            alert("제목을 입력해주세요.");
            return;
        }
        if (!formData.description) {
            alert("내용을 입력해주세요.");
            return;
        }

        const form = new FormData();
        form.append("id", notice.id);
        form.append("title", formData.title);

        // base64 → blob 추출
        const { updatedContent, base64Data } = extractBase64Data(
            formData.description
        );
        // 수정된 description 적용
        form.append("description", updatedContent);

        // 썸네일 세팅
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
            await UserApi.put("/api/v1/admin/notice", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // // 서버에서 받은 presigned URL
            // const { presignedUrl } = response.data;

            // // 이미지 확인
            // console.log("Presigned URL: ", presignedUrl);

            // const { fileUrl } = response.data;
            // // 미리보기용 이미지 세팅
            // setThumbnailUrl(fileUrl);

            alert("수정이 완료되었습니다.");
            navigate(`/admin/notice/noticeDetail/${notice.id}`);
        } catch (error) {
            console.error("수정 실패", error);
            alert("공지사항 수정 중 오류가 발생했습니다.");
        }
    };

    // 이전 버튼
    const handleBack = () => {
        navigate(`/admin/notice/noticeDetail/${notice.id}`);
    };

    if (!notice) {
        return (
            <div className="text-gray-500 text-sm">
                공지사항 정보를 불러오는 중입니다...
            </div>
        );
    }

    return (
        <SectionCard className="px-[30px]">
            <h2 className="font-[TmoneyRoundWind] font-extrabold text-[35px] leading-[50px] tracking-[-1.75px] text-[#333] md:text-[30px] pb-[50px]">
                공지사항 관리
            </h2>
            <div className="w-full bg-white p-10 rounded-xl shadow">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
                    공지사항 수정
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
                                ? URL.createObjectURL(thumbnailFile) // 로컬에서 미리보기용으로 파일 URL 생성
                                : thumbnailUrl
                            // : isExpired // 유효기간 지난경우
                            //   ? "/assets/image/time.png" // 만료될 경우 로고 넣어버리기
                            //   : thumbnailUrl // 유효할 경우 presigned URL 사용
                        }
                        handleInputChange={handleInputChange}
                    />

                    <LabelDetail label="작성자" value={notice.author} />
                    <LabelDetail label="작성일" value={notice.createdAt} />
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

export default NoticeEdit;

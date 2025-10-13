import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserApi } from "src/utils/userApi";
import { ActionButtons } from "src/components/organisms/actionButtons"; // 버튼 공통 컴포넌트 사용
import { SectionCard } from "src/components/molecules/card";
import { LabelDetail } from "src/components/atoms/labelDetail";
import { StoreDetailType } from "src/types";
import { AxiosError } from "axios";

import { cdn } from "src/constans"; // 네이버 클라우드 경로
import { storeFolder } from "src/constans"; // 매장관리 첨부파일 경로

function StoreEdit() {
    // 썸네일 관련 상태 (등록폼과 동일)
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<string | undefined>();

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setThumbnailFile(file); // 서버 업로드용 파일 저장
        const reader = new FileReader();
        reader.onloadend = () => setThumbnail(reader.result as string); // 미리보기용
        reader.readAsDataURL(file);
    };

    const [formData, setFormData] = useState({
        name: "",
        // ownerId: "",
        address: "",
    });
    const navigate = useNavigate();
    const { id } = useParams();
    const [store, setStore] = useState<StoreDetailType | null>(null);

    useEffect(() => {
        if (id) {
            UserApi.get(`/api/v1/stores/${id}`)
                .then((res) => {
                    setStore(res.data);
                    const thumbnail = res.data.thumbnail;
                    const extension = res.data.extension;
                    if (thumbnail) {
                        // 첨부파일 최종경로
                        const fileUrl = `${cdn}/${storeFolder}/${thumbnail}${extension}`;
                        setThumbnail(fileUrl);
                    } else {
                        // 이미지 미리보기 경로 세팅
                        setThumbnail("");
                    }
                })

                .catch((err) => {
                    console.error("매장 정보를 불러오는 데 실패했습니다.", err);
                    alert("데이터 로딩 실패");
                    navigate("/admin/store"); // ← 실패 시 목록으로 이동
                });
        }
    }, [id, navigate]);

    useEffect(() => {
        if (store) {
            setFormData({
                name: store.name || "",
                address: store.address || "",
            });
        }
    }, [store]);

    // 뒤로 가기 (매장목록 이동)
    const handleBack = () => {
        navigate(`/admin/store/storeDetail/${id}`);
    };

    // 매장 수정 페이지 이동
    const handleEdit = async () => {
        if (!formData.name) {
            alert("매장 이름을 입력해주세요.");
            return;
        }
        if (!formData.address) {
            alert("매장 주소를 입력해주세요.");
            return;
        }

        try {
            const form = new FormData();
            form.append("name", formData.name);
            form.append("address", formData.address);
            if (thumbnailFile) {
                // 썸네일 변경 시에만 파일 추가
                form.append("file", thumbnailFile);
            }
            await UserApi.put(`/api/v1/stores/${id}`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("매장 수정이 완료되었습니다.");
            navigate(`/admin/store/storeDetail/${id}`);
        } catch (error) {
            console.error("수정 실패", error);
            const axiosError = error as AxiosError<{ message: string }>;
            const message = axiosError.response?.data?.message; // message를 변수로
            if (message) {
                alert(message);
            } else {
                alert("매장 수정 중 오류가 발생했습니다.");
            }
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <SectionCard className="px-[30px]">
            <h2 className="font-[TmoneyRoundWind] font-extrabold text-[35px] leading-[50px] tracking-[-1.75px] text-[#333] md:text-[30px] pb-[50px]">
                매장 관리
            </h2>
            <div className="w-full bg-white p-10 rounded-xl shadow">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
                    매장 수정 정보
                </h2>

                <div className="grid gap-x-16 gap-y-6">
                    <LabelDetail label="점주 이름" value={store?.ownerName} />

                    <LabelDetail
                        label="매장 이름"
                        value={formData.name}
                        editable
                        name="name"
                        onChange={handleChange}
                    />

                    <LabelDetail
                        label="매장 주소"
                        value={formData.address}
                        editable
                        name="address"
                        onChange={handleChange}
                    />

                    {handleThumbnailChange && (
                        <div className="w-full flex items-center lg:text-sm xs:text-[13px] xs:flex-col gap-[20px]">
                            <p className="text-base font-semibold mb-5 mr-20 text-nowrap text-[#374151]">
                                썸네일
                            </p>
                            <div className="flex w-full flex-col xs:ml-6 xs:mt-5">
                                <input
                                    type="file"
                                    className="w-full border border-[#D6D6D6] rounded-[5px] max-w-[800px] p-4 mb-5"
                                    onChange={handleThumbnailChange}
                                    accept="image/*"
                                />
                                {thumbnail && (
                                    <img
                                        src={thumbnail}
                                        alt=""
                                        className="w-[400px] h-[300px] aspect-auto object-contain"
                                    />
                                )}
                                {/* presigned url 기능 주석 */}
                                {/* {thumbnail === "/assets/image/time.png" ? (
                                <span className="mt-5">유효기간 만료</span>
                            ) : (
                                <a
                                    className="w-36 border border-black rounded py-3 text-center mt-5"
                                    href={thumbnail}
                                    download
                                >
                                    이미지 다운로드
                                </a>
                            )} */}
                            </div>
                        </div>
                    )}
                    <LabelDetail label="매장 등록일" value={store?.createdAt} />
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

export default StoreEdit;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserApi } from "src/utils/userApi";
import { SectionCard } from "../../molecules/card";
import { LabelDetail } from "src/components/atoms/labelDetail"; // 첨부파일 없는 등록, 수정폼 공통
import { ActionButtons } from "../../organisms/actionButtons"; // 등록, 수정 공통 버튼
import { AxiosError } from "axios";
//import { useQuery } from "react-query";

export function StoreCreate() {
    const navigate = useNavigate();

    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<string | undefined>();

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setThumbnailFile(file); // 실제 서버 업로드용
        const reader = new FileReader();
        reader.onloadend = () => setThumbnail(reader.result as string); // 미리보기용
        reader.readAsDataURL(file);
    };

    interface Owner {
        id: number;
        name: string;
    }

    const [formData, setFormData] = useState({
        name: "",
        ownerId: "",
        address: "",
        thumbnail: "",
    });

    const [owners, setOwners] = useState<Owner[]>([]);
    const [nullOwners, setNullOwners] = useState("");

    // 점주정보만 가져오기
    const fetchOwners = async () => {
        try {
            const res = await UserApi.get("/api/v1/stores/available-owners"); // 가맹점 미보유 점주만 조회
            setOwners(res.data);
            if (!res.data || res.data.length === 0) {
                setNullOwners("선택할 점주가 없음.");
            }
        } catch (err) {
            console.error("점주 목록 가져오기 실패", err);
        }
    };

    useEffect(() => {
        fetchOwners();
    }, [nullOwners]);

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
        navigate("/admin/store");
    };

    // 매장 등록
    const handleSubmit = async () => {
        if (!formData.ownerId) {
            alert("점주를 선택해주세요.");
            return;
        }

        if (!formData.name) {
            alert("매장 이름을 입력해주세요.");
            return;
        }

        if (!formData.address) {
            alert("매장 주소를 입력해주세요.");
            return;
        }

        if (!thumbnailFile) {
            alert("썸네일을 첨부해주세요.");
            return;
        }

        const form = new FormData();
        form.append("file", thumbnailFile); // 실제 파일 업로드
        form.append("ownerId", formData.ownerId);
        form.append("name", formData.name);
        form.append("address", formData.address);
        try {
            await UserApi.post("/api/v1/stores", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("매장 등록이 완료되었습니다.");
            navigate("/admin/store");
        } catch (error) {
            console.log(error);
            const axiosError = error as AxiosError<{ message: string }>;
            const message = axiosError.response?.data?.message; // message를 변수로
            if (message) {
                alert(message);
            } else {
                alert("알 수 없는 오류가 발생했습니다.");
            }
        }
    };
    return (
        <SectionCard className="px-[30px]">
            <div className={`font-bold ${nullOwners ? "block" : "hidden"}`}>
                <p>매장 등록할 점주가 없습니다.</p>
                <p>점주를 등록 후 매장 등록해주세요.</p>
            </div>

            <h2
                className={`font-[TmoneyRoundWind] font-extrabold text-[35px] leading-[50px] tracking-[-1.75px] text-[#333] md:text-[30px] pb-[50px] ${nullOwners ? "hidden" : "block"}`}
            >
                매장 관리
            </h2>
            <div
                className={`w-full bg-white p-10 rounded-xl shadow ${nullOwners ? "hidden" : "block"}`}
            >
                <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
                    매장 등록
                </h2>
                <div className="grid grid-cols-1 gap-y-6">
                    <div className="flex items-center gap-2">
                        <span className="w-32 text-[#374151]">점주선택</span>
                        <select
                            name="ownerId"
                            value={formData.ownerId}
                            onChange={handleChange}
                            className="border border-gray-300 rounded px-2 py-2"
                        >
                            <option value="">선택</option>
                            {owners.map((owner) => (
                                <option key={owner.id} value={owner.id}>
                                    {owner.name}
                                </option>
                            ))}
                        </select>
                    </div>

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

export default StoreCreate;

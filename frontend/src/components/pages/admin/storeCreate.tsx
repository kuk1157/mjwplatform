import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserApi } from "src/utils/userApi";
import { SectionCard } from "../../molecules/card";
import { LabelDetail } from "src/components/atoms/labelDetail"; // 첨부파일 없는 등록, 수정폼 공통
import { ActionButtons } from "../../organisms/actionButtons"; // 등록, 수정 공통 버튼
import { AxiosError } from "axios";
//import { useQuery } from "react-query";

// 점주 선택 select를 위한 정보
export interface OwnerList {
    id: number;
    name?: string;
    role: "owner";
    isActive: "y";
}

export function StoreCreate() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        ownerId: "",
        address: "",
    });

    const [owners, setOwners] = useState<OwnerList[]>([]);

    // 점주정보만 가져오기
    const fetchOwners = async () => {
        try {
            const res = await UserApi.get("/api/v1/admin/member"); // 전체 member 조회 API
            const filtered = res.data.content.filter(
                (member: OwnerList) =>
                    member.role === "owner" && member.isActive === "y"
            );
            setOwners(filtered);
        } catch (err) {
            console.error("점주 목록 가져오기 실패", err);
        }
    };

    useEffect(() => {
        fetchOwners();
    }, []);

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

        try {
            await UserApi.post("/api/v1/stores", {
                ownerId: formData.ownerId,
                name: formData.name,
                address: formData.address,
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
            <h2 className="font-[TmoneyRoundWind] font-extrabold text-[35px] leading-[50px] tracking-[-1.75px] text-[#333] md:text-[30px] pb-[50px]">
                매장 관리
            </h2>
            <div className="w-full bg-white p-10 rounded-xl shadow">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
                    매장 등록
                </h2>
                <div className="grid grid-cols-1 gap-y-6">
                    <div className="flex items-center gap-2">
                        <span className="w-32">점주선택</span>
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

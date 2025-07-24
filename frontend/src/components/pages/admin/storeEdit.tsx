import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserApi } from "src/utils/userApi";
import { ActionButtons } from "src/components/organisms/actionButtons"; // 버튼 공통 컴포넌트 사용
import { SectionCard } from "src/components/molecules/card";
import { LabelDetail } from "src/components/atoms/labelDetail";
import { StoreDetailType } from "src/types";

function StoreEdit() {
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
                .then((res) => setStore(res.data))
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
    const handleEdit = () => {
        if (!formData.name) {
            alert("매장 이름을 입력해주세요.");
            return;
        }
        if (!formData.address) {
            alert("매장 주소를 입력해주세요.");
            return;
        }

        try {
            UserApi.patch(`/api/v1/stores/${id}`, {
                id: id,
                name: formData.name,
                address: formData.address,
            });
            alert("수정이 완료되었습니다.");
            navigate(`/admin/store/storeDetail/${id}`);
        } catch (error) {
            console.error("수정 실패", error);
            alert("사용자 수정 중 오류가 발생했습니다.");
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
                    매장 상세 정보
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

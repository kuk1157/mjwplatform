import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserApi } from "src/utils/userApi";
import { DetailActionButtons } from "src/components/organisms/detailActionButtons"; // 버튼 공통 컴포넌트 사용
import { SectionCard } from "src/components/molecules/card";
import { LabelDetail } from "src/components/atoms/labelDetail";
import { StoreDetailType } from "src/types";

function StoreDetail() {
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

    // 매장 삭제 API 호출
    const handleDelete = async () => {
        alert("사용할 수 없는 기능입니다.");
        return;
    };

    // 뒤로 가기 (매장목록 이동)
    const handleBack = () => {
        navigate("/admin/store");
    };

    // 매장 수정 페이지 이동
    const handleEdit = () => {
        navigate(`/admin/store/storeEdit/${id}`);
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
                    <LabelDetail label="점주 이름" value={store?.name} />
                    <LabelDetail label="매장 이름" value={store?.ownerName} />
                    <LabelDetail label="매장 주소" value={store?.address} />
                    <LabelDetail label="매장 등록일" value={store?.createdAt} />
                </div>
                {/* 상세보기 공통 버튼영역 */}
                <DetailActionButtons
                    onBack={handleBack}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    backLabel="매장 목록"
                    editLabel="매장 수정"
                    deleteLabel="사용 불가"
                />
            </div>
        </SectionCard>
    );
}

export default StoreDetail;

import { UserApi } from "src/utils/userApi";
import { SectionContainer } from "src/components/molecules/container";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatedDate } from "src/utils/common";
import { DetailActionButtons } from "src/components/organisms/detailActionButtons"; // 버튼 공통 컴포넌트 사용
import { SectionCard } from "src/components/molecules/card";
import { FaqData } from "src/types";

function AdminFaqDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [faq, setFaq] = useState<FaqData | null>(null);

    useEffect(() => {
        if (id) {
            UserApi.get(`/api/v1/admin/faqs/${id}`)
                .then((res) => setFaq(res.data))
                .catch((err) => {
                    console.error("매장 정보를 불러오는 데 실패했습니다.", err);
                    alert("데이터 로딩 실패");
                    navigate("/admin/store"); // ← 실패 시 목록으로 이동
                });
        }
    }, [id, navigate]);

    // FAQ 삭제 API 호출
    const handleDelete = async () => {
        if (!id) return;
        if (!window.confirm("정말 FAQ을 삭제하시겠습니까?")) return;

        try {
            await UserApi.delete(`/api/v1/admin/faqs/${id}`, {});
            alert("FAQ 삭제(비활성화)가 완료되었습니다.");
            navigate("/admin/faq"); // 목록으로 이동
        } catch (err) {
            console.error("삭제 실패", err);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // 뒤로 가기 (FAQ목록 이동)
    const handleBack = () => {
        navigate("/admin/faq");
    };

    // FAQ 수정 페이지 이동
    const handleEdit = () => {
        navigate(`/admin/faq/faqEdit/${id}`);
    };

    return (
        <SectionCard className="px-[30px]">
            <h2 className="font-[TmoneyRoundWind] font-extrabold text-[35px] leading-[50px] tracking-[-1.75px] text-[#333] md:text-[30px] pb-[50px]">
                FAQ 관리
            </h2>
            <SectionContainer className="pt-[100px] pb-[150px] lg:px-[20px]">
                <section className="flex flex-col w-full mt-[100px]">
                    <div className="text-[19px] text-[#333333] font-bold tracking-[-0.32px] leading-[23px] bg-[#F6F6F6] py-[18.5px] px-[45px] border-y border-y-[#666666] lg:px-[25px] md:text-[18px] xs:text-[16px]">
                        질문 : {faq?.question}
                    </div>
                    <div className="flex justify-between py-[19.5px] px-[45px] text-[#666666] tracking-[-0.32px] leading-[19px] md:text-[15px] lg:px-[25px] xs:text-[14px]">
                        <p>
                            등록일 :{" "}
                            {faq?.createdAt && formatedDate(faq?.createdAt)}
                        </p>
                    </div>
                    <div className="whitespace-pre-wrap text-[16px] text-[#333333] tracking-[-0.32px] leading-[30px] pt-[30.5px] pb-[50px] px-[45px] border-y border-b-[#666666] md:text-[15px] xs:text-[14px] lg:px-[25px]">
                        답변 : {faq?.answer}
                    </div>
                    {/* 상세보기 공통 버튼영역 */}
                    <DetailActionButtons
                        onBack={handleBack}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        backLabel="FAQ 목록"
                        editLabel="FAQ 수정"
                        deleteLabel="FAQ 삭제"
                    />
                </section>
            </SectionContainer>
        </SectionCard>
    );
}

export default AdminFaqDetail;

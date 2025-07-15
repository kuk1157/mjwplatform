// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { UserApi } from "src/utils/userApi";
// import { NoticeInfo } from "./noticeInfo"; // 사용자 정보 렌더링 컴포넌트
// import { SectionCard } from "../../molecules/card";
// // import { UserActionButtons } from "./UserActionButtons"; // 수정/삭제/뒤로가기 버튼

// function NoticeDetailPage() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [notice, setUser] = useState<any>(null);

//     useEffect(() => {
//         if (id) {
//             UserApi.get(`/api/v1/notice/${id}`)
//                 .then((res) => setUser(res.data))
//                 .catch((err) => {
//                     console.error(
//                         "공지사항 정보를 불러오는 데 실패했습니다.",
//                         err
//                     );
//                     alert("데이터 로딩 실패");
//                     navigate("/admin/noticeTest"); // 실패 시 목록으로
//                 });
//         }
//     }, [id, navigate]);

//     return (
//         <SectionCard className="px-[30px]">
//             <h2 className="font-[TmoneyRoundWind] font-extrabold text-[35px] leading-[50px] tracking-[-1.75px] text-[#333] md:text-[30px] pb-[50px]">
//                 공지사항 관리
//             </h2>
//             <NoticeInfo notice={notice} />
//         </SectionCard>
//     );
// }

// export default NoticeDetailPage;

//// 기존 공지사항 상세정보

import { UserApi } from "src/utils/userApi";
import { SectionContainer } from "src/components/molecules/container";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatedDate, updateContentsWithImages } from "src/utils/common";
import i18n from "src/language";
import { useQuery } from "react-query";
import axios from "axios";
import { DetailActionButtons } from "src/components/organisms/detailActionButtons"; // 버튼 공통 컴포넌트 사용
import { SectionCard } from "src/components/molecules/card";
import parse from "html-react-parser"; // 기존코드에 필요함. HTML 가공
interface DataType {
    id?: number;
    title?: string;
    description?: string;
    uuid?: string; // 공지사항 UUID
    thumbnail?: string; // 첨부파일 썸네일(UUID)
    extension?: string; // 첨부파일 확장자
    view?: number;
    createdAt?: string;
}

function NoticeDetailPage() {
    const currentLanguage = i18n.language;
    const navigate = useNavigate();
    const { id } = useParams();

    const [detailData, setDetailData] = useState<DataType>({});

    const { data: noticeDetail } = useQuery({
        queryKey: ["noticeDetail", id],
        queryFn: async () => {
            const url = `/api/v1/notice/${id}?lang=${currentLanguage}`;
            const res = await axios.get(url);

            if (res.data.description && res.data.filePaths) {
                const updatedContents = updateContentsWithImages(
                    res.data.description,
                    res.data.filePaths
                );

                res.data.description = updatedContents;
            }
            return res.data;
        },
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        axios.put(`/api/v1/notice/view/${id}`).then((res) => {
            setDetailData((prevData) => ({ ...prevData, view: res.data.view }));
        });
    }, [id]);

    useEffect(() => {
        console.log(noticeDetail);
        setDetailData(noticeDetail);
    }, [noticeDetail]);

    // 공지사항 삭제 API 호출
    const handleDelete = async () => {
        if (!id) return;
        if (!window.confirm("정말 공지사항을 삭제하시겠습니까?")) return;

        try {
            await UserApi.delete(`/api/v1/admin/notice/${id}`, {});
            alert("공지사항 삭제(비활성화)가 완료되었습니다.");
            navigate("/admin/noticeTest"); // 목록으로 이동
        } catch (err) {
            console.error("삭제 실패", err);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // 뒤로 가기 (공지사항목록 이동)
    const handleBack = () => {
        navigate("/admin/noticeTest");
    };

    // 공지사항 수정 페이지 이동
    const handleEdit = () => {
        navigate(`/admin/notice/noticeEdit/${id}`);
    };

    return (
        <SectionCard className="px-[30px]">
            <h2 className="font-[TmoneyRoundWind] font-extrabold text-[35px] leading-[50px] tracking-[-1.75px] text-[#333] md:text-[30px] pb-[50px]">
                공지사항 관리
            </h2>
            <SectionContainer className="pt-[100px] pb-[150px] lg:px-[20px]">
                <section className="flex flex-col w-full mt-[100px]">
                    <div className="text-[19px] text-[#333333] font-bold tracking-[-0.32px] leading-[23px] bg-[#F6F6F6] py-[18.5px] px-[45px] border-y border-y-[#666666] lg:px-[25px] md:text-[18px] xs:text-[16px]">
                        {detailData?.title}
                    </div>
                    <div className="flex justify-between py-[19.5px] px-[45px] text-[#666666] tracking-[-0.32px] leading-[19px] md:text-[15px] lg:px-[25px] xs:text-[14px]">
                        <p>
                            {detailData?.createdAt &&
                                formatedDate(detailData?.createdAt)}
                        </p>
                        <p>{detailData?.view}</p>
                    </div>
                    <div className="whitespace-pre-wrap text-[16px] text-[#333333] tracking-[-0.32px] leading-[30px] pt-[30.5px] pb-[50px] px-[45px] border-y border-b-[#666666] md:text-[15px] xs:text-[14px] lg:px-[25px]">
                        {detailData?.description
                            ? parse(detailData?.description)
                            : ""}
                    </div>
                    {/* 상세보기 공통 버튼영역 */}
                    <DetailActionButtons
                        onBack={handleBack}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        backLabel="공지사항 목록"
                        editLabel="공지사항 수정"
                        deleteLabel="공지사항 삭제"
                    />
                </section>
            </SectionContainer>
        </SectionCard>
    );
}

export default NoticeDetailPage;

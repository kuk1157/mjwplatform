import { useTranslation } from "react-i18next";
import { SectionContainer } from "../molecules/container";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatedDate, updateContentsWithImages } from "src/utils/common";
import i18n from "src/language";
import { useQuery } from "react-query";
import axios from "axios";
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

interface NextPrevDataType {
    id: number;
    title: string;
}

function NoticeDetailPage() {
    const { t } = useTranslation(["notice"]);
    const currentLanguage = i18n.language;
    const navigate = useNavigate();
    const { id } = useParams();

    const [detailData, setDetailData] = useState<DataType>({});
    const [prevData, setPrevData] = useState<NextPrevDataType | null>();
    const [nextData, setNextData] = useState<NextPrevDataType | null>();

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
        setPrevData(noticeDetail?.prevNotice);
        setNextData(noticeDetail?.nextNotice);
    }, [noticeDetail]);

    return (
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
                <div className="flex justify-between mt-[26px] text-[20px] lg:text-[18px] xs:text-[16px]">
                    <div className="flex gap-[10px]">
                        <button
                            onClick={() => {
                                if (!prevData) return alert(t(`first_page`));
                                navigate(`/notice/${prevData?.id}`);
                            }}
                            className="px-[41px] py-[13px] text-[#FFFFFF] leading-[24px] rounded-[5px] bg-[#008E80] md:text-[15px] xs:text-[14px]"
                        >
                            {t(`detail_prev`)}
                        </button>
                        <button
                            onClick={() => {
                                if (!nextData) return alert(t(`last_page`));
                                navigate(`/notice/${nextData?.id}`);
                            }}
                            className="px-[41px] py-[13px] text-[#FFFFFF] leading-[24px] rounded-[5px] bg-[#008E80] md:text-[15px] xs:text-[14px]"
                        >
                            {t(`detail_next`)}
                        </button>
                    </div>
                    <button
                        onClick={() => navigate("/notice")}
                        className="px-[49.5px] py-[13px] text-[#FFFFFF] leading-[24px] rounded-[5px] bg-[#008E80] md:text-[15px] xs:text-[14px]"
                    >
                        {t(`detail_to_list`)}
                    </button>
                </div>
            </section>
        </SectionContainer>
    );
}

export default NoticeDetailPage;

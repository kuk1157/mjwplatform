import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import parse from "html-react-parser"; // 기존코드에 필요함. HTML 가공

// [파일 첨부 경로]
import { cdn } from "src/constans"; // 파일첨부 경로(네이버클라우드)
import { noticeFolder } from "src/constans"; // 첨부 디렉토리 경로 notice

// [아이콘 및 공통 컴포넌트]
import { CiImageOff } from "react-icons/ci"; // 데이터없음 아이콘
import { MdArrowBackIosNew } from "react-icons/md"; // 이전 페이지이동 좌측 화살표 아이콘
import { formatedDate } from "src/utils/common";
import { MobileMain } from "src/components/organisms/mobileMain"; // 모바일 상단 타이틀
import { MobileFooter } from "src/components/organisms/mobileFooter"; // 하단 모바일 footer 공통 컴포넌트
import { MobileFooter2 } from "src/components/organisms/mobileFooter2"; // 하단 모바일 footer 공통 컴포넌트

// [공통 데이터 인터페이스]
import { NoticeDetail } from "src/types"; // 공지사항 인터페이스

export function MobileNoticeDetail() {
    const navigate = useNavigate();
    const { id } = useParams(); // 공지사항 id
    const customerId = localStorage.getItem("customerId"); // 고객 번호 localStroage
    const [notice, setNotice] = useState<NoticeDetail>(); // 공지사항 데이터 세팅

    // 방문 스탬프, 가맹점 상세보기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [noticeDetail] = await Promise.all([
                    axios.get(`/api/v1/notice/${id}`),
                ]);
                setNotice(noticeDetail.data); // 공지사항 추출
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };
        fetchData();
    }, [id]);

    const handleBack = () => {
        navigate(-1); // 뒤로 가기
    };

    return (
        <div className="min-h-screen bg-white p-4">
            {/* 모바일 타이틀 */}
            {<MobileMain param={Number(customerId)} />}

            <div className="mt-8 mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <button
                        className="w-full flex items-center justify-between"
                        onClick={handleBack}
                    >
                        <h2 className="text-2xl font-semibold font-Pretendard flex items-center">
                            <span className="mr-2">
                                <MdArrowBackIosNew />
                            </span>
                            <span>공지사항 상세보기</span>
                        </h2>
                    </button>
                </div>
            </div>
            {notice ? (
                <div>
                    <div className=" px-3 py-3 mb-3 flex items-center">
                        <div className="w-full flex justify-center items-center">
                            {notice.thumbnail ? (
                                <img
                                    src={`${cdn}/${noticeFolder}/${notice.thumbnail}${notice.extension}`}
                                    alt={notice.title}
                                />
                            ) : (
                                <span className="p-6 text-xl text-center">
                                    <p>썸네일 없음</p>
                                    <p className="text-center inline-block mt-3">
                                        <CiImageOff />
                                    </p>
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm shadow-[rgb(92, 123, 185, 0.102)] border border-[#580098] mb-3 flex items-center">
                        <div className="flex flex-col font-Pretendard min-w-0 w-full">
                            <p className="text-sm text-[#000] px-5 pt-4">
                                <p>[제목]</p>
                                {notice.title}
                            </p>
                            <span className="border-b my-5 w-full border-[#580098]"></span>
                            <p className="flex px-5 pb-4">
                                <span className="truncate w-full">
                                    <p className="text-base ">
                                        [내용]
                                        {notice?.description
                                            ? parse(notice?.description)
                                            : ""}
                                    </p>
                                    <p className="text-sm text-[#000] mt-2">
                                        <p>[작성일]</p>
                                        {notice?.createdAt &&
                                            formatedDate(notice?.createdAt)}
                                    </p>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-gray-400">공지사항 정보를 불러오는 중...</p>
            )}

            {/* 하단 네비게이션 */}
            {customerId ? <MobileFooter /> : <MobileFooter2 />}
        </div>
    );
}
export default MobileNoticeDetail;

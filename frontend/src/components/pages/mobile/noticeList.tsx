import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

// [파일 첨부 경로]
import { cdn } from "src/constans"; // 파일첨부 경로(네이버클라우드)
import { noticeFolder } from "src/constans"; // 첨부 디렉토리 경로 stroe

// [아이콘 및 공통 컴포넌트]
import { MdArrowBackIosNew } from "react-icons/md"; // 이전 페이지이동 좌측 화살표 아이콘
import { MobileMain } from "src/components/organisms/mobileMain"; // 모바일 상단 타이틀
import { MobileFooter } from "src/components/organisms/mobileFooter"; // 하단 모바일 footer 공통 컴포넌트
import { MobileFooter2 } from "src/components/organisms/mobileFooter2"; // 하단 모바일 footer 공통 컴포넌트

// [공통 데이터 인터페이스]
import { NoticeDetail } from "src/types"; // 공지사항 인터페이스

export function MobileNoticeList() {
    const navigate = useNavigate();
    const customerId = localStorage.getItem("customerId");
    const [notices, setNotice] = useState<NoticeDetail[]>([]); // 공지사항 데이터 세팅

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [noticeList] = await Promise.all([
                    axios.get("/api/v1/notice"),
                ]);
                setNotice(noticeList.data.content); // 공지사항 추출
            } catch (error) {
                console.error("데이터 조회 실패:", error);
            }
        };

        fetchData();
    }, [customerId]);
    const handleBack = () => {
        navigate(-1); // 뒤로 가기
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="p-4 mb-20">
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
                                <span>공지사항 목록</span>
                            </h2>
                        </button>
                    </div>
                </div>

                {/* NFT 목록 */}
                <section>
                    {notices.length > 0 ? (
                        notices.map((notice, idx) => {
                            return (
                                <Link
                                    to={`/mobile/noticeDetail/${notice.id}`}
                                    key={idx}
                                >
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-3 flex items-center">
                                        <div className="flex items-center w-full">
                                            {notice.thumbnail ? (
                                                <img
                                                    src={`${cdn}/${noticeFolder}/${notice.thumbnail}${notice.extension}`}
                                                    alt={`${notice.title}`}
                                                    className="w-12 h-12 rounded-md object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src="/assets/image/time.png"
                                                    alt={`${notice.title}`}
                                                    className="w-12 h-12 rounded-md object-cover"
                                                />
                                            )}
                                            <div className="flex flex-col ml-3 font-Pretendard min-w-0">
                                                <p className="text-base font-semibold mb-1 truncate">
                                                    {notice.title}
                                                </p>
                                                <p className="text-sm mb-1 text-[#999CA2]">
                                                    {notice.createdAt?.replace(
                                                        "T",
                                                        " "
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center  text-[#999ca2]">
                            <img
                                src="/assets/image/mobile/noVisitIcon.svg"
                                alt="스탬프가 없습니다 아이콘"
                            />
                            <p className="text-lg font-semibold mt-2">
                                공지사항이 없습니다.
                            </p>
                            <p className="text-sm font-light mt-1">
                                공지사항이 등록되면 이곳에 표시됩니다.
                            </p>
                        </div>
                    )}
                </section>
            </div>

            {/* 하단 네비게이션 */}
            {customerId ? <MobileFooter /> : <MobileFooter2 />}
        </div>
    );
}
export default MobileNoticeList;

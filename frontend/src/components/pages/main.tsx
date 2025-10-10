import { MainContainer } from "../molecules/container";
function MainPage() {
    return (
        <MainContainer className="bg-[#FFF] py-[100px] lg:py-[150px] sm:py-[100px] xs:py-[60px]">
            <div className="w-full">
                <div className="w-full bg-[#FFF] p-6">
                    <div className="w-[1700px] mx-auto p-4">
                        {/* 첫번째 영역 */}
                        <div className="w-full flex">
                            {/* 메인 슬라이드 영역 */}
                            <div className="mr-3">
                                <img
                                    src="/public/assets/image/mainTitle.png"
                                    alt="메인 타이틀 슬라이드 이미지"
                                ></img>
                            </div>

                            {/* 포인트 영역 */}
                            <div className="w-[400px] h-[449px] mx-3 flex flex-col border border-[#580098] rounded-xl text-lg font-bold shadow-xl">
                                <div className="flex justify-between border-b border-[#580098] p-5">
                                    <span>현재 보유 포인트</span>
                                    <span className="text-[#580098]">
                                        13,500P
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex justify-between border-b border-[#580098] p-5">
                                        <div className="flex flex-col">
                                            <span>현재 나의 등급</span>
                                            <span className="mt-3">
                                                일반 회원
                                            </span>
                                        </div>
                                        <div className="flex items-end">
                                            <span className="text-[#A19CB4] text-sm font-normal">
                                                적립률 3%
                                            </span>
                                            <span>
                                                <img
                                                    src="/public/assets/image/mainNft.png"
                                                    alt="영수증"
                                                    className="block"
                                                />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div>최근 결제 내역</div>
                                        <div className="flex flex-col bg-[#ededed] rounded-lg p-4 mt-2 text-sm font-semibold">
                                            <span>금액 : 15,000원</span>
                                            <span>
                                                시간 : 2025.10.10 14:02:17
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 첫번째 영역 */}
                        <div className="w-full flex mt-16">
                            {/* 가맹점 슬라이드 영역 */}
                            <div className="w-[1600px]">
                                <img
                                    src="/public/assets/image/mainStore.png"
                                    alt="가맹점 슬라이드 이미지"
                                ></img>
                            </div>
                        </div>

                        {/* 세번째 영역 */}
                        <div className="w-full flex mt-16">
                            {/* 게시판 영역 */}
                            <div className="w-[800px] mx-3 flex flex-col border border-[#580098] rounded-xl text-lg font-bold shadow-xl">
                                <div className="flex justify-between border-b border-[#580098] p-5 text-2xl">
                                    <span>공지사항</span>
                                </div>
                                <div className="flex flex-col p-5 font-normal">
                                    <div className="flex flex-col">
                                        <div className="flex p-2 border-b border-[#580098] ">
                                            <span className="bg-[#580098] w-14 text-[#fff] text-center rounded-md mr-4">
                                                안내
                                            </span>
                                            <span>
                                                웹 사이트 주소가 변경
                                                되었습니다.
                                            </span>
                                        </div>
                                        <div className="flex p-2 border-b border-[#580098]">
                                            <span className="bg-[#580098] w-14 text-[#fff] text-center rounded-md mr-4">
                                                안내
                                            </span>
                                            <span>
                                                메인페이지엔 3개의 공지사항만 볼
                                                수 있습니다.
                                            </span>
                                        </div>
                                        <div className="flex p-2">
                                            <span className="bg-[#580098] w-14 text-[#fff] text-center rounded-md mr-4">
                                                공지
                                            </span>
                                            <span>
                                                동터 상인회 전체 이번 한달
                                                쉽니다. 그동안 너무 고생해서요.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 버튼 영역 */}
                            <div className="w-[850px] text-xl flex">
                                <button className="w-[180px] p-5 mx-2 bg-[#580098] rounded-xl text-[#fff] flex flex-col items-center justify-center">
                                    <img
                                        src="/public/assets/image/mainbutton1.svg"
                                        alt="영수증"
                                        className="block"
                                    />
                                    <span className="mt-2 text-center">
                                        영수증
                                    </span>
                                </button>

                                <button className="w-[180px] p-5 mx-2 bg-[#580098] rounded-xl text-[#fff] flex flex-col items-center justify-center">
                                    <img
                                        src="/public/assets/image/mainbutton2.svg"
                                        alt="적립내역"
                                        className="block"
                                    />
                                    <span className="mt-2 text-center">
                                        적립내역
                                    </span>
                                </button>

                                <button className="w-[180px] p-5 mx-2 bg-[#580098] rounded-xl text-[#fff] flex flex-col items-center justify-center">
                                    <img
                                        src="/public/assets/image/mainbutton3.svg"
                                        alt="레이아웃"
                                        className="block"
                                    />
                                    <span className="mt-2 text-center">
                                        레이아웃
                                    </span>
                                </button>

                                <button className="w-[180px] p-5 mx-2 bg-[#580098] rounded-xl text-[#fff] flex flex-col items-center justify-center">
                                    <img
                                        src="/public/assets/image/mainbutton4.svg"
                                        alt="레이아웃"
                                        className="block"
                                    />
                                    <span className="mt-2 text-center">
                                        레이아웃
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-full mx-auto p-4 ">
                        {/* 메인 슬라이드 및 포인트 영역 */}
                        <div></div>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}

export default MainPage;

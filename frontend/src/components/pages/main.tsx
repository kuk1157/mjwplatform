import { MainContainer } from "../molecules/container";
import { useEffect } from "react";
import { useRecoilValueLoadable } from "recoil";
import { userSelectorUpdated } from "src/recoil/userState";
import { useNavigate } from "react-router-dom";

function MainPage() {
    const { contents: user } = useRecoilValueLoadable(userSelectorUpdated);
    const navigate = useNavigate();

    const ownerId = user.id;
    const userRole = user.role;

    // 점주(owner) 권한일 경우에 바로 dashBoard 페이지로 이동
    // ownerId 물려주기
    useEffect(() => {
        if (userRole === "owner") {
            navigate(`/owner/dashBoard/${ownerId}`);
            return;
        }
    }, [userRole, ownerId, navigate]);

    // const TestPostcash = async () => {
    //     try {
    //         const cashInput = document.querySelector(
    //             ".cashInput"
    //         ) as HTMLInputElement | null;

    //         const memberId = user.id;
    //         const requestNumber = Number(requestPrice);

    //         if (!requestPrice) {
    //             alert("현금 신청할 금액을 입력해주세요.");
    //             if (cashInput) {
    //                 setRequestPrice("");
    //             }
    //             return;
    //         }

    //         if (requestNumber <= 0) {
    //             alert("0원이나 (-) 금액은 입력할 수 없습니다.");
    //             if (cashInput) {
    //                 setRequestPrice("");
    //             }
    //             return;
    //         }

    //         if (user.totalPoint <= requestNumber) {
    //             alert("현금 신청할 금액은 보유포인트보다 클 수 없습니다.");
    //             if (cashInput) {
    //                 setRequestPrice("");
    //             }
    //             return;
    //         }

    //         const url = `/api/v1/pointCashOutRequest/${memberId}`;
    //         const response = await axios.post(url, {
    //             cash: requestNumber,
    //             headers: { "Content-Type": "application/json" },
    //         });
    //         alert(`${requestNumber}포인트 현금화 신청이 완료 되었습니다.`);
    //         navigate(0);
    //         console.log("현금 신청 결과:", response.data);
    //     } catch (error) {
    //         console.error("현금 신청 실패:", error);
    //     }
    // };

    const QrVisit = () => {
        navigate("/testVisit");
    };

    const StoreVisit = () => {
        navigate("/storeVisit");
    };

    return (
        <MainContainer className="py-[230px] bg-[#F6F6F6] lg:py-[150px] sm:py-[100px]">
            <div>메인페이지</div>
            {/* 임시 버튼 웹 플랫폼 api 호출 확인용 */}
            <div className="space-y-6 max-w-md mx-auto mt-12">
                <button
                    onClick={QrVisit}
                    className="flex items-center justify-center gap-3 bg-white rounded-xl shadow p-4 hover:bg-gray-50 transition w-full"
                    type="button"
                >
                    <span className="text-2xl">📱</span>
                    <span className="text-lg font-semibold text-gray-900">
                        QR 인증하러 가기
                    </span>
                </button>

                <button
                    onClick={StoreVisit}
                    className="flex items-center justify-center gap-3 bg-white rounded-xl shadow p-4 hover:bg-gray-50 transition w-full"
                    type="button"
                >
                    <span className="text-2xl">💵</span>
                    <span className="text-lg font-semibold text-gray-900">
                        금액 입력하러 가기
                    </span>
                </button>
            </div>
            {/* 임시주석 */}
            {/* <div className="bg-white p-4">
                <p>[ 점주 보유 포인트 : {user.totalPoint} ]</p>
                <p>[ 점주 보유 현금 : {user.totalCash} ]</p>
                <p className="my-2">
                    <input
                        type="number"
                        placeholder="현금화 신청 금액 입력"
                        value={requestPrice}
                        onChange={(e) => setRequestPrice(e.target.value)}
                        className="border p-1 mr-2 cashInput"
                    />
                </p>
                <button
                    className="bg-slate-400 p-2"
                    type="button"
                    onClick={TestPostcash}
                >
                    점주 현금화 신청(완료✅)
                </button>
            </div> */}
        </MainContainer>
    );
}

export default MainPage;

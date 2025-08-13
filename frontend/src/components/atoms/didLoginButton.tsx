import axios from "axios";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

// (window as any) 캐스팅 우회
declare global {
    interface Window {
        daeguIdLogin: () => void;
        didLogin: {
            loginPopup: (data: any) => void;
        };
        handleDidLogin: (returnData: string) => void;
        goReturnUrl: (data: any, url: string, callbackFunc?: string) => void;
    }
}

interface DidLoginButtonProps {
    storeNum?: number;
    tableNumber?: number;
}

const DidLoginButton = ({ storeNum, tableNumber }: DidLoginButtonProps) => {
    useEffect(() => {
        // 다대구 로그인 콜백 등록
        window.handleDidLogin = async (
            returnData: string | { returnData?: string }
        ) => {
            console.log("returnData", returnData);
            try {
                const response = await axios.post(
                    `/api/v1/auth/did/${storeNum}/${tableNumber}`,
                    {
                        returnData:
                            // returnData가 문자열인 경우 그대로 사용
                            // backend에서 JSON으로 변환 RequestBody를 처리할 수 있도록
                            typeof returnData === "string"
                                ? returnData
                                : JSON.stringify(returnData),
                    }
                );

                const userRole = response.data.auth.role;
                if (userRole != "user") {
                    alert("고객만 연동 로그인이 가능합니다.");
                    return;
                }

                localStorage.clear();
                localStorage.setItem("tokenType", response.data.tokenType);
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem(
                    "refreshToken",
                    response.data.refreshToken
                );

                const customerId = response.data.customerId; // customerId 변수 추가
                window.location.replace(`/mobile/myPage/${customerId}`); // 여기에 customerId 넣기
            } catch (err) {
                console.error("다대구 로그인 실패", err);
                alert("다대구 로그인에 실패했습니다. 다시 시도해 주세요.");
            }
        };

        // didLogin.js 로딩 대기
        let retries = 10;
        const interval = setInterval(() => {
            if (window.didLogin) {
                clearInterval(interval);
                console.log(
                    "didLogin.js 로딩 완료, daeguIdLogin 함수 등록 중..."
                );

                window.daeguIdLogin = () => {
                    const data = {
                        siteId: "AuyVJfyBUnUGcFzqSih27NT",
                        //requiredVC: "DaeguMasterVC", // 전체
                        requiredVC: "Name", // DID와 CI는 기본 포함
                        subVC: "",
                        //returnUrl: "/api/v1/auth/did",
                        callbackFunc: "handleDidLogin",
                    };
                    window.didLogin.loginPopup(data);
                };
            } else {
                retries--;
                if (retries <= 0) {
                    clearInterval(interval);
                    console.error("didLogin.js is not loaded!");
                }
            }
        }, 300);
    }, [storeNum, tableNumber]);

    return (
        <>
            <Helmet>
                <script src="https://code.jquery.com/jquery-3.6.0.min.js" />
                <script src="/js/didLogin.js" />
            </Helmet>

            <button onClick={() => window.daeguIdLogin()}>
                <img
                    src="/assets/image/did/icon_5.png"
                    alt="Daegu ID Logo"
                    className="object-contain"
                />
            </button>
        </>
    );
};

export default DidLoginButton;

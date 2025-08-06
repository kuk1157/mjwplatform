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
    }
}

const DidLoginButton = () => {
    useEffect(() => {
        // 다대구 로그인 콜백 등록
        window.handleDidLogin = async (
            returnData: string | { returnData?: string }
        ) => {
            console.log("returnData", returnData);
            try {
                const response = await axios.post("/api/v1/auth/did", {
                    returnData:
                        // returnData가 문자열인 경우 그대로 사용
                        // backend에서 JSON으로 변환 RequestBody를 처리할 수 있도록
                        typeof returnData === "string"
                            ? returnData
                            : JSON.stringify(returnData),
                });

                console.log("response", response.data);

                localStorage.clear();
                localStorage.setItem("tokenType", response.data.tokenType);
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem(
                    "refreshToken",
                    response.data.refreshToken
                );
                window.location.replace("/");
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
    }, []);

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

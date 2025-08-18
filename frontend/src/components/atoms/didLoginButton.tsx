import { useEffect, useState } from "react";
import axios from "axios";

// 타입 확장
declare global {
    interface Window {
        daeguIdLogin: () => void;
        didLogin?: {
            loginPopup: (data: any) => void;
        };
        handleDidLogin: (returnData: string) => void;
    }
}

interface DidLoginButtonProps {
    storeNum?: number;
    tableNumber?: number;
}

const DidLoginButton = ({ storeNum, tableNumber }: DidLoginButtonProps) => {
    const [ready, setReady] = useState(false); // 스크립트 로딩 완료 상태

    useEffect(() => {
        // 로그인 처리 콜백 등록
        window.handleDidLogin = async (
            returnData: string | { returnData?: string }
        ) => {
            console.log("returnData", returnData);
            try {
                const response = await axios.post(
                    `/api/v1/auth/did/${storeNum}/${tableNumber}`,
                    {
                        returnData:
                            typeof returnData === "string"
                                ? returnData
                                : JSON.stringify(returnData),
                    }
                );

                const userRole = response.data.auth.role;
                if (userRole !== "user") {
                    alert("고객만 연동 로그인이 가능합니다.");
                    return;
                }

                localStorage.clear();
                localStorage.setItem("tokenType", response.data.auth.tokenType);
                localStorage.setItem(
                    "accessToken",
                    response.data.auth.accessToken
                );
                localStorage.setItem(
                    "refreshToken",
                    response.data.auth.refreshToken
                );

                const customerId = response.data.customerId;
                window.location.replace(`/mobile/mainPage/${customerId}`);
            } catch (err) {
                console.error("다대구 로그인 실패", err);
                alert("다대구 로그인에 실패했습니다. 다시 시도해 주세요.");
            }
        };

        // 스크립트 로드 유틸 함수
        const loadScript = (src: string) =>
            new Promise<void>((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve(); // 이미 로드된 경우
                    return;
                }
                const script = document.createElement("script");
                script.src = src;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject(`Failed to load ${src}`);
                document.body.appendChild(script);
            });

        const initDidLogin = async () => {
            try {
                await loadScript("https://code.jquery.com/jquery-3.6.0.min.js");
                console.log("jQuery loaded");

                await loadScript("/js/didLogin.js");
                console.log("didLogin.js loaded");

                if (window.didLogin) {
                    // 이제 버튼 클릭 가능
                    window.daeguIdLogin = () => {
                        const data = {
                            siteId: "AuyVJfyBUnUGcFzqSih27NT",
                            requiredVC: "Name",
                            subVC: "",
                            callbackFunc: "handleDidLogin",
                        };
                        window.didLogin?.loginPopup(data);
                    };
                    setReady(true); // 버튼 활성화
                } else {
                    console.error("window.didLogin is still undefined!");
                }
            } catch (err) {
                console.error("스크립트 로딩 실패:", err);
            }
        };

        initDidLogin();
    }, [storeNum, tableNumber]);

    return (
        <button
            onClick={() => ready && window.daeguIdLogin?.()}
            className={`cursor-pointer ${!ready ? "opacity-50 pointer-events-none" : ""}`}
        >
            <img
                src="/assets/image/did/icon_5.png"
                alt="Daegu ID Logo"
                className="object-contain"
            />
        </button>
    );
};

export default DidLoginButton;

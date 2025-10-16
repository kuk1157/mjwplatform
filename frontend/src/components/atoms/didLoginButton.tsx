import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "src/utils/loadingSpinner";

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
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        // 로그인 처리 콜백 등록
        window.handleDidLogin = async (
            returnData: string | { returnData?: string }
        ) => {
            console.log("returnData", returnData);
            try {
                setLoading(true); // 스피너 켜기
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
                if (userRole != "user") {
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

                const customerId = response.data.customerId; // customerId 변수 추가
                localStorage.setItem("customerId", customerId); // 권한별 분기처리를 위한 고객 고유번호 저장
                window.location.replace("/mobile/mainPage"); // 여기에 customerId 넣기
            } catch (err) {
                console.error("다대구 로그인 실패", err);
                alert("다대구 로그인에 실패했습니다. 다시 시도해 주세요.");
                setLoading(false); // 스피너 끄기
            }
        };

        // 스크립트 로드 유틸 함수
        const loadScript = (src: string) =>
            new Promise<void>((resolve, reject) => {
                const script = document.createElement("script");
                script.src = src;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject(`Failed to load ${src}`);
                document.body.appendChild(script);
            });

        // jQuery → didLogin.js 순서대로 로드
        (async () => {
            try {
                await loadScript("https://code.jquery.com/jquery-3.6.0.min.js");
                console.log("jQuery loaded");

                await loadScript("/js/didLogin.js");
                console.log("didLogin.js loaded");

                if (window.didLogin) {
                    window.daeguIdLogin = () => {
                        const data = {
                            siteId: "AuyVJfyBUnUGcFzqSih27NT",
                            requiredVC: "Name", // DID와 CI는 기본 포함
                            subVC: "",
                            callbackFunc: "handleDidLogin",
                        };
                        window.didLogin?.loginPopup(data);

                        // Fallback: 앱이 없을 때 스토어로 이동
                        const timer = setTimeout(() => {
                            if (/Android/i.test(navigator.userAgent)) {
                                window.location.href =
                                    "https://play.google.com/store/apps/details?id=com.dreamsecurity.daegudid";
                            } else if (
                                /iPhone|iPad|iPod/i.test(navigator.userAgent)
                            ) {
                                window.location.href =
                                    "https://apps.apple.com/kr/app/%EB%8B%A4%EB%8C%80%EA%B5%AC/id1565818679";
                            }
                        }, 1200);

                        document.addEventListener("visibilitychange", () => {
                            if (document.hidden) {
                                clearTimeout(timer);
                            }
                        });
                    };
                } else {
                    console.error("window.didLogin is still undefined!");
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, [storeNum, tableNumber]);

    const loginClick = () => {
        window.daeguIdLogin?.();
    };

    return (
        <>
            {loading && <LoadingSpinner />}
            <button
                onClick={loginClick}
                className="cursor-pointer relative z-10"
            >
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

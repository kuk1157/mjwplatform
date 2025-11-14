import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "src/utils/loadingSpinner";

// 타입 확장
declare global {
    interface Window {
        DIDLogin?: {
            init: (opts?: any) => void;
            isReady: () => boolean;
            loginPersonal: (opts: any) => void;
            setOptions?: (opts: any) => void;
            reset?: () => void;
            getVersion?: () => string;
        };
        didLogin?: {
            setOption?: (opts: any) => void;
            loginPopup: (opts: any) => void;
        };
        daeguIdLogin?: () => void;
        didLoginCallback?: (encrypted: string | object) => void;
        iosCallback?: (encrypted: any) => void;
    }
}

const SITE_ID = "AuyVJfyBUnUGcFzqSih27NT";
const REQUIRED_VC = "Name:PhoneNum";

interface DidLoginButtonProps {
    storeNum?: number;
    tableNumber?: number;
}

const DidLoginButton = ({ storeNum, tableNumber }: DidLoginButtonProps) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleGlobalError = (event: ErrorEvent) => {
            console.error(
                "전역 JS 에러 발생:",
                event.message,
                event.filename,
                event.lineno
            );
            alert(
                "로그인 모듈에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
            );
        };
        const handlePromiseRejection = (event: PromiseRejectionEvent) => {
            console.error("비동기 JS 에러 발생:", event.reason);
            alert("로그인 모듈 비동기 오류 발생. 잠시 후 다시 시도해주세요.");
        };

        window.addEventListener("error", handleGlobalError);
        window.addEventListener("unhandledrejection", handlePromiseRejection);

        window.didLoginCallback = async (encrypted) => {
            const returnData =
                typeof encrypted === "string"
                    ? encrypted
                    : JSON.stringify(encrypted);
            console.log("returnData", returnData);

            try {
                setLoading(true);
                const response = await axios.post(
                    `/api/v1/auth/did/${storeNum}/${tableNumber}`,
                    { returnData }
                );

                const userRole = response.data.auth.role;
                if (userRole !== "user") {
                    alert("고객만 연동 로그인이 가능합니다.");
                    setLoading(false);
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
                localStorage.setItem("customerId", response.data.customerId);

                window.location.replace("/mobile/mainPage");
            } catch (err) {
                console.error("다대구 로그인 실패", err);
                alert("다대구 로그인에 실패했습니다. 다시 시도해 주세요.");
                setLoading(false);
            }
        };

        window.iosCallback = function (encrypted: any) {
            window.didLoginCallback?.(encrypted);
        };

        // =====================
        // 3️⃣ 스크립트 로드 유틸
        // =====================
        const loadScript = (src: string) =>
            new Promise<void>((resolve, reject) => {
                const script = document.createElement("script");
                script.src = src;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject(`Failed to load ${src}`);
                document.body.appendChild(script);
            });

        (async () => {
            try {
                await loadScript("https://code.jquery.com/jquery-3.6.0.min.js");
                console.log("jQuery loaded");

                await loadScript("/js/didLogin.js");
                console.log("didLogin.js loaded");

                if (window.DIDLogin) {
                    window.DIDLogin.init({
                        logActive: process.env.NODE_ENV !== "production",
                        mbActive: true,
                    });

                    window.daeguIdLogin = () => {
                        if (!window.DIDLogin?.isReady()) {
                            alert("로그인 모듈 초기화에 실패했습니다.");
                            return;
                        }

                        window.DIDLogin.loginPersonal({
                            siteId: SITE_ID,
                            requiredVC: REQUIRED_VC,
                            callbackFunc: "didLoginCallback",
                            iosCallbackFuncName: "iosCallback",
                        });

                        // 앱 미설치 fallback
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
                            if (document.hidden) clearTimeout(timer);
                        });
                    };
                } else if (window.didLogin) {
                    // 구버전 호환
                    window.daeguIdLogin = () => {
                        window.didLogin!.loginPopup({
                            siteId: SITE_ID,
                            requiredVC: REQUIRED_VC,
                            callbackFunc: "didLoginCallback",
                            iosCallbackFuncName: "iosCallback",
                        });
                    };
                } else {
                    console.error("didLogin.js 로드됨. 전역 객체 미탑재.");
                    alert("로그인 모듈을 로드할 수 없습니다.");
                }
            } catch (err) {
                console.error("스크립트 로드 실패:", err);
                alert(
                    "로그인 모듈 로드에 실패했습니다. 네트워크를 확인해주세요."
                );
            }
        })();

        return () => {
            window.removeEventListener("error", handleGlobalError);
            window.removeEventListener(
                "unhandledrejection",
                handlePromiseRejection
            );
        };
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

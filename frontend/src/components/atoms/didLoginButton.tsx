import { useEffect, useState, useRef } from "react";
import axios from "axios";
import LoadingSpinner from "src/utils/loadingSpinner";

declare global {
    interface Window {
        DIDLogin?: {
            init: (opts?: any) => void;
            isReady: () => boolean;
            loginPersonal: (opts: any) => void;
        };
        didLogin?: {
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

const MAX_CONSECUTIVE_FAILURES = 5; // 최대 연속 실패 횟수
const POLLING_INTERVAL = 500; // 기본 polling 간격(ms)
const MAX_POLLING_INTERVAL = 3000; // 최대 간격(ms)

const DidLoginButton = ({ storeNum, tableNumber }: DidLoginButtonProps) => {
    const [loading, setLoading] = useState(false);
    const [sdkReady, setSdkReady] = useState(false);
    const consecutiveFailures = useRef(0);
    const pollingTimer = useRef<number | null>(null);
    const pollingInterval = useRef(POLLING_INTERVAL);

    // ===============================
    // 전역 JS 에러 핸들링
    // ===============================
    useEffect(() => {
        const handleGlobalError = (event: ErrorEvent) => {
            console.error(
                "전역 JS 에러:",
                event.message,
                event.filename,
                event.lineno
            );
            alert(
                "로그인 모듈에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
            );
        };
        const handlePromiseRejection = (event: PromiseRejectionEvent) => {
            console.error("비동기 JS 에러:", event.reason);
            alert("로그인 모듈 비동기 오류 발생. 잠시 후 다시 시도해주세요.");
        };

        window.addEventListener("error", handleGlobalError);
        window.addEventListener("unhandledrejection", handlePromiseRejection);

        return () => {
            window.removeEventListener("error", handleGlobalError);
            window.removeEventListener(
                "unhandledrejection",
                handlePromiseRejection
            );
        };
    }, []);

    // ===============================
    // 글로벌 로그인 콜백
    // ===============================
    useEffect(() => {
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
    }, [storeNum, tableNumber]);

    // ===============================
    // SDK 로드 및 초기화
    // ===============================
    useEffect(() => {
        const loadScript = (src: string) =>
            new Promise<void>((resolve, reject) => {
                const script = document.createElement("script");
                script.src = src;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject(`Failed to load ${src}`);
                document.body.appendChild(script);
            });

        const initSdk = async () => {
            try {
                if (!(window as any).jQuery) {
                    await loadScript(
                        "https://code.jquery.com/jquery-3.6.0.min.js"
                    );
                    console.log("jQuery loaded");
                }

                await loadScript("/js/didLogin.js");
                console.log("didLogin.js loaded");

                if (window.DIDLogin) {
                    window.DIDLogin.init({ logActive: true, mbActive: true });

                    // SDK 준비 확인 + polling
                    const checkReady = () => {
                        if (window.DIDLogin?.isReady()) {
                            setSdkReady(true);
                            console.log("SDK 준비 완료");
                        } else {
                            consecutiveFailures.current++;
                            pollingInterval.current = Math.min(
                                pollingInterval.current * 1.5,
                                MAX_POLLING_INTERVAL
                            );

                            if (
                                consecutiveFailures.current >=
                                MAX_CONSECUTIVE_FAILURES
                            ) {
                                alert(
                                    "로그인 모듈 준비에 실패했습니다. 잠시 후 다시 시도해주세요."
                                );
                                console.error(
                                    "Max consecutive failures reached"
                                );
                            } else {
                                pollingTimer.current = window.setTimeout(
                                    checkReady,
                                    pollingInterval.current
                                );
                            }
                        }
                    };
                    checkReady();
                } else if (window.didLogin) {
                    setSdkReady(true);
                } else {
                    throw new Error("로그인 모듈 전역 객체 미탑재");
                }
            } catch (err) {
                console.error("SDK 초기화 실패:", err);
                alert(
                    "로그인 모듈을 로드할 수 없습니다. 네트워크를 확인해주세요."
                );
            }
        };

        initSdk();

        return () => {
            if (pollingTimer.current) clearTimeout(pollingTimer.current);
        };
    }, []);

    // ===============================
    // 로그인 클릭
    // ===============================
    const loginClick = () => {
        if (!sdkReady) {
            alert(
                "로그인 모듈이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요."
            );
            return;
        }

        if (window.DIDLogin) {
            window.DIDLogin.loginPersonal({
                siteId: SITE_ID,
                requiredVC: REQUIRED_VC,
                callbackFunc: "didLoginCallback",
                iosCallbackFuncName: "iosCallback",
            });
        } else if (window.didLogin) {
            window.didLogin.loginPopup({
                siteId: SITE_ID,
                requiredVC: REQUIRED_VC,
                callbackFunc: "didLoginCallback",
                iosCallbackFuncName: "iosCallback",
            });
        }
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

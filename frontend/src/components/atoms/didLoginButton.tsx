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
        /** 구버전(호환용) */
        didLogin?: {
            setOption?: (opts: any) => void;
            loginPopup: (opts: any) => void;
        };
        /** 앱 진입 함수 */
        daeguIdLogin?: () => void;
        /** 공통 콜백 */
        didLoginCallback?: (encrypted: string | object) => void;
        /** iOS 전용 전역 콜백 - 반드시 함수 선언문 형태 */
        iosCallback?: (encrypted: any) => void;
    }
}

const SITE_ID = "AuyVJfyBUnUGcFzqSih27NT"; // 발급받은 사이트 ID
const REQUIRED_VC = "Name"; // 필요 VC 항목

interface DidLoginButtonProps {
    storeNum?: number;
    tableNumber?: number;
}

const DidLoginButton = ({ storeNum, tableNumber }: DidLoginButtonProps) => {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        // 로그인 처리 콜백 등록
        window.didLoginCallback = async (encrypted) => {
            const returnData =
                typeof encrypted === "string"
                    ? encrypted
                    : JSON.stringify(encrypted);

            console.log("returnData", returnData);
            try {
                setLoading(true); // 스피너 켜기
                const response = await axios.post(
                    `/api/v1/auth/did/${storeNum}/${tableNumber}`,
                    {
                        returnData,
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
                window.location.replace("/mobile/mainPageTest");
            } catch (err) {
                console.error("다대구 로그인 실패", err);
                alert("다대구 로그인에 실패했습니다. 다시 시도해 주세요.");
                setLoading(false); // 스피너 끄기
            }
        };

        // 2) iOS 전역 콜백(함수 선언문 형태 필수)
        window.iosCallback = function (encrypted: any) {
            window.didLoginCallback?.(encrypted);
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

                // v2 객체 방식
                if (window.DIDLogin) {
                    // 모바일 웹 지원 켜기 (iOS 전역 콜백 필수)
                    window.DIDLogin.init({
                        logActive: process.env.NODE_ENV !== "production",
                        mbActive: true, // 모바일 웹에서 앱 호출 지원
                    });

                    // 앱 진입 함수(신규)
                    window.daeguIdLogin = () => {
                        if (!window.DIDLogin?.isReady()) {
                            alert("로그인 모듈 초기화에 실패했습니다.");
                            return;
                        }
                        window.DIDLogin.loginPersonal({
                            siteId: SITE_ID,
                            requiredVC: REQUIRED_VC,
                            // 두 방식 중 하나 택1: 여기서는 콜백 방식 사용
                            callbackFunc: "didLoginCallback",
                            // 모바일웹(iOS) 필수: 전역 함수명 문자열
                            iosCallbackFuncName: "iosCallback",
                            // 만약 서버 수신으로 바꾸려면 ↓ 사용 (서버의 returnUrl 엔드포인트 구현 필요)
                            // returnUrl: "/api/v1/auth/did/return",
                        });

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
                } else if (window.didLogin) {
                    // 4) 구버전(호환): didLogin 함수 방식 유지
                    window.daeguIdLogin = () => {
                        window.didLogin!.loginPopup({
                            siteId: SITE_ID,
                            requiredVC: REQUIRED_VC,
                            callbackFunc: "didLoginCallback",
                            iosCallbackFuncName: "iosCallback",
                        });
                    };
                } else {
                    console.error(
                        "didLogin.js 로드됨. 구버전(호환): didLogin 함수 방식 유지 전역 객체 미탑재."
                    );
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

/**
 * DID Login Library v2.1.1
 * 대구광역시 DID 로그인 서비스 연동 라이브러리
 *
 * 사용법:
 * 1. HTML에 스크립트 포함: <script src="did-login.js"></script>
 * 2. 초기화: DIDLogin.init() 또는 DIDLogin.init(options)
 * 3. 로그인 실행: DIDLogin.login(loginData)
 *
 * 지원 브라우저:
 * - Chrome 55+ (2017년 1월)
 * - Firefox 52+ (2017년 3월)
 * - Safari 10+ (2016년 9월)
 * - Edge 12+ (2015년 7월)
 * - Internet Explorer: 미지원 (fetch API, Promise 미지원)
 *
 * IE 지원이 필요한 경우 폴리필 추가:
 * <script src="https://polyfill.io/v3/polyfill.min.js?features=fetch,Promise,URLSearchParams"></script>
 *
 * 의존성:
 * - jQuery: 불필요 (순수 JavaScript로 작성)
 * - 외부 라이브러리: 없음
 *
 * @version 2.1.1
 * @author Daegu Metropolitan City
 * @updated 2025-06-27 - Fixed instance destruction error
 */

(function(global) {
    'use strict';

    // 라이브러리가 이미 로드되었는지 확인
    if (global.DIDLogin) {
        console.warn('DIDLogin library is already loaded');
        return;
    }

    // 상수 정의
    const CONSTANTS = {
        VERSION: '2.1.1',
        BASE_URL: 'https://diddapp.daegu.go.kr/dgbp',
        TIMEOUT_DURATION: 60000,
        APP_LAUNCH_DELAY: 2500,
        APP_LAUNCH_TIMEOUT: 3000,
        IOS_APP_ID: '1565818679',
        ANDROID_PACKAGE: 'com.dreamsecurity.daegudid',
        POPUP_TARGET: 'dqr_login_popup_' + Date.now(),
        // Flag 관련 상수
        FLAGS: {
            PERSONAL: 'dqrp',    // 개인 인증
            CORPORATE: 'corp'    // 법인 인증
        },
        // 적응형 폴링 설정
        ADAPTIVE_POLLING: {
            MIN_INTERVAL: 1000,    // 최소 간격: 1초
            MAX_INTERVAL: 5000,    // 최대 간격: 5초
            MAX_FAILURES: 60,       // 최대 연속 실패
            DEBOUNCE_DELAY: 300    // 디바운스 지연시간
        },
        // 타이밍 관련 상수
        TIMING: {
            IOS_AUTO_CHECK_DELAY: 100,        // iOS 자동 체크 지연
            POPUP_CHECK_INTERVAL: 1000,       // 팝업 닫힘 체크 간격
            VISIBILITY_DEBOUNCE: 100,         // 페이지 가시성 디바운스
            FOCUS_DEBOUNCE: 200,              // 포커스 이벤트 디바운스
            AJAX_TIMEOUT: 30000               // AJAX 요청 타임아웃 (30초)
        }
    };

    // 기본 설정
    const DEFAULT_OPTIONS = {
        isClose: true,
        isRefresh: true,
        refreshCnt: 5,
        logActive: false,
        mbActive: false,
        mbMsg: '모바일 웹은 지원하지 않습니다.\nPC를 이용해 주세요',
        width: 500,
        height: 530,
        baseUrl: CONSTANTS.BASE_URL
    };

    // 유틸리티 함수들
    const Utils = {
        getUserAgent() {
            return (navigator.userAgent || navigator.vendor || global.opera || '').toLowerCase();
        },

        isIOS() {
            return /iPad|iPhone|iPod/.test(navigator.userAgent);
        },

        isAndroid() {
            return /Android/.test(navigator.userAgent);
        },

        isMobile() {
            return this.isIOS() || this.isAndroid();
        },

        isFunction(fn) {
            return typeof fn === 'function';
        },

        isFunctionName(functionName) {
            return typeof global[functionName] === 'function';
        },

        getQueryParameter(parameterName) {
            try {
                const urlParams = new URLSearchParams(global.location.search);
                return urlParams.get(parameterName) || null;
            } catch (error) {
                console.warn('URL parameter parsing error:', error);
                return null;
            }
        },

        safeJSONParse(jsonString) {
            try {
                return JSON.parse(jsonString);
            } catch (error) {
                console.warn('JSON parsing error:', error);
                return null;
            }
        },

        calculatePopupPosition(width, height) {
            const screenLeft = global.screenLeft || global.screenX || 0;
            const screenTop = global.screenTop || global.screenY || 0;
            const windowWidth = global.innerWidth || document.documentElement.clientWidth || screen.width;
            const windowHeight = global.innerHeight || document.documentElement.clientHeight || screen.height;

            const left = screenLeft + (windowWidth / 2) - (width / 2);
            const top = screenTop + (windowHeight / 2) - (height / 2);

            return { left: Math.max(0, left), top: Math.max(0, top) };
        },

        // 객체 깊은 복사
        deepClone(obj) {
            if (obj === null || typeof obj !== 'object') return obj;
            if (obj instanceof Date) return new Date(obj.getTime());
            if (obj instanceof Array) return obj.map(item => this.deepClone(item));
            if (typeof obj === 'object') {
                const cloned = {};
                Object.keys(obj).forEach(key => {
                    cloned[key] = this.deepClone(obj[key]);
                });
                return cloned;
            }
        },

        // 디바운스 함수 추가
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // XSS 방지를 위한 입력값 검증
        validateInput(value) {
            if (typeof value !== 'string') return false;

            // 위험한 문자열 패턴 검사
            const dangerousPatterns = [
                /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                /javascript:/gi,
                /on\w+\s*=/gi
            ];

            return !dangerousPatterns.some(pattern => pattern.test(value));
        },

        // CSP 정책 확인
        checkCSPPolicy() {
            try {
                const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
                if (meta && meta.content.includes('unsafe-inline')) {
                    console.warn('CSP policy may block dynamic form creation');
                }
            } catch (error) {
                // CSP 체크 실패는 무시
            }
        }
    };

    // 메인 DID 로그인 클래스
    class DIDLoginService {
        constructor() {
            this.options = Utils.deepClone(DEFAULT_OPTIONS);
            this.sessionKey = null;
            this.checkStatusInterval = null;
            this.checkExpireInterval = null;
            this.isPolling = false;
            this.isInitialized = false;
            this.isDestroyed = false;
            this.popupWindow = null;
            this.messageHandler = null;
            this.activityHandlers = null;
            this.immediateCheck = null;

            // 고유 식별자
            this.instanceId = 'did_login_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }

        /**
         * 인스턴스 리셋 (재사용 가능하도록)
         */
        reset() {
            this.cleanup();
            this.isDestroyed = false;
            this.isInitialized = false;
            this.sessionKey = null;
            this.popupWindow = null;
            this.messageHandler = null;
            this.activityHandlers = null;
            this.immediateCheck = null;

            if (this.options.logActive) {
                console.info('DIDLogin instance has been reset');
            }

            return this;
        }

        /**
         * 라이브러리 초기화
         * @param {Object} options - 설정 옵션
         * @returns {DIDLoginService} 체이닝을 위한 인스턴스 반환
         */
        init(options = {}) {
            try {
                // 이미 파괴된 인스턴스라면 리셋
                if (this.isDestroyed) {
                    this.isDestroyed = false;
                }

                this.setOptions(options);
                this.setupEventListeners();
                this.handleIOSAutoCheck();
                Utils.checkCSPPolicy();
                this.isInitialized = true;

                if (this.options.logActive) {
                    console.info(`DIDLogin library v${CONSTANTS.VERSION} initialized`);
                }

                return this;
            } catch (error) {
                console.error('DIDLogin initialization failed:', error);
                throw error;
            }
        }

        /**
         * 옵션 설정
         * @param {Object} options - 설정할 옵션들
         */
        setOptions(options = {}) {
            const validOptions = Object.keys(DEFAULT_OPTIONS);

            Object.keys(options).forEach(key => {
                if (!validOptions.includes(key)) {
                    console.warn(`Invalid option: ${key}`);
                    return;
                }

                const value = options[key];

                // 타입 검증 강화
                if (key === 'baseUrl' && typeof value === 'string' && value.trim()) {
                    if (!Utils.validateInput(value)) {
                        console.warn(`Invalid baseUrl format: ${key}`);
                        return;
                    }
                    this.options[key] = value.trim().replace(/\/$/, ''); // 끝의 슬래시 제거
                } else if (typeof value === typeof DEFAULT_OPTIONS[key]) {
                    if (typeof value === 'string' && value.trim() === '' && key !== 'mbMsg') {
                        console.warn(`Option ${key} cannot be empty string`);
                        return;
                    }
                    this.options[key] = value;
                } else {
                    console.warn(`Invalid type for option ${key}. Expected: ${typeof DEFAULT_OPTIONS[key]}, Got: ${typeof value}`);
                }
            });
        }

        /**
         * 이벤트 리스너 설정 (성능 최적화)
         */
        setupEventListeners() {
            const options = { passive: true };

            // 페이지 언로드 시 정리
            global.addEventListener('beforeunload', () => {
                this.cleanup();
            });

            // 페이지 숨김/표시 처리 (모바일 앱 전환 시)
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible' && this.sessionKey && !this.isDestroyed) {
                    // 앱에서 돌아왔을 때 상태 확인
                    if (this.options.logActive) {
                        console.info('Page became visible, checking login status...');
                    }
                }
            }, options);
        }

        /**
         * iOS 자동 체크 처리
         */
        handleIOSAutoCheck() {
            if (this.options.mbActive && Utils.isIOS()) {
                setTimeout(() => {
                    this.iosCheckProcess();
                }, CONSTANTS.TIMING.IOS_AUTO_CHECK_DELAY); // 초기화 완료 후 실행
            }
        }

        /**
         * 로그인 실행 (수정된 버전)
         * @param {Object} loginData - 로그인 데이터
         * @returns {Promise<boolean>} 성공 여부
         */
        async login(loginData) {
            // 파괴된 인스턴스인 경우 자동으로 리셋
            if (this.isDestroyed) {
                if (this.options.logActive) {
                    console.warn('Instance was destroyed, resetting and reinitializing...');
                }
                this.reset();
                this.init();
            }

            if (!this.isInitialized) {
                if (this.options.logActive) {
                    console.warn('Instance not initialized, auto-initializing...');
                }
                this.init();
            }

            try {
                // 입력 데이터 검증
                const validationResult = this.validateLoginData(loginData);
                if (!validationResult.valid) {
                    throw new Error(validationResult.message);
                }

                // 기존 프로세스 정리
                this.cleanup();

                if (Utils.isAndroid()) {
                    return await this.handleAndroidLogin(loginData);
                } else if (Utils.isIOS()) {
                    return await this.handleIOSLogin(loginData);
                } else {
                    return await this.handleWebLogin(loginData);
                }
            } catch (error) {
                console.error('Login process failed:', error);
                alert(error.message || '로그인 처리 중 오류가 발생했습니다.');
                this.cleanup();
                return false;
            }
        }

        /**
         * 로그인 데이터 검증 (타입 안전성 강화)
         * @param {Object} data - 검증할 데이터
         * @returns {Object} 검증 결과
         */
        validateLoginData(data) {
            if (!data || typeof data !== 'object' || Array.isArray(data)) {
                return { valid: false, message: '로그인 데이터는 객체여야 합니다.' };
            }

            // flag 설정 (기본값: dqrp)
            if (!data.flag) {
                data.flag = CONSTANTS.FLAGS.PERSONAL;
            }

            // flag에 따른 필수 필드 검증
            if (data.flag === CONSTANTS.FLAGS.CORPORATE) {
                // 법인 인증 시 필수 필드 검증
                const requiredFields = ['siteId'];
                for (const field of requiredFields) {
                    const value = data[field];
                    if (value == null || typeof value !== 'string' || !value.trim()) {
                        return { valid: false, message: `${field}는 필수 입력사항입니다.` };
                    }
                    if (!Utils.validateInput(value)) {
                        return { valid: false, message: `${field}에 유효하지 않은 문자가 포함되어 있습니다.` };
                    }
                }
            } else {
                // 개인 인증 시 필수 필드 검증 (기존 로직)
                const requiredFields = ['siteId', 'requiredVC'];
                for (const field of requiredFields) {
                    const value = data[field];
                    if (value == null || typeof value !== 'string' || !value.trim()) {
                        return { valid: false, message: `${field}는 필수 입력사항입니다.` };
                    }

                    // XSS 검증
                    if (!Utils.validateInput(value)) {
                        return { valid: false, message: `${field}에 유효하지 않은 문자가 포함되어 있습니다.` };
                    }
                }
            }

            // 콜백 방식 검증
            if (!data.returnUrl && !data.callbackFunc) {
                return { valid: false, message: 'returnUrl 또는 callbackFunc 중 하나는 필수입니다.' };
            }

            // 콜백 함수 검증
            if (data.callbackFunc) {
                if (typeof data.callbackFunc === 'string') {
                    if (!Utils.isFunctionName(data.callbackFunc)) {
                        return { valid: false, message: `콜백 함수 '${data.callbackFunc}'를 찾을 수 없습니다.` };
                    }
                } else if (!Utils.isFunction(data.callbackFunc)) {
                    return { valid: false, message: '유효하지 않은 콜백 함수입니다.' };
                }
            }

            if (this.options.mbActive === true) {
                if(!data.iosCallbackFuncName) {
                    return { valid: false, message: `모바일 웹 로그인 지원 시 iosCallbackFuncName 는 필수 값입니다.` };
                }

                if (!Utils.isFunctionName(data.iosCallbackFuncName)) {
                    return { valid: false, message: `iOS 콜백 함수 '${data.iosCallbackFuncName}'를 찾을 수 없습니다.` };
                }
                if(Utils.isFunction(data.iosCallbackFuncName)) {
                    return { valid: false, message: 'iOS 콜백 함수는 함수 형태로 전달 할 수 없습니다. D클라우드 정책 위배.' };
                }
            }

            // returnUrl 검증
            if (data.returnUrl && (typeof data.returnUrl !== 'string' || !Utils.validateInput(data.returnUrl))) {
                return { valid: false, message: 'returnUrl이 유효하지 않습니다.' };
            }

            return { valid: true };
        }

        /**
         * Android 로그인 처리
         */
        async handleAndroidLogin(loginData) {
            if (!this.options.mbActive) {
                throw new Error(this.options.mbMsg);
            }

            const success = await this.mobileWebInitProcess('android', loginData);
            if (!success) {
                return false;
            }

            this.setupAppLaunchTimeout(() => {
                this.launchAndroidApp();
            });

            return true;
        }

        /**
         * iOS 로그인 처리
         */
        async handleIOSLogin(loginData) {
            if (!this.options.mbActive) {
                throw new Error(this.options.mbMsg);
            }

            const success = await this.mobileWebInitProcess('ios', loginData);
            if (!success) {
                return false;
            }

            this.setupAppLaunchTimeout(() => {
                this.launchIOSApp();
            });

            return true;
        }

        /**
         * 웹 로그인 처리
         */
        async handleWebLogin(loginData) {
            let url = `${this.options.baseUrl}/popup/v4/dqrLogin`;

            if (this.options.logActive) {
                console.info('Opening login popup:', { url, flag: loginData.flag });
            }

            loginData.origin = window.location.origin;

            this.openPopup(url, loginData);
            this.setupMessageListener(loginData);

            return true;
        }

        /**
         * 앱 실행 타임아웃 설정 (모바일 환경 개선)
         */
        setupAppLaunchTimeout(launchCallback) {
            const startTime = Date.now();
            let hasLaunched = false;

            // 페이지 숨김으로 앱 실행 감지
            const visibilityHandler = () => {
                if (document.visibilityState === 'hidden') {
                    hasLaunched = true;
                    document.removeEventListener('visibilitychange', visibilityHandler);
                }
            };

            document.addEventListener('visibilitychange', visibilityHandler);

            setTimeout(() => {
                document.removeEventListener('visibilitychange', visibilityHandler);

                if (!hasLaunched && Date.now() - startTime < CONSTANTS.APP_LAUNCH_TIMEOUT) {
                    this.cleanup();
                    launchCallback();
                }
            }, CONSTANTS.APP_LAUNCH_DELAY);
        }

        /**
         * 팝업 창 열기 (접근성 개선)
         */
        openPopup(url, loginData) {
            const formData = {
                siteId: loginData.siteId,
                isClose: this.options.isClose,
                logActive: this.options.logActive,
                origin: loginData.origin,
                flag: loginData.flag
            };

            // flag에 따른 추가 데이터 설정
            if (loginData.flag === CONSTANTS.FLAGS.PERSONAL) {
                formData.requiredVC = loginData.requiredVC;
                formData.subVC = loginData.subVC || '';
                formData.isRefresh = this.options.isRefresh;
                formData.refreshCnt = this.options.refreshCnt;
            }

            const form = this.createForm(url, formData, CONSTANTS.POPUP_TARGET);
            const position = Utils.calculatePopupPosition(this.options.width, this.options.height);
            const features = [
                `width=${this.options.width}`,
                `height=${this.options.height}`,
                `left=${position.left}`,
                `top=${position.top}`,
                'resizable=no',
                'scrollbars=no',
                'menubar=no',
                'toolbar=no',
                'location=no',
                'status=no'
            ].join(',');

            this.popupWindow = global.open('', CONSTANTS.POPUP_TARGET, features);

            if (!this.popupWindow) {
                throw new Error('팝업이 차단되었습니다. 브라우저의 팝업 차단을 해제해 주세요.');
            }

            // 접근성을 위한 속성 추가
            try {
                this.popupWindow.document.title = loginData.flag === CONSTANTS.FLAGS.CORPORATE ? '법인 ID 로그인' : 'DID 로그인';
                this.popupWindow.document.body.setAttribute('role', 'dialog');
                this.popupWindow.document.body.setAttribute('aria-label', 'DID 로그인 창');
            } catch (e) {
                // 크로스 오리진 에러 무시
            }

            form.submit();
            document.body.removeChild(form);

            // 팝업 닫힘 감지
            this.monitorPopupClosure();
        }

        /**
         * 팝업 닫힘 모니터링
         */
        monitorPopupClosure() {
            const checkClosed = () => {
                if (this.popupWindow && this.popupWindow.closed) {
                    if (this.options.logActive) {
                        console.info('Popup window was closed');
                    }
                    this.cleanup();
                } else if (this.popupWindow && !this.isDestroyed) {
                    setTimeout(checkClosed, CONSTANTS.TIMING.POPUP_CHECK_INTERVAL);
                }
            };
            setTimeout(checkClosed, CONSTANTS.TIMING.POPUP_CHECK_INTERVAL);
        }

        /**
         * 메시지 리스너 설정
         */
        setupMessageListener(loginData) {
            // 기존 핸들러가 있다면 제거
            if (this.messageHandler) {
                global.removeEventListener('message', this.messageHandler);
            }

            this.messageHandler = (event) => {
                // 보안: 원본 도메인 검증
                if (!this.isValidOrigin(event.origin)) {
                    console.warn('Message from unauthorized origin:', event.origin);
                    return;
                }

                try {
                    this.handleLoginResult(event.data, loginData);
                } catch (error) {
                    console.error('Message handling error:', error);
                    alert('로그인 결과 처리 중 오류가 발생했습니다.');
                } finally {
                    this.cleanup();
                }
            };

            global.addEventListener('message', this.messageHandler);
        }

        /**
         * 유효한 원본인지 확인
         */
        isValidOrigin(origin) {
            try {
                const baseUrlOrigin = new URL(this.options.baseUrl).origin;
                return origin === baseUrlOrigin;
            } catch (error) {
                console.warn('Origin validation error:', error);
                return false;
            }
        }

        /**
         * 로그인 결과 처리
         */
        async handleLoginResult(data, loginData) {
            if (loginData.returnUrl) {
                await this.goReturnUrl(data, loginData.returnUrl, loginData.callbackFunc);
            } else if (typeof loginData.callbackFunc === 'string') {
                global[loginData.callbackFunc](data);
            } else if (Utils.isFunction(loginData.callbackFunc)) {
                loginData.callbackFunc(data);
            } else {
                throw new Error('유효한 콜백 방식이 없습니다.');
            }
        }

        /**
         * 폼 생성
         */
        createForm(action, data, target) {
            const form = document.createElement('form');
            form.setAttribute('charset', 'UTF-8');
            form.setAttribute('method', 'POST');
            form.setAttribute('target', target);
            form.setAttribute('action', action);
            form.style.display = 'none';

            Object.entries(data).forEach(([name, value]) => {
                if (value !== undefined && value !== null) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = name;
                    input.value = String(value);
                    form.appendChild(input);
                }
            });

            document.body.appendChild(form);
            return form;
        }

        /**
         * 모바일 웹 초기화 프로세스
         */
        async mobileWebInitProcess(os, data) {
            const initUrl = `${this.options.baseUrl}/mobileWeb/login/init`;
            const initData = {
                siteId: data.siteId,
                flag: data.flag,
                origin: global.location.origin
            };
            // flag에 따른 추가 데이터 설정
            if (data.flag === CONSTANTS.FLAGS.PERSONAL) {
                initData.requiredVC = data.requiredVC;
                initData.subVC = data.subVC || '';
            }
            if (data.flag === CONSTANTS.FLAGS.CORPORATE) {
                alert("법인ID는 모바일 웹 로그인을 지원하지 않습니다.")
                return false;
            }

            if (this.options.logActive) {
                console.info('Mobile web initialization:', { url: initUrl, data: initData, flag: data.flag });
            }

            try {
                const response = await this.postAjax(initUrl, initData);

                if (!response.success || response.errMsg) {
                    throw new Error(response.errMsg || '모바일 로그인 초기화에 실패했습니다.');
                }

                this.sessionKey = response.sessionKey;
                const mobileParam = this.buildMobileParam(response, data, os);

                if (os === 'android') {
                    global.location.href = `didapp://mobileweblogin?${mobileParam}`;
                    data.sessionKey = response.sessionKey;
                    this.startMobileCheckProcess(data);
                } else if (os === 'ios') {
                    const cleanUrl = new URL(global.location.href);
                    cleanUrl.search = '';
                    const extendedParam = `${mobileParam}&siteId=${encodeURIComponent(data.siteId)}&rtnUrl=${encodeURIComponent(data.returnUrl || '')}&cbf=${encodeURIComponent(data.iosCallbackFuncName || '')}&returnUrl=${encodeURIComponent(cleanUrl.toString())}`;
                    global.location.href = `didapp://mobileweblogin?${extendedParam}`;
                }

                return true;
            } catch (error) {
                console.error('Mobile web initialization error:', error);
                throw error;
            }
        }

        /**
         * 모바일 파라미터 빌드
         */
        buildMobileParam(response, data, os) {
            const params = new URLSearchParams({
                sessionKey: response.sessionKey,
                flag: data.flag,
                url: response.url
            });

            // flag에 따른 추가 파라미터 설정
            if (data.flag === CONSTANTS.FLAGS.PERSONAL) {
                params.append('requiredVC', response.requiredVC);
                params.append('subVC', response.subVC || '');
            }

            return params.toString();
        }

        /**
         * 모바일 체크 프로세스 시작 (개선된 debounce 적용)
         */
        startMobileCheckProcess(data) {
            const chkUrl = `${this.options.baseUrl}/mobileWeb/login/chk`;
            const chkData = {
                sessionKey: data.sessionKey,
                siteId: data.siteId,
                origin: global.location.origin
            };

            if (this.options.logActive) {
                console.info('Starting intelligent mobile check process:', { url: chkUrl, data: chkData });
            }

            // 적응형 폴링 설정 (상수 사용)
            let consecutiveFailures = 0;
            let currentInterval = CONSTANTS.ADAPTIVE_POLLING.MIN_INTERVAL;
            const maxInterval = CONSTANTS.ADAPTIVE_POLLING.MAX_INTERVAL;
            const maxFailures = CONSTANTS.ADAPTIVE_POLLING.MAX_FAILURES;

            // 디바운스된 체크 함수
            const debouncedCheck = Utils.debounce(async () => {
                if (this.isPolling || this.isDestroyed) return;

                this.isPolling = true;

                try {
                    const response = await this.postAjax(chkUrl, chkData);

                    if (response.success && response.returnUrl !== 'Failed') {
                        this.cleanup();
                        await this.handleLoginResult(response.returnData, data);
                        return; // 성공 시 더 이상 체크하지 않음
                    } else if (response.msg.includes('폐기된 VC')) {
                        this.cleanup();
                        console.error('Revoked VC');
                        alert('폐기된 VC 입니다. 재발급 받고 다시 시도해 주세요.');
                        return;
                    } else if (response.returnUrl === 'Failed') {
                        this.cleanup();
                        throw new Error(response.msg || '로그인에 실패했습니다.');
                    }

                    // 성공은 아니지만 계속 진행 중인 경우
                    consecutiveFailures = 0; // 실패 카운터 리셋
                    currentInterval = Math.max(CONSTANTS.ADAPTIVE_POLLING.MIN_INTERVAL, currentInterval * 0.9); // 간격 점진적 감소

                } catch (error) {
                    consecutiveFailures++;

                    if (this.options.logActive) {
                        console.warn(`Check attempt failed (${consecutiveFailures}/${maxFailures}):`, error.message);
                    }

                    // 지수적 백오프 적용
                    currentInterval = Math.min(currentInterval * 1.5, maxInterval);

                    if (consecutiveFailures >= maxFailures) {
                        this.cleanup();
                        console.error('Max consecutive failures reached');
                        alert('서버 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
                        return;
                    }
                } finally {
                    this.isPolling = false;
                }

                // 다음 체크 스케줄링 (적응형 간격)
                if (!this.isDestroyed) {
                    setTimeout(() => {
                        if (!this.isDestroyed) {
                            debouncedCheck();
                        }
                    }, currentInterval);
                }

            }, CONSTANTS.ADAPTIVE_POLLING.DEBOUNCE_DELAY); // 디바운스 지연시간

            // 즉시 체크를 위한 함수 (디바운스 우회)
            this.immediateCheck = async () => {
                if (this.isPolling || this.isDestroyed || !data.sessionKey) return;

                if (this.options.logActive) {
                    console.info('Performing immediate check due to user activity');
                }

                try {
                    this.isPolling = true;
                    const response = await this.postAjax(chkUrl, chkData);

                    if (response.success && response.returnUrl !== 'Failed') {
                        this.cleanup();
                        await this.handleLoginResult(response.returnData, data);
                        return true;
                    }
                } catch (error) {
                    if (this.options.logActive) {
                        console.warn('Immediate check failed:', error.message);
                    }
                } finally {
                    this.isPolling = false;
                }

                return false;
            };

            // 사용자 상호작용 기반 즉시 체크 설정
            this.setupUserActivityCheck();

            // 초기 체크 시작
            debouncedCheck();

            // 전체 타임아웃 설정 (기존과 동일)
            this.checkExpireInterval = setTimeout(() => {
                this.cleanup();
                if (this.options.logActive) {
                    console.log('Session expired');
                }
                alert('로그인 세션이 만료되었습니다.');
            }, CONSTANTS.TIMEOUT_DURATION);
        }

        /**
         * 사용자 활동 기반 체크 설정
         */
        setupUserActivityCheck() {
            // 페이지 가시성 변경 시 즉시 체크
            const visibilityHandler = Utils.debounce(() => {
                if (document.visibilityState === 'visible' && this.sessionKey && !this.isDestroyed) {
                    if (this.options.logActive) {
                        console.info('Page visible - performing immediate check');
                    }
                    this.immediateCheck();
                }
            }, CONSTANTS.TIMING.VISIBILITY_DEBOUNCE);

            // 포커스 이벤트 처리
            const focusHandler = Utils.debounce(() => {
                if (this.sessionKey && !this.isDestroyed) {
                    if (this.options.logActive) {
                        console.info('Window focused - performing immediate check');
                    }
                    this.immediateCheck();
                }
            }, CONSTANTS.TIMING.FOCUS_DEBOUNCE);

            document.addEventListener('visibilitychange', visibilityHandler);
            global.addEventListener('focus', focusHandler);

            // 정리 시 이벤트 리스너 제거를 위해 참조 저장
            this.activityHandlers = {
                visibilityHandler,
                focusHandler
            };
        }

        /**
         * iOS 체크 프로세스
         */
        iosCheckProcess() {
            const mwSessionKey = Utils.getQueryParameter('mwSessionKey');
            const siteId = Utils.getQueryParameter('siteId');
            const returnUrl = Utils.getQueryParameter('rtnUrl');
            const callbackFunc = Utils.getQueryParameter('cbf');

            if (!mwSessionKey || !Utils.isIOS()) {
                return;
            }

            const chkUrl = `${this.options.baseUrl}/mobileWeb/login/chk`;
            const chkData = {
                sessionKey: mwSessionKey,
                siteId: siteId,
                origin: global.location.origin
            };

            if (this.options.logActive) {
                console.info('iOS check process');
            }

            this.postAjax(chkUrl, chkData)
                .then(response => {
                    if (response.success && response.returnUrl !== 'Failed') {
                        const loginData = {
                            returnUrl: returnUrl !== 'undefined' ? returnUrl : null,
                            callbackFunc: callbackFunc !== 'undefined' ? callbackFunc : null
                        };
                        this.handleLoginResult(response.returnData, loginData);
                    }
                })
                .catch(error => {
                    console.error('iOS check process error:', error);
                });
        }

        /**
         * 리턴 URL 처리
         */
        async goReturnUrl(data, url, callbackFunc) {
            if (!url) {
                throw new Error('리턴 URL이 제공되지 않았습니다.');
            }

            if (callbackFunc && callbackFunc !== 'undefined') {
                // AJAX 방식
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8'
                        },
                        body: typeof data === 'string' ? data : JSON.stringify(data)
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }

                    const result = await response.json();

                    if (this.options.logActive) {
                        console.log('Return URL response:', result);
                    }

                    if (typeof callbackFunc === 'string' && Utils.isFunctionName(callbackFunc)) {
                        global[callbackFunc](result);
                    } else if (Utils.isFunction(callbackFunc)) {
                        callbackFunc(result);
                    }
                } catch (error) {
                    console.error('Return URL request error:', error);
                    this.showError('서버 통신 중 오류가 발생했습니다.');
                }
            } else {
                // 폼 방식
                const form = document.createElement('form');
                form.setAttribute('charset', 'UTF-8');
                form.setAttribute('method', 'POST');
                form.setAttribute('action', url);
                form.style.display = 'none';

                const dataObj = typeof data === 'string' ? Utils.safeJSONParse(data) : data;

                if (dataObj) {
                    Object.entries(dataObj).forEach(([key, value]) => {
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = key;
                        input.value = String(value);
                        form.appendChild(input);
                    });
                }

                document.body.appendChild(form);
                form.submit();
            }
        }

        /**
         * POST AJAX 요청 (에러 처리 강화)
         */
        async postAjax(url, data) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONSTANTS.TIMING.AJAX_TIMEOUT);

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    body: new URLSearchParams(data).toString(),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    // 더 구체적인 에러 메시지
                    const errorText = await response.text().catch(() => 'Unknown error');
                    throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
                }

                const result = await response.json();

                if (this.options.logActive) {
                    console.log('AJAX response:', result);
                }

                return result;
            } catch (error) {
                clearTimeout(timeoutId);

                if (error.name === 'AbortError') {
                    throw new Error('서버 응답 시간이 초과되었습니다.');
                } else if (error instanceof TypeError) {
                    throw new Error('네트워크 연결을 확인해주세요.');
                } else {
                    throw error;
                }
            }
        }

        /**
         * Android 앱 실행
         */
        launchAndroidApp() {
            const userAgent = Utils.getUserAgent();
            let installUrl;

            if (userAgent.includes('chrome')) {
                installUrl = `intent://didapp://launch#Intent;scheme=didapp;package=${CONSTANTS.ANDROID_PACKAGE};end;`;
            } else {
                installUrl = `market://details?id=${CONSTANTS.ANDROID_PACKAGE}`;
            }

            global.location.replace(installUrl);
        }

        /**
         * iOS 앱 실행
         */
        launchIOSApp() {
            global.location.replace(`itms-apps://itunes.apple.com/app/id${CONSTANTS.IOS_APP_ID}`);
        }

        /**
         * 에러 표시
         */
        showError(message) {
            alert(message);
        }

        /**
         * 리소스 정리 (메모리 누수 방지, isDestroyed 설정 제거)
         */
        cleanup() {
            if (this.checkStatusInterval) {
                clearInterval(this.checkStatusInterval);
                this.checkStatusInterval = null;
            }

            if (this.checkExpireInterval) {
                clearTimeout(this.checkExpireInterval);
                this.checkExpireInterval = null;
            }

            if (this.popupWindow && !this.popupWindow.closed) {
                try {
                    this.popupWindow.close();
                } catch (e) {
                    // 팝업 닫기 실패 무시
                }
                this.popupWindow = null;
            }

            // 메시지 핸들러 제거
            if (this.messageHandler) {
                global.removeEventListener('message', this.messageHandler);
                this.messageHandler = null;
            }

            // 사용자 활동 체크 이벤트 리스너 제거
            if (this.activityHandlers) {
                document.removeEventListener('visibilitychange', this.activityHandlers.visibilityHandler);
                global.removeEventListener('focus', this.activityHandlers.focusHandler);
                this.activityHandlers = null;
            }

            // 폴링 및 참조 정리 (isDestroyed 설정 제거)
            this.isPolling = false;
            this.sessionKey = null;
            this.immediateCheck = null;
        }

        /**
         * 라이브러리 정보 반환
         */
        getVersion() {
            return CONSTANTS.VERSION;
        }

        /**
         * 현재 설정 반환
         */
        getOptions() {
            return Utils.deepClone(this.options);
        }

        /**
         * 초기화 상태 확인
         */
        isReady() {
            return this.isInitialized && !this.isDestroyed;
        }
    }

    // 싱글톤 인스턴스 생성
    const didLoginInstance = new DIDLoginService();

    // 공개 API 정의
    const DIDLogin = {
        /**
         * 라이브러리 초기화
         * @param {Object} options - 설정 옵션
         * @returns {Object} DIDLogin API
         */
        init: function(options) {
            didLoginInstance.init(options);
            return this;
        },

        /**
         * 로그인 실행
         * @param {Object} loginData - 로그인 데이터
         * @returns {Promise<boolean>} 성공 여부
         */
        login: function(loginData) {
            return didLoginInstance.login(loginData);
        },

        // 개인 인증 전용 메서드
        loginPersonal: function(loginData) {
            loginData.flag = CONSTANTS.FLAGS.PERSONAL;
            return didLoginInstance.login(loginData);
        },

        // 법인 인증 전용 메서드
        loginCorporate: function(loginData) {
            loginData.flag = CONSTANTS.FLAGS.CORPORATE;
            return didLoginInstance.login(loginData);
        },

        /**
         * 옵션 설정
         * @param {Object} options - 설정할 옵션들
         * @returns {Object} DIDLogin API
         */
        setOptions: function(options) {
            didLoginInstance.setOptions(options);
            return this;
        },

        /**
         * 인스턴스 리셋 (새로운 메서드)
         * @returns {Object} DIDLogin API
         */
        reset: function() {
            didLoginInstance.reset();
            return this;
        },

        /**
         * 라이브러리 정보
         */
        version: CONSTANTS.VERSION,
        getVersion: function() { return didLoginInstance.getVersion(); },
        getOptions: function() { return didLoginInstance.getOptions(); },
        isReady: function() { return didLoginInstance.isReady(); },

        /**
         * 리소스 정리 (필요시 수동 호출)
         */
        cleanup: function() {
            didLoginInstance.cleanup();
            return this;
        }
    };

    // 전역 객체에 등록
    global.DIDLogin = DIDLogin;

    // 이전 버전과의 완전한 호환성을 위한 didLogin 객체 제공
    global.didLogin = {
        // 기존 옵션 객체 (읽기 전용)
        option: didLoginInstance.options,

        // 기존 setOption 메서드 (완전 호환)
        setOption: function(options) {
            didLoginInstance.setOptions(options);
        },

        // 기존 loginPopup 메서드 (완전 호환, 자동 복구 기능 추가)
        loginPopup: function(loginData) {
            // flag 기본값 설정
            if (!loginData.flag) {
                loginData.flag = CONSTANTS.FLAGS.PERSONAL;
            }

            // 파괴된 인스턴스 체크 및 자동 복구
            if (didLoginInstance.isDestroyed || !didLoginInstance.isInitialized) {
                didLoginInstance.reset();
                didLoginInstance.init();
            }
            return didLoginInstance.login(loginData);
        }
    };

    // AMD/CommonJS 지원
    if (typeof define === 'function' && define.amd) {
        define(function() { return DIDLogin; });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = DIDLogin;
    }

    // 기존 사용자를 위한 자동 초기화 (DOM 로드 완료 시)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // 기존 사용자들을 위해 자동으로 초기화
            if (!didLoginInstance.isInitialized) {
                didLoginInstance.init();
            }
            global.dispatchEvent(new CustomEvent('didlogin:ready', { detail: DIDLogin }));
        });
    } else {
        // 이미 DOM이 로드된 경우 즉시 초기화
        setTimeout(function() {
            if (!didLoginInstance.isInitialized) {
                didLoginInstance.init();
            }
            global.dispatchEvent(new CustomEvent('didlogin:ready', { detail: DIDLogin }));
        }, 0);
    }

})(typeof window !== 'undefined' ? window : this);
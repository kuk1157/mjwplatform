import { cdn } from "src/constans";

declare global {
    interface Window {
        openModal?: (imgSrc: string) => void;
    }
}

/**
 * 필드(Elemenet) 유효성 검사
 * @param target - 검사 대상 Element
 * @param fieldName - 필드명
 * @param focusTarget - 포커스 대상 Element
 * @returns 필드 입력(선택) 여부
 */
function isValid(
    target: HTMLInputElement,
    fieldName: string,
    focusTarget: HTMLElement | undefined = undefined
) {
    if (target.value.trim()) {
        return true;
    }

    const particle = hasCoda(fieldName) ? "을" : "를"; // 조사
    const elementType =
        target.type === "text" ||
        target.type === "password" ||
        target.type === "search" ||
        target.type === "textarea"
            ? "입력"
            : "선택";
    alert(`${fieldName + particle} ${elementType}해 주세요.`);

    target.value = "";
    (!focusTarget ? target : focusTarget).focus();
    throw new Error(`"${target.id}" is required...`);
}

/**
 * 문자열의 마지막(끝) 문자의 종성 포함 여부 확인
 * @param value - Target String
 * @returns 종성 포함 여부
 */
function hasCoda(value: string) {
    return (value.charCodeAt(value.length - 1) - 0xac00) % 28 > 0;
}

/**
 * base64 링크에서 확장자 추출
 *
 * @param   {string}  base64Link  [base64Link description]
 *
 * @return  {[type]}              [return description]
 */
const getExtensionFromBase64Link = (base64Link: string) =>
    base64Link.split(";")[0].split("/")[1];

const formattedDate = (date: Date | string, isTime: boolean = true) => {
    const originalDate = new Date(date);

    const time = isTime
        ? `${String(originalDate.getHours()).padStart(2, "0")}:${String(
              originalDate.getMinutes()
          ).padStart(2, "0")}`
        : "";
    return `${originalDate.getFullYear()}-${String(
        originalDate.getMonth() + 1
    ).padStart(2, "0")}-${String(originalDate.getDate()).padStart(
        2,
        "0"
    )} ${time}`;
};
const comma = (str: any) => {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
};

const uncomma = (str: any) => {
    str = String(str);
    return str.replace(/[^\d]+/g, "");
};
/**
 * datetime형식을 전부 분해해서 객체로 반환한다
 * @param date
 * @returns number
 */
const convertDates = (date: Date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return { year, month, day, hour, minutes, seconds };
};
const convertToMySQLDate = (dateTimeString: any) => {
    // 주어진 날짜 및 시간 문자열을 Date 객체로 변환
    const dateTime = new Date(dateTimeString);

    // MySQL의 DATE 형식으로 변환
    const year = dateTime.getFullYear();
    const month = ("0" + (dateTime.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 1을 더하고 두 자리로 맞춤
    const day = ("0" + dateTime.getDate()).slice(-2); // 일을 두 자리로 맞춤

    // MySQL의 DATE 형식인 'YYYY-MM-DD'로 반환
    const mysqlDate = `${year}-${month}-${day}`;

    return mysqlDate;
};

/**
 *  timestamp 형식의 number로 시간 분 초를 구한다
 *  남은 시간 구할 때
 * @param date
 * @returns number
 */
const convertSeconds = (diff: number) => {
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { hours, minutes, seconds };
};

/**
 *  연도와 월로 해당월이 몇주차까지 있는지 구한다
 * @param date
 * @returns number
 */
const weekCountOfMonth = (year: number, month: number) => {
    const nowDate = new Date(year, month - 1, 1);
    const lastDate = new Date(year, month, 0).getDate();
    const monthSWeek = nowDate.getDay();
    const weekSeq = Math.floor((lastDate + monthSWeek - 1) / 7 + 1);
    return weekSeq;
};
/**
 *  파라미터로 받은 Date를 해당 월의 몇주차인지 구한다
 * @param date
 * @returns number
 */
const thisWeek = (date: Date = new Date()) => {
    const currentDate = date.getDate();
    const firstDay = new Date(date.setDate(1)).getDay();
    return Math.ceil((currentDate + firstDay) / 7);
};
/**
 * [연도, 월, 주차로 해당 주차의 일요일을 구한다(주는 일요일부터 시작)]
 *
 * @param  year
 * @param  month
 * @param  week
 *
 * @return
 */
function sundayDate(year: number, month: number, week: number) {
    // 월은 0부터 시작 월에서 1을 뺌
    const januaryFirst = new Date(year, month - 1, 1); // 해당 월의 1일
    const daysToSunday = 0 - januaryFirst.getDay(); // 0: 일요일, 1: 월요일, 2: 화요일, ...
    const daysToAdd = (week - 1) * 7 + daysToSunday;
    const sundayDate = new Date(year, month - 1, 1 + daysToAdd);
    return sundayDate;
}
const lastDay = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
};

/**
 *  문자열에서 숫자만 반환
 * @param string
 * @returns number
 */
const parseNumbers = (str: string) => {
    const regex = /[^0-9]/g;
    return Number(str.replace(regex, ""));
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const formatedDate = (date: Date | string): string => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const formatViewCount = (count: number) => {
    return String(count).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
// quill 에디터 이미지 태그 생성
const updateContentsWithImages = (
    contents: string,
    filePaths: Array<any>,
    options?: { onlyLast?: boolean }, // 리스트에서 마지막 이미지만 추출 위한 상태값
    openModal?: (imgSrc: string) => void
): string => {
    console.log(contents, filePaths);
    if (!contents || !filePaths) return ""; // 기본값으로 빈 문자열 반환

    const uuidMatches = [...contents.matchAll(/{{([a-f0-9-]+)}}/g)];
    if (uuidMatches.length === 0) return contents;

    const lastUuid = options?.onlyLast
        ? uuidMatches[uuidMatches.length - 1][1] // true일 경우 마지막 uuid
        : null;

    return contents.replace(/{{([a-f0-9-]+)}}/g, (match, uuid) => {
        // 마지막 uuid 체크 후 이미지 1개 추출 및 나머지 uuid 안보이게
        if (options?.onlyLast) {
            if (uuid === lastUuid) {
                const file = filePaths.find((file) => file.uuid === uuid);
                if (file && file.type === "image") {
                    const imgSrc = `${cdn}/${file.path}`;
                    // const widthAttribute = file.width
                    //     ? `width="${file.width}"`
                    //     : "";
                    // ${widthAttribute} - 이미지 태그안에 넣어주기
                    return `<img src="${imgSrc}" class="w-24 inline-block cursor-pointer" />`;
                }
            }
            return ""; // 마지막 uuid 제외 전부 제거
        }

        const file = filePaths.find((file) => file.uuid === uuid);
        if (file && file.type === "image") {
            const imgSrc = `${cdn}/${file.path}`;
            const widthAttribute = file.width ? `width="${file.width}"` : ""; // width 속성 추가 조건

            if (openModal) {
                window.openModal = openModal;

                return `<img src="${imgSrc}" ${widthAttribute} style="cursor: pointer;" onClick="window.openModal('${imgSrc}')" />`;
            } else {
                return `<img src="${imgSrc}" ${widthAttribute} />`;
            }
        }
        return match; // 매칭되는 파일이 없으면 원래의 템플릿 유지
    });
};
// quill 에디터 이미지 숨기기
const hideContentsWithImages = (
    contents: string,
    filePaths: Array<any>
): string => {
    if (!contents || !filePaths) return contents || ""; // 기본값으로 원본 내용을 반환
    return contents.replace(/{{([a-f0-9-]+)}}/g, (match, uuid) => {
        const file = filePaths.find((file) => file.uuid === uuid);
        if (file && file.type === "image") {
            return "";
        }
        return match; // 이미지가 아닌 부분은 그대로 반환
    });
};

// 비밀번호 유효성 검사
const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W).{8,20}$/;
    return passwordRegex.test(password);
};
// 이메일 유효성 검사
const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
// 전화번호 유효성 검사
const validatePhoneNumber = (PhoneNumber: string) => {
    const phoneRegex = /^(01[0-9]-?\d{3,4}-?\d{4}|0\d{1,2}-?\d{3,4}-?\d{4})$/;
    return phoneRegex.test(PhoneNumber);
};
const formatTimeCount = (time: number) => {
    const minutes = Math.floor(time / 60); // 남은 분
    const seconds = time % 60; // 남은 초
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`; // "MM:SS" 형식
};

//시간대 처리
const timeFormat = (date: any) => {
    const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
    );
    return localDate;
};

/**
 * quill 에디터 사진첨부 base64 처리 (base64 -> blob)
 * @param string
 */

const extractBase64Data = (str: string) => {
    const base64Data: { blob: Blob; width?: number; uuid?: string }[] = [];
    let editorContent = str;

    // img 태그와 video 태그에서 src 값 추출
    const mediaTags = editorContent.match(
        /<(img|video)[^>]*(src="([^"]+)")[^>]*(width="(\d+)")?[^>]*>/g
    );

    if (mediaTags) {
        mediaTags.forEach((mediaTag) => {
            const srcMatch = mediaTag.match(/src="([^"]+)"/); // src 값 추출
            const widthMatch = mediaTag.match(/width="(\d+)"/); // width 값 추출

            // width 추출
            const width = widthMatch ? parseInt(widthMatch[1]) : undefined;

            if (srcMatch && srcMatch[1]) {
                const src = srcMatch[1];

                // base64 데이터인 경우
                if (src.startsWith("data:")) {
                    const base64 = src;
                    const mimeType = base64.split(";")[0].split(":")[1]; // MIME 타입 추출 (image/png, video/mp4)

                    // base64 데이터를 Blob으로 변환
                    const byteCharacters = atob(base64.split(",")[1]);
                    const byteArrays = [];

                    // 바이트 배열로 변환
                    for (
                        let offset = 0;
                        offset < byteCharacters.length;
                        offset++
                    ) {
                        const byte = byteCharacters.charCodeAt(offset);
                        byteArrays.push(byte);
                    }

                    const byteArray = new Uint8Array(byteArrays);
                    const blob = new Blob([byteArray], { type: mimeType });

                    // Blob 데이터를 배열에 저장
                    base64Data.push({ blob, width });

                    // 태그를 {{uuid}} 형태로 대체
                    editorContent = editorContent.replace(mediaTag, `{{uuid}}`);
                } else {
                    // base64가 아닌 경우 (이미지 URL인 경우)
                    const uuid = extractUuidFromUrl(src);

                    editorContent = editorContent.replace(
                        mediaTag,
                        `{{${uuid}${width ? `&width_${width}` : ""}}}`
                    );
                }
            }
        });
    }

    // 불필요한 }}> 제거 (혹시 있을 경우)
    editorContent = editorContent.replace(/}}>/g, "}}");
    console.log({ updatedContent: editorContent, base64Data });
    return { updatedContent: editorContent, base64Data };
};
/**
 * URL에서 uuid를 추출하는 함수
 * @param src - 이미지 URL
 * @returns string - URL에서 추출된 UUID
 */
const extractUuidFromUrl = (src: string): string => {
    const parts = src.split("/");
    const uuidWithExtension = parts[parts.length - 1];
    const uuid = uuidWithExtension.split(".")[0];
    return uuid;
};

export {
    isValid,
    hasCoda,
    getExtensionFromBase64Link,
    formattedDate,
    comma,
    uncomma,
    convertSeconds,
    convertDates,
    weekCountOfMonth,
    thisWeek,
    sundayDate,
    lastDay,
    parseNumbers,
    convertToMySQLDate,
    formatDate,
    formatViewCount,
    updateContentsWithImages,
    hideContentsWithImages,
    validatePassword,
    validateEmail,
    validatePhoneNumber,
    formatTimeCount,
    formatedDate,
    timeFormat,
    extractBase64Data,
};

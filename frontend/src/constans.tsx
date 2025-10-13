// eslint-disable-next-line react-refresh/only-export-components
export const siteUrl =
    process.env.NODE_ENV === "production"
        ? "https://coex.everymeta.kr"!
        : "http://localhost:5173";

export const cdn = "https://kr.object.ncloudstorage.com/pudding";
export const noticeFolder = "coex/notice"; // 공지사항 폴더 경로
export const storeFolder = "coex/store"; // 가맹점 이미지 경로

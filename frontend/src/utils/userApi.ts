import axios from "axios";
import { siteUrl } from "../constans";
import { Member } from "../types";

const TOKEN_TYPE = localStorage.getItem("tokenType");
let ACCESS_TOKEN = localStorage.getItem("accessToken");
const REFRESH_TOKEN = localStorage.getItem("refreshToken");

export const UserApi = axios.create({
    baseURL: siteUrl,
    headers: {
        "Content-Type": "application/json",
        Authorization: `${TOKEN_TYPE} ${ACCESS_TOKEN}`,
        REFRESH_TOKEN: REFRESH_TOKEN,
    },
});
export const UserFormApi = axios.create({
    baseURL: siteUrl,
    headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `${TOKEN_TYPE} ${ACCESS_TOKEN}`,
        REFRESH_TOKEN: REFRESH_TOKEN,
    },
});

/** 토큰 갱신 */
const refreshAccessToken = async () => {
    const response = await UserApi.get(`/api/v1/auth/refresh`);
    const token = typeof response.data === "string" ? response.data : null;

    if (token && token.includes(".")) {
        ACCESS_TOKEN = token;
        localStorage.setItem("accessToken", token);
        UserApi.defaults.headers.common["Authorization"] =
            `${TOKEN_TYPE} ${token}`;
        return token;
    }

    throw new Error("Invalid token during refresh");
};

/** 토큰 유효성 검사 */
UserApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await refreshAccessToken();
                originalRequest.headers["Authorization"] =
                    `${TOKEN_TYPE} ${newToken}`;
                return UserApi(originalRequest);
            } catch (err) {
                console.error("토큰 갱신 실패 - 강제 로그아웃 필요");
                // 여기에 logout 처리 또는 강제 이동 가능
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

/** 회원조회 API */
export const fetchUser = async () => {
    const tokenType = localStorage.getItem("tokenType");
    const accessToken = localStorage.getItem("accessToken");

    const response = await axios.get(`/api/v1/member`, {
        headers: {
            Authorization: `${tokenType} ${accessToken}`,
        },
    });
    return response.data;
};
/** 회원정보 수정 API */
export const updateUser = async (data: Member) => {
    const response = await UserApi.put(`/api/v1/user`, data);
    return response.data;
};
/** 회원탈퇴 API */
export const deleteUser = async () => {
    await UserApi.delete(`/api/v1/user`);
};

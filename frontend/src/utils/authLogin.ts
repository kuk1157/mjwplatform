import axios from "axios";
import { siteUrl } from "../constans";
const TOKEN_TYPE = localStorage.getItem("tokenType");
const ACCESS_TOKEN = localStorage.getItem("accessToken");

export const AuthApi = axios.create({
    baseURL: siteUrl,
    headers: {
        "Content-Type": "application/json",
        Authorization: `${TOKEN_TYPE} ${ACCESS_TOKEN}`,
    },
});

export const login = async ({
    loginId,
    password,
}: {
    loginId: string;
    password: string;
}) => {
    const data = { loginId, password };
    const response = await AuthApi.post(`/api/v1/auth/login`, data);
    return response.data;
};

export const adminLogin = async ({
    loginId,
    password,
}: {
    loginId: string;
    password: string;
}) => {
    const data = { loginId, password };
    const response = await AuthApi.post(`/api/v1/auth/admin/login`, data);
    return response.data;
};

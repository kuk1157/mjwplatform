// PageRedirect.tsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchUser } from "src/utils/userApi";

export const PageRedirect = () => {
    const { data: user } = useQuery(
        ["userSelectorUpdated"], // 기존 selector 이름 그대로 key 사용
        fetchUser,
        {
            enabled: !!localStorage.getItem("accessToken"), // 토큰 있을 때만 실행
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
        }
    );
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user?.role) return; // 로그인 안 된 경우 무시

        const path = location.pathname;

        const isLoginPage =
            path.startsWith("/admin/login") || path.startsWith("/owner/login");
        if (isLoginPage) return;

        const customerId = localStorage.getItem("customerId") || "";
        let targetPath = "/";
        if (user.role === "admin") targetPath = "/admin/user";
        else if (user.role === "owner") {
            if (!user.id) return;
            targetPath = `/owner/dashBoard`;
        } else if (user.role === "user") {
            if (!customerId) return;
            targetPath = `/mobile/mainPage`;
        }

        const realmByRole = {
            admin: "/admin",
            owner: "/owner",
            user: "/mobile",
        } as const;
        const allowedPrefix =
            realmByRole[user.role as keyof typeof realmByRole];

        const inWrongRealm =
            (path.startsWith("/admin") && allowedPrefix !== "/admin") ||
            (path.startsWith("/owner") && allowedPrefix !== "/owner") ||
            (path.startsWith("/mobile") && allowedPrefix !== "/mobile");

        if (inWrongRealm) {
            if (path !== targetPath) navigate(targetPath, { replace: true });
            return;
        }

        const isSectionRoot = ["/", "/admin", "/owner", "/mobile"].includes(
            path
        );
        if (isSectionRoot && path !== targetPath) {
            navigate(targetPath, { replace: true });
        }
    }, [user, location.pathname, navigate]);

    return null;
};
export default PageRedirect;

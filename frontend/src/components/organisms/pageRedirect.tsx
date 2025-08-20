// PageRedirect.tsx
import { useEffect } from "react";
import { useRecoilValueLoadable } from "recoil";
import { userSelectorUpdated } from "src/recoil/userState";
import { useNavigate, useLocation } from "react-router-dom";

export const PageRedirect = () => {
    const { contents: user } = useRecoilValueLoadable(userSelectorUpdated);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user?.role) return; // 로그인 안된 경우 무시

        let targetPath = "/";

        if (user.role === "admin") targetPath = "/admin/user";
        else if (user.role === "owner")
            targetPath = `/owner/dashBoard/${user.id}`;
        else if (user.role === "user")
            targetPath = `/mobile/mainPage/${user.id}`;

        if (location.pathname !== targetPath) {
            navigate(targetPath, { replace: true });
        }
    }, [user, location.pathname, navigate]);

    return null;
};
export default PageRedirect;

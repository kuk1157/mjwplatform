import { Outlet, useNavigate } from "react-router-dom";
import { AdminSideNavbar } from "./adminSideNavbar";
import { useRecoilValue } from "recoil";
import { useEffect } from "react";
import { userSelectorUpdated } from "src/recoil/userState";
import { useResetSortOnPathChange } from "src/recoil/sortState";

const MainContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <section className="flex-1 p-[30px] bg-[#F2FAF8]">{children}</section>
    );
};

interface User {
    name: string;
}

const AdminLayout = () => {
    const user = useRecoilValue(userSelectorUpdated) as User;
    const navigate = useNavigate();
    useResetSortOnPathChange();

    useEffect(() => {
        if (!user.name) {
            navigate("/admin");
        }
    }, [user, navigate]);
    return (
        <>
            <main className="flex min-h-screen font-Pretendard">
                <AdminSideNavbar />
                <MainContainer>
                    <Outlet />
                </MainContainer>
            </main>
        </>
    );
};
export default AdminLayout;

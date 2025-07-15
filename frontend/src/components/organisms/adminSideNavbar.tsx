/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AdminMenuList } from "src/constans/index";
import { useRecoilValue } from "recoil";
import { userSelectorUpdated } from "src/recoil/userState";

interface OpenMenus {
    [key: number]: boolean;
}

const AdminSideNavbar = () => {
    const user = useRecoilValue(userSelectorUpdated);

    // 관리자 메뉴 toggle용
    const [openMenus, setOpenMenus] = useState<{
        [key: number]: boolean;
    }>({});
    // 서브 메뉴 toggle용
    const [openParentMenus, setOpenParentMenus] = useState<{
        [key: number]: boolean;
    }>({});
    const location = useLocation();

    // 로그아웃
    const logout = () => {
        localStorage.clear();
        window.location.reload();
    };

    // 메뉴 클릭
    const handleMenusClick = (id: number, hasSubMenu: boolean) => {
        if (!hasSubMenu) {
            setOpenMenus({ [id]: true });
        } else {
            setOpenMenus((prev) => ({
                ...prev,
                [id]: !prev[id],
            }));
        }
    };

    // 서브 메뉴 클릭
    const handleParentMenusClick = (id: number) => {
        setOpenParentMenus((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // 페이지 이동 감지 (기존 탭 닫기)
    useEffect(() => {
        const newOpenMenus: OpenMenus = {};
        AdminMenuList.forEach((menu) => {
            if (menu.subMenu) {
                (menu.subMenu as any[]).forEach((subMenu: any) => {
                    if (location.pathname === subMenu.path) {
                        newOpenMenus[menu.id] = true;
                    }
                });
            } else if (location.pathname === menu.path) {
                newOpenMenus[menu.id] = true;
            }
        });

        setOpenMenus(newOpenMenus);
    }, [location.pathname]);

    // 서브메뉴
    const RenderSubMenus = ({ menuList }: { menuList: any }) => {
        const parentMenus = menuList.filter(
            (menu: any) => menu.parent_id === null
        );
        return parentMenus.map((menu: any) => (
            <li key={menu.id} className="mb-[15px] last:mb-0">
                <div className="cursor-pointer hover:font-bold text-md">
                    <div
                        className="flex items-center"
                        onClick={() => handleParentMenusClick(menu.id)}
                    >
                        {menuList.some(
                            (subMenu: any) => subMenu.parent_id === menu.id
                        ) && (
                            <button className="flex justify-center items-center mr-[10px]">
                                {openParentMenus[menu.id] ? (
                                    <img
                                        src="/assets/icon/triangle-down.svg"
                                        alt=""
                                    />
                                ) : (
                                    <img
                                        src="/assets/icon/triangle-right.svg"
                                        alt=""
                                    />
                                )}
                            </button>
                        )}
                        <span
                            className={`block w-full h-full font-medium ${openParentMenus[menu.id] ? "text-[#21A089]" : "text-[#777777]"}`}
                        >
                            {menu.name}
                        </span>
                    </div>
                    {openParentMenus[menu.id] && (
                        <RenderSubMenus2
                            menuList={menuList}
                            parentId={menu.id}
                        />
                    )}
                </div>
            </li>
        ));
    };

    // 서브메뉴2
    const RenderSubMenus2 = ({
        menuList,
        parentId,
    }: {
        menuList: any;
        parentId: number;
    }) => {
        const subMenus = menuList.filter(
            (subMenu: any) => subMenu.parent_id === parentId
        );
        return subMenus
            .filter((subMenu: any) => subMenu.parent_id === parentId)
            .map((subMenu: any) => (
                <div
                    key={subMenu.id}
                    className="my-[10px] last:my-0 hover:font-bold text-[15px]"
                >
                    <Link
                        to={subMenu.path}
                        className="block w-full h-full px-[15px]"
                    >
                        <span
                            className={`font-medium ${location.pathname === subMenu.path ? "text-[#21A089]" : "text-[#999999]"}`}
                        >
                            <span className="mr-[10px]">-</span>
                            {subMenu.name}
                        </span>
                    </Link>
                </div>
            ));
    };

    if (!user.name) {
        return;
    }

    return (
        <nav className="flex flex-col w-[300px] max-h-screen pt-[30px] px-[20px] border-r border-[#D5EBE8]">
            <Link to={"/"} className="w-3/4 mx-auto">
                <img src="/assets/image/logo.svg" alt="" />
            </Link>
            <ul className="flex flex-col gap-1 mt-10 flex-grow">
                {AdminMenuList.map((menu) => (
                    <li
                        className={`cursor-pointer rounded-[10px] hover:bg-[#F2FAF8] hover:font-bold 
                                    ${openMenus[menu.id] ? "text-[#21A089] bg-[#F2FAF8]" : "text-[#666666]"}`}
                    >
                        <div
                            className={`px-[15px] hover:text-[#21A089] ${openMenus[menu.id] && menu.subMenu ? "text-[#21A089] border-b border-[#D6E2DF]" : ""}`}
                        >
                            <Link
                                to={menu.path || "#"}
                                className="flex items-center py-3"
                                onClick={() =>
                                    handleMenusClick(menu.id, !!menu.subMenu)
                                }
                            >
                                <span
                                    className={`block w-full h-full ${openMenus ? "font-bold" : ""}`}
                                >
                                    {menu.name}
                                </span>
                                {menu.subMenu && (
                                    <button className="flex justify-center items-center mr-2">
                                        {openMenus[menu.id] ? (
                                            <img
                                                src="/assets/icon/minus.svg"
                                                alt=""
                                            />
                                        ) : (
                                            <img
                                                src="/assets/icon/plus.svg"
                                                alt=""
                                            />
                                        )}
                                    </button>
                                )}
                            </Link>
                        </div>

                        {openMenus[menu.id] && menu.subMenu && (
                            <ul className="px-5 py-[15px]">
                                <RenderSubMenus menuList={menu.subMenu} />
                            </ul>
                        )}
                    </li>
                ))}
            </ul>

            <div className="px-5 py-3 text-[#999999]">
                <button onClick={logout}>로그아웃</button>
            </div>
        </nav>
    );
};

export { AdminSideNavbar };

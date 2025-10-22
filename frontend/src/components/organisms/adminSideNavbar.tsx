import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AdminMenuList } from "src/constants/index";
import { useRecoilValue } from "recoil";
import { userSelectorUpdated } from "src/recoil/userState";

const AdminSideNavbar = () => {
    const user = useRecoilValue(userSelectorUpdated);
    const location = useLocation();

    const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});

    const logout = () => {
        localStorage.clear();
        window.location.replace("/");
    };

    const handleToggle = (id: number) => {
        setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const getChildren = (parentId: number | null) =>
        AdminMenuList.filter((item) => item.parent_id === parentId);

    const isMenuActive = (menu: any) =>
        location.pathname === menu.path ||
        AdminMenuList.some(
            (m) => m.parent_id === menu.id && location.pathname === m.path
        );

    useEffect(() => {
        const activeMenu = AdminMenuList.find(
            (menu) => location.pathname === menu.path
        );
        if (activeMenu?.parent_id) {
            setOpenMenus((prev) => ({
                ...prev,
                [Number(activeMenu.parent_id)]: true,
            }));
        }
    }, [location.pathname]);

    const renderMenus = (parentId: number | null) =>
        getChildren(parentId).map((menu) => {
            const children = getChildren(menu.id);
            const isOpen = openMenus[menu.id];
            const active = isMenuActive(menu);

            return (
                <li
                    key={menu.id}
                    className={`cursor-pointer rounded-[10px] hover:bg-[#F2FAF8] hover:font-bold ${
                        active
                            ? "text-[#21A089] bg-[#F2FAF8]"
                            : "text-[#666666]"
                    }`}
                >
                    <div
                        className={`px-[15px] hover:text-[#21A089] ${
                            active && children.length
                                ? "text-[#21A089] border-b border-[#D6E2DF]"
                                : ""
                        }`}
                    >
                        {children.length > 0 ? (
                            <div
                                onClick={() => handleToggle(menu.id)}
                                className="flex items-center py-3"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) =>
                                    (e.key === "Enter" || e.key === " ") &&
                                    handleToggle(menu.id)
                                }
                            >
                                {/* 메뉴 아이콘 */}
                                <div className="mr-[15px] text-[25px]">
                                    {menu.icon}
                                </div>
                                <span
                                    className={`block w-full h-full ${
                                        active ? "font-bold" : ""
                                    }`}
                                >
                                    {menu.name}
                                </span>
                                <button className="flex justify-center items-center mr-2">
                                    <img
                                        src={
                                            isOpen
                                                ? "/assets/icon/minus.svg"
                                                : "/assets/icon/plus.svg"
                                        }
                                        alt=""
                                    />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to={menu.path}
                                className="flex items-center py-3"
                            >
                                {/* 메뉴 아이콘 */}
                                <div className="mr-[15px] text-[25px]">
                                    {menu.icon}
                                </div>

                                <span
                                    className={`block w-full h-full ${
                                        active ? "font-bold text-[#21A089]" : ""
                                    }`}
                                >
                                    {menu.name}
                                </span>
                            </Link>
                        )}
                    </div>

                    {isOpen && children.length > 0 && (
                        <ul className="px-5 py-[15px]">
                            {renderSubMenus(children)}
                        </ul>
                    )}
                </li>
            );
        });

    const renderSubMenus = (menus: any[]) =>
        menus.map((menu) => {
            const children = getChildren(menu.id);
            const isOpen = openMenus[menu.id];
            const active = location.pathname === menu.path;

            return (
                <li key={menu.id} className="mb-[15px] last:mb-0">
                    <div className="cursor-pointer hover:font-bold text-md">
                        {children.length > 0 ? (
                            <div
                                className="flex items-center"
                                onClick={() => handleToggle(menu.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) =>
                                    (e.key === "Enter" || e.key === " ") &&
                                    handleToggle(menu.id)
                                }
                            >
                                <button className="flex justify-center items-center mr-[10px]">
                                    <img
                                        src={
                                            isOpen
                                                ? "/assets/icon/triangle-down.svg"
                                                : "/assets/icon/triangle-right.svg"
                                        }
                                        alt=""
                                    />
                                </button>
                                <span
                                    className={`block w-full h-full font-medium ${
                                        isOpen
                                            ? "text-[#21A089]"
                                            : "text-[#777777]"
                                    }`}
                                >
                                    {menu.name}
                                </span>
                            </div>
                        ) : (
                            <Link
                                to={menu.path}
                                className="flex items-center ml-[10px] py-2 hover:font-bold text-md"
                            >
                                <span
                                    className={`block w-full h-full font-medium ${
                                        active
                                            ? "text-[#21A089]"
                                            : "text-[#777777]"
                                    }`}
                                >
                                    {menu.name}
                                </span>
                            </Link>
                        )}

                        {isOpen && (
                            <div className="ml-[20px] mt-[10px]">
                                {getChildren(menu.id).map((sub) => (
                                    <Link
                                        key={sub.id}
                                        to={sub.path}
                                        className="block w-full h-full px-[15px] my-[10px] last:my-0 hover:font-bold text-[15px]"
                                    >
                                        <span
                                            className={`font-medium ${
                                                location.pathname === sub.path
                                                    ? "text-[#21A089]"
                                                    : "text-[#999999]"
                                            }`}
                                        >
                                            <span className="mr-[10px]">-</span>
                                            {sub.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </li>
            );
        });

    if (!user.name) return null;

    return (
        <nav className="flex flex-col w-[300px] pt-[30px] px-[20px] border-r border-[#D5EBE8]">
            <Link to={"/"} className="w-3/4 mx-auto">
                <img src="/assets/image/logo.svg" alt="Logo" />
            </Link>
            <ul className="flex flex-col gap-1 mt-10 flex-grow">
                {renderMenus(null)}
            </ul>
            <div className="px-5 py-3 text-[#999999] mb-14">
                <button onClick={logout}>로그아웃</button>
            </div>
        </nav>
    );
};

export { AdminSideNavbar };

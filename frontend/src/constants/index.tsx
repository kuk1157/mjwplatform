// Header 메뉴
const MenuList = [
    {
        id: 0,
        name: "notice",
        path: "/notice",
        is_active: "y",
    },
];

const AdminMenuList = [
    {
        id: 1,
        name: "사용자 관리",
        path: "/admin/user",
        parent_id: null,
        seq: 3,
        is_active: "Y",
    },
    {
        id: 2,
        name: "공지사항 관리",
        path: "/admin/notice",
        parent_id: null,
        seq: 3,
        is_active: "Y",
    },
    // {
    //     id: 3,
    //     name: "공지사항 서브메뉴 테스트1",
    //     path: "/admin/notice",
    //     parent_id: 2,
    //     seq: 3,
    //     is_active: "Y",
    // },
    // {
    //     id: 4,
    //     name: "공지사항 서브메뉴 테스트2",
    //     path: "/admin/notice",
    //     parent_id: 3,
    //     seq: 3,
    //     is_active: "Y",
    // },
];

const UserRoleList = [
    { id: 1, name: "admin", value: "최고 관리자" },
    { id: 2, name: "owner", value: "점주" },
    { id: 2, name: "user", value: "고객(손님)" },
];

const SocialDomain = ["gmail.com", "naver.com", "daum.net", "hanmail.net"];
export { MenuList, AdminMenuList, SocialDomain, UserRoleList };

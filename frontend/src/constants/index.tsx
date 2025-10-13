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
    {
        id: 3,
        name: "매장관리",
        path: "/admin/store",
        parent_id: null,
        seq: 3,
        is_active: "Y",
    },
    {
        id: 4,
        name: "매장관리",
        path: "/admin/store",
        parent_id: 3,
        seq: 3,
        is_active: "Y",
    },
    {
        id: 5,
        name: "매장테이블 관리",
        path: "/admin/store/storeTablePage",
        parent_id: 3,
        seq: 3,
        is_active: "Y",
    },

    {
        id: 6,
        name: "통계",
        path: "/admin/analytics/trafficAnalytics",
        parent_id: null,
        seq: 3,
        is_active: "Y",
    },

    {
        id: 7,
        name: "접속 통계",
        path: "/admin/analytics/trafficAnalytics",
        parent_id: 6,
        seq: 3,
        is_active: "Y",
    },

    {
        id: 8,
        name: "포인트 통계",
        path: "/admin/analytics/pointAnalytics",
        parent_id: 6,
        seq: 3,
        is_active: "Y",
    },
];

const UserRoleList = [
    { id: 1, name: "admin", value: "최고 관리자" },
    { id: 2, name: "owner", value: "점주" },
];

const SocialDomain = ["gmail.com", "naver.com", "daum.net", "hanmail.net"];
export { MenuList, AdminMenuList, SocialDomain, UserRoleList };

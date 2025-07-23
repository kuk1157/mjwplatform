import { lazy } from "react";
import Loadable from "../utils/Loadable";
import { createBrowserRouter } from "react-router-dom";

// /* ****Pages***** */
const Main = Loadable({
    Component: lazy(() => import("../components/pages/main")),
});

// 임시 매장 테이블 페이지
const TestStoreTable = Loadable({
    Component: lazy(() => import("../components/pages/testStoreTable")),
});

const MainLayoutLoader = Loadable({
    Component: lazy(() => import("../components/organisms/mainLayout")),
});
const PageLayoutLoader = Loadable({
    Component: lazy(() => import("../components/organisms/pageLayout")),
});
const AdminLayoutLoader = Loadable({
    Component: lazy(() => import("../components/organisms/adminLayout")),
});
const Notice = Loadable({
    Component: lazy(() => import("../components/pages/notice")),
});
const NoticeDetail = Loadable({
    Component: lazy(() => import("../components/pages/noticeDetail")),
});
const Login = Loadable({
    Component: lazy(() => import("../components/pages/login")),
});
const SignUp = Loadable({
    Component: lazy(() => import("../components/pages/signUp")),
});
const FindLoginId = Loadable({
    Component: lazy(() => import("../components/pages/findLoginId")),
});
const FindPassword = Loadable({
    Component: lazy(() => import("../components/pages/findPassword")),
});
const MyPage = Loadable({
    Component: lazy(() => import("../components/pages/myPage/myInfo")),
});
const ChangePassword = Loadable({
    Component: lazy(() => import("../components/pages/myPage/changePassword")),
});

// [관리자 전산] /admin

const AdminLogin = Loadable({
    Component: lazy(() => import("../components/pages/admin/login")),
});

// 공지사항 관리)
// 공지사항 관리 - 공지사항 목록
const AdminNotice = Loadable({
    Component: lazy(() => import("../components/pages/admin/notice")),
});

const AdminNoticeDetail = Loadable({
    Component: lazy(() => import("../components/pages/admin/noticeDetail")),
});

// 기존 공지사항 놔두고 사용자 관리 기준으로 레이아웃 맞추는 용도(임시)
const AdminNoticetest = Loadable({
    Component: lazy(() => import("../components/pages/admin/noticeTest")),
});

// 공지사항 관리 - 공지사항 등록
const AdminNoticeCreate = Loadable({
    Component: lazy(() => import("../components/pages/admin/noticeCreate")),
});

// 공지사항 관리 - 공지사항 수정
const AdminNoticeEdit = Loadable({
    Component: lazy(() => import("../components/pages/admin/noticeEdit")),
});

// 사용자 관리)
// 사용자 관리 - 사용자 목록
const AdminUser = Loadable({
    Component: lazy(() => import("../components/pages/admin/user")),
});

// 사용자관리 - 사용자 등록
const AdminUserCreate = Loadable({
    Component: lazy(() => import("../components/pages/admin/userCreate")),
});

// 사용자관리 - 사용자 상세보기(삭제는 아래 버튼에서 바로 진행)
const AdminUserDetail = Loadable({
    Component: lazy(() => import("../components/pages/admin/userDetail")),
});

// 사용자관리 - 사용자 수정
const AdminUserEdit = Loadable({
    Component: lazy(() => import("../components/pages/admin/userEdit")),
});

// 매장 관리)
// 매장 관리 - 매장 목록
const AdminStore = Loadable({
    Component: lazy(() => import("../components/pages/admin/store")),
});

// 매장 관리 - 매장 등록
const AdminStoreCreate = Loadable({
    Component: lazy(() => import("../components/pages/admin/storeCreate")),
});

// 매장 관리 - 매장 상세보기
const AdminStoreDetail = Loadable({
    Component: lazy(() => import("../components/pages/admin/storeDetail")),
});

// 매장 관리 - 매장 수정
const AdminStoreEdit = Loadable({
    Component: lazy(() => import("../components/pages/admin/storeEdit")),
});

const Router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayoutLoader />,
        children: [
            { index: true, element: <Main /> },
            { path: "/login", element: <Login /> },
            { path: "/login/find/findLoginId", element: <FindLoginId /> },
            { path: "/login/find/findPassword", element: <FindPassword /> },
            { path: "/sign-up", element: <SignUp /> },
            {
                path: "/myPage/myInfo",
                element: <MyPage />,
            },
            {
                path: "/myPage/changePassword",
                element: <ChangePassword />,
            },

            {
                path: "/testStoreTable",
                element: <TestStoreTable />,
            },
            {
                element: <PageLayoutLoader />,
                children: [
                    { path: "/notice", element: <Notice /> },
                    { path: "/notice/:id", element: <NoticeDetail /> },
                ],
            },
        ],
    },
    {
        path: "/admin",
        element: <AdminLayoutLoader />,
        children: [
            {
                index: true,
                element: <AdminLogin />,
            },
            // 공지사항 관리)
            {
                path: "/admin/notice",
                element: <AdminNotice />,
            },

            // 공지사항 관리 - 공지사항 임시 test
            {
                path: "/admin/noticeTest",
                element: <AdminNoticetest />,
            },

            // 공지사항 관리 - 공지사항 등록
            {
                path: "notice/noticeCreate",
                element: <AdminNoticeCreate />,
            },

            // 공지사항 관리 - 공지사항 상세보기
            {
                path: "notice/noticeDetail/:id",
                element: <AdminNoticeDetail />,
            },

            // 공지사항 관리 - 공지사항 수정
            {
                path: "notice/noticeEdit/:id",
                element: <AdminNoticeEdit />,
            },

            // 사용자관리)
            {
                path: "/admin/user",
                element: <AdminUser />,
            },

            // 사용자관리 - 사용자 등록
            {
                path: "/admin/user/userCreate/",
                element: <AdminUserCreate />,
            },

            // 사용자관리 - 사용자 상세보기
            {
                path: "/admin/user/userDetail/:id",
                element: <AdminUserDetail />,
            },

            // 사용자관리 - 사용자 수정
            {
                path: "/admin/user/userEdit/:id",
                element: <AdminUserEdit />,
            },

            // 매장관리)
            {
                path: "/admin/store",
                element: <AdminStore />,
            },

            // 매장관리 - 매장 등록
            {
                path: "/admin/store/storeCreate/",
                element: <AdminStoreCreate />,
            },

            // 매장관리 - 매장 수정
            {
                path: "/admin/store/storeEdit/:id",
                element: <AdminStoreEdit />,
            },

            // 매장관리 - 매장 상세보기
            {
                path: "/admin/store/storeDetail/:id",
                element: <AdminStoreDetail />,
            },

            // {
            //     path: "/admin/user/update",
            //     element: <AdminUser />,
            // },
        ],
    },
]);

export default Router;

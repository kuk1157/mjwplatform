import { lazy } from "react";
import Loadable from "../utils/Loadable";
import { createBrowserRouter } from "react-router-dom";

// /* ****Pages***** */
const Main = Loadable({
    Component: lazy(() => import("../components/pages/main")),
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

// [홈페이지에서 메뉴]

// 가맹점 리스트
const HomePageStoreList = Loadable({
    Component: lazy(() => import("../components/pages/homePage/store/store")),
});

// 가맹점 상세보기
const HomePageStoreDetail = Loadable({
    Component: lazy(
        () => import("../components/pages/homePage/store/storeDetail")
    ),
});

// 입점문의 첫 페이지(등록,문의 2가지 버튼)
const HomePageStoreInquiry = Loadable({
    Component: lazy(
        () => import("../components/pages/homePage/inquiry/storeInquiry")
    ),
});

// 입점문의 등록
const HomePageStoreInquiryCreate = Loadable({
    Component: lazy(
        () => import("../components/pages/homePage/inquiry/storeInquiryCreate")
    ),
});

// 입점문의 확인
const HomePageStoreInquirySearch = Loadable({
    Component: lazy(
        () => import("../components/pages/homePage/inquiry/storeInquirySearch")
    ),
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

// 매장 테이블 관리 - 매장테이블 페이지(매장 목록 먼저 보여주고 우측에서 매장테이블 보기 클릭)
const AdminStoreTablePage = Loadable({
    Component: lazy(() => import("../components/pages/admin/storeTablePage")),
});

// 매장 테이블 관리 - 매장테이블 목록
const AdminStoreTableList = Loadable({
    Component: lazy(() => import("../components/pages/admin/storeTableList")),
});

// 매장 테이블 관리 - 매장 테이블 등록
const AdminStoreTableCreate = Loadable({
    Component: lazy(() => import("../components/pages/admin/storeTableCreate")),
});

// 매장 테이블 관리 - 매장 테이블 상세보기
const AdminStoreTableDetail = Loadable({
    Component: lazy(() => import("../components/pages/admin/storeTableDetail")),
});

// 통계 - 접속 통계
const AdminTrafficAnalyticsPage = Loadable({
    Component: lazy(() => import("../components/pages/admin/trafficAnalytics")),
});

// 통계 - 포인트 통계
const AdminPointAnalyticsPage = Loadable({
    Component: lazy(() => import("../components/pages/admin/pointAnalytics")),
});

// 통계 - 현금화 통계
const AdminCashAnalyticsPage = Loadable({
    Component: lazy(() => import("../components/pages/admin/cashAnalytics")),
});

// [ 메인에서 곧바로 진행되는 페이지들 ] - 곧 정리할 예정

// PC - 고객 매장선택 페이지
const UserVisitStore = Loadable({
    Component: lazy(() => import("../components/pages/user/userVisitStore")),
});

// PC - 고객 매장테이블 QR인증 페이지
const UserVisitStoreQR = Loadable({
    Component: lazy(() => import("../components/pages/user/userVisitStoreQR")),
});

// 임시 socket 테스트 페이지
const SocketTest = Loadable({
    Component: lazy(() => import("../components/pages/socketTest")),
});

// 임시 각 주문 금액 입력 페이지
const StoreVisit = Loadable({
    Component: lazy(() => import("../components/pages/storeVisit")),
});

// 임시 매장 테이블 페이지
const TestStoreTable = Loadable({
    Component: lazy(() => import("../components/pages/testStoreTable")),
});

// [점주용]

// 점주용 웹 플랫폼 메인 대시보드
const OwnerDashBoard = Loadable({
    Component: lazy(() => import("../components/pages/owner/dashBoard")),
});

// 점주용 매장 결제 조회 페이지
const OwnerPayList = Loadable({
    Component: lazy(() => import("../components/pages/owner/ownerPayList")),
});

// 점주용 매장 결제 내역 조회 페이지
const OwnerPayLogList = Loadable({
    Component: lazy(() => import("../components/pages/owner/ownerPayLogList")),
});

// 점주용 매장 포인트 조회 페이지
const OwnerPointList = Loadable({
    Component: lazy(() => import("../components/pages/owner/ownerPointList")),
});

// 점주용 매장 테이블 조회 페이지
const OwnerStoreTableList = Loadable({
    Component: lazy(
        () => import("../components/pages/owner/ownerStoreTableList")
    ),
});

// 점주용 전체 방문 기록
const OwnerAllVisitLogList = Loadable({
    Component: lazy(() => import("../components/pages/owner/ownerAllVisitLog")),
});

// 점주용 현금 신청 내역 조회 페이지
const OwnerCashList = Loadable({
    Component: lazy(() => import("../components/pages/owner/ownerCashList")),
});

// [모바일]

// 모바일 로그인 페이지
const MobileLogin = Loadable({
    Component: lazy(() => import("../components/pages/mobile/login")),
});

// 모바일 고객 메인페이지
const MobileMainPage = Loadable({
    Component: lazy(() => import("../components/pages/mobile/mainPage")),
});

// 모바일 고객 마이페이지(나의정보)
const MobileMyPage = Loadable({
    Component: lazy(() => import("../components/pages/mobile/myPage")),
});

// 모바일 고객 지갑 정보
const MobileMyWallet = Loadable({
    Component: lazy(() => import("../components/pages/mobile/myWallet")),
});

// 모바일 고객 나의 NFT 목록
const MobileMyNftList = Loadable({
    Component: lazy(() => import("../components/pages/mobile/myNftList")),
});

// 모바일 NFT 상세보기
const MobileNftDetail = Loadable({
    Component: lazy(() => import("../components/pages/mobile/nftDetail")),
});

// 모바일 고객 나의 방문 기록 목록
const MobileMyVisitLogList = Loadable({
    Component: lazy(() => import("../components/pages/mobile/myVisitLogList")),
});

// 모바일 고객 나의 방문 스탬프 목록
const MobileMyStamp = Loadable({
    Component: lazy(() => import("../components/pages/mobile/myStamp")),
});

// 모바일 나의 방문 스탬프 상세보기
const MobileMyStampDetail = Loadable({
    Component: lazy(() => import("../components/pages/mobile/stampDetail")),
});

// 모바일 가맹점 목록
const MobileStoreList = Loadable({
    Component: lazy(() => import("../components/pages/mobile/storeList")),
});

// 모바일 가맹점 상세보기
const MobileStoreDetail = Loadable({
    Component: lazy(() => import("../components/pages/mobile/storeDetail")),
});

// 모바일 공지사항 목록
const MobileNoticeList = Loadable({
    Component: lazy(() => import("../components/pages/mobile/noticeList")),
});

// 모바일 공지사항 상세보기
const MobileNoticeDetail = Loadable({
    Component: lazy(() => import("../components/pages/mobile/noticeDetail")),
});

// 모바일 고객등급 안내
const MobileGradeGuide = Loadable({
    Component: lazy(() => import("../components/pages/mobile/gradeGuide")),
});

// 모바일 입점 문의
const MobileStoreInquiry = Loadable({
    Component: lazy(() => import("../components/pages/mobile/storeInquiry")),
});

// 모바일 입점 문의 등록
const MobileStoreInquiryCreate = Loadable({
    Component: lazy(() => import("../components/pages/mobile/inquiryCreate")),
});

// 모바일 입점 문의 확인(항목 입력 후 리스트 확인)
const MobileStoreInquirySearch = Loadable({
    Component: lazy(() => import("../components/pages/mobile/inquirySearch")),
});

// 모바일 나의 결제 내역
const MobileMyPayList = Loadable({
    Component: lazy(() => import("../components/pages/mobile/myPayList")),
});

const Router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayoutLoader />,
        children: [
            // { index: true, element: <Navigate to={"/admin"} /> }, // 임시로 무조건 admin으로 가도록
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
                path: "/storeVisit",
                element: <StoreVisit />,
            },

            // [홈페이지]

            // 가맹점 목록
            {
                path: "/store/store",
                element: <HomePageStoreList />,
            },

            // 가맹점 상세보기
            {
                path: "/store/store/:id",
                element: <HomePageStoreDetail />,
            },

            // 입점 문의 메인페이지
            {
                path: "/inquiry/storeInquiry",
                element: <HomePageStoreInquiry />,
            },

            // 입점 문의 등록
            {
                path: "/inquiry/storeInquiryCreate",
                element: <HomePageStoreInquiryCreate />,
            },

            // 입점 문의 입점 확인
            {
                path: "/inquiry/storeInquirySearch",
                element: <HomePageStoreInquirySearch />,
            },

            // socket 테스트 페이지
            {
                path: "/socketTest",
                element: <SocketTest />,
            },

            // [ owner - 점주 ]
            // 점주용 웹 플랫폼 메인 대시보드
            {
                path: "/owner/dashBoard",
                element: <OwnerDashBoard />,
            },

            // 점주용 매장 결제 조회
            {
                path: "/owner/ownerPayList",
                element: <OwnerPayList />,
            },

            // 점주용 매장 결제 로그 조회
            {
                path: "/owner/ownerPayLogList",
                element: <OwnerPayLogList />,
            },

            // 점주용 매장 포인트 조회
            {
                path: "/owner/ownerPointList",
                element: <OwnerPointList />,
            },

            // 점주용 매장 테이블 조회
            {
                path: "/owner/ownerStoreTableList/:storeId",
                element: <OwnerStoreTableList />,
            },
            // 점주용 방문기록 조회
            {
                path: "/owner/ownerAllVisitLog/:storeId",
                element: <OwnerAllVisitLogList />,
            },
            // 점주용 현금 신청 내역 조회
            {
                path: "/owner/ownerCashList/:storeId",
                element: <OwnerCashList />,
            },

            // [ user - 고객 ]
            // 고객 매장 방문 및 QR인증
            {
                path: "/user/userVisitStore",
                element: <UserVisitStore />,
            },

            {
                path: "/user/userVisitStoreQR/:storeId",
                element: <UserVisitStoreQR />,
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

            // 매장테이블 관리)
            // 매장테이블 관리 - 매장테이블 페이지(매장 목록 먼저 보여주고 우측에서 매장테이블 보기 클릭)
            {
                path: "/admin/store/storeTablePage",
                element: <AdminStoreTablePage />,
            },

            // 매장테이블 관리 - 매장테이블 목록
            {
                path: "/admin/store/:storeId/storeTableList",
                element: <AdminStoreTableList />,
            },

            // 매장테이블 관리 - 매장테이블 등록
            {
                path: "/admin/store/:storeId/storeTableCreate",
                element: <AdminStoreTableCreate />,
            },

            // 매장테이블 관리 - 매장테이블 상세보기
            {
                path: "/admin/store/:storeId/storeTableDetail/:id",
                element: <AdminStoreTableDetail />,
            },

            // 통계)
            // 접속 통계
            {
                path: "/admin/analytics/trafficAnalytics",
                element: <AdminTrafficAnalyticsPage />,
            },

            // 포인트 통계
            {
                path: "/admin/analytics/pointAnalytics",
                element: <AdminPointAnalyticsPage />,
            },

            // 현금화 통계
            {
                path: "/admin/analytics/CashAnalytics",
                element: <AdminCashAnalyticsPage />,
            },

            // {
            //     path: "/admin/user/update",
            //     element: <AdminUser />,
            // },
        ],
    },
    // 모바일 로그인(다대구 로그인 버튼)
    {
        path: "/mobile/login/:storeNum/:tableNumber",
        element: <MobileLogin />,
    },

    // 모바일 고객 메인페이지
    {
        path: "/mobile/mainPage/",
        element: <MobileMainPage />,
    },

    // 모바일 고객 마이페이지(나의정보)
    {
        path: "/mobile/myPage/",
        element: <MobileMyPage />,
    },

    // 모바일 고객 마이페이지(나의정보)
    {
        path: "/mobile/myWallet/",
        element: <MobileMyWallet />,
    },

    // 모바일 고객 나의 NFT 목록
    {
        path: "/mobile/myNftList/",
        element: <MobileMyNftList />,
    },

    // 모바일 나의 NFT 상세보기
    {
        path: "/mobile/nftDetail/:id",
        element: <MobileNftDetail />,
    },

    // 모바일 고객 나의 방문 기록 목록
    {
        path: "/mobile/myVisitLogList/",
        element: <MobileMyVisitLogList />,
    },

    // 모바일 나의 스탬프 목록
    {
        path: "/mobile/myStamp/",
        element: <MobileMyStamp />,
    },

    // 모바일 나의 스탬프 상세보기
    {
        path: "/mobile/stampDetail/:id/:storeId",
        element: <MobileMyStampDetail />,
    },

    // 모바일 가맹점 목록
    {
        path: "/mobile/storeList/",
        element: <MobileStoreList />,
    },

    // 모바일 가맹점 상세보기
    {
        path: "/mobile/storeDetail/:id",
        element: <MobileStoreDetail />,
    },

    // 모바일 공지사항 목록
    {
        path: "/mobile/noticeList/",
        element: <MobileNoticeList />,
    },

    // 모바일 공지사항 상세보기
    {
        path: "/mobile/noticeDetail/:id",
        element: <MobileNoticeDetail />,
    },

    // 모바일 고객 등급 안내
    {
        path: "/mobile/gradeGuide",
        element: <MobileGradeGuide />,
    },

    // 모바일 입점문의
    {
        path: "/mobile/storeInquiry",
        element: <MobileStoreInquiry />,
    },

    // 모바일 입점문의 등록
    {
        path: "/mobile/inquiryCreate",
        element: <MobileStoreInquiryCreate />,
    },

    // 모바일 입점문의 확인(항목 검색 후 리스트 보여주기)
    {
        path: "/mobile/inquirySearch",
        element: <MobileStoreInquirySearch />,
    },

    // 모바일 나의 결제 내역
    {
        path: "/mobile/myPayList",
        element: <MobileMyPayList />,
    },
]);

export default Router;

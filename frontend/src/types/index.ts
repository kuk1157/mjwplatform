export interface DataTableProps {
    data: { [key: string]: any }[];
    columns?: any;
    columnWidths?: string[];
    type: string;
    ref?: React.Ref<{
        getCheckedItems: () => any[];
    }>;
    startIndex?: number;
    handleRowSelect?: any;
    handleRoleChange?: any;
    handleIsConfirmed?: any;
    handleIsActive?: any;
}

export interface IfindLoginIdProps {
    email: string;
    setEmail: (email: string) => void;
    isSentEmail: boolean;
    handleSendEmail: () => Promise<void>;
}

export interface IfindPasswordProps {
    loginId: string;
    setLoginId: (loginId: string) => void;
    isCheckedId: boolean;
    handleCheckLoginId: () => Promise<void>;
    email: string;
    setEmail: (email: string) => void;
    handleEmailSubmit: () => Promise<void>;
    verifyTime: number;
    sendVerify: boolean;
    verifyNumber: string;
    setVerifyNumber: (number: string) => void;
    isVerify: boolean;
    handleVerify: () => Promise<void>;
    createNewPassword: boolean;
    setCreateNewPassword: (createNewPassword: boolean) => void;
    password: string;
    setPassword: (password: string) => void;
    checkPassword: string;
    setCheckPassword: (password: string) => void;
    invalid: boolean;
    mismatch: boolean;
    onSave: () => Promise<void>;
}
export interface CardGroupProps {
    data: { [key: string]: any }[];
}

export interface IPaginationProps {
    totalItemsCount: number;
    activePage: number;
    itemsCountPerPage: number;
    paginationOnChange: (pageNumber: number) => void;
}

// 메인페이지 - 새소식
export interface NewsDataType {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    author: string;
    createdAt: string;
    view: number;
}

// 메인페이지 - 이번 주 신규, 인기 자료
export interface WeeklyDataType {
    id: string;
    url: string;
    title: string;
    views: number;
    path: string;
    createdAt?: number;
    view?: number;
    uuid?: string;
    thumbnailExtension?: string;
}

// 새소식 - 공지사항
export interface NoticeDataType {
    id: string;
    title: string;
    description?: string;
    createdAt?: string;
    view_count?: number;
}

export interface BookDataType {
    id: string;
    uuid: string;
    menuName: string;
    title: string;
    author: string;
    publisher: string;
    publishAt: Date;
    thumbnailExtension: string;
}

export type Gender = "m" | "f" | null;
export type Role =
    | "super_admin"
    | "consultant"
    | "school_admin"
    | "school_student"
    | "school_parent"
    | "school_teacher"
    | "organ_admin"
    | "organ_user"
    | "organ_parent"
    | "organ_supporter"
    | "general_client"
    | "general_guardian";
export type IsActive = "y" | "n";

/** 멤버테이블 타입 */
export interface Member {
    id: number; // 고유번호 활용
    loginId?: string;
    password?: string;
    name: string;
    gender: Gender;
    birthday: string;
    totalPoint: number;
    totalCash: number;
    role: Role;
    isActive: IsActive;
}

// 고객

export type CustomerGrade = "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";
export type CouponAvailable = "Y" | "N";
export type CouponStatus = "Y" | "N";
export interface Customer {
    id: number;
    memberId: number;
    customerGrade: CustomerGrade;
    couponAvailable: CouponAvailable;
    couponStatus: CouponStatus;
}

// 매장(store) 정보 가져오기
export interface StoreType {
    id: number;
    ownerId: number;
    name?: string;
    address?: string;
    thumbnail: string;
    extension: string;
}

// 매장(store) 정보 상세조회용..
export interface StoreDetailType extends StoreType {
    ownerName: string;
    createdAt: string;
}

// 매장 테이블(store_table) 정보 가져오기
export interface StoreTable {
    id: number;
    storeId: number;
    tableNumber: number;
}

// 고객 매장 방문 스탬프
export interface StoreStamp {
    id: number;
    customerId: number;
    storeId: number;
    createdAt: string;
}

// NFT
export interface Nft {
    id: number;
    tokenId: number;
    storeId: number;
    customerId: number;
    storeName?: string;
    createdAt: string;
}

// 방문기록
export interface VisitLog {
    id: number;
    storeId: number;
    storeTableId: number;
    customerId: number;
    storeName?: string;
    memberName?: string;
    paymentStatus: "y" | "n"; // 결제 완료 여부
    visitStatus: "y" | "n"; // 방문 완료 여부
    createdAt: string;
}

// 현금화 신청
export interface pointCashOutRequest {
    id: number;
    storeId: number;
    ownerId: number;
    cash: number;
    requestAt: string;
}

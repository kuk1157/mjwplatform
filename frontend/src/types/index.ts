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
    loginId?: string;
    password?: string;
    name: string;
    gender: Gender;
    birthday: string;
    role: Role;
    isActive: IsActive;
}

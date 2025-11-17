import { Link, useLocation } from "react-router-dom";
import { Button } from "../atoms/button";
import { PageTitle } from "../atoms/title";
import { formatTimeCount } from "src/utils/common";
import { SocialDomain } from "src/constants/index";

const MyInfo = ({
    ...props
}: {
    name: string;
    setName: (name: string) => void;
    loginId: string;
    birthday: string;
    email: string;
    setEmail: (email: string) => void;
    emailDomain: string;
    setEmailDomain: (domain: string) => void;
    customDomain: string;
    setCustomDomain: (domain: string) => void;
    phoneNumber: string;
    setPhoneNumber: (phoneNumber: string) => void;
    handleEmailSubmit: () => Promise<void>;
    verifyTime: number;
    sendVerify: boolean;
    verifyNumber: string;
    setVerifyNumber: (number: string) => void;
    isVerify: boolean;
    handleVerify: () => Promise<void>;
    onSave: () => Promise<void>;
    handleDeleteMember: () => Promise<void>;
    emailLoading: boolean;
}) => {
    const {
        name,
        setName,
        loginId,
        birthday,
        email,
        setEmail,
        emailDomain,
        setEmailDomain,
        customDomain,
        setCustomDomain,
        phoneNumber,
        setPhoneNumber,
        handleEmailSubmit,
        verifyTime,
        sendVerify,
        verifyNumber,
        setVerifyNumber,
        isVerify,
        handleVerify,
        onSave,
        handleDeleteMember,
        emailLoading,
    } = props;
    const location = useLocation().pathname;
    return (
        <div className="ml-[70px] flex flex-col w-full h-full max-w-[750px] border border-[#580098] rounded-3xl p-12 lg:ml-0 lg:max-w-none min-h-screen">
            <div className="lg:flex gap-3 pb-[30px] w-full hidden">
                <Link
                    to={"/myPage/myInfo"}
                    className={`border rounded-[10px] w-full h-fit p-[15px] flex flex-col gap-[8px] text-[15px] leading-[18px] tracking-[-0.6px] xs:text-[13px] xs:px-3 ${location.includes("myInfo") ? "border-[#21a089] bg-[#F2FAF8]" : "border-[#EEEEEE] bg-white"} sm:text-[13px] sm:p-2`}
                >
                    <p
                        className={
                            location.includes("myInfo")
                                ? "text-[#21a089] font-semibold"
                                : "font-semibold"
                        }
                    >
                        내 정보 변경
                    </p>
                </Link>
                <Link
                    to={"/myPage/changePassword"}
                    className={`border rounded-[10px] w-full h-fit p-[15px] flex flex-col gap-[8px] text-[15px] leading-[18px] tracking-[-0.6px] xs:text-[13px] xs:px-3 ${location.includes("changePassword") ? "border-[#21a089] bg-[#F2FAF8]" : "border-[#EEEEEE] bg-white"} sm:text-[13px] sm:p-2`}
                >
                    <p
                        className={
                            location.includes("changePassword")
                                ? "text-[#21a089] font-semibold"
                                : "font-semibold"
                        }
                    >
                        비밀번호 변경
                    </p>
                </Link>
            </div>
            <div className="mb-[30px] xs:mb-[10px] xs:mt-[20px] border-b border-[#333] border-opacity-20 pb-[30px]">
                <PageTitle className="xs:text-[25px]">내 정보 변경</PageTitle>
            </div>
            <div className="flex flex-col gap-[20px]">
                <div className="flex flex-col gap-[10px]">
                    <span className="text-[#333] text-[17px] xs:text-[15px] leading-[25px] font-bold">
                        이름
                    </span>
                    <input
                        type="text"
                        className="w-full bg-[#f7f7f7] text-[15px] rounded-[5px] h-[40px] px-[15px]"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-[10px]">
                    <span className="text-[#333] text-[17px] xs:text-[15px] leading-[25px] font-bold">
                        아이디
                    </span>
                    <input
                        type="text"
                        className="w-full bg-[#f7f7f7] text-[15px] rounded-[5px] h-[40px] px-[15px]"
                        value={loginId}
                        disabled
                    />
                </div>
                <div className="flex flex-col gap-[10px]">
                    <span className="text-[#333] text-[17px] xs:text-[15px] leading-[25px] font-bold">
                        생년월일
                    </span>
                    <input
                        type="text"
                        className="w-full bg-[#f7f7f7] text-[15px] rounded-[5px] h-[40px] px-[15px]"
                        value={birthday}
                        disabled
                    />
                </div>
                <div className="flex flex-col gap-[10px]">
                    <span className="text-[#333] text-[17px] xs:text-[15px] leading-[25px] font-bold">
                        계좌 번호
                    </span>
                    <input
                        type="text"
                        className="w-full bg-[#f7f7f7] text-[15px] rounded-[5px] h-[40px] px-[15px]"
                        disabled
                    />
                </div>
                <div>
                    <div className="flex flex-col gap-[10px]">
                        <span className="text-[#333] text-[17px] xs:text-[15px] leading-[25px] font-bold">
                            이메일
                        </span>
                        <div className="flex gap-[10px] items-center w-full">
                            <input
                                type="text"
                                className="w-1/2 bg-[#f7f7f7] text-[15px] rounded-[5px] h-[40px] px-[15px]"
                                value={email ?? ""}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={!isVerify}
                            />
                            <span>@</span>
                            <select
                                className="border border-[#f7f7f7] h-[40px] w-1/2 px-3 text-[15px]"
                                onChange={(e) => setEmailDomain(e.target.value)}
                                value={emailDomain}
                                disabled={!isVerify}
                            >
                                <option>----------</option>
                                {SocialDomain.map((item, index: number) => (
                                    <option key={index} value={item}>
                                        {item}
                                    </option>
                                ))}
                                <option value="etc">직접 입력</option>
                            </select>
                            {emailDomain == "etc" && (
                                <input
                                    type="text"
                                    className="w-1/2 bg-[#f7f7f7] text-[15px] rounded-[5px] h-[40px] px-[15px]"
                                    value={customDomain ?? ""}
                                    disabled={!isVerify}
                                    onChange={(e) =>
                                        setCustomDomain(e.target.value)
                                    }
                                />
                            )}
                            <Button
                                className={`${emailLoading || isVerify || verifyTime > 0 ? "bg-[#eee]" : "bg-[#580098]"} text-white rounded-[5px] text-nowrap px-5 h-[40px] text-[15px] xs:text-[13px] xs:px-3`}
                                onClick={handleEmailSubmit}
                                disabled={
                                    emailLoading || isVerify || sendVerify
                                }
                            >
                                인증번호 받기
                            </Button>
                        </div>
                    </div>
                    {verifyTime > 0 && (
                        <div className="flex gap-[10px] items-center w-full mt-[10px]">
                            <input
                                type="text"
                                className="w-1/2 bg-[#f7f7f7] text-[15px] rounded-[5px] h-[40px] px-[15px]"
                                value={verifyNumber ?? ""}
                                onChange={(e) =>
                                    setVerifyNumber(e.target.value)
                                }
                                placeholder="인증번호를 입력하세요"
                                disabled={isVerify}
                            />
                            <Button
                                className={`${isVerify ? "bg-[#eee]" : "bg-[#580098]"} text-white rounded-[5px] text-nowrap px-5 h-[40px]`}
                                onClick={handleVerify}
                            >
                                확인
                            </Button>
                            <div className="min-w-[53px] flex justify-center items-center">
                                {verifyTime > 0 && (
                                    <span className="text-red-700 text-[13px]">
                                        {formatTimeCount(verifyTime)}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-[10px]">
                    <span className="text-[#333] text-[17px] xs:text-[15px] leading-[25px] font-bold">
                        핸드폰 번호
                    </span>
                    <input
                        type="text"
                        className="w-full bg-[#f7f7f7] text-[15px] rounded-[5px] h-[40px] px-[15px]"
                        value={phoneNumber ?? ""}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <Link className="self-end" to={"/myPage/changePassword"}>
                    <Button className="bg-[#580098] text-white px-[20px] py-[10px] w-full rounded-[5px] text-[15px] xs:text-[13px] xs:px-3">
                        비밀번호 변경하기
                    </Button>
                </Link>
            </div>
            <div className="w-full flex justify-center mt-[50px]">
                <Button
                    className="bg-[#580098] text-white px-[60px] py-[18px] w-fit rounded-[5px] text-[20px] xs:text-[17px] xs:px-[40px] xs:py-[15px]"
                    onClick={onSave}
                >
                    저장하기
                </Button>
            </div>
            <div className="w-full flex justify-end mt-[50px]">
                <Button
                    className="bg-[#999] hover:bg-red-700 text-white px-[20px] py-[10px] w-fit rounded-[5px] text-[15px] xs:text-[13px] xs:px-3"
                    onClick={handleDeleteMember}
                >
                    탈퇴하기
                </Button>
            </div>
        </div>
    );
};

const ChangePassword = ({
    ...props
}: {
    currentPassword: string;
    setCurrentPassword: (password: string) => void;
    password: string;
    setPassword: (password: string) => void;
    checkPassword: string;
    setCheckPassword: (password: string) => void;
    mismatch: boolean;
    invalid: boolean;
    handleUpdatePassword: () => Promise<void>;
}) => {
    const {
        currentPassword,
        setCurrentPassword,
        password,
        setPassword,
        checkPassword,
        setCheckPassword,
        mismatch,
        invalid,
        handleUpdatePassword,
    } = props;
    const location = useLocation().pathname;
    return (
        <div className="ml-[70px] flex flex-col w-full h-full max-w-[800px] lg:ml-0 lg:max-w-none min-h-screen">
            <div className="lg:flex gap-3 pb-[30px] w-full hidden">
                <Link
                    to={"/myPage/myInfo"}
                    className={`border rounded-[10px] w-full h-fit p-[15px] flex flex-col gap-[8px] text-[15px] leading-[18px] tracking-[-0.6px] xs:text-[13px] xs:px-3 ${location.includes("myInfo") ? "border-[#21a089] bg-[#F2FAF8]" : "border-[#EEEEEE] bg-white"} sm:text-[13px] sm:p-2`}
                >
                    <p
                        className={
                            location.includes("myInfo")
                                ? "text-[#21a089] font-semibold"
                                : "font-semibold"
                        }
                    >
                        내 정보 변경
                    </p>
                </Link>
                <Link
                    to={"/myPage/changePassword"}
                    className={`border rounded-[10px] w-full h-fit p-[15px] flex flex-col gap-[8px] text-[15px] leading-[18px] tracking-[-0.6px] xs:text-[13px] xs:px-3 ${location.includes("changePassword") ? "border-[#21a089] bg-[#F2FAF8]" : "border-[#EEEEEE] bg-white"} sm:text-[13px] sm:p-2`}
                >
                    <p
                        className={
                            location.includes("changePassword")
                                ? "text-[#21a089] font-semibold"
                                : "font-semibold"
                        }
                    >
                        비밀번호 변경
                    </p>
                </Link>
            </div>
            <div className="flex flex-col gap-[20px]">
                <div className="mb-[30px] xs:mb-[10px] xs:mt-[20px] border-b border-[#333] border-opacity-20 pb-[30px]">
                    <PageTitle className="xs:text-[25px]">
                        비밀번호 변경
                    </PageTitle>
                </div>
                <div className="flex flex-col gap-[10px]">
                    <span className="text-[#333] text-[17px] xs:text-[15px] leading-[25px] font-bold">
                        현재 비밀번호
                    </span>
                    <input
                        type="password"
                        className="w-full bg-[#f7f7f7] text-[15px] rounded-[5px] h-[40px] px-[15px]"
                        placeholder="현재 비밀번호 입력"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-[10px]">
                    <span className="text-[#333] text-[17px] xs:text-[15px] leading-[25px] font-bold">
                        새 비밀번호
                    </span>
                    <div>
                        <input
                            type="password"
                            className="w-full bg-[#f7f7f7] text-[15px] rounded-[5px] h-[40px] px-[15px]"
                            placeholder="새 비밀번호 입력"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {invalid && (
                            <div className="flex justify-end">
                                <span className="text-[12px] text-[red] mr-[10px]">
                                    *영문 대소문자, 숫자, 특수문자를 포함하여
                                    8~20자로 설정해주세요.
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-[10px]">
                    <span className="text-[#333] text-[17px] xs:text-[15px] leading-[25px] font-bold">
                        비밀번호 확인
                    </span>
                    <div>
                        <input
                            type="password"
                            className="w-full bg-[#f7f7f7] text-[15px] rounded-[5px] h-[40px] px-[15px]"
                            placeholder="비밀번호 재입력"
                            value={checkPassword}
                            onChange={(e) => setCheckPassword(e.target.value)}
                        />
                        {mismatch && (
                            <div className="flex justify-end">
                                <span className="text-[12px] text-[red] mr-[10px]">
                                    *비밀번호가 일치하지 않습니다.
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center mt-[50px]">
                <Button
                    className="bg-[#21A089] text-white px-[60px] py-[18px] w-fit rounded-[5px] text-[20px] xs:text-[17px] xs:px-[40px] xs:py-[15px]"
                    onClick={handleUpdatePassword}
                >
                    저장하기
                </Button>
            </div>
        </div>
    );
};
export { MyInfo, ChangePassword };

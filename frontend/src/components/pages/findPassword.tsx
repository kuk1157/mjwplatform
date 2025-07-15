import { useEffect, useState } from "react";
import axios from "axios";
import {
    formatTimeCount,
    validateEmail,
    validatePassword,
} from "src/utils/common";
import { Link } from "react-router-dom";
import { Button, LoginButton } from "../atoms/button";
import { IfindPasswordProps } from "src/types";
import { LoginTitle } from "../atoms/title";
import { LoginContainer } from "../molecules/container";

const FindPasswordPage = () => {
    const [loginId, setLoginId] = useState<string>("");
    const [isCheckedId, setIsCheckedId] = useState<boolean>(false);

    const [email, setEmail] = useState<string>("");
    const [verifyTime, setVerifyTime] = useState(0); //입력 유효시간
    const [sendVerify, setSendVerify] = useState<boolean>(false); //인증번호 전송
    const [verifyNumber, setVerifyNumber] = useState<string>(""); //인증번호
    const [isVerify, setIsVerify] = useState<boolean>(false); //인증번호

    const [createNewPassword, setCreateNewPassword] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [checkPassword, setCheckPassword] = useState<string>("");
    const [invalid, setInvalid] = useState<boolean>(false);
    const [mismatch, setMismatch] = useState<boolean>(false);

    useEffect(() => {
        if (password && !validatePassword(password)) {
            setInvalid(true);
        } else {
            setInvalid(false);
        }
    }, [password]);

    //비밀번호와 재확인비밀번호 비교
    useEffect(() => {
        if (password && checkPassword && password !== checkPassword) {
            setMismatch(true);
        } else {
            setMismatch(false);
        }
    }, [password, checkPassword]);

    const handleCheckLoginId = async () => {
        try {
            const response = await axios.post(
                `/api/v1/member/check?loginId=${loginId}`
            );
            if (response.status === 200 || response.status === 201) {
                console.log("존재하지 않는 아이디?", response.data);
                if (response.data) {
                    alert("존재하지 않는 아이디 입니다.");
                    return;
                } else {
                    setIsCheckedId(true);
                }
            } else {
                alert("입력하신 아이디를 찾을 수 없습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            setIsCheckedId(false);
            console.error("이메일 전송 중 오류가 발생했습니다:", error);
            alert("오류가 발생했습니다. 관리자에게 문의하세요.");
        }
    };
    //인증번호 전송 핸들러
    const handleEmailSubmit = async () => {
        if (!email) {
            alert("이메일을 입력하세요");
            return;
        }
        if (!validateEmail(email)) {
            alert("유효하지 않은 이메일입니다");
            return;
        }
        setVerifyTime(180);

        try {
            const response = await axios.post("/api/v1/emailVerify/send", {
                email: email,
            });
            if (response.status === 200 || response.status === 201) {
                setSendVerify(true);
            } else {
                alert(
                    "인증번호 이메일 전송에 실패했습니다. 다시 시도해주세요."
                );
            }
        } catch (error) {
            setSendVerify(false);
            console.error("이메일 전송 중 오류가 발생했습니다:", error);
            alert("오류가 발생했습니다. 관리자에게 문의하세요.");
        }
    };

    //인증번호 체크 핸들러
    const handleVerify = async () => {
        if (!verifyNumber) {
            alert("인증번호를 입력하세요");
            return;
        }

        try {
            const response = await axios.post("/api/v1/emailVerify/verify", {
                email: email,
                number: verifyNumber,
            });
            if (response.status === 200 || response.status === 201) {
                alert("이메일 인증이 완료되었습니다.");
                setIsVerify(true);
                setVerifyTime(0);
            } else {
                alert("인증번호 확인에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            setIsVerify(false);
            console.error("인증번호 확인 중 오류가 발생했습니다:", error);
            alert("오류가 발생했습니다. 관리자에게 문의하세요.");
        }
    };
    const onSave = async () => {
        if (!password) {
            alert("비밀번호를 입력해주세요");
            return;
        }
        if (!validatePassword(password)) {
            alert(
                "비밀번호는 영문 대소문자, 숫자, 특수문자를 포함하여 8~20자로 설정해주세요."
            );
            return;
        }
        if (!checkPassword) {
            alert("비밀번호를 입력해주세요");
            return;
        }
        if (mismatch) {
            alert("비밀번호가 일치하지 않습니다");
            return;
        }
        const postData = {
            loginId: loginId,
            password: password,
        };
        try {
            const response = await axios.post(
                "/api/v1/member/findPassword",
                postData
            );
            if (response.status === 200 || response.status === 201) {
                alert("비밀번호 변경이 완료 되었습니다.");
                window.location.replace("/login");
            } else {
                alert("정보 수정에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            setSendVerify(false);
            console.error("정보 수정 중 오류가 발생했습니다:", error);
            alert("오류가 발생했습니다. 관리자에게 문의하세요.");
        }
    };
    useEffect(() => {
        if (sendVerify && verifyTime > 0) {
            const timer = setInterval(() => {
                setVerifyTime((prev) => prev - 1);
            }, 1000); // 1초마다 감소
            return () => clearInterval(timer);
        }
        if (verifyTime <= 0) {
            setSendVerify(false);
        }
    }, [verifyTime, sendVerify]);

    return (
        <LoginContainer>
            <div className="flex gap-[50px]">
                <Link to={"/login/find/findLoginId"}>
                    <LoginTitle
                        className={`mb-[50px] xs:mb-[30px]  text-[#ccc]`}
                    >
                        아이디 찾기
                    </LoginTitle>
                </Link>
                <Link to={"/login/find/findPassword"}>
                    <LoginTitle className={`mb-[50px] xs:mb-[30px]`}>
                        비밀번호 찾기
                    </LoginTitle>
                </Link>
            </div>

            <FindPassword
                findPasswordProps={{
                    loginId: loginId,
                    setLoginId: setLoginId,
                    isCheckedId: isCheckedId,
                    handleCheckLoginId: handleCheckLoginId,
                    email: email,
                    setEmail: setEmail,
                    handleEmailSubmit: handleEmailSubmit,
                    verifyTime: verifyTime,
                    sendVerify: sendVerify,
                    verifyNumber: verifyNumber,
                    setVerifyNumber: setVerifyNumber,
                    isVerify: isVerify,
                    handleVerify: handleVerify,
                    createNewPassword: createNewPassword,
                    setCreateNewPassword: setCreateNewPassword,
                    password: password,
                    setPassword: setPassword,
                    checkPassword: checkPassword,
                    setCheckPassword: setCheckPassword,
                    invalid: invalid,
                    mismatch: mismatch,
                    onSave: onSave,
                }}
            />
        </LoginContainer>
    );
};

const FindPassword = ({
    findPasswordProps,
}: {
    findPasswordProps: IfindPasswordProps;
}) => {
    const {
        loginId,
        setLoginId,
        isCheckedId,
        handleCheckLoginId,
        email,
        setEmail,
        handleEmailSubmit,
        verifyTime,
        sendVerify,
        verifyNumber,
        setVerifyNumber,
        isVerify,
        handleVerify,
        createNewPassword,
        setCreateNewPassword,
        password,
        setPassword,
        checkPassword,
        setCheckPassword,
        invalid,
        mismatch,
        onSave,
    } = findPasswordProps;

    return (
        <div className="flex flex-col w-full">
            {!createNewPassword ? (
                !isCheckedId ? (
                    <>
                        <div className="flex flex-col gap-[5px] w-full">
                            <span className="text-[#999] text-[13px] leading-[15px]">
                                아이디
                            </span>
                            <input
                                type="text"
                                className="w-full bg-[#F7F7F7] outline-none rounded-[5px] placeholder:text-[#999999] placeholder:text-[15px] py-[15px] px-[20px] xs:placeholder:text-[13px] xs:py-[10px]"
                                placeholder="아이디 입력"
                                value={loginId!}
                                onChange={(e) => setLoginId(e.target.value)}
                            />
                        </div>
                        <LoginButton
                            className="bg-[#21A089] text-white py-[15px] xs:py-[10px] mt-[50px]"
                            onClick={handleCheckLoginId}
                        >
                            다음
                        </LoginButton>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-[5px] w-full">
                                <span className="text-[#999] text-[13px] leading-[15px]">
                                    이메일
                                </span>

                                <div className="flex items-center gap-[10px]">
                                    <input
                                        type="text"
                                        className="w-full bg-[#f7f7f7] rounded-[5px] h-[40px] px-[15px]"
                                        value={email ?? ""}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="이메일을 입력하세요"
                                    />
                                    <Button
                                        className={`${verifyTime > 0 || isVerify ? "bg-[#eee]" : "bg-[#21A089]"} text-white rounded-[5px] text-nowrap px-5 h-[40px]`}
                                        onClick={handleEmailSubmit}
                                        disabled={sendVerify || isVerify}
                                    >
                                        {isVerify
                                            ? "인증 완료"
                                            : "인증번호 받기"}
                                    </Button>
                                </div>
                            </div>
                            {verifyTime > 0 && (
                                <div className="flex items-center gap-[10px]">
                                    <input
                                        type="text"
                                        className="w-full bg-[#f7f7f7] rounded-[5px] h-[40px] px-[15px]"
                                        value={verifyNumber ?? ""}
                                        onChange={(e) =>
                                            setVerifyNumber(e.target.value)
                                        }
                                        placeholder="인증번호를 입력하세요"
                                        disabled={isVerify}
                                    />
                                    <Button
                                        className={`${isVerify ? "bg-[#eee]" : "bg-[#21A089]"} text-white rounded-[5px] text-nowrap px-5 h-[40px]`}
                                        onClick={handleVerify}
                                    >
                                        확인
                                    </Button>

                                    <div className="min-w-[50px] flex justify-center items-center">
                                        {verifyTime > 0 && (
                                            <span className="text-red-700 text-[13px]">
                                                {formatTimeCount(verifyTime)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <LoginButton
                            className="bg-[#21A089] text-white py-[15px] xs:py-[10px] mt-[50px]"
                            onClick={() =>
                                isVerify && setCreateNewPassword(true)
                            }
                        >
                            비밀번호 재설정
                        </LoginButton>
                    </>
                )
            ) : (
                <>
                    <div className="flex flex-col w-full gap-[15px]">
                        <div className="flex flex-col gap-[5px] w-full">
                            <span className="text-[#999] text-[13px] leading-[15px]">
                                새 비밀번호
                            </span>
                            <input
                                type="password"
                                className="w-full bg-[#F7F7F7] outline-none rounded-[5px] placeholder:text-[#999999] placeholder:text-[15px] py-[15px] px-[20px] xs:placeholder:text-[13px] xs:py-[10px]"
                                placeholder="비밀번호 입력"
                                value={password!}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {invalid && (
                                <span className="text-[12px] text-[red] ml-[10px]">
                                    *영문 대소문자, 숫자, 특수문자를 포함하여
                                    8~20자로 설정해주세요.
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-[5px] w-full">
                            <span className="text-[#999] text-[13px] leading-[15px]">
                                새 비밀번호 확인
                            </span>
                            <input
                                type="password"
                                className="w-full bg-[#F7F7F7] outline-none rounded-[5px] placeholder:text-[#999999] placeholder:text-[15px] py-[15px] px-[20px] xs:placeholder:text-[13px] xs:py-[10px]"
                                placeholder="비밀번호 재입력"
                                value={checkPassword!}
                                onChange={(e) =>
                                    setCheckPassword(e.target.value)
                                }
                            />
                            {mismatch && (
                                <span className="text-[12px] text-[red] ml-[10px]">
                                    *비밀번호가 일치하지 않습니다.
                                </span>
                            )}
                        </div>
                    </div>
                    <LoginButton
                        className="bg-[#21A089] text-white py-[15px] xs:py-[10px] mt-[50px]"
                        onClick={onSave}
                    >
                        저장하기
                    </LoginButton>
                </>
            )}
            <div className="flex flex-col items-center mt-[30px]">
                <Link
                    to="/login"
                    className="text-[13px] leading-[15px] underline text-[#999]"
                >
                    로그인/회원가입 하기
                </Link>
            </div>
        </div>
    );
};

export default FindPasswordPage;

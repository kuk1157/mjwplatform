import { useEffect, useState } from "react";
import { LoginButton } from "../atoms/button";
import { LoginTitle } from "../atoms/title";
import axios from "axios";
import { formatTimeCount, validatePassword } from "src/utils/common";
import { SocialDomain } from "src/constans/index";
import useImageClick from "src/utils/useImageClick";
import Portal from "../molecules/portal";
import ImgModal from "../molecules/imgModal";
import CustomDatePicker from "../molecules/customDatepicker";

const SelectSignUpType = ({ ...props }) => {
    const { typeData, signUpType, setSignUpType, setPage } = props;
    return (
        <>
            <LoginTitle className="mb-[50px]  xs:mb-[30px]">
                회원가입
            </LoginTitle>
            <div className="w-full flex gap-[20px] mb-[50px] sm:gap-3 xs:flex-col">
                {typeData.map((type: any, index: number) => (
                    <button
                        key={index}
                        className={`shadow-[0px_3px_10px_#e8e8e8] h-full w-full min-w-[200px] max-h-[250px] pt-[40px] pb-[30px] rounded-[20px] flex flex-col items-center aspect-auto md:min-w-0 xs:flex-row xs:justify-center xs:gap-5 xs:py-5 ${signUpType?.value === type.value ? "border-[2px] border-[#21A089]" : ""}`}
                        onClick={() => setSignUpType(type)}
                    >
                        <img
                            src={`/assets/icon/sign_up_${type.value}.svg`}
                            alt=""
                            className="mb-[40px] md:mx-3 xs:w-[80px] xs:m-0"
                        />
                        <p className="text-[17px] leading-[20px] font-bold text-[#333] xs:text-[15px]">
                            {type.title}
                        </p>
                    </button>
                ))}
            </div>
            <LoginButton
                className="bg-[#21A089] text-white py-[15px] xs:py-[10px]"
                onClick={() => {
                    signUpType
                        ? setPage(1)
                        : alert("회원가입 유형을 선택해주세요");
                }}
            >
                다음으로
            </LoginButton>
        </>
    );
};
const SignUp = ({ ...props }) => {
    const { signUpType, setPage } = props;
    const [loginId, setLoginId] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [checkPassword, setCheckPassword] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [gender, setGender] = useState<string | null>(null);
    const [birthday, setBirthday] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [mismatch, setMismatch] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const [checkedLoginId, setCheckedLoginId] = useState<boolean>(false);
    const [isValidLoginId, setIsValidLoginId] = useState<boolean>(false);

    const [email, setEmail] = useState<string>("");
    const [emailDomain, setEmailDomain] = useState<string>("");
    const [fullEmail, setFullEmail] = useState<string>("");
    const [customDomain, setCustomDomain] = useState<string>("");
    const [verifyTime, setVerifyTime] = useState(0); //입력 유효시간
    const [sendVerify, setSendVerify] = useState<boolean>(false); //인증번호 전송
    const [verifyNumber, setVerifyNumber] = useState<string>(""); //인증번호
    const [isVerify, setIsVerify] = useState<boolean>(false); //인증번호

    const [isCheckedPrivacy, setIsCheckedPrivacy] = useState(false);
    const { isModalOpen, modalImageUrl, openModal, closeModal } =
        useImageClick();

    // 아이디 중복 확인
    const checkLoginIdValid = async () => {
        if (!loginId) {
            alert("아이디를 입력해주세요");
            return;
        }
        const formData = new FormData();
        formData.append("loginId", loginId);
        try {
            setCheckedLoginId(true);
            const response = await axios.post("/api/v1/member/check", formData);
            if (response.data) {
                setIsValidLoginId(true);
            } else {
                setIsValidLoginId(false);
            }
        } catch (error) {
            console.error("중복 확인 중 오류가 발생했습니다:", error);
            alert("오류가 발생했습니다. 관리자에게 문의하세요.");
        }
    };

    // 비밀번호 유효성 검사 실패 시 문구 출력용 입니다.
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

    // 회원가입
    const handleSubmit = async () => {
        if (!loginId) {
            alert("아이디를 입력해주세요");
            return;
        }
        if (!checkedLoginId) {
            alert("아이디 중복확인을 해주세요");
            return;
        }
        if (!isValidLoginId) {
            alert("이미 사용중인 아이디 입니다.");
            return;
        }
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
        if (!username) {
            alert("이름을 입력해주세요");
            return;
        }
        if (!birthday) {
            alert("생년월일을 입력해주세요");
            return;
        }
        if (!email) {
            alert("이메일 인증을 해주세요");
            return;
        }
        if (!isVerify) {
            alert("이메일 인증을 해주세요");
            return;
        }
        if (!email) {
            alert("이메일을 입력하세요");
            return;
        }
        if (!emailDomain) {
            alert("도메인을 선택하세요");
            return;
        }
        if (emailDomain == "etc" && !customDomain) {
            alert("도메인을 입력하세요");
            return;
        }
        if (!isCheckedPrivacy) {
            alert("개인정보 수집 및 이용에 동의해주세요");
            return;
        }
        const postData = {
            loginId: loginId, //로그인아이디
            password: password, //비밀번호
            name: username, //이름
            gender: gender, //성별
            birthday: birthday, //생년월일
            email: fullEmail,
            phoneNumber: phoneNumber,
            role: signUpType.value, // 권한을 "user"로 고정 할 경우 signUpType props는 필요없습니다.
        };
        try {
            const response = await axios.post("/api/v1/member", postData);
            if (response.status === 200 || response.status === 201) {
                alert("회원가입 완료되었습니다.");
                window.location.replace("/login");
            } else {
                alert("저장에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("저장 중 오류가 발생했습니다:", error);
            alert("오류가 발생했습니다. 관리자에게 문의하세요.");
        }
    };

    useEffect(() => {
        setFullEmail(
            `${email}@${emailDomain == "etc" ? customDomain : emailDomain}`
        );
    }, [email, emailDomain, customDomain]);

    //인증번호 전송 핸들러
    const handleEmailSubmit = async () => {
        if (!email) {
            alert("이메일을 입력하세요");
            return;
        }
        if (!emailDomain) {
            alert("도메인을 선택하세요");
            return;
        }
        if (emailDomain == "etc" && !customDomain) {
            alert("도메인을 입력하세요");
            return;
        }

        setVerifyTime(180);

        try {
            const response = await axios.post("/api/v1/emailVerify/send", {
                email: fullEmail,
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
                email: fullEmail,
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

    // 인증번호 유효시간 카운트
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
        <>
            <LoginTitle className="mb-[20px] xs:mb-[30px]">
                {signUpType?.title}
            </LoginTitle>
            <div className="flex flex-col w-full gap-[20px] mt-[30px] xs:gap-[15px]">
                <div className="flex flex-col w-full">
                    <div className="text-[13px] text-[#999] mb-[5px] flex">
                        <p className="text-nowrap">아이디</p>
                        {checkedLoginId && (
                            <span
                                className={`text-[12px] ${isValidLoginId ? "text-[#21A089]" : "text-[red]"} ml-[10px]`}
                            >
                                {isValidLoginId
                                    ? "* 사용 가능한 아이디입니다."
                                    : "* 이미 사용중인 아이디입니다."}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-[10px]">
                        <input
                            type="text"
                            className="w-full bg-[#F7F7F7] outline-none rounded-[10px]  placeholder:text-[#999] placeholder:text-[17px] xs:placeholder:text-[13px] leading-[20px] py-[15px] px-[20px] max-h-[50px] xs:py-[10px]"
                            placeholder="아이디 입력"
                            onChange={(e) => setLoginId(e.target.value)}
                            disabled={isValidLoginId}
                        />
                        <button
                            className={`rounded-[10px] text-white py-[15px] text-[17px] leading-[20px] text-nowrap px-[18.5px] xs:text-[15px] xs:py-[10px] ${isValidLoginId ? "bg-[#ddd]" : "bg-[#21A089]"}`}
                            onClick={checkLoginIdValid}
                            disabled={isValidLoginId}
                        >
                            중복확인
                        </button>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <div className="text-[13px] text-[#999] mb-[5px] flex">
                        <p className="text-nowrap">비밀번호</p>
                        {invalid && (
                            <span className="text-[12px] text-[red] ml-[10px]">
                                *영문 대소문자, 숫자, 특수문자를 포함하여
                                8~20자로 설정해주세요.
                            </span>
                        )}
                    </div>
                    <input
                        type="password"
                        className="w-full bg-[#F7F7F7] outline-none rounded-[10px] placeholder:text-[#999] placeholder:text-[17px] placeholder:tracking-[-0.51px] xs:placeholder:text-[13px] leading-[20px] py-[15px] px-[20px] max-h-[50px] xs:py-[10px]"
                        placeholder="비밀번호 입력 (8자 이상 영문 대 소문자, 숫자, 특수문자)"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-full">
                    <div className="text-[13px] text-[#999] mb-[5px] flex text-nowrap">
                        <p>비밀번호 확인</p>
                        {mismatch && (
                            <span className="text-[12px] text-[red] ml-[10px]">
                                *비밀번호가 일치하지 않습니다.
                            </span>
                        )}
                    </div>
                    <input
                        type="password"
                        className="w-full bg-[#F7F7F7] outline-none rounded-[10px]  placeholder:text-[#999] placeholder:text-[17px] xs:placeholder:text-[13px] leading-[20px] py-[15px] px-[20px] max-h-[50px] xs:py-[10px]"
                        placeholder="비밀번호 재입력"
                        onChange={(e) => setCheckPassword(e.target.value)}
                    />
                </div>

                <div className="flex flex-col w-full">
                    <p className="text-[13px] text-[#999] mb-[5px]">이름</p>
                    <input
                        type="text"
                        className="w-full bg-[#F7F7F7] outline-none rounded-[10px]  placeholder:text-[#999] placeholder:text-[17px] xs:placeholder:text-[13px] leading-[20px] py-[15px] px-[20px] max-h-[50px] xs:py-[10px]"
                        placeholder="이름"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-full">
                    <p className="text-[13px] text-[#999] mb-[5px]">성별</p>

                    <div className="w-full flex gap-[10px] outline-none rounded-[10px] text-[#999] text-[17px] leading-[20px] max-h-[50px] xs:text-[15px]">
                        <button
                            className={`w-full py-[15px] border rounded-[10px] flex justify-center sm:py-[15px] ${gender === "m" ? "border-[#21A089] text-[#21A089]" : "opacity-30 border-[#999]"}`}
                            onClick={() => setGender("m")}
                        >
                            남자
                        </button>
                        <button
                            className={`w-full py-[15px] border rounded-[10px] flex justify-center sm:py-[15px] ${gender === "f" ? "border-[#21A089] text-[#21A089]" : "opacity-30 border-[#999]"}`}
                            onClick={() => setGender("f")}
                        >
                            여자
                        </button>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <p className="text-[13px] text-[#999] mb-[5px]">생년월일</p>
                    <CustomDatePicker
                        selected={birthday ? new Date(birthday) : null}
                        onChange={(date) =>
                            setBirthday(date ? date.toISOString() : null)
                        }
                        placeholderText="연도-월-일"
                    ></CustomDatePicker>
                </div>
                <div className="flex flex-col w-full">
                    <p className="text-[13px] text-[#999] mb-[5px]">
                        핸드폰 번호
                    </p>
                    <input
                        type="text"
                        className="w-full bg-[#F7F7F7] outline-none rounded-[10px]  placeholder:text-[#999] placeholder:text-[17px] xs:placeholder:text-[13px] leading-[20px] py-[15px] px-[20px] max-h-[50px] xs:py-[10px]"
                        placeholder="핸드폰 번호 입력"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <div>
                    <div className="flex flex-col gap-[10px]">
                        <p className="text-[13px] text-[#999] mb-[5px]">
                            이메일
                        </p>
                        <div className="flex gap-[10px] items-center w-full">
                            <input
                                type="text"
                                className="w-1/2 bg-[#F7F7F7] outline-none rounded-[10px]  placeholder:text-[#999] placeholder:text-[17px] xs:placeholder:text-[13px] leading-[20px] py-[15px] px-[20px] max-h-[50px] xs:py-[10px]"
                                value={email ?? ""}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <span>@</span>
                            <select
                                className={`border border-[#f7f7f7] w-1/2 leading-[20px] py-[15px] px-[10px] max-h-[50px] xs:py-[10px]  rounded-[10px] ${emailDomain == "etc" && "hidden"}`}
                                onChange={(e) => setEmailDomain(e.target.value)}
                                value={emailDomain}
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
                                    className="w-1/2 bg-[#F7F7F7] outline-none rounded-[10px]  placeholder:text-[#999] placeholder:text-[17px] xs:placeholder:text-[13px] leading-[20px] py-[15px] px-[20px] max-h-[50px] xs:py-[10px]"
                                    value={customDomain ?? ""}
                                    onChange={(e) =>
                                        setCustomDomain(e.target.value)
                                    }
                                />
                            )}
                            <button
                                className={`rounded-[10px] text-white py-[15px] text-[17px] leading-[20px] text-nowrap px-[18.5px] xs:text-[15px] xs:py-[10px] ${verifyTime > 0 || isVerify ? "bg-[#ddd]" : "bg-[#21A089]"}`}
                                onClick={handleEmailSubmit}
                                disabled={sendVerify || isVerify}
                            >
                                {isVerify ? "인증 완료" : "인증번호 받기"}
                            </button>
                        </div>
                    </div>
                    {(sendVerify || verifyTime > 0) && (
                        <div className="flex gap-[10px] items-center w-full mt-[10px]">
                            <input
                                type="text"
                                className="w-full bg-[#F7F7F7] outline-none rounded-[10px]  placeholder:text-[#999] placeholder:text-[17px] xs:placeholder:text-[13px] leading-[20px] py-[15px] px-[20px] max-h-[50px] xs:py-[10px]"
                                value={verifyNumber ?? ""}
                                onChange={(e) =>
                                    setVerifyNumber(e.target.value)
                                }
                                placeholder="인증번호를 입력하세요"
                                disabled={isVerify}
                            />
                            <button
                                className={`rounded-[10px] text-white py-[15px] text-[17px] leading-[20px] text-nowrap px-[18.5px] xs:text-[15px] xs:py-[10px] ${isVerify ? "bg-[#ddd]" : "bg-[#21A089]"}`}
                                onClick={handleVerify}
                            >
                                확인
                            </button>
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
            </div>
            <div className="flex w-full justify-start gap-2 pt-3 px-1">
                <input
                    id="privacyCheckbox"
                    type="checkbox"
                    className="hidden"
                    checked={isCheckedPrivacy}
                    onChange={() => setIsCheckedPrivacy(!isCheckedPrivacy)}
                />
                <label
                    htmlFor="privacyCheckbox"
                    className={`w-[20px] min-w-[20px] h-[20px] border rounded-[3px] cursor-pointer flex justify-center items-center  
                    ${isCheckedPrivacy ? "bg-[#F2FAF8] border border-[#21A089]" : "border-[#d6d6d6]"} 
                    md:w-[15px] md:min-w-[15px] md:h-[15px]`}
                >
                    {isCheckedPrivacy && (
                        <img
                            src="/assets/icon/checked_icon.svg"
                            alt="Checked"
                            className="w-[8px]"
                        />
                    )}
                </label>
                <button
                    className="underline cursor-pointer text-sm text-gray-700"
                    onClick={() => openModal("/assets/image/privacy.png")}
                >
                    (필수) 개인정보 수집 및 이용 동의
                </button>
            </div>

            <div className="w-full flex gap-[10px] mt-[50px]">
                <LoginButton
                    className="border border-[#21A089] text-[#21A089] bg-white py-[15px] w-1/2 max-h-[50px] xs:py-[9px]"
                    onClick={() => setPage(0)}
                >
                    이전으로
                </LoginButton>
                <LoginButton
                    className="bg-[#21A089] text-white py-[15px] w-1/2 max-h-[50px] xs:py-[9px]"
                    onClick={handleSubmit}
                >
                    가입하기
                </LoginButton>
            </div>
            <Portal>
                <ImgModal
                    className="w-fit font-Pretendard"
                    visible={isModalOpen}
                    onClose={closeModal}
                    modalImageUrl={modalImageUrl}
                ></ImgModal>
            </Portal>
        </>
    );
};
export { SelectSignUpType, SignUp };

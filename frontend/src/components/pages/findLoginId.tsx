import { useState } from "react";
import axios from "axios";
import { Loading } from "../molecules/Loading";
import { validateEmail } from "src/utils/common";
import { LoginContainer } from "../molecules/container";
import { Link } from "react-router-dom";
import { LoginTitle } from "../atoms/title";
import { LoginButton } from "../atoms/button";
import { IfindLoginIdProps } from "src/types";

const FindId = ({
    findLoginIdProps,
}: {
    findLoginIdProps: IfindLoginIdProps;
}) => {
    const { email, setEmail, isSentEmail, handleSendEmail } = findLoginIdProps;
    return (
        <div className="flex flex-col gap-[50px] w-full">
            <div className="flex flex-col gap-[5px] w-full">
                <span className="text-[#999] text-[13px] leading-[15px]">
                    이메일
                </span>
                <input
                    type="text"
                    className="w-full bg-[#F7F7F7] outline-none rounded-[5px] placeholder:text-[#999999] placeholder:text-[15px] py-[15px] px-[20px] xs:placeholder:text-[13px] xs:py-[10px]"
                    placeholder="이메일 입력"
                    value={email!}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-[30px] items-center">
                <LoginButton
                    className={`${isSentEmail ? "bg-[#eee]" : "bg-[#21A089]"} text-white py-[15px] xs:py-[10px]`}
                    onClick={handleSendEmail}
                    disabled={isSentEmail}
                >
                    이메일 발송
                </LoginButton>
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

const FindLoginIdPage = () => {
    //아이디 찾기
    const [email, setEmail] = useState<string>("");
    const [isSentEmail, setIsSentEmail] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendEmail = async () => {
        if (!email) {
            alert("이메일을 입력해주세요");
            return;
        }

        if (!validateEmail(email)) {
            alert("이메일 형식으로 입력해주세요");
            return;
        }
        setIsLoading(true);
        setIsSentEmail(true);

        try {
            const response = await axios.post("/api/v1/member/findLoginId", {
                email: email,
            });
            if (response.status === 200 || response.status === 201) {
                alert(
                    "이메일로 인증번호를 발송했습니다. 인증번호가 오지 않으면 입력하신 정보가 회원 정보와 일치하는지 확인해주세요."
                );
            } else {
                setIsSentEmail(false);
                alert(
                    "인증번호 이메일 전송에 실패했습니다. 다시 시도해주세요."
                );
            }
        } catch (error) {
            setIsSentEmail(false);
            console.error("이메일 전송 중 오류가 발생했습니다:", error);
            alert("오류가 발생했습니다. 관리자에게 문의하세요.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading && (
                <Loading text="이메일 전송중 입니다. 잠시만 기다려 주세요..." />
            )}
            <LoginContainer>
                <div className="flex gap-[50px]">
                    <Link to={"/login/find/findLoginId"}>
                        <LoginTitle className={`mb-[50px] xs:mb-[30px]`}>
                            아이디 찾기
                        </LoginTitle>
                    </Link>
                    <Link to={"/login/find/findPassword"}>
                        <LoginTitle
                            className={`mb-[50px] xs:mb-[30px] text-[#ccc]`}
                        >
                            비밀번호 찾기
                        </LoginTitle>
                    </Link>
                </div>

                <FindId
                    findLoginIdProps={{
                        email: email,
                        setEmail: setEmail,
                        isSentEmail: isSentEmail,
                        handleSendEmail: handleSendEmail,
                    }}
                />
            </LoginContainer>
        </>
    );
};
export default FindLoginIdPage;

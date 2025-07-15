import { useState } from "react";
import { LoginContainer } from "../molecules/container";
import { SelectSignUpType, SignUp } from "../organisms/signUp";
import { Link } from "react-router-dom";

// 권한에 맞게 추가/수정 해주세요.
const signUpTypeData = [
    {
        title: "일반 사용자",
        value: "user",
    },
];

const SignUpPage = () => {
    const [page, setPage] = useState(0);

    // SelectSignUpType 컴포넌트에서 선택한 권한이 signUpType State에 들어갑니다.
    const [signUpType, setSignUpType] = useState<any>(null); // 회원가입 시 서버로 보내는 데이터에 포함됩니다.
    return (
        <LoginContainer
            className={
                page === 0 ? "max-w-none w-fit xs:w-full xs:max-w-[500px]" : ""
            }
        >
            {page === 0 ? (
                <SelectSignUpType
                    typeData={signUpTypeData}
                    signUpType={signUpType}
                    setSignUpType={setSignUpType}
                    setPage={setPage}
                />
            ) : (
                <SignUp signUpType={signUpType} setPage={setPage} />
            )}
            <Link
                to="/login"
                className="text-[13px] text-[#999] leading-[15px] underline mt-[30px]"
            >
                계정이 있으신가요?
            </Link>
        </LoginContainer>
    );
};

export default SignUpPage;

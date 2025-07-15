import { useEffect, useState } from "react";
import { MainContainer } from "src/components/molecules/container";
import { ChangePassword } from "src/components/organisms/myPage";
import { validatePassword } from "src/utils/common";
import { UserApi } from "src/utils/userApi";

const ChangePasswordPage = () => {
    // 패스워드 변경 관련
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [checkPassword, setCheckPassword] = useState<string>("");
    const [mismatch, setMismatch] = useState(false);
    const [invalid, setInvalid] = useState(false);

    useEffect(() => {
        if (password && !validatePassword(password)) {
            setInvalid(true);
        } else {
            setInvalid(false);
        }
    }, [password]);

    // 비밀번호와 재확인비밀번호 비교
    useEffect(() => {
        if (password && checkPassword && password !== checkPassword) {
            setMismatch(true);
        } else {
            setMismatch(false);
        }
    }, [password, checkPassword]);

    const handleUpdatePassword = async () => {
        try {
            const response = await UserApi.post(
                "/api/v1/member/updatePassword",
                {
                    password: currentPassword,
                    newPassword: password,
                }
            );
            if (response.status === 200 || response.status === 201) {
                alert("수정 완료 되었습니다.");
                localStorage.clear();
                location.reload();
                window.location.replace("/login");
            } else {
                alert("정보 수정에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("정보 수정 중 오류가 발생했습니다:", error);
            alert("오류가 발생했습니다. 관리자에게 문의하세요.");
        }
    };

    return (
        <MainContainer className="mt-[100px] pt-[100px]">
            <ChangePassword
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                password={password}
                setPassword={setPassword}
                checkPassword={checkPassword}
                setCheckPassword={setCheckPassword}
                mismatch={mismatch}
                invalid={invalid}
                handleUpdatePassword={handleUpdatePassword}
            />
        </MainContainer>
    );
};

export default ChangePasswordPage;

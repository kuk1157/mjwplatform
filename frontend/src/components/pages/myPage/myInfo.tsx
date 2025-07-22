import { useEffect, useState } from "react";
import { useRecoilValueLoadable } from "recoil";
import { userSelectorUpdated } from "src/recoil/userState";
import axios from "axios";
import { UserApi } from "src/utils/userApi";
import { SocialDomain } from "src/constants/index";
import { validatePhoneNumber } from "src/utils/common";
import { MainContainer } from "../../molecules/container";
import { MyInfo } from "src/components/organisms/myPage";

const MyInfoPage = () => {
    const { contents: user } = useRecoilValueLoadable(userSelectorUpdated);

    // 기본정보 변경 관련
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [emailDomain, setEmailDomain] = useState<string>("");
    const [fullEmail, setFullEmail] = useState<string>("");
    const [customDomain, setCustomDomain] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");

    const [verifyTime, setVerifyTime] = useState(0); //입력 유효시간
    const [sendVerify, setSendVerify] = useState<boolean>(false); //인증번호 전송
    const [verifyNumber, setVerifyNumber] = useState<string>(""); //인증번호
    const [isVerify, setIsVerify] = useState<boolean>(false); //인증번호
    const [emailLoading, setEmailLoading] = useState<boolean>(false);

    useEffect(() => {
        const userEmail = user.email?.split("@")[0];
        const userEmailDomain = user.email?.split("@")[1];
        const isSocialDomain = SocialDomain.includes(userEmailDomain);
        setName(user.name);
        setEmail(userEmail);
        setEmailDomain(isSocialDomain ? userEmailDomain : "etc");
        setCustomDomain(isSocialDomain ? "" : userEmailDomain);
        setPhoneNumber(user.phoneNumber);
    }, [user]);

    useEffect(() => {
        setFullEmail(
            `${email}@${emailDomain == "etc" ? customDomain : emailDomain}`
        );
    }, [email, emailDomain, customDomain]);

    //인증번호 전송 핸들러
    const handleEmailSubmit = async () => {
        if (!email) {
            alert("이메일을 입력하세요.");
            return;
        }
        if (!emailDomain) {
            alert("도메인을 선택하세요.");
            return;
        }
        if (emailDomain == "etc" && !customDomain) {
            alert("도메인을 입력하세요.");
            return;
        }
        if (user.email != fullEmail) {
            alert("기존 이메일과 다릅니다.");
            return;
        }
        setEmailLoading(true);
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
        } finally {
            setEmailLoading(false);
        }
    };

    //인증번호 체크 핸들러
    const handleVerify = async () => {
        if (!verifyNumber) {
            alert("인증번호를 입력하세요.");
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
            alert("인증번호 확인에 실패했습니다.");
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

    const onSave = async () => {
        if (!name) {
            alert("이름을 입력하세요.");
            return;
        }
        if (!isVerify) {
            alert("이메일 인증을 해주세요.");
            return;
        }
        if (!validatePhoneNumber(phoneNumber)) {
            alert("유효하지 않은 전화번호 형식입니다.");
            return;
        }
        const postData = {
            id: user.id,
            name: name,
            birthday: user.birthday,
            email: fullEmail,
            phoneNumber: phoneNumber,
        };
        try {
            const response = await UserApi.put("/api/v1/member", postData);
            if (response.status === 200 || response.status === 201) {
                alert("수정 완료 되었습니다.");
                window.location.reload();
            } else {
                alert("정보 수정에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            setSendVerify(false);
            console.error("정보 수정 중 오류가 발생했습니다:", error);
            alert("오류가 발생했습니다. 관리자에게 문의하세요.");
        }
    };

    const handleDeleteMember = async () => {
        if (!isVerify) {
            alert("이메일 인증을 해주세요");
            return;
        }
        if (confirm("정말 탈퇴하시겠습니까?")) {
            try {
                const response = await UserApi.delete(
                    "/api/v1/member/deleteMember"
                );
                if (response.status === 200 || response.status === 201) {
                    alert("탈퇴되었습니다.");

                    localStorage.clear();
                    location.reload();
                    window.location.replace("/login");
                } else {
                    alert("탈퇴 실패했습니다. 다시 시도해주세요.");
                }
            } catch (error) {
                setSendVerify(false);
                console.error("탈퇴 중 오류가 발생했습니다:", error);
                alert("오류가 발생했습니다. 관리자에게 문의하세요.");
            }
        }
    };

    return (
        <MainContainer className="mt-[100px] pt-[100px]">
            <MyInfo
                name={name}
                setName={setName}
                loginId={user.loginId}
                birthday={user.birthday}
                email={email}
                setEmail={setEmail}
                emailDomain={emailDomain}
                setEmailDomain={setEmailDomain}
                customDomain={customDomain}
                setCustomDomain={setCustomDomain}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                handleEmailSubmit={handleEmailSubmit}
                verifyTime={verifyTime}
                sendVerify={sendVerify}
                verifyNumber={verifyNumber}
                setVerifyNumber={setVerifyNumber}
                isVerify={isVerify}
                handleVerify={handleVerify}
                onSave={onSave}
                handleDeleteMember={handleDeleteMember}
                emailLoading={emailLoading}
            />
        </MainContainer>
    );
};
export default MyInfoPage;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { MainContainer } from "src/components/molecules/container";
import { userSelectorUpdated } from "src/recoil/userState";
import { adminLogin } from "src/utils/authLogin";
import { AxiosError } from "axios";

const LoginPage = () => {
    const user = useRecoilValue(userSelectorUpdated);
    const navigate = useNavigate();
    useEffect(() => {
        if (user.name) {
            navigate("/admin/user");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [loginId, setLoginId] = useState<string>();
    const [password, setPassword] = useState<string>();

    const handleLogin = () => {
        if (!loginId) {
            return alert("아이디를 입력해 주세요.");
        }
        if (!password) {
            return alert("비밀번호를 입력해 주세요.");
        }
        adminLogin({ loginId, password })
            .then((response) => {
                localStorage.clear();
                localStorage.setItem("tokenType", response.tokenType);
                localStorage.setItem("accessToken", response.accessToken);
                localStorage.setItem("refreshToken", response.refreshToken);
                window.location.href = `/admin/user`;
            })
            .catch((error) => {
                const axiosError = error as AxiosError<{ message: string }>;
                const message = axiosError.response?.data?.message; // message를 변수로
                if (message) {
                    alert(message);
                } else {
                    alert(
                        error.response.data.message ??
                            "알 수없는 오류가 발생했습니다. 관리자에게 문의해 주세요."
                    );
                }
                console.log(error);
            });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };
    return (
        <MainContainer>
            <div className="w-full h-full flex justify-center items-center">
                <div className="w-[450px] bg-white md:w-screen  h-[600px] border rounded-md shadow-md flex flex-col justify-center items-center">
                    <div></div>
                    <h1 className="mb-[80px] text-[20px] font-bold lg:text-[18px] xs:text-[16px]">
                        관리자 로그인
                    </h1>
                    <div className="flex flex-col w-[80%] font-Pretendard gap-3">
                        <input
                            type="text"
                            className="w-full outline-none border rounded-[5px] placeholder:text-[15px] p-3"
                            placeholder="아이디를 입력해주세요"
                            onChange={(e) => setLoginId(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <input
                            type="password"
                            className="w-full outline-none border rounded-[5px] placeholder:text-[15px] p-3"
                            placeholder="비밀번호를 입력해주세요"
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <button
                        className="bg-[#8BC34A] mt-[50px] text-white px-10 py-3 rounded-[5px]"
                        onClick={handleLogin}
                    >
                        로그인
                    </button>
                </div>
            </div>
        </MainContainer>
    );
};

export default LoginPage;

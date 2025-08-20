import { Link } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../utils/authLogin";
import { useCookies } from "react-cookie";

const CustomCheckbox = styled.label`
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    max-width: 80px;

    input[type="checkbox"] {
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        position: absolute;
        opacity: 0;
        pointer-events: none;
    }

    span {
        width: 15px;
        height: 15px;
        border: 1px solid #e9e9e9;
        border-radius: 2px;
        display: inline-block;
        position: relative;
        transition: all 0.2s ease;
    }

    span::after {
        content: url("/assets/icon/checked_checkbox.svg");
        position: absolute;
        top: 70%;
        left: 55%;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0.2s ease;
    }

    input[type="checkbox"]:checked + span::after {
        transform: translate(-50%, -50%) scale(1);
    }
`;
const LoginPage = () => {
    const navigate = useNavigate();

    const [cookies, setCookie, removeCookie] = useCookies(["rememberUserId"]);
    const [isRemember, setIsRemember] = useState(false);
    const [loginId, setLoginId] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const handleOnChange = (e: any) => {
        setIsRemember(e.target.checked);
        if (e.target.checked) {
            setCookie("rememberUserId", loginId);
        } else {
            removeCookie("rememberUserId");
        }
    };
    const handleLogin = () => {
        if (!loginId) {
            return alert("아이디를 입력해 주세요.");
        }
        if (!password) {
            return alert("비밀번호를 입력해 주세요.");
        }
        login({ loginId, password })
            .then((response) => {
                localStorage.clear();
                localStorage.setItem("tokenType", response.tokenType);
                localStorage.setItem("accessToken", response.accessToken);
                localStorage.setItem("refreshToken", response.refreshToken);

                // id,role 값 세팅
                const userRole = response.role;
                const userId = response.userId;

                // // 관리자일 경우 관리자 로그인 페이지로 이동
                // if (userRole == "admin") {
                //     alert(
                //         "관리자는 해당 페이지에서 로그인 할 수 없습니다. \n관리자 로그인 페이지로 이동합니다."
                //     );
                //     navigate(`/admin`);
                //     return;
                // }

                // 로그인시 아이디 저장 기능 변경
                if (isRemember) {
                    setCookie("rememberUserId", loginId, {
                        path: "/",
                        maxAge: 60 * 60 * 24 * 30,
                    }); // 30일
                } else {
                    removeCookie("rememberUserId");
                }

                // owner(점주)일 경우 점주 메인대시보드로 이동
                if (userRole === "owner") {
                    navigate(`/owner/dashboard/${userId}`);
                } else {
                    // 고객은 그냥 메인
                    navigate("/");
                }
            })
            .catch((error) => {
                alert(
                    error.response.data.message ??
                        "알 수없는 오류가 발생했습니다. 관리자에게 문의해 주세요."
                );
                console.log(error);
            });
    };

    useEffect(() => {
        const savedLoginId = cookies.rememberUserId;
        if (savedLoginId && savedLoginId !== "undefined") {
            setLoginId(savedLoginId);
            setIsRemember(true);
        }
    }, [cookies]);

    return (
        <section className="w-full min-h-screen bg-[#F2FAF8] flex justify-center items-center">
            <div className="w-full max-w-[500px] h-fit bg-white rounded-[20px] flex flex-col items-center p-[50px] shadow-[0px_3px_10px_#e8e8e8] mt-[80px] mb-[32px] xs:p-[30px] xs:mt-[50px]">
                <h2 className="font-extrabold text-[25px] leading-[33px] tracking-[-1.25px] text-[#333] xs:text-[22px] mb-[50px] xs:mb-[30px]">
                    로그인
                </h2>
                <div className="flex flex-col w-full gap-[15px]">
                    <input
                        type="text"
                        className="w-full bg-[#F7F7F7] outline-none rounded-[5px] placeholder:text-[#999999] placeholder:text-[15px] py-[15px] px-[20px] xs:placeholder:text-[13px] xs:py-[10px]"
                        placeholder="아이디를 입력해주세요"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                    />
                    <input
                        type="password"
                        className="w-full bg-[#F7F7F7] outline-none rounded-[5px] placeholder:text-[#999999] placeholder:text-[15px] py-[15px] px-[20px] xs:placeholder:text-[13px] xs:py-[10px]"
                        placeholder="비밀번호를 입력해주세요"
                        value={password!}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(
                            e: React.KeyboardEvent<HTMLInputElement>
                        ) => {
                            if (e.key === "Enter") {
                                handleLogin();
                            }
                        }}
                    />
                </div>
                <CustomCheckbox className="flex items-center self-start w-full mt-[20px] mb-[15px]">
                    <input
                        type="checkbox"
                        id="remember_id"
                        checked={isRemember}
                        onChange={handleOnChange}
                    />
                    <span />
                    <label
                        htmlFor="remember_id"
                        className="cursor-pointer text-[13px] text-[#999] leading-[15px] ml-[5px]"
                    >
                        아이디 저장
                    </label>
                </CustomCheckbox>
                <div className="flex flex-col w-full gap-[15px] xs:mt-[20px]">
                    <button
                        className="flex items-center justify-center rounded-[10px] w-full text-[17px] leading-[20px] xs:text-[15px] bg-[#21A089] text-white py-[15px] xs:py-[10px]"
                        onClick={handleLogin}
                    >
                        로그인
                    </button>
                    <Link to="/sign-up" className="w-full">
                        <button className="flex items-center justify-center rounded-[10px] w-full text-[17px] leading-[20px] xs:text-[15px] border border-[#21A089] text-[#21A089] bg-white py-[15px] xs:py-[10px]">
                            회원가입
                        </button>
                    </Link>
                </div>
                <Link
                    to="/login/find/findLoginId"
                    className="text-[13px] leading-[15px] underline mt-[30px] text-[#999]"
                >
                    아이디/비밀번호 찾기
                </Link>
            </div>
        </section>
    );
};

export default LoginPage;

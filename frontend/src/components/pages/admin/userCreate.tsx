import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserApi } from "src/utils/userApi";
import { LabelDetail } from "src/components/atoms/labelDetail";
import { SectionCard } from "../../molecules/card";
import { UserRoleList } from "src/constants/index";
import { ActionButtons } from "src/components/organisms/actionButtons"; // 등록, 수정 공통 버튼

export function UserCreate() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        birthday: "",
        loginId: "",
        emailId: "",
        emailDomain: "",
        email: "",
        phoneNumber: "",
        role: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 아이디 중복체크 API
    const [isLoginIdChecked, setIsLoginIdChecked] = useState(false);
    const handleIdCheck = async () => {
        if (!formData.loginId) {
            alert("아이디를 입력해주세요.");
            return;
        }
        try {
            const res = await UserApi.post(`/api/v1/member/check`, null, {
                params: { loginId: formData.loginId },
            });

            if (res.data === true) {
                alert("사용 가능한 아이디입니다.");
                setIsLoginIdChecked(true); // 중복 체크 통과
            } else {
                alert("이미 사용 중인 아이디입니다.");
                setIsLoginIdChecked(false);
            }
        } catch (err) {
            console.error(err);
            alert("중복 체크 중 오류 발생");
            setIsLoginIdChecked(false);
        }
    };

    // 이메일 중복체크 API
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    const handleEmailCheck = async () => {
        const { emailId, emailDomain } = formData;

        if (!emailId || !emailDomain) {
            alert("이메일을 모두 입력해주세요.");
            return;
        }

        const finalEmail = `${emailId}@${emailDomain}`;

        try {
            const res = await UserApi.post(`/api/v1/member/checkEmail`, null, {
                params: { email: finalEmail },
            });

            if (res.data === true) {
                alert("사용 가능한 이메일입니다.");
                setIsEmailChecked(true);

                // formData에도 최종 이메일을 반영
                setFormData((prev) => ({
                    ...prev,
                    email: finalEmail,
                }));
            } else {
                alert("이미 사용 중인 이메일입니다.");
                setIsEmailChecked(false);
            }
        } catch (err) {
            console.error("이메일 중복 확인 중 오류 발생", err);
            alert("중복 체크 중 오류 발생");
            setIsEmailChecked(false);
        }
    };

    // 이전 버튼
    const handleBack = () => {
        navigate("/admin/user");
    };

    // 사용자 등록
    const handleSubmit = async () => {
        const { emailId, emailDomain } = formData;

        if (!isLoginIdChecked) {
            alert("아이디 중복 확인을 하지 않았습니다.");
            return;
        }

        if (!isEmailChecked) {
            alert("이메일 중복 확인을 하지 않았습니다.");
            return;
        }

        const finalEmail = `${emailId}@${emailDomain}`;

        try {
            await UserApi.post(`/api/v1/admin/member`, {
                name: formData.name,
                birthday: formData.birthday,
                loginId: formData.loginId,
                phoneNumber: formData.phoneNumber,
                email: finalEmail,
                role: formData.role,
            });
            alert("등록이 완료되었습니다.");
            navigate(`/admin/user`);
        } catch (error) {
            console.error("등록 실패", error);
            alert("사용자 등록 중 오류가 발생했습니다.");
            console.log(formData.role);
        }
    };

    return (
        <SectionCard className="px-[30px]">
            <h2 className="font-[TmoneyRoundWind] font-extrabold text-[35px] leading-[50px] tracking-[-1.75px] text-[#333] md:text-[30px] pb-[50px]">
                사용자 등록
            </h2>
            <div className="w-full bg-white p-10 rounded-xl shadow">
                <div className="grid grid-cols-1 gap-y-6">
                    <LabelDetail
                        label="이름"
                        value={formData.name}
                        editable
                        name="name"
                        onChange={handleChange}
                    />
                    {/* 아이디 + 중복확인 버튼 */}
                    <div className="flex items-center gap-2">
                        <span className="w-32 font-semibold">아이디:</span>
                        <input
                            type="text"
                            name="loginId"
                            value={formData.loginId}
                            onChange={handleChange}
                            className="border border-gray-300 rounded px-3 py-2 w-full max-w-sm"
                        />
                        <button
                            className="h-[40px] px-4 rounded bg-[#21A089] text-white whitespace-nowrap"
                            onClick={handleIdCheck}
                        >
                            아이디 확인
                        </button>
                    </div>

                    {/* 비밀번호 임시 */}
                    <div className="flex items-center gap-2">
                        <span className="w-32 font-semibold">비밀번호:</span>
                        <span>비밀번호 임시로 1234로 등록</span>
                    </div>

                    {/* 이메일 */}
                    <div className="flex items-center gap-2">
                        <span className="w-32">이메일:</span>
                        <input
                            type="text"
                            name="emailId"
                            placeholder="이메일 아이디"
                            value={formData.emailId}
                            onChange={handleChange}
                            className="border border-gray-300 rounded px-3 py-2 w-full max-w-[200px]"
                        />
                        <span>@</span>
                        <select
                            name="emailDomain"
                            value={formData.emailDomain}
                            onChange={handleChange}
                            className="border border-gray-300 rounded px-2 py-2"
                        >
                            <option value="">선택</option>
                            <option value="gmail.com">gmail.com</option>
                            <option value="naver.com">naver.com</option>
                            <option value="daum.net">daum.net</option>
                            <option value="kakao.com">kakao.com</option>
                        </select>
                        <button
                            className="h-[40px] px-4 rounded bg-[#21A089] text-white whitespace-nowrap"
                            onClick={handleEmailCheck}
                        >
                            이메일 확인
                        </button>
                    </div>
                    <LabelDetail
                        label="전화번호"
                        value={formData.phoneNumber}
                        editable
                        name="phoneNumber"
                        onChange={handleChange}
                    />
                    <LabelDetail
                        label="생년월일"
                        value={formData.birthday}
                        editable
                        name="birthday"
                        type="date"
                        onKeyDown={(e) => e.preventDefault()}
                        onChange={handleChange}
                    />
                    <div className="flex items-center gap-2">
                        <span className="w-32">권한 선택:</span>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="border border-gray-300 rounded px-2 py-2"
                        >
                            {UserRoleList.map((item) => (
                                <option key={item.name} value={item.name}>
                                    {item.value}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 공통 버튼 영역 */}
                <ActionButtons
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                    submitLabel="등록 완료"
                />
            </div>
        </SectionCard>
    );
}

export default UserCreate;

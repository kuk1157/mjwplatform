import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserApi } from "src/utils/userApi";
import { UserInfo } from "./userInfo"; // 사용자 정보 렌더링 컴포넌트
import { SectionCard } from "../../molecules/card";
// import { UserActionButtons } from "./UserActionButtons"; // 수정/삭제/뒤로가기 버튼

function UserDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (id) {
            UserApi.get(`/api/v1/admin/member/${id}`)
                .then((res) => setUser(res.data))
                .catch((err) => {
                    console.error("유저 정보를 불러오는 데 실패했습니다.", err);
                    alert("데이터 로딩 실패");
                    navigate("/admin/user"); // ← 실패 시 목록으로 이동
                });
        }
    }, [id, navigate]);

    return (
        <SectionCard className="px-[30px]">
            <h2 className="font-[TmoneyRoundWind] font-extrabold text-[35px] leading-[50px] tracking-[-1.75px] text-[#333] md:text-[30px] pb-[50px]">
                사용자 관리
            </h2>
            <UserInfo user={user} />
        </SectionCard>
    );
}

export default UserDetailPage;

import { MainContainer } from "../molecules/container";
import { useEffect } from "react";
import { useRecoilValueLoadable } from "recoil";
import { userSelectorUpdated } from "src/recoil/userState";
import { useNavigate } from "react-router-dom";

function MainPage() {
    const { contents: user } = useRecoilValueLoadable(userSelectorUpdated);
    const navigate = useNavigate();

    const ownerId = user.id;
    const userRole = user.role;
    // 점주(owner) 권한일 경우에 바로 dashBoard 페이지로 이동
    // ownerId 물려주기
    useEffect(() => {
        if (userRole === "owner") {
            navigate(`/owner/dashBoard/${ownerId}`);
            return;
        }
    }, [userRole, ownerId, navigate]);

    return (
        <MainContainer className="py-[230px] bg-[#F6F6F6] lg:py-[150px] sm:py-[100px]">
            <div>메인페이지</div>
        </MainContainer>
    );
}

export default MainPage;

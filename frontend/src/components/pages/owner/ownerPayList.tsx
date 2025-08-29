import { MainContainer } from "../../molecules/container";
import { useParams } from "react-router-dom";

function OwnerPayList() {
    const { ownerId } = useParams();
    console.log(ownerId);

    return (
        <MainContainer className="py-[230px] bg-[#F6F6F6] lg:py-[150px] sm:py-[100px]">
            <div>
                {/* 전체 방문 기록 섹션 */}
                <div className="mb-20 px-10"></div>
            </div>
        </MainContainer>
    );
}

export default OwnerPayList;

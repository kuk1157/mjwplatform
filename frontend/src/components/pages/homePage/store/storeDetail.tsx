// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// [파일 첨부 경로]
// import { cdn } from "src/constans"; // 파일첨부 경로(네이버클라우드)
// import { storeFolder } from "src/constans"; // 첨부 디렉토리 경로 stroe

// [아이콘 및 공통 컴포넌트]
import { MainContainer } from "src/components/molecules/container";

// [공통 데이터 인터페이스]
// import { StoreType } from "src/types"; // 가맹점(매장) 인터페이스

function homePageStoreDetail() {
    return (
        <MainContainer className="bg-[#FFF] py-[100px] lg:py-[150px] sm:py-[100px] xs:py-[60px]">
            <div className="w-full">
                <div className="w-full bg-[#FFF] p-6"></div>
            </div>
        </MainContainer>
    );
}

export default homePageStoreDetail;

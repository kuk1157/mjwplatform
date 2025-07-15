import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button } from "../atoms/button";

interface BoardSearchProps {
    executeSearch: (query: string) => void;
    searchOption: { key: string; value: string }[];
}
export const StyledSelect = styled.select`
    appearance: none;
    background-color: #ffffff;
    border: 1px solid rgba(51, 51, 51, 0.2);
    margin-right: 10px;
    padding: 10px 20px;
    color: #333;
    width: 140px;
    position: relative;
    cursor: pointer;
    background-image: url("/assets/icon/downArrow.svg");
    background-repeat: no-repeat;
    background-position: right 20px center;
    background-size: 10px;
    &:focus {
        outline: none;
    }
`;
export const BoardSearch = ({
    executeSearch,
    searchOption,
}: BoardSearchProps) => {
    const { t } = useTranslation(["core"]);
    const [searchQuery, setSearchQuery] = useState("");

    const searchRef = useRef<HTMLSelectElement>(null);

    const handleSearch = () => {
        if (searchRef.current) {
            const selectedValue = searchRef.current.value;
            executeSearch(`&${selectedValue}=${searchQuery}`);
        }
    };

    const activeEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div
            className={`flex flex-nowrap justify-center w-full text-[17px] font-Pretendard text-[#333333] font-medium md:text-[14px] sm:text-[13px] sm:flex-wrap`}
        >
            <StyledSelect
                className="h-[45px] md:h-[40px] xs:h-[35px] md:py-0 sm:w-[120px] xs:max-w-[100px]"
                ref={searchRef}
            >
                {searchOption &&
                    searchOption.map(({ key, value }) => (
                        <option key={value} value={value}>
                            {key}
                        </option>
                    ))}
            </StyledSelect>
            <div className="flex max-w-[496px] w-full relative md:max-w-[300px] xs:max-w-[220px]">
                <input
                    type="text"
                    className="px-4 py-2 h-[45px] w-full border border-[rgba(51,51,51,0.2)] focus-visible:outline-[#21A089] md:h-[40px] xs:h-[35px]"
                    placeholder={t(`search_placeholder`)}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => activeEnter(e)}
                />
                <button
                    className="absolute right-[10px] top-[10px] md:top-[8px] xs:top-[6px]"
                    onClick={handleSearch}
                >
                    <img src="/assets/icon/search.svg" alt="search icon" />
                </button>
            </div>
        </div>
    );
};

export const SelectBoardSearch = ({
    executeSearch,
    searchOption,
    submitButton, // 공통 등록 버튼
}: {
    executeSearch: (query: string) => void;
    searchOption: { key: string; value: string }[];
    submitButton?: React.ReactNode; // 공통 등록 버튼
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const searchRef = useRef<HTMLSelectElement>(null);

    const handleSearch = () => {
        if (searchRef.current) {
            const selectedValue = searchRef.current.value;
            executeSearch(`&${selectedValue}=${searchQuery}`);
        }
    };
    const activeEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div
            className={`flex justify-between w-full gap-[10px] text-[#999999] font-medium px-[30px] pb-[30px]`}
        >
            {/* // 공통 등록 버튼 */}
            {submitButton}

            <div className="flex gap-[10px]">
                <select
                    ref={searchRef}
                    className="h-[35px] px-[7px] border border-[#D6D6D6] rounded-[5px] focus-visible:outline-[#21A089]"
                >
                    {searchOption.map(({ key, value }) => (
                        <option value={value}>{key}</option>
                    ))}
                </select>

                <input
                    type="text"
                    className="w-[250px] h-[35px] border boredr-[#D6D6D6] rounded-[5px] px-2"
                    placeholder="검색값 입력"
                    value={searchQuery}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setSearchQuery(e.target.value)
                    }
                    onKeyDown={(e) => activeEnter(e)}
                />
                <Button
                    className="px-[37px] bg-[#21A089] text-[#fff] rounded-[5px]"
                    onClick={handleSearch}
                >
                    조회
                </Button>
            </div>
        </div>
    );
};

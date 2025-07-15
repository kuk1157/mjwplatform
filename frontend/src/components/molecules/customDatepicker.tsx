import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import { addMonths, subMonths } from "date-fns";
import styled from "styled-components";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("ko", ko);

const CustomStyledDatePicker = styled.div`
    .react-datepicker-wrapper {
        width: 100% !important;
    }

    .react-datepicker__header {
        background-color: white !important;
    }

    .react-datepicker__input-container input {
        background-color: rgb(247 247 247 / var(--tw-bg-opacity, 1)) !important;
        padding: 15px 20px !important;
        border-radius: 10px;
        line-height: 21px;
    }

    .react-datepicker__children-container {
        white-space: nowrap;
        overflow-y: scroll;
        max-height: 300px;
    }

    .react-datepicker__input-container input::placeholder {
        color: #999999;
    }

    .react-datepicker__calendar-icon {
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
    }

    .react-datepicker__navigation {
        top: auto !important;
        text-indent: 0 !important;
        font-size: 17px;
        position: static !important;
    }

    .react-datepicker-popper {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }
`;

interface CustomDatePickerProps {
    selected: Date | null;
    onChange: (date: Date | null) => void;
    yearDropdownItemNumber?: number;
    placeholderText?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
    selected,
    onChange,
    placeholderText = "날짜를 선택 해주세요",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [viewDate, setViewDate] = useState<Date>(new Date());
    const [year, setYear] = useState<number | undefined>();

    useEffect(() => {
        if (!isOpen) {
            setViewDate(selected ?? new Date());
        }
    }, [isOpen, selected]);

    const handleDateChange = (date: Date | null) => {
        if (showYearPicker) {
            const prevDate = selected ?? new Date();
            const prevMonth = prevDate.getMonth();
            const prevDay = prevDate.getDate();

            const mergeDate = new Date(
                date?.getFullYear() ?? prevDate.getFullYear(),
                prevMonth,
                prevDay
            );
            console.log("11", date?.getFullYear());
            setYear(date?.getFullYear());
            setViewDate(mergeDate);
            onChange(mergeDate);
        } else {
            if (year) {
                date?.setFullYear(year);
            }
            setViewDate(date ?? new Date());
            onChange(date);
        }

        if (date) {
            setShowYearPicker(false);
        }
    };

    const renderCustomHeader = ({
        date,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
    }: {
        date: Date;
        decreaseMonth: () => void;
        increaseMonth: () => void;
        prevMonthButtonDisabled: boolean;
        nextMonthButtonDisabled: boolean;
    }) => (
        <div className="flex justify-between items-center mx-[15px] my-[10px]">
            <div
                className="react-datepicker__current-month text-[17px] font-Pretendard font-bold relative"
                aria-label={`Select year: ${date.getFullYear()}`}
            >
                {`${viewDate.getFullYear()}년 ${viewDate?.getMonth() + 1}월`}

                <button
                    className="ml-3 flex justify-center items-center absolute top-[0px] right-[-25px] w-[20px] h-[20px]"
                    onClick={() => setShowYearPicker(!showYearPicker)}
                >
                    <img
                        src="/assets/icon/dropdown.svg"
                        className={`w-[13px] ${showYearPicker ? "rotate-180" : ""}`}
                        alt=""
                    />
                </button>
            </div>

            {!showYearPicker && (
                <div className="flex justify-between">
                    <button
                        type="button"
                        className="react-datepicker__navigation react-datepicker__navigation--previous"
                        onClick={() => {
                            setViewDate(subMonths(viewDate, 1));
                            decreaseMonth();
                        }}
                        disabled={prevMonthButtonDisabled}
                        aria-label="Previous month"
                    >
                        <img
                            src="/assets/icon/next.svg"
                            alt=""
                            className="rotate-180 w-[7px]"
                        />
                    </button>
                    <button
                        type="button"
                        className="react-datepicker__navigation react-datepicker__navigation--next"
                        onClick={() => {
                            setViewDate(addMonths(viewDate, 1));
                            increaseMonth();
                        }}
                        disabled={nextMonthButtonDisabled}
                        aria-label="Next month"
                    >
                        <img
                            src="/assets/icon/next.svg"
                            alt=""
                            className="w-[7px]"
                        />
                    </button>
                </div>
            )}
        </div>
    );

    const years = [];
    for (let i = new Date().getFullYear(); i >= 1930; i--) {
        years.push(i);
    }

    return (
        <>
            <CustomStyledDatePicker>
                <DatePicker
                    selected={selected}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    showMonthDropdown={!showYearPicker}
                    placeholderText={placeholderText}
                    dropdownMode="select"
                    yearItemNumber={0}
                    showYearPicker={showYearPicker}
                    renderCustomHeader={renderCustomHeader}
                    open={isOpen}
                    onInputClick={() => setIsOpen(!isOpen)}
                    onClickOutside={() => setIsOpen(false)}
                    showIcon={true}
                    icon={
                        <button onClick={() => setIsOpen(!isOpen)}>
                            <img
                                src="/assets/icon/calender.svg"
                                alt="calendar icon"
                            />
                        </button>
                    }
                    locale="ko"
                    readOnly
                    className="cursor-pointer"
                >
                    {showYearPicker && (
                        <div className="react-datepicker__year-wrapper gap-[10px] items-center max-w-[200px] text-[16px] font-Pretendard">
                            {years.map((year) => (
                                <button
                                    key={year}
                                    onClick={() =>
                                        handleDateChange(new Date(year, 0, 1))
                                    }
                                    className="react-datepicker__year-text max-w-[58px] w-full"
                                >
                                    <div
                                        className={`py-[10px] ${year === viewDate.getFullYear() && "font-bold bg-[#21A089] text-white rounded-[25px]"}`}
                                    >
                                        {year}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </DatePicker>
            </CustomStyledDatePicker>
        </>
    );
};

export default CustomDatePicker;

import DatePicker from "react-datepicker";
import { getMonth, getYear, parse, isValid, format } from "date-fns";
import { cn } from "src/utils/tailwindMerge";
import { ko } from "date-fns/locale";
import { useEffect, useState } from "react";

const DateCalendar = ({
    selected,
    changeHandler,
    placeholderText,
    disabled,
    dateClassName,
    isOpen,
    setIsOpen,
}: {
    selected: Date | null;
    changeHandler: (date: Date | null) => void;
    placeholderText?: string;
    disabled?: boolean;
    dateClassName?: string;
    isOpen?: boolean;
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const validSelectedDate = selected;

    const [inputValue, setInputValue] = useState(
        validSelectedDate ? format(validSelectedDate, "yyyy-MM-dd") : ""
    );
    useEffect(() => {
        if (validSelectedDate) {
            setInputValue(format(validSelectedDate, "yyyy-MM-dd"));
        } else {
            setInputValue("");
        }
    }, [validSelectedDate, selected]);
    const years = Array.from(
        { length: getYear(new Date()) + 1 - 2000 },
        (_, i) => getYear(new Date()) - i
    );
    const months = [
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
        "10월",
        "11월",
        "12월",
    ];

    const handleInputChange = (e: any) => {
        if (!e.target || typeof e.target.value !== "string") {
            return;
        }

        const rawValue = e.target.value;
        const numericValue = rawValue.replace(/[^0-9]/g, "");

        if (numericValue.length > 8) {
            return;
        }

        let formattedValue = "";

        if (numericValue.length > 0) {
            formattedValue += numericValue.slice(0, 4);
        }

        if (numericValue.length > 4) {
            formattedValue += "-" + numericValue.slice(4, 6);
        }

        if (numericValue.length > 6) {
            formattedValue += "-" + numericValue.slice(6, 8);
        }

        setInputValue(formattedValue);

        if (/^\d{4}-\d{2}-\d{2}$/.test(formattedValue)) {
            const parsedDate = parse(formattedValue, "yyyy-MM-dd", new Date());

            if (isValid(parsedDate)) {
                changeHandler(parsedDate);

                return;
            }
        }

        changeHandler(null);
    };

    return (
        <DatePicker
            className={cn("placeholder:text-[#bbb]  max-w-fit", dateClassName)}
            locale={ko}
            selected={validSelectedDate}
            onChange={(date) => {
                if (date instanceof Date && isValid(date)) {
                    date.setHours(12, 0, 0, 0);
                    const offset = date.getTimezoneOffset();
                    const adjustedDate = new Date(
                        date.getTime() + offset * 60000
                    );
                    changeHandler(adjustedDate);
                } else {
                    changeHandler(null);
                }
            }}
            onChangeRaw={handleInputChange}
            value={inputValue}
            placeholderText={placeholderText}
            dateFormat="yyyy-MM-dd"
            disabled={disabled}
            open={isOpen}
            onClickOutside={() => setIsOpen && setIsOpen(false)}
            renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
            }) => (
                <div className="flex items-center justify-between px-3 py-2 bg-gray-100 border-b border-gray-300">
                    <button
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                        className="text-gray-600 hover:text-black px-2 pb-2 text-[30px]"
                    >
                        ‹
                    </button>
                    <div className="flex items-center gap-2">
                        <select
                            className="bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                            value={getYear(date)}
                            onChange={({ target: { value } }) =>
                                changeYear(Number(value))
                            }
                        >
                            {years.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <select
                            className="bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                            value={getMonth(date)}
                            onChange={({ target: { value } }) =>
                                changeMonth(Number(value))
                            }
                        >
                            {months.map((label, index) => (
                                <option key={label} value={index}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                        className="text-gray-600 hover:text-black px-2 pb-2 text-[30px]"
                    >
                        ›
                    </button>
                </div>
            )}
        />
    );
};

export { DateCalendar };

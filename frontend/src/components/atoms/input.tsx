import React from "react";
import { cn } from "../../utils/tailwindMerge";
import "react-datepicker/dist/react-datepicker.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    title: string;
    divClass?: string;
    titleClass?: string;
    className?: string;
}
const InfoInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ title, divClass, titleClass, className, ...props }, ref) => {
        return (
            <div
                className={`w-full flex items-center xs:flex-col xs:items-start xs:gap-1 ${divClass}`}
            >
                <div
                    className={cn(
                        "text-[15px] leading-[18px] tracking-[-0.6px] xs:text-[11px] font-semibold min-w-[120px] text-[#333]",
                        titleClass
                    )}
                >
                    {title}
                </div>
                <input
                    ref={ref}
                    className={cn(
                        "w-full h-[35px] border border-[#D6D6D6] px-[15px] rounded-[5px] text-[#666] placeholder:text-[#bbb] text-[15px] xs:text-[13px] focus:outline-none sm:px-[10px]",
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    title: string;
    option1: {
        name: string;
        id: string;
        value: string;
    };
    option2: {
        name: string;
        id: string;
        value: string;
    };
    targetOption: string | undefined;
}
const InfoRadioInput = React.forwardRef<HTMLInputElement, RadioProps>(
    ({ title, option1, option2, targetOption, className, ...props }, ref) => {
        return (
            <div className="flex items-center gap-3">
                <div className="flex items-center w-full xs:flex-col xs:items-start xs:gap-1">
                    <p className="text-[15px] leading-[18px] tracking-[-0.6px] xs:text-[11px] font-semibold min-w-[120px] text-[#333]">
                        {title}
                    </p>
                    <div className="flex w-full gap-3">
                        <input
                            ref={ref}
                            type="radio"
                            className="hidden"
                            id={option1.id}
                            value={option1.value}
                            checked={targetOption === option1.value}
                            {...props}
                        />
                        <label
                            htmlFor={option1.id}
                            className={cn(
                                `flex items-center justify-center border border-[#D6D6D6] px-3 py-1 rounded-[5px] cursor-pointer text-[#bbb] text-[15px] leading-[18px] tracking-[-0.6px]  xs:text-[13px] w-full max-w-[100px] h-[35px] xs:max-w-none text-center ${targetOption == option1.value ? "border-[#21A089] bg-[#F2FAF8] text-[rgb(33,160,137)]" : ""}`,
                                className
                            )}
                        >
                            {option1.name}
                        </label>
                        <input
                            ref={ref}
                            type="radio"
                            className="hidden"
                            id={option2.id}
                            value={option2.value}
                            checked={targetOption === option2.value}
                            {...props}
                        />
                        <label
                            htmlFor={option2.id}
                            className={cn(
                                `flex items-center justify-center border border-[#D6D6D6] px-3 py-1 rounded-[5px] cursor-pointer text-[#bbb] text-[15px] leading-[18px] tracking-[-0.6px]  xs:text-[13px] w-full max-w-[100px] h-[35px] xs:max-w-none text-center ${targetOption == option2.value ? "border-[#21A089] bg-[#F2FAF8] text-[rgb(33,160,137)]" : ""}`,
                                className
                            )}
                        >
                            {option2.name}
                        </label>
                    </div>
                </div>
            </div>
        );
    }
);
interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    title: string;
    count: number;
    setCount: (num: number) => void;
    unitName: string;
    className?: string;
}
const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
    ({ title, count, setCount, unitName, className, ...props }, ref) => {
        return (
            <div className="flex items-center w-fit mr-3 xs:flex-col xs:items-start xs:gap-1">
                <p className="text-[15px] leading-[18px] tracking-[-0.6px] xs:text-[11px] font-semibold min-w-[120px]">
                    {title}
                </p>
                <div className="flex w-full gap-3 items-center">
                    <div className="rounded-[5px] py-[3px] border relative flex items-center w-full max-w-[120px] xs:text-[13px] xs:max-w-none">
                        <button
                            type="button"
                            className="absolute left-2 w-3 h-4"
                            onClick={() =>
                                count > 0 && setCount(Number(count) - 1)
                            }
                        >
                            <img src="/assets/icon/minus.svg" alt="" />
                        </button>
                        <input
                            ref={ref}
                            className={cn(
                                "text-center w-full focus:outline-none",
                                className
                            )}
                            value={count ?? 0}
                            onChange={(e) =>
                                setCount(parseInt(e.target.value, 10) || 0)
                            }
                            {...props}
                        />
                        <button
                            type="button"
                            className="absolute right-2 w-3 h-4"
                            onClick={() => {
                                // console.log("plus");
                                // console.log(count);
                                count >= 0 && setCount(Number(count) + 1);
                            }}
                        >
                            <img src="/assets/icon/plus.svg" alt="" />
                        </button>
                    </div>
                    <p className="text-[15px] text-[#333] font-semibold leading-[20px] xs:text-[13px]">
                        {unitName}
                    </p>
                </div>
            </div>
        );
    }
);
interface TextAreaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
}
const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={cn(
                    "border border-[#D6D6D6] w-full mt-[10px] min-h-[100px] focus:outline-none p-2 text-[14px] rounded-[5px] sm:text-[13px]",
                    className
                )}
                {...props}
            />
        );
    }
);
InfoInput.displayName = "InfoInput";

export { InfoInput, InfoRadioInput, NumberInput, TextArea };

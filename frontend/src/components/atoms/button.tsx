import React from "react";
import { cn } from "../../utils/tailwindMerge";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, ...props }, ref) => {
        return (
            <button
                className={cn(
                    "cursor-poiner flex items-center justify-center",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
const GoButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, text, ...props }, ref) => {
        return (
            <button
                className={cn(
                    "flex gap-[20px] border mt-[50px] px-[31px] py-[18px] border-[#666666] rounded-[35px]",
                    className
                )}
                ref={ref}
                {...props}
            >
                <p className="text-[20px] leading-[24px] text-[#666666] lg:text-[18px] xs:text-[16px]">
                    {text}
                </p>
                <img
                    src="/assets/icon/right_arrow.svg"
                    alt="icon"
                    className="invert"
                />
            </button>
        );
    }
);

const LoginButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, ...props }, ref) => {
        return (
            <button
                className={cn(
                    "cursor-poiner flex items-center justify-center rounded-[10px] w-full text-[17px] leading-[20px] xs:text-[15px]",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, GoButton, LoginButton };

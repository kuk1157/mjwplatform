/* eslint-disable jsx-a11y/heading-has-content */
import React from "react";
import { cn } from "../../utils/tailwindMerge";

export interface TitleProps extends React.HTMLProps<HTMLHeadingElement> {}
export interface ContainerProps extends React.HTMLProps<HTMLDivElement> {}

const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
    ({ className, ...props }, ref) => {
        return (
            <h1
                ref={ref}
                className={cn(
                    "text-[30px] text-[#333333] font-bold leading-[36px] tracking-[-1.2px]",
                    className
                )}
                {...props}
            />
        );
    }
);

const SubTitle = React.forwardRef<HTMLHeadingElement, TitleProps>(
    ({ className, ...props }, ref) => {
        return (
            <h1
                ref={ref}
                className={cn(
                    "text-[20px] text-[#999999] leading-[24px] tracking-[-1px] mt-[9px] lg:text-[18px] xs:text-[16px]",
                    className
                )}
                {...props}
            />
        );
    }
);

const LoginTitle = React.forwardRef<HTMLHeadingElement, TitleProps>(
    ({ className, ...props }, ref) => {
        return (
            <h2
                ref={ref}
                className={cn(
                    "font-[TmoneyRoundWind] font-extrabold text-[25px] leading-[33px] tracking-[-1.25px] text-[#333] xs:text-[22px]",
                    className
                )}
                {...props}
            />
        );
    }
);

const PageTitle = React.forwardRef<HTMLHeadingElement, TitleProps>(
    ({ className, ...props }, ref) => {
        return (
            <h2
                ref={ref}
                className={cn(
                    "font-[TmoneyRoundWind] font-extrabold text-[35px] leading-[50px] tracking-[-1.75px] text-[#333] md:text-[30px] px-[3rem]",
                    className
                )}
                {...props}
            />
        );
    }
);

export { Title, SubTitle, LoginTitle, PageTitle };

import React from "react";
import { cn } from "../../utils/tailwindMerge";

export interface DivProps extends React.HTMLAttributes<HTMLDivElement> {}

const PrimaryContainer = React.forwardRef<HTMLDivElement, DivProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                className={cn(
                    "w-full h-full flex px-[150px] xl:px-20 lg:px-[50px] md:px-10 xs:px-5",
                    className
                )}
                ref={ref}
                {...props}
            ></div>
        );
    }
);
const MainContainer = React.forwardRef<HTMLDivElement, DivProps>(
    ({ className, ...props }, ref) => {
        return (
            <section
                className={cn(
                    "flex flex-col justify-center items-center w-full h-full font-Pretendard",
                    className
                )}
                ref={ref}
                {...props}
            >
                {props.children}
            </section>
        );
    }
);
const SectionContainer = React.forwardRef<HTMLDivElement, DivProps>(
    ({ className, ...props }, ref) => {
        return (
            <section
                className={cn(
                    "flex flex-col justify-center items-center w-full h-full max-w-[1320px] mx-auto font-Pretendard",
                    className
                )}
                ref={ref}
                {...props}
            >
                {props.children}
            </section>
        );
    }
);
const LoginContainer = React.forwardRef<HTMLDivElement, DivProps>(
    ({ className, ...props }, ref) => {
        return (
            <div className="w-full min-h-screen bg-[#F2FAF8] flex justify-center font-Pretendard">
                <div
                    className={cn(
                        "w-full max-w-[500px] h-fit bg-white rounded-[20px] flex flex-col items-center p-[50px] shadow-[0px_3px_10px_#e8e8e8] mt-[132px] mb-[32px] xs:p-[30px] xs:mt-[50px]",
                        className
                    )}
                    ref={ref}
                    {...props}
                ></div>
            </div>
        );
    }
);
export { PrimaryContainer, SectionContainer, MainContainer, LoginContainer };

import React from "react";
import { cn } from "../../utils/tailwindMerge";

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {}

const SectionCard = React.forwardRef<HTMLDivElement, DivProps>(
    ({ className, children }) => {
        return (
            <div
                className={cn(
                    "flex flex-col rounded-xl leading-[18px] bg-[#FFFFFF] py-[30px] border border-[#D5EBE8]",
                    className
                )}
            >
                {children}
            </div>
        );
    }
);

export { SectionCard };

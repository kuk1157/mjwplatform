import React from "react";
import { cn } from "../../utils/tailwindMerge";

export interface DivProps extends React.HTMLAttributes<HTMLDivElement> {}

const SectionWrapper = React.forwardRef<HTMLDivElement, DivProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                className={cn("px-[30px] border-t border-[#EEEEEE]", className)}
                ref={ref}
                {...props}
            ></div>
        );
    }
);

export { SectionWrapper };

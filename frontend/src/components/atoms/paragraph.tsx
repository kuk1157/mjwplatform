import React from "react";
import { cn } from "../../utils/tailwindMerge";

export interface DescriptionProps
    extends React.HTMLProps<HTMLParagraphElement> {}
const Paragraph = React.forwardRef<HTMLParagraphElement, DescriptionProps>(
    ({ className, ...props }, ref) => {
        return (
            <p
                ref={ref}
                className={cn(
                    "text-[20px] text-[#333333] tracking-[-0.8px] leading-[24px] lg:text-[18px] xs:text-[16px]",
                    className
                )}
                {...props}
            />
        );
    }
);

export { Paragraph };

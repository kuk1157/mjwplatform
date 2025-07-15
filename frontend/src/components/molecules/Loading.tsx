import styled, { keyframes } from "styled-components";
import Portal from "./portal";

const rotation = keyframes`
    from{
        transform: rotate(0deg);
    }

    to{
        transform: rotate(360deg);
    }

`;

interface SpinnerProps {
    borderColor?: string;
}

const Spinner = styled.div<SpinnerProps>`
    height: 16px;
    width: 16px;
    border: 2px solid ${(props) => props.borderColor || "#000"};
    border-radius: 50%;
    border-top: none;
    border-right: none;
    // margin: 16px auto;
    animation: ${rotation} 1s linear infinite;
`;

const Loading = ({ text = "잠시만 기다려 주세요..." }: { text?: string }) => {
    return (
        <Portal>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="relative flex flex-col items-center space-y-4">
                    <div className="absolute top-4 w-16 h-16 border-4 border-t-4 border-black border-opacity-20 border-solid rounded-full" />
                    <div className="w-16 h-16 border-4 border-t-4 border-transparent border-solid rounded-full animate-spin border-t-white" />
                    <div className="text-white text-lg font-semibold">
                        {text}
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export { Loading, Spinner };

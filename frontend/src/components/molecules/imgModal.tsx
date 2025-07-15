import { useEffect, useRef, useState } from "react";
import { cn } from "src/utils/tailwindMerge";
import styled, { keyframes, css } from "styled-components";
// import { ReactComponent as XButton } from "/assets/images/close.png";
// import H1 from "src/components/atoms/Heading1";
const modalSettings = (visible: boolean) => css`
    visibility: ${visible ? "visible" : "hidden"};
    z-index: 15;
    animation: ${visible ? fadeIn : fadeOut} 0.15s ease-out;
    transition: visibility 0.15s ease-out;
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;
interface ModalWrapperType {
    $visible: boolean;
}
const ModalWrapper = styled.div<ModalWrapperType>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 9999;
    padding: 30px;
    ${(props: ModalWrapperType) => modalSettings(props.$visible)}
`;

const ModalContent = styled.div<{ $visible: boolean }>`
    width: auto;
    position: relative;
    // padding: 30px;
    background-color: #ffffff;
    border-radius: 10px;
    // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    // overflow: hidden;
    ${(props: ModalWrapperType) => modalSettings(props.$visible)}
`;

const ModalHeader = styled.section`
    display: flex;
    align-items: center;
    // margin-bottom: 2rem;
    font-size: 16px;
    font-weight: 700;
    // justify-content: space-between;
    // margin-bottom: 40px;
`;

type ModalProps = {
    onClose: () => void;
    modalImageUrl?: string;
    visible: boolean;
    // title: string;
    // titleStyle?: string;
    className?: string;
};

const ImgModal = ({
    onClose,
    modalImageUrl,
    visible,
    // title,
    // titleStyle,
    className,
}: ModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const node = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const clickOutside = (e: any) => {
        // 모달이 열려 있고 모달의 바깥쪽을 눌렀을 때 창 닫기
        if (
            isOpen &&
            node.current &&
            !node.current.contains(e.target as Node)
        ) {
            onClose();
        }
    };

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        if (visible) {
            setIsOpen(true);
        } else {
            timeoutId = setTimeout(() => setIsOpen(false), 150);
        }

        return () => {
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }
        };
    }, [visible]);

    useEffect(() => {
        document.addEventListener("mousedown", clickOutside);
        return () => {
            document.removeEventListener("mousedown", clickOutside);
        };
    }, [clickOutside, isOpen]);
    if (!isOpen) {
        return null;
    }

    return (
        <ModalWrapper $visible={visible}>
            <ModalContent
                className={cn(`modal-content max-w-[600px] p-5`, className)}
                ref={node}
                $visible={visible}
            >
                <ModalHeader className="relative"></ModalHeader>
                <figure className="  overflow-y-auto max-h-[90vh] ">
                    <img className="w-full" src={modalImageUrl} alt="" />
                </figure>
            </ModalContent>
        </ModalWrapper>
    );
};

export default ImgModal;

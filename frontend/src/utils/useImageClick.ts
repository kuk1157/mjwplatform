import { useState } from "react";

interface UseImageClickResult {
    isModalOpen: boolean;
    modalImageUrl: string;
    openModal: (imageUrl: string) => void;
    closeModal: () => void;
}

const useImageClick = (): UseImageClickResult => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState("");

    const openModal = (imageUrl: string) => {
        setModalImageUrl(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalImageUrl("");
    };

    return { isModalOpen, modalImageUrl, openModal, closeModal };
};

export default useImageClick;

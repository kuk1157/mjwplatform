import { Link } from "react-router-dom";
import useImageClick from "src/utils/useImageClick";
import Portal from "../molecules/portal";
import ImgModal from "../molecules/imgModal";
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation(["footer"]);
    const { isModalOpen, modalImageUrl, closeModal } = useImageClick();
    return (
        <footer className="w-full bg-[#008E80] font-Pretendard tracking-[-0.34px] leading-[19px] ">
            <div className="px-[100px] pt-[80px] pb-[60px] lg:px-20 lg:py-24 md:pt-10 md:pb-12 md:py-10 sm:px-5">
                <div className="mb-[40px] flex flex-col flex-wrap xs:flex-col xs:items-start xs:mb-[30px]">
                    <img
                        className="w-[191px] min-w-[55px] md:w-[150px] sm:w-[120px]"
                        src="/assets/image/footer_logo.svg"
                        alt="logo"
                    />
                </div>

                <div className="flex flex-col text-[16px] text-white text-opacity-70 lg:text-[15px] md:text-[13px] gap-[15px] font-normal">
                    {/* <div className="flex text-white text-opacity-90 font-bold">
                        <button>{t(`terms_of_service`)}</button>
                        <p className="mx-[10px]">|</p>
                        <button
                            onClick={() =>
                                openModal("/assets/image/privacy.png")
                            }
                        >
                            {t(`privacy_policy`)}
                        </button>
                        <p className="mx-[10px]">|</p>
                        <button>{t(`user_guide`)}</button>
                    </div> */}
                    <div className="flex">
                        <span>{t(`customer_support`)}</span>
                        <p className="mx-[10px]">|</p>
                        <span>053-753-0133</span>
                        <p className="mx-[10px]">|</p>
                        <span>help@vpudding.com</span>
                    </div>
                    <div className="flex">
                        <span>{t(`company_name`)}</span>
                        <p className="mx-[10px]">|</p>
                        <span>{t(`address`)}</span>
                    </div>
                    <div className="flex relative">
                        <span>{t(`business_registration_number`)}</span>
                        <p className="mx-[10px]">|</p>
                        <span>{t(`mail_order_license_number`)}</span>
                        <div className="flex gap-[10px] absolute right-0 md:bottom-[-40px]">
                            <Link
                                target="_blank"
                                to={
                                    "https://www.youtube.com/channel/UChgsulnGdB4hOdcSr7Ce3jA"
                                }
                            >
                                <img
                                    className="w-[50px] lg:w-[35px] md:w-[30px]"
                                    src="/assets/icon/youtube.svg"
                                    alt="youtube.svg"
                                />
                            </Link>
                            <Link
                                target="_blank"
                                to={
                                    "https://www.facebook.com/ceopudding/?ref=bookmarks"
                                }
                            >
                                <img
                                    className="w-[50px] lg:w-[35px] md:w-[30px]"
                                    src="/assets/icon/facebook.svg"
                                    alt="youtube.svg"
                                />
                            </Link>
                            <Link
                                target="_blank"
                                to={
                                    "https://www.instagram.com/puddingworld.io/"
                                }
                            >
                                <img
                                    className="w-[50px] lg:w-[35px] md:w-[30px]"
                                    src="/assets/icon/instagram.svg"
                                    alt="youtube.svg"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full bg-[#008E80] pb-[80px] text-white text-opacity-70 md:pb-[30px]">
                <div className="flex border-t border-[rgba(255,255,255,0.5)] pt-[60px] px-[100px] md:pt-[30px] md:px-[80px] sm:px-[20px]">
                    <p className="md:text-[14px] sm:m-0 sm:mt-1">
                        ⓒ PUDDING Co. Ltd ALL RIGHT RESERVED
                    </p>
                </div>

                <Portal>
                    <ImgModal
                        className="w-fit font-Pretendard"
                        visible={isModalOpen}
                        onClose={closeModal}
                        modalImageUrl={modalImageUrl}
                    ></ImgModal>
                </Portal>
            </div>
        </footer>
    );
};

export { Footer };

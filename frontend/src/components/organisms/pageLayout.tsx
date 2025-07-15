import { useTranslation } from "react-i18next";
import { useLocation, useOutlet } from "react-router-dom";

const PageLayout = () => {
    const outlet = useOutlet();
    const { t } = useTranslation(["core"]);
    const location = useLocation();
    const cleanPathname = location.pathname
        .replace(/^\/|\/$/g, "")
        .replace(/\/\d+(\/|$)/g, "");

    return (
        <section>
            <div className="pt-[166px] w-full text-center md:pt-[80px] xs:pt-[40px]">
                <h1
                    className={`text-[#333333] text-[70px] font-bold leading-[84px] lg:text-[60px] md:text-[50px] xs:text-[40px]`}
                >
                    {t(cleanPathname)}
                </h1>
                <h2 className="text-[rgba(153,153,153,0.8)] text-[20px] font-extralight lg:text-[18px] xs:text-[16px]">
                    {t(`sub_${cleanPathname}`, {
                        lng: "en",
                        defaultValue: t(cleanPathname),
                    })}
                </h2>
            </div>
            <div>{outlet}</div>
        </section>
    );
};
export default PageLayout;

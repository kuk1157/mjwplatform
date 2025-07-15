import { useEffect } from "react";
import { Footer } from "../organisms/footer";
import { Header } from "../organisms/header";
import { useLocation, useOutlet } from "react-router-dom";
import i18n from "src/language";
import { useResetSortOnPathChange } from "src/recoil/sortState";

const MainLayout = () => {
    const location = useLocation();
    const outlet = useOutlet();
    useResetSortOnPathChange();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        const lang = localStorage.getItem("lang");
        i18n.changeLanguage(lang ?? "ko");
    }, []);
    // const variants = {
    //     initial: { opacity: 0 },
    //     animate: { opacity: 1, transition: { duration: 0.3 } },
    //     exit: { opacity: 0, transition: { duration: 0.3 } },
    // };
    return (
        <>
            <Header />
            <main className="font-Pretendard">{outlet}</main>
            {/* <AnimatePresence mode="wait">
                <motion.main
                    key={location.pathname}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="font-Pretendard"
                >
                    {outlet}
                </motion.main>
            </AnimatePresence> */}
            <Footer />
        </>
    );
};
export default MainLayout;

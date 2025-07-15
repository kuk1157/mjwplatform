import { motion } from "framer-motion";

interface Props {
    children: React.ReactNode;
}

//TODO 애니메이션 재활용을 위한 컴포넌트를 모아놓는 용도로 만들었습니다.
export const FadeInUpAnimation = ({ children }: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{
                ease: "easeInOut",
                duration: 1.5,
                y: { duration: 1 },
            }}
            className="max-w-[1320px] w-full"
        >
            {children}
        </motion.div>
    );
};

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        screens: {
            xl: { max: "1400px" },

            lg: { max: "1023px" },

            md: { max: "767px" },

            sm: { max: "639px" },
            xs: { max: "500px" },
            xxs: { max: "360px" },
        },
        extend: {},
        fontFamily: {
            Pretendard: ["Pretendard"],
            TmoneyRoundWind: ["TmoneyRoundWind"],
        },
    },
    plugins: [],
};

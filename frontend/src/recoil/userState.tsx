import { atom, selector } from "recoil";
import { Member } from "src/types";
import { fetchUser } from "src/utils/userApi";

export const userState = atom<Member | {}>({
    key: "userState",
    default: {},
});

export const userSelectorUpdated = selector({
    key: "userSelectorUpdated",
    get: async () => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            try {
                const response = await fetchUser();
                return response;
            } catch (error) {
                console.error(error);
            }
        }
        return {};
    },
});

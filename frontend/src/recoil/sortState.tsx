import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist({
    key: "sortPersist",
    storage: sessionStorage,
});
interface ISort {
    key: string;
    array: string;
}
export const sortState = atom<ISort>({
    key: "sortState",
    default: { key: "createdAt", array: "desc" },
    effects_UNSTABLE: [persistAtom],
});
const DEFAULT_SORT = { key: "createdAt", array: "desc" };

export function useResetSortOnPathChange() {
    const location = useLocation();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setSort] = useRecoilState(sortState);

    useEffect(() => {
        setSort(DEFAULT_SORT); // path 변경 시 default 값으로 초기화
    }, [location.pathname, setSort]); // pathname이 바뀔 때 실행
}

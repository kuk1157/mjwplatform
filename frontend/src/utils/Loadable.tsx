import { Suspense, ComponentType, ReactNode } from "react";
import LoadingSpinner from "./loadingSpinner";

// Loadable 함수에 대한 타입 정의
const Loadable =
    <P extends object>({
        Fallback,
        Component,
    }: {
        Fallback?: ComponentType;
        Component: ComponentType<P>;
    }) =>
    (props: P): ReactNode => {
        const FallbackComponent = Fallback ?? LoadingSpinner;

        return (
            <Suspense fallback={<FallbackComponent />}>
                <Component {...props} />
            </Suspense>
        );
    };

export default Loadable;

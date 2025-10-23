declare global {
    interface Window {
        naver: typeof naver;
    }

    namespace naver {
        export namespace maps {
            class LatLng {
                constructor(lat: number, lng: number);
            }

            class Map {
                constructor(
                    element: HTMLElement | string,
                    options?: MapOptions
                );
            }

            interface MapOptions {
                center?: LatLng;
                zoom?: number;
                [key: string]: any;
            }

            namespace Service {
                type Status = "OK" | "ERROR";

                interface GeocodeResponseV2 {
                    v2: {
                        addresses: {
                            x: string;
                            y: string;
                            roadAddress?: string;
                            jibunAddress?: string;
                        }[];
                    };
                }

                function geocode(
                    options: { query: string },
                    callback: (
                        status: Status,
                        response: GeocodeResponseV2
                    ) => void
                ): void;
            }
        }
    }
}

export {};

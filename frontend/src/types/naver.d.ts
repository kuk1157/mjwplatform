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
                marker?: string;
                [key: string]: any;
            }
        }
    }
}

export {};

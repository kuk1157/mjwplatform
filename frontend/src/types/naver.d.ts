declare global {
    interface Window {
        naver: typeof naver;
        daum: any;
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

            class Point {
                width: number;
                height: number;
                constructor(width: number, height: number);
            }

            class Size {
                width: number;
                height: number;
                constructor(width: number, height: number);
            }
            class Marker {
                position?: LatLng;
                map?: Map;
                constructor(options: { position: LatLng; map?: Map }) {
                    this.position = options.position;
                    this.map = options.map;
                }
            }
            class InfoWindow {
                constructor(options: {
                    content: string;
                    maxWidth: number;
                    borderWidth: number;
                    backgroundColor: string;
                    pixelOffset: Map;
                });
                open(map: Map, marker: Marker): void;
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

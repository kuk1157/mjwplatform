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
                icon?: {
                    url?: string;
                    size?: Size;
                    origin?: Point;
                    anchor?: Point;
                    scaledSize?: Size;
                };

                constructor(options: {
                    position: LatLng;
                    map?: Map;
                    icon?: {
                        url?: string;
                        size?: Size;
                        origin?: Point;
                        anchor?: Point;
                        scaledSize?: Size;
                    };
                }) {
                    this.position = options.position;
                    this.map = options.map;
                    this.icon = options.icon;
                }
            }
            class InfoWindow {
                constructor(options: {
                    content: string;
                    maxWidth: number;
                    borderWidth: number;
                    backgroundColor: string;
                    anchorSkew?: boolean;
                    pixelOffset: Map;
                });
                open(map: Map, marker: Marker, anchorSkew?: boolean): void;

                close() {
                    // 닫기 기능
                }

                getMap() {
                    // 현재 map 반환
                    return null;
                }
            }

            interface MapOptions {
                center?: LatLng;
                zoom?: number;
                [key: string]: any;
            }

            // Event 타입 추가
            namespace Event {
                function addListener(
                    target: any,
                    eventName: string,
                    handler: (e: any) => void
                ): void;
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

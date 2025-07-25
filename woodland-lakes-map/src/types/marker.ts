export interface Marker {
    lot: string;
    block: string;
    section: string;
    lat: number;
    lng: number;
    label?: string;
    isSpecialLocation?: boolean;
}
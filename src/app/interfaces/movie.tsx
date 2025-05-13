export interface Movie {
    itemType: string;
    showType: string;
    id: string;
    imdbId: string;
    tmdbId: string;
    title: string;
    overview: string;
    releaseYear: number;
    originalTitle: string;
    genres: Genre[];
    directors: string[];
    cast: string[];
    rating: number;
    runtime: number;
    imageSet: ImageSet;
    streamingOptions: StreamingOptions; // Updated to use the flexible StreamingOptions
}

export interface Genre {
    id: string;
    name: string;
}

export interface ImageSet {
    verticalPoster: PosterSizes;
    horizontalPoster: PosterSizes;
    verticalBackdrop: BackdropSizes;
    horizontalBackdrop: BackdropSizes;
}

export interface PosterSizes {
    w240?: string;
    w360?: string;
    w480?: string;
    w600?: string;
    w720?: string;
    w1080?: string;
    w1440?: string;
}

export interface BackdropSizes {
    w240?: string;
    w360?: string;
    w480?: string;
    w600?: string;
    w720?: string;
    w1080?: string;
    w1440?: string;
}

export interface StreamingOptions {
    [countryCode: string]: StreamingOption[]; // Country codes (e.g., "us", "uk", "de") as keys
}

export interface StreamingOption {
    service: Service;
    type: string;
    link: string;
    quality: string;
    audios: string[];
    subtitles: string[];
    price: Price;
    expiresSoon: boolean;
    availableSince: number;
}

export interface Service {
    id: string;
    name: string;
    homePage: string;
    themeColorCode: string;
    imageSet: ServiceImageSet;
}

export interface ServiceImageSet {
    lightThemeImage: string;
    darkThemeImage: string;
    whiteImage: string;
}

export interface Price {
    amount: string;
    currency: string;
    formatted: string;
}
export interface BookAttrs {
    id?: string;
    title?: string;
    description?: string;
    authors?: string;
    favorite?: boolean;
    fileCover?: string;
    fileName?: string;
    fileBook?: string;
}

export type BookUpdate = Partial<Omit<BookAttrs, 'id'>>;

export interface BookFormBody {
    title?: string;
    description?: string;
    authors?: string;
    favorite?: string | boolean;
    fileCover?: string;
    fileName?: string;
}

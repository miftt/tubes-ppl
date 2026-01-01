import { Item } from "rss-parser";

// Type untuk RSS Item dengan image custom
export type RSSItemWithImage = Item & {
    image?: {
        small?: string;
        large?: string;
    };
    [key: string]: any;
};

// Type untuk response data CNN News
export type CNNNewsResponse = {
    message?: string;
    messages?: string;
    total?: number;
    data?: RSSItemWithImage[];
    "CNN News"?: {
        all: string;
        type: string;
        listType: string[];
    };
};

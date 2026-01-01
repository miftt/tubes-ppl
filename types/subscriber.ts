// Type untuk data subscriber dari Prisma select
export type SubscriberData = {
    id: number;
    email: string;
    status: string;
    subscribedAt: Date;
};

// Type untuk response subscriber (untuk admin)
export type SubscriberResponse = {
    id: number;
    email: string;
    status: string;
    joined: string;
};

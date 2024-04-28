export const Tags = [
    "Technolog",
    "Science",
    "Health",
    "Economy",
    "Sport",
    "Entertainment",
    "Crypto",
    "Politics",
    "World",
] as const;
export type Tag = typeof Tags[number];
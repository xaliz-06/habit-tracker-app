export const frequencyEnum = ["daily", "weekly", "monthly"] as const;
export type Frequency = (typeof frequencyEnum)[number];

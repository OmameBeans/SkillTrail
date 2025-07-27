export type User = {
    id: string;
    name: string;
    role: Role;
}

export const role = {
    NONE: 0,
    TRAINEE: 1,
    ADMIN: 2,
} as const;

export type Role = typeof role[keyof typeof role];
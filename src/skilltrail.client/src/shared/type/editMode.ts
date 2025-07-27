export const editMode = {
    NONE: 0,
    CREATE: 1,
    UPDATE: 2,
    DELETE: 3,
} as const;

export type EditMode = typeof editMode[keyof typeof editMode];
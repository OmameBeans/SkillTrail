const API_BASE_URL = '/api';

export const endpoint = {
    TASK_CATEGORY: `${API_BASE_URL}/taskCategory`,
    TASK: `${API_BASE_URL}/task`,
    USER: `${API_BASE_URL}/user`,
} as const;

export type Endpoint = typeof endpoint[keyof typeof endpoint];
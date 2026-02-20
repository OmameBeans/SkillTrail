const API_BASE_URL = '/api';

export const endpoint = {
    TASK_CATEGORY: `${API_BASE_URL}/taskCategory`,
    TASK: `${API_BASE_URL}/task`,
    USER: `${API_BASE_URL}/user`,
    EVALUATION: `${API_BASE_URL}/evaluation`,
    GROUP: `${API_BASE_URL}/group`,
    PROGRESS: `${API_BASE_URL}/progress`,
    LEVEL: `${API_BASE_URL}/level`,
    FEEDBACK: `${API_BASE_URL}/feedback`,
} as const;

export type Endpoint = typeof endpoint[keyof typeof endpoint];
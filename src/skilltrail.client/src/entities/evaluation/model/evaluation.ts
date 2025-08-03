export type Evaluation = {
    id: string;
    userId: string;
    userName: string;
    evaluatorId: string;
    evaluatorName: string;
    PGStatus: EvaluationStatus;
    ShareStatus: EvaluationStatus;
    CommunicationStatus: EvaluationStatus;
    comment: string;
};

export const evaluationStatus = {
    None: 0,
    Poor: 1,
    SlightlyPoor: 2,
    Average: 3,
    Good: 4,
    Excellent: 5,
} as const;

export type EvaluationStatus = typeof evaluationStatus[keyof typeof evaluationStatus];
export interface Level {
    level: number;
    experiencePoints: number;
    cumulativeExperiencePoints: number;
}

export interface UserLevel {
    level: number;
    currentExperiencePoints: number;
    nextLevelExperiencePoints: number;
}
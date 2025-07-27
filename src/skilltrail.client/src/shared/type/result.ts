interface Result {
    hasError: boolean;
    errorMessages: string[];
}

export type SimpleResult = Result;

export type GenericResult<T> = Result & {
    data?: T;
}
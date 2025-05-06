export type Nullable<T> = T | null | undefined;

export function isNotNull<T>(value: Nullable<T>): value is T {
    return value !== null && value !== undefined;
}
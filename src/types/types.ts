export type PaginateSortType = {
    page?: number | string;
    limit?: number | number;
    sortBy?: string;
    sortOrder: string;
};
export type PaginateSortResult = {
    page: number;
    limit: number;
    sortBy: string;
    skip: number;
    sortOrder: string;
};

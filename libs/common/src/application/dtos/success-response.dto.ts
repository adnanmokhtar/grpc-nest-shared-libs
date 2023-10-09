export class SuccessResponse<T> {
    constructor(
        public status: 'success',
        public code: number,
        public message: string | null,
        public data: T
    ) { }
}

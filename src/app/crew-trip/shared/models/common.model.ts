export class ListResponse<T> {
    data: {
        totalPages: number;
        totalElements: number;
        pageable: {
            pageNumber: number;
            pageSize: number;
            sort: {
                sorted: boolean;
                empty: boolean;
                unsorted: boolean;
            };
            offset: number;
            paged: boolean;
            unpaged: boolean;
        };
        size: number;
        content: T[];
        number: number;
        sort: {
            sorted: boolean;
            empty: boolean;
            unsorted: boolean;
        };
        numberOfElements: number;
        first: boolean;
        last: boolean;
        empty: boolean;
    };
    status: number;

    constructor(data: {
        totalPages: number;
        totalElements: number;
        pageable: {
            pageNumber: number;
            pageSize: number;
            sort: {
                sorted: boolean;
                empty: boolean;
                unsorted: boolean;
            };
            offset: number;
            paged: boolean;
            unpaged: boolean;
        };
        size: number;
        content: T[];
        number: number;
        sort: {
            sorted: boolean;
            empty: boolean;
            unsorted: boolean;
        };
        numberOfElements: number;
        first: boolean;
        last: boolean;
        empty: boolean;
    }, status: number) {
        this.data = data;
        this.status = status;
    }
}


export class DetailResponse<T> {
    data: T;
    status: number;

    constructor(data: T, status: number) {
        this.data = data;
        this.status = status;
    }
}